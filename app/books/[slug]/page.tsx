import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeft, Mic, MicOff } from "lucide-react";
import VapiControls from "@/components/VapiControls";

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

  return (
    <main className="book-page-container">
      <Link href="/" className="back-btn-floating" aria-label="Back to library">
        <ArrowLeft className="size-5 text-[#212a3b]" aria-hidden="true" />
      </Link>
      <VapiControls book={bookResult.data} />
    </main>
  );
};

export default BookPage;
