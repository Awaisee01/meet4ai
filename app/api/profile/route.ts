// import { NextRequest, NextResponse } from "next/server";
// import { getServerSession } from "next-auth/next";
// import { connectDB } from "@/lib/mongodb";
// import { User } from "@/models/User";
// import cloudinary from "@/lib/cloudinary";
// import { authOptions } from "@/lib/authOptions";

// // GET - fetch user profile
// export async function GET(req: NextRequest) {
//   const session = await getServerSession(authOptions);
//   if (!session?.user?.email) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   await connectDB();

//   const user = await User.findOne({ email: session.user.email }).lean();
//   if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

//   return NextResponse.json({
//     user: {
//       name: user.name,
//       email: user.email,
//       image: user.image || null,
//     },
//   });
// }

// // POST - upload/update profile image
// export async function POST(req: NextRequest) {
//   const session = await getServerSession(authOptions);
//   if (!session?.user?.email)
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//   const { imageBase64 } = await req.json();
//   if (!imageBase64)
//     return NextResponse.json({ error: "No image provided" }, { status: 400 });

//   const matches = imageBase64.match(/^data:image\/(png|jpeg|jpg);base64,(.+)$/);
//   if (!matches)
//     return NextResponse.json({ error: "Invalid image format" }, { status: 400 });

//   const ext = matches[1];
//   const data = matches[2];

//   // Upload to Cloudinary
//   const uploadResponse = await cloudinary.uploader.upload(
//     `data:image/${ext};base64,${data}`,
//     {
//       folder: "profiles",
//       public_id: `${session.user.email}_${Date.now()}`,
//     }
//   );

//   const imageUrl = uploadResponse.secure_url;

//   await connectDB();
//   await User.findOneAndUpdate(
//     { email: session.user.email },
//     { image: imageUrl },
//     { new: true }
//   );

//   return NextResponse.json({ image: imageUrl });
// }


import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import cloudinary from "@/lib/cloudinary";
import { authOptions } from "@/lib/authOptions";

interface IUser {
  name: string;
  email: string;
  image?: string | null;
}

// GET - fetch user profile
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();

  const user = await User.findOne({ email }).lean<IUser>();
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json({
    user: {
      name: user.name,
      email: user.email,
      image: user.image || null,
    },
  });
}

// POST - upload/update profile image
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { imageBase64 } = await req.json();
  if (!imageBase64) return NextResponse.json({ error: "No image provided" }, { status: 400 });

  const matches = imageBase64.match(/^data:image\/(png|jpeg|jpg);base64,(.+)$/);
  if (!matches) return NextResponse.json({ error: "Invalid image format" }, { status: 400 });

  const ext = matches[1];
  const data = matches[2];

  let imageUrl: string;
  try {
    const uploadResponse = await cloudinary.uploader.upload(
      `data:image/${ext};base64,${data}`,
      { folder: "profiles", public_id: `${email}_${Date.now()}` }
    );
    imageUrl = uploadResponse.secure_url;
  } catch (err) {
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }

  await connectDB();
  await User.findOneAndUpdate({ email }, { image: imageUrl }, { new: true });

  return NextResponse.json({ image: imageUrl });
}
