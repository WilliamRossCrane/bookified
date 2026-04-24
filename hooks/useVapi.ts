import { IBook, Messages } from "@/types";
import { DEFAULT_VOICE } from "@/lib/constants";
import { useState } from "react";

export type CallStatus =
  | "idle"
  | "connecting"
  | "starting"
  | "listening"
  | "thinking"
  | "speaking";

export const useVapi = (book: IBook) => {
  const { userId } = useAuth();

  const [status, setStatus] = useState<CallStatus>("idle");
  const [messages, setMessages] = useState<Messages[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [currentUserMessage, setCurrentUserMessage] = useState("");
  const [duration, setDuration] = useState(0);
  const [limitError, setLimitError] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimerRef = useRef<NodeJS.Timeout | null>(null);
  const sessionIdRef = useRef<string | null>(null);
  const isStoppingRef = useRef<boolean>(false);

  const bookRef = useLatestRef(book);
  const durationRef = useLatestRef(duration);
  const voice = book.persona || DEFAULT_VOICE;

  const isActive =
    status === "listening" ||
    status === "thinking" ||
    status === "speaking" ||
    status === "starting";

  /* Limits:
    // const maxDurationRef = useLatestRef(limits.maxSessionMinutes * 60)
    // const maxDurationSeconds
    // const remainingSeconds
    // const showTimeWarning
    */

  const start = async () => {
    if (!userId) return setLimitError("Please login to start a conversation.");

    setLimitError(null);
    setStatus("connecting");

    try {
    } catch (e) {
      console.error("Error starting call", e);
      setStatus("idle");
      setLimitError("An error occurred while starting the call.");
    }
  };
  const stop = async () => {};
  const clearErrors = async () => {};

  return {
    status,
    isActive,
    messages,
    currentMessage,
    currentUserMessage,
    duration,
    start,
    stop,
    clearErrors,
    // maxDurationSeconds, remainingSeconds, showTimeWarning
  };
};

export default useVapi;
