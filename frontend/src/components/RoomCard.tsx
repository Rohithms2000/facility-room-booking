"use client";

import Image from "next/image";
import { Room } from "@/services/roomService";

interface RoomCardProps {
    room: Room;
    onClick?: (room: Room) => void;
}

export default function RoomCard({ room, onClick }: RoomCardProps) {
    return (
        <div
            className="bg-white rounded-2xl shadow-md p-4 hover:shadow-lg transition cursor-pointer"
            onClick={() => onClick && onClick(room)}
        >
                {room.imageUrl &&(
                    <Image
                    src="/abc"
                    alt={room.name}
                    width={400}
                    height={250}
                    className="rounded-xl w-full h-48 object-cover"
                />)}
            
            <div className="mt-3 text-center">
                <h2 className="text-xl text-gray-800 font-semibold">{room.name}</h2>
                <p className="text-gray-800 font-medium mt-1">Capacity: {room.capacity}</p>
                <p className="text-gray-500 text-sm">{room.location}</p>
                <p className="text-green-500 font-bold mt-2">
                    {room.resources?.join(" | ")
                    }
                </p>
            </div>
        </div>
    );
}
