"use server";

import { EndSessionResult, StartSessionResult } from "@/types";
import { auth } from "@clerk/nextjs/server";
import { connectToDatabase } from "@/database/mongoose";
import VoiceSession from "@/database/models/voice-session.model";
import mongoose from "mongoose";
import { getCurrentBillingPeriodStart } from "../subscription-constants";

export const startVoiceSession = async (
  bookId: string,
): Promise<StartSessionResult> => {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return {
        success: false,
        error: "Invalid book ID.",
      };
    }

    await connectToDatabase();

    // Limits/Plan to see whether a session is allowed.

    const session = await VoiceSession.create({
      clerkId: userId,
      bookId,
      startedAt: new Date(),
      billingPeriodStart: getCurrentBillingPeriodStart(),
      durationSeconds: 0,
    });

    return {
      success: true,
      sessionId: session._id.toString(),
      // maxDurationMinutes: check.maxDurationMinutes,
    };
  } catch (e) {
    console.error("Error starting voice session", e);
    return {
      success: false,
      error: "Failed to start voice session. Please try again later.",
    };
  }
};

export const endVoiceSession = async (
  sessionId: string,
  durationSeconds: number,
): Promise<EndSessionResult> => {
  try {
    await connectToDatabase();

    const result = await VoiceSession.findByIdAndUpdate(sessionId, {
      endedAt: new Date(),
      durationSeconds,
    });

    if (!result) return { success: false, error: "Voice session not found." };

    return { success: true };
  } catch (e) {
    console.error("Error ending voice session", e);
    return {
      success: false,
      error: "Failed to end voice session. Please try again later.",
    };
  }
};
