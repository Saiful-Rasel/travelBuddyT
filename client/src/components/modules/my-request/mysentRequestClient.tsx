/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";

interface TravelPlan {
  id: number;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  image?: string | null;
}

interface Receiver {
  id: number;
  fullName: string;
  profileImage?: string;
}

export interface MatchRequest {
  id: number;
  message?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  travelPlan: TravelPlan;
  receiver: Receiver;
}

interface Props {
  requests: MatchRequest[];
}

export default function MySentRequestsClient({ requests }: Props) {
  if (!requests.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-lg text-muted-foreground">
          You have not sent any match requests yet.
        </p>
      </div>
    );
  }

  return (
    <section className="min-h-screen w-full bg-zinc-50 dark:bg-black p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        My Sent Match Requests
      </h1>

      <div className="grid gap-6">
        {requests.map((req) => (
          <motion.div
            key={req.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="rounded-2xl shadow-md">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {req.travelPlan.image && (
                      <Image
                        src={req.travelPlan.image}
                        alt={req.travelPlan.title}
                        width={50}
                        height={50}
                        className="rounded-lg"
                      />
                    )}
                    <div>
                      <h2 className="text-xl font-semibold">
                        {req.travelPlan.title}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {req.travelPlan.destination}
                      </p>
                    </div>
                  </div>
                  <Badge variant={req.status === "PENDING" ? "secondary" : req.status === "ACCEPTED" ? "default" : "destructive"}>
                    {req.status}
                  </Badge>
                </div>

                {req.message && (
                  <p className="text-sm text-muted-foreground">
                    📩 Message: {req.message}
                  </p>
                )}

                <p className="text-sm text-muted-foreground">
                  Receiver: {req.receiver.fullName}
                </p>

                <p className="text-xs text-muted-foreground">
                  Sent on: {new Date(req.createdAt).toLocaleDateString()}
                </p>

                <Separator />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
