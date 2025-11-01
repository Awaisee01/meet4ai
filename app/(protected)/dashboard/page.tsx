

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectDB } from "@/lib/mongodb";
import { Meeting } from "@/models/Meeting";
import ResultsDisplay from "@/components/ResultsDisplay";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Users, TrendingUp } from "lucide-react";
import { Types } from "mongoose";
import Header from "@/components/Header";

// Type for Meeting document from MongoDB
interface MeetingDocument {
  _id: Types.ObjectId;
  userId: string;
  results: any;
  createdAt?: Date;
  updatedAt?: Date;
}

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Access Denied</CardTitle>
            <CardDescription>Please login to view your dashboard</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  await connectDB();

  const meetings = await Meeting.find({ 
    userId: (session.user as any).id || (session.user as any)._id 
  })
    .sort({ createdAt: -1 })
    .lean<MeetingDocument[]>()
    .exec();

  // Convert to plain objects and stringify _id for serialization
  const serializedMeetings = meetings.map((m) => ({
    ...m,
    _id: m._id.toString(),
    createdAt: m.createdAt?.toISOString(),
    updatedAt: m.updatedAt?.toISOString(),
  }));

  const weekAgoDate = new Date();
  weekAgoDate.setDate(weekAgoDate.getDate() - 7);

  const meetingsThisWeek = serializedMeetings.filter((m) => {
    if (!m.createdAt) return false;
    const createdAt = new Date(m.createdAt);
    return createdAt >= weekAgoDate;
  }).length;

  const avgParticipants = serializedMeetings.length > 0
    ? Math.round(
        serializedMeetings.reduce((acc, m) => {
          return acc + (m.results?.people?.length || 3);
        }, 0) / serializedMeetings.length
      )
    : 0;

  return (
    <>
    <Header/>
    <div className="min-h-screen sm:pt-20 bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Your Meetings
              </h1>
              <p className="text-muted-foreground">
                Welcome back, {session.user.name || session.user.email}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {serializedMeetings.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Meetings
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {serializedMeetings.length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      This Week
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {meetingsThisWeek}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Avg Participants
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {avgParticipants}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Meetings List */}
        {serializedMeetings.length === 0 ? (
          <Card className="border-2 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No meetings yet
              </h3>
              <p className="text-muted-foreground text-center max-w-sm">
                Get started by creating your first meeting. Find the perfect time that works for everyone.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-gray-900">
                Recent Meetings
              </h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Sorted by most recent</span>
              </div>
            </div>

            {serializedMeetings.map((m, index) => (
              <Card key={m._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      Meeting #{serializedMeetings.length - index}
                    </CardTitle>
                    <div className="text-sm text-muted-foreground">
                      {m.createdAt && new Date(m.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <ResultsDisplay results={m.results} />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  );
}