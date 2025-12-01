"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { RoomFilterRequest } from "@/services/roomService";

const RESOURCES = ["Projector", "AC", "TV", "Whiteboard", "WiFi"];
const LOCATIONS = ["Trivandrum", "Kollam", "Pathanamthitta", "Alappuzha", "Kottayam", "Idukki", "Ernakulam", "Thrissur", "Palakkad", "Malappuram", "Kozhikode", "Wayanad", "Kannur", "Kasaragod",];


export default function RoomFilter({ onFilter }: Readonly<{ onFilter: (filters: RoomFilterRequest) => void }>) {
  const [minCapacity, setMinCapacity] = useState("");
  const [maxCapacity, setMaxCapacity] = useState("");
  const [location, setLocation] = useState("");
  const [selectedResources, setSelectedResources] = useState<string[]>([]);

  const toggleResource = (item: string) => {
    setSelectedResources(prev =>
      prev.includes(item)
        ? prev.filter(r => r !== item)
        : [...prev, item]
    );
  };

  const handleSubmit = () => {
    onFilter({
      minCapacity,
      maxCapacity,
      location,
      resources: selectedResources,
    });
  };

  const handleReset = () => {
    setMinCapacity("");
    setMaxCapacity("");
    setLocation("");
    setSelectedResources([]);
    onFilter({});
  };

  return (
    <Card className="w-full mb-6">
      <CardContent className="grid gap-4 md:grid-cols-4 lg:grid-cols-6 py-4">
        <div className="flex flex-col">
          <Label className="mb-4">Min Capacity</Label>
          <Input
            type="number"
            value={minCapacity}
            onChange={e => setMinCapacity(e.target.value)}
            placeholder="10"
          />
        </div>

        <div className="flex flex-col">
          <Label className="mb-4">Max Capacity</Label>
          <Input
            type="number"
            value={maxCapacity}
            onChange={e => setMaxCapacity(e.target.value)}
            placeholder="50"
          />
        </div>

        <div className="flex flex-col">
          <Label className="mb-4">Location</Label>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {LOCATIONS.map(loc => (
                <SelectItem key={loc} value={loc.replace(" ", "")}>
                  {loc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col col-span-2">
          <Label className="mb-4">Resources</Label>
          <div className="flex flex-wrap gap-2 mt-1">
            {RESOURCES.map(r => (
              <Badge
                key={r}
                variant={selectedResources.includes(r) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleResource(r)}
              >
                {r}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex gap-2 col-span-full justify-end">
          <Button variant="outline" onClick={handleReset}>Reset</Button>
          <Button onClick={handleSubmit}>Apply</Button>
        </div>
      </CardContent>
    </Card>
  );
}
