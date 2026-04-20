import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeft, Mic, MicOff } from "lucide-react";

import { getBookBySlug } from "@/lib/actions/book.actions";

type BookPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const BookPage = async ({ params }: BookPageProps) => {
  const { slug } = await params;
  const { userId, redirectToSignIn } = await auth();

  if (!userId) {
    return redirectToSignIn({ returnBackUrl: `/books/${slug}` });
  }

  const bookResult = await getBookBySlug(slug);

  if (!bookResult.success || !bookResult.data) {
    redirect("/");
  }

  const { title, author, coverURL, persona } = bookResult.data;

  return (
    <main className="book-page-container">
      <Link href="/" className="back-btn-floating" aria-label="Back to library">
        <ArrowLeft className="size-5 text-[#212a3b]" aria-hidden="true" />
      </Link>

      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <section className="vapi-header-card rounded-xl p-6">
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

        <section className="transcript-container min-h-[400px] rounded-xl">
          <div className="transcript-empty">
            <Mic className="mb-4 size-12 text-[#212a3b]" aria-hidden="true" />
            <p className="transcript-empty-text">No conversation yet</p>
            <p className="transcript-empty-hint">
              Click the mic button above to start talking
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default BookPage;
