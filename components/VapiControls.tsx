'use client';

import { Mic, MicOff } from "lucide-react";
import Image from "next/image";
import useVapi from "@/hooks/useVapi";
import { IBook } from "@/types";

const VapiControls = ({ book }: { book?: IBook }) => {
  if (!book) {
    return null;
  }

  const { title, author, coverURL, persona } = book;
  const {
    status,
    isActive,
    messages,
    currentMessage,
    currentUserMessage,
    duration,
    start,
    stop,
    clearErrors,
  } = useVapi(book);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <section className="vapi-header-card rounded-xl p-6 flex">
        <div className="vapi-cover-wrapper">
          <Image
            src={coverURL}
            alt={`${title} cover`}
            width={120}
            height={180}
            className="w-[120px] rounded-lg object-cover shadow-lg"
            unoptimized
            priority
          />

          <div className="absolute -bottom-2 -right-2">
            <button
              type="button"
              className="vapi-mic-btn"
              aria-label="Microphone muted"
            >
              <MicOff className="size-5 text-[#212a3b]" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div>
            <h1 className="font-serif text-2xl font-bold leading-tight text-[#212a3b] md:text-3xl">
              {title}
            </h1>
            <p className="mt-1 text-sm font-medium text-[#5d6674] md:text-base">
              by {author}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="vapi-status-indicator rounded-full">
              <span
                className="vapi-status-dot bg-gray-400"
                aria-hidden="true"
              />
              <span className="vapi-status-text">Ready</span>
            </div>

            <div className="vapi-status-indicator rounded-full">
              <span className="vapi-status-text">
                Voice: {persona || "Default"}
              </span>
            </div>

            <div className="vapi-status-indicator rounded-full">
              <span className="vapi-status-text">0:00/15:00</span>
            </div>
          </div>
        </div>
      </section>

      <div className="transcript-container min-h-[400px]">
        <div className="transcript-empty">
          <Mic className="size-12 text-[#212a3b] mb-4" />
          <h2 className="transcript-empty-text">No conversation yet</h2>
          <p className="transcript-empty-hint">
            Click the mic button above to start talking
          </p>
        </div>
      </div>
    </div>
  );
};

export default VapiControls;
