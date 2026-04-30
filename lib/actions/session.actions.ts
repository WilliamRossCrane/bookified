"use server";

import { EndSessionResult, StartSessionResult } from "@/types";
import { connectToDatabase } from "@/database/mongoose";
import VoiceSession from "@/database/models/voice-session.model";
import mongoose from "mongoose";
import {
  getCurrentBillingPeriodStart,
  getNextBillingPeriodStart,
} from "@/lib/subscription-constants";
import { getCurrentUserSubscription } from "@/lib/subscription";

export const startVoiceSession = async (
  bookId: string,
): Promise<StartSessionResult> => {
  try {
    const { userId, plan } = await getCurrentUserSubscription();

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
    const now = new Date();
    const billingPeriodStart = getCurrentBillingPeriodStart(now);
    const billingPeriodEnd = getNextBillingPeriodStart(now);
    const maxSessionsPerMonth = plan.limits.maxSessionsPerMonth;
    const billingPeriodQuery = {
      clerkId: userId,
      startedAt: {
        $gte: billingPeriodStart,
        $lt: billingPeriodEnd,
      },
    };

    if (maxSessionsPerMonth !== null) {
      const currentMonthSessionCount =
        await VoiceSession.countDocuments(billingPeriodQuery);

      if (currentMonthSessionCount >= maxSessionsPerMonth) {
        return {
          success: false,
          error: `You've reached the ${maxSessionsPerMonth} voice sessions included in your ${plan.label} plan for this month. Upgrade to continue.`,
        };
      }
    }

    const session = await VoiceSession.create({
      clerkId: userId,
      bookId,
      startedAt: now,
      billingPeriodStart,
      durationSeconds: 0,
    });

    if (maxSessionsPerMonth !== null) {
      const updatedMonthSessionCount =
        await VoiceSession.countDocuments(billingPeriodQuery);

      if (updatedMonthSessionCount > maxSessionsPerMonth) {
        await VoiceSession.deleteOne({ _id: session._id });

        return {
          success: false,
          error: `You've reached the ${maxSessionsPerMonth} voice sessions included in your ${plan.label} plan for this month. Upgrade to continue.`,
        };
      }
    }

    return {
      success: true,
      sessionId: session._id.toString(),
      maxDurationMinutes: plan.limits.maxSessionMinutes,
      planKey: plan.key,
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
