

import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "./mongodb";
import { User } from "@/models/User";
import bcrypt from "bcrypt";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        await connectDB();
        
        const user = await User.findOne({ email: credentials.email }).lean();
        
        if (!user) {
          throw new Error("No user found");
        }

        if (!user.password) {
          throw new Error("Invalid login method");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        
        if (!isValid) {
          throw new Error("Invalid password");
        }

        // Return user in NextAuth format
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name || null,
          image: user.image || null,
        };
      },
    }),
  ],
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account }) {
      // Handle Google users manually
      if (account?.provider === "google") {
        await connectDB();
        const existingUser = await User.findOne({ email: user.email });
        
        if (!existingUser) {
          // Create new user in MongoDB
          await User.create({
            name: user.name || undefined,
            email: user.email!,
            image: user.image || undefined,
          });
        } else {
          // Optional: update image or name
          if (user.name) existingUser.name = user.name;
          if (user.image) existingUser.image = user.image;
          await existingUser.save();
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};