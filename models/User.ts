import mongoose from "mongoose";

export interface IUser {
  name?: string;
  email: string;
  password?: string;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, required: true, unique: true },
    password: String,
    image: String,
  },
  { timestamps: true }
);

// Delete the model if it exists (prevents Next.js hot reload issues)
if (mongoose.models.User) {
  delete mongoose.models.User;
}

export const User = mongoose.model<IUser>("User", userSchema);