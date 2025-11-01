// app/api/meetings/save/route.ts
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/mongodb";
import { Meeting } from "@/models/Meeting";

export async function POST(req: Request) {
  try {
    // Get session
    const session = await getServerSession(authOptions);

    // Ensure session and user ID exist
    const userId = session?.user?.id;
    if (!userId) return new Response("Unauthorized", { status: 401 });

    // Parse request body
    const body = await req.json();
    const { results } = body;

    if (!results) return new Response("No results provided", { status: 400 });

    // Connect to MongoDB
    await connectDB();

    // Create new meeting
    const meeting = new Meeting({
      userId,
      results,
      createdAt: new Date(),
    });

    await meeting.save();

    return new Response(JSON.stringify({ message: "Saved" }), { status: 200 });
  } catch (err) {
    console.error("Save meeting error:", err);
    return new Response("Failed to save results", { status: 500 });
  }
}
