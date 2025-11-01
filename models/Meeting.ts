import mongoose, { Schema, model, models } from "mongoose";
import { AIResponse } from "@/lib/types";

export interface IMeeting {
  userId: string;
  results: AIResponse;
  createdAt: Date;
}

const meetingSchema = new Schema<IMeeting>({
  userId: { type: String, required: true },
  results: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Meeting = models.Meeting || model<IMeeting>("Meeting", meetingSchema);
