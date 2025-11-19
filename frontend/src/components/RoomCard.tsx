"use client";

import { Room } from "@/services/roomService";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface RoomCardProps {
  room: Room;
  onClick?: (room: Room) => void;
}

export default function RoomCard({ room, onClick }: Readonly<RoomCardProps>) {
  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition"
      onClick={() => onClick?.(room)}
    >
      <CardHeader className="text-center">
        <CardTitle className="text-lg">{room.name}</CardTitle>
        <CardDescription>Capacity: {room.capacity}</CardDescription>
        <p className="text-gray-500 text-sm">{room.location}</p>
      </CardHeader>
      {room.resources && room.resources.length > 0 && (
        <CardContent className="text-center text-green-500 font-bold">
          {room.resources.join(" | ")}
        </CardContent>
      )}
    </Card>
  );
}
