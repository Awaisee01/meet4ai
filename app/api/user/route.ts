import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { authOptions } from "@/lib/authOptions";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const user = await User.findOne({ email: session.user.email }).select("name email image");
  return NextResponse.json({ user });
}
