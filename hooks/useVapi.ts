"use client";

// Create hooks/useVapi.ts: the core hook. Initializes Vapi SDK, manages call lifecycle (idle, connecting, starting, listening, thinking, speaking), tracks messages array + currentMessage streaming, handles duration timer with maxDuration enforcement, session tracking via server actions

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  useEffectEvent,
} from "react";
import Vapi from "@vapi-ai/web";
import { useAuth } from "@clerk/nextjs";

import { ASSISTANT_ID, DEFAULT_VOICE, VOICE_SETTINGS } from "@/lib/constants";
import { getVoice } from "@/lib/utils";
import { IBook, MessageRole, Messages } from "@/types";
import {
  startVoiceSession,
  endVoiceSession,
} from "@/lib/actions/session.actions";

export function useLatestRef<T>(value: T) {
  const ref = useRef(value);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref;
}

const VAPI_API_KEY = process.env.NEXT_PUBLIC_VAPI_API_KEY;
const TIMER_INTERVAL_MS = 1000;

export type CallStatus =
  | "idle"
  | "connecting"
  | "starting"
  | "listening"
  | "thinking"
  | "speaking";

type VoiceSessionError = {
  message: string;
  redirectTo?: "/" | "/subscriptions";
};

type VapiTranscriptMessage = {
  type: string;
  role?: MessageRole;
  transcriptType?: "partial" | "final";
  transcript?: string;
  status?: string;
};

export function useVapi(book: IBook) {
  const { userId } = useAuth();
  // const { limits } = useSubscription();
  const vapi = useMemo(() => {
    if (!VAPI_API_KEY) {
      throw new Error(
        "NEXT_PUBLIC_VAPI_API_KEY environment variable is not set",
      );
    }

    return new Vapi(VAPI_API_KEY);
  }, []);

  const [status, setStatus] = useState<CallStatus>("idle");
  const [messages, setMessages] = useState<Messages[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [currentUserMessage, setCurrentUserMessage] = useState("");
  const [duration, setDuration] = useState(0);
  const [maxDurationSeconds, setMaxDurationSeconds] = useState(0);
  const [errorState, setErrorState] = useState<VoiceSessionError | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const sessionIdRef = useRef<string | null>(null);
  const isStoppingRef = useRef(false);

  // Keep refs in sync with latest values for use in callbacks
  const maxDurationRef = useLatestRef(maxDurationSeconds);
  const durationRef = useLatestRef(duration);
  const voice = book.persona || DEFAULT_VOICE;
  const finalizeSession = useEffectEvent(
    (sessionId: string, context: "end" | "error" | "unmount") => {
      endVoiceSession(sessionId, durationRef.current).catch((err) =>
        console.error(`Failed to end voice session on ${context}:`, err),
      );
    },
  );

  const handleSessionError = useCallback((error: VoiceSessionError) => {
    setErrorState(error);
  }, []);

  // Set up Vapi event listeners
  useEffect(() => {
    const handlers = {
      "call-start": () => {
        isStoppingRef.current = false;
        setStatus("starting"); // AI speaks first, wait for it
        setCurrentMessage("");
        setCurrentUserMessage("");

        // Start duration timer
        startTimeRef.current = Date.now();
        setDuration(0);
        timerRef.current = setInterval(() => {
          if (startTimeRef.current) {
            const newDuration = Math.floor(
              (Date.now() - startTimeRef.current) / TIMER_INTERVAL_MS,
            );
            setDuration(newDuration);

            if (
              maxDurationRef.current > 0 &&
              newDuration >= maxDurationRef.current
            ) {
              isStoppingRef.current = true;
              handleSessionError({
                message: `This session reached your ${Math.floor(maxDurationRef.current / 60)}-minute limit.`,
                redirectTo: "/",
              });
              vapi.stop();
            }
          }
        }, TIMER_INTERVAL_MS);
      },

      "call-end": () => {
        // Don't reset isStoppingRef here - delayed events may still fire
        setStatus("idle");
        setCurrentMessage("");
        setCurrentUserMessage("");

        // Stop timer
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }

        // End session tracking
        if (sessionIdRef.current) {
          finalizeSession(sessionIdRef.current, "end");
          sessionIdRef.current = null;
        }

        startTimeRef.current = null;
      },

      "speech-start": () => {
        if (!isStoppingRef.current) {
          setStatus("speaking");
        }
      },
      "speech-end": () => {
        if (!isStoppingRef.current) {
          // After AI finishes speaking, user can talk
          setStatus("listening");
        }
      },

      message: (message: VapiTranscriptMessage) => {
        if (
          message.type === "status-update" &&
          typeof message.status === "string"
        ) {
          if (message.status === "ended") {
            return;
          }

          if (
            message.status === "listening" ||
            message.status === "thinking" ||
            message.status === "speaking"
          ) {
            setStatus(message.status);
          }
        }

        if (message.type !== "transcript") return;

        // User finished speaking → AI is thinking
        if (message.role === "user" && message.transcriptType === "final") {
          if (!isStoppingRef.current) {
            setStatus("thinking");
          }
          setCurrentUserMessage("");
        }

        // Partial user transcript → show real-time typing
        if (message.role === "user" && message.transcriptType === "partial") {
          if (!isStoppingRef.current) {
            setStatus("listening");
          }
          setCurrentUserMessage(message.transcript || "");
          return;
        }

        // Partial AI transcript → show word-by-word
        if (
          message.role === "assistant" &&
          message.transcriptType === "partial"
        ) {
          if (!isStoppingRef.current) {
            setStatus("speaking");
          }
          setCurrentMessage(message.transcript || "");
          return;
        }

        // Final transcript → clear active streaming state, then add valid messages
        if (message.transcriptType === "final") {
          if (message.role === "assistant") setCurrentMessage("");
          if (message.role === "user") setCurrentUserMessage("");
          if (!message.role || !message.transcript?.trim()) return;
          const role = message.role;
          const transcript = message.transcript;

          setMessages((prev) => [
            ...prev,
            {
              role,
              content: transcript,
            },
          ]);
        }
      },

      error: (error: Error) => {
        console.error("Vapi error:", error);
        // Don't reset isStoppingRef here - delayed events may still fire
        setStatus("idle");
        setCurrentMessage("");
        setCurrentUserMessage("");

        // Stop timer on error
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }

        // End session tracking on error
        if (sessionIdRef.current) {
          finalizeSession(sessionIdRef.current, "error");
          sessionIdRef.current = null;
        }

        // Show user-friendly error message
        const errorMessage = error.message?.toLowerCase() || "";
        if (
          errorMessage.includes("timeout") ||
          errorMessage.includes("silence")
        ) {
          handleSessionError({
            message: "Session ended due to inactivity. Click the mic to start again.",
          });
        } else if (
          errorMessage.includes("network") ||
          errorMessage.includes("connection")
        ) {
          handleSessionError({
            message: "Connection lost. Please check your internet and try again.",
          });
        } else {
          handleSessionError({
            message: "Session ended unexpectedly. Click the mic to start again.",
          });
        }

        startTimeRef.current = null;
      },
    };

    // Register all handlers
    Object.entries(handlers).forEach(([event, handler]) => {
      vapi.on(event as keyof typeof handlers, handler as () => void);
    });

    return () => {
      const activeSessionId = sessionIdRef.current;

      // End active session on unmount
      if (activeSessionId) {
        sessionIdRef.current = null;
        vapi.stop();
        finalizeSession(activeSessionId, "unmount");
      }
      // Cleanup handlers
      Object.entries(handlers).forEach(([event, handler]) => {
        vapi.off(event as keyof typeof handlers, handler as () => void);
      });
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [maxDurationRef, vapi, handleSessionError]);

  const start = useCallback(async () => {
    if (!userId) {
      handleSessionError({ message: "Please sign in to start a voice session." });
      return;
    }

    setErrorState(null);
    setStatus("connecting");

    try {
      // Check session limits and create session record
      const result = await startVoiceSession(book._id);

      if (!result.success) {
        handleSessionError({
          message:
            result.error || "Session limit reached. Please upgrade your plan.",
          redirectTo: "/subscriptions",
        });
        setStatus("idle");
        return;
      }

      sessionIdRef.current = result.sessionId || null;
      setMaxDurationSeconds((result.maxDurationMinutes ?? 0) * 60);

      const firstMessage = `Hey, good to meet you. Quick question before we dive in - have you actually read ${book.title} yet, or are we starting fresh?`;

      await vapi.start(ASSISTANT_ID, {
        firstMessage,
        variableValues: {
          title: book.title,
          author: book.author,
          bookId: book._id,
        },
        voice: {
          provider: "11labs" as const,
          voiceId: getVoice(voice).id,
          model: "eleven_turbo_v2_5" as const,
          stability: VOICE_SETTINGS.stability,
          similarityBoost: VOICE_SETTINGS.similarityBoost,
          style: VOICE_SETTINGS.style,
          useSpeakerBoost: VOICE_SETTINGS.useSpeakerBoost,
        },
      });
    } catch (err) {
      console.error("Failed to start call:", err);
      setStatus("idle");
      handleSessionError({
        message: "Failed to start voice session. Please try again.",
      });
    }
  }, [book._id, book.title, book.author, userId, vapi, voice, handleSessionError]);

  const stop = useCallback(() => {
    isStoppingRef.current = true;
    vapi.stop();
  }, [vapi]);

  const clearError = useCallback(() => {
    setErrorState(null);
  }, []);

  const isActive =
    status === "starting" ||
    status === "listening" ||
    status === "thinking" ||
    status === "speaking";

  return {
    status,
    isActive,
    messages,
    currentMessage,
    currentUserMessage,
    duration,
    maxDurationSeconds,
    start,
    stop,
    limitError: errorState?.message ?? null,
    redirectToOnError: errorState?.redirectTo ?? null,
    clearError,
  };
}

export default useVapi;
