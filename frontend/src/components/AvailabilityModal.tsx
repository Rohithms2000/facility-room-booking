"use client";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AvailabilityRuleProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (field: string, value: string | Date | null) => void;
  ruleType: string;
  date?: Date | null;
  dayOfWeek?: string | null;
  startTime?: Date | null;
  endTime?: Date | null;
  reason: string;
}

export default function AvailabilityModal({
  ruleType,
  date,
  dayOfWeek,
  startTime,
  endTime,
  reason,
  onSubmit,
  isOpen,
  onClose,
  onChange,
}: AvailabilityRuleProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-center font-bold">Set Availability Rule</DialogTitle>
        </DialogHeader>


        <form onSubmit={onSubmit} className="space-y-4" autoComplete="off">
          <div className="space-y-2">
            <Label>Rule Type</Label>
            <Select
              value={ruleType}
              onValueChange={(val) => onChange("ruleType", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Rule Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="HOLIDAY">Holiday</SelectItem>
                <SelectItem value="WEEKLY_CLOSED">Weekly Closed</SelectItem>
                <SelectItem value="TIME_BLOCK">Time Block</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            {ruleType === "HOLIDAY" && (
              <div className="space-y-2">
                <Label>Date</Label>
                <DatePicker
                  selected={date}
                  onChange={(date) => onChange("date", date)}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Select date"
                  className="border border-input p-2 rounded-md w-full focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {ruleType === "WEEKLY_CLOSED" && (
              <div className="space-y-2">
                <Label>Day of Week</Label>
                <Select
                  value={dayOfWeek ?? ""}
                  onValueChange={(val) => onChange("dayOfWeek", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Day" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MONDAY">Monday</SelectItem>
                    <SelectItem value="TUESDAY">Tuesday</SelectItem>
                    <SelectItem value="WEDNESDAY">Wednesday</SelectItem>
                    <SelectItem value="THURSDAY">Thursday</SelectItem>
                    <SelectItem value="FRIDAY">Friday</SelectItem>
                    <SelectItem value="SATURDAY">Saturday</SelectItem>
                    <SelectItem value="SUNDAY">Sunday</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {ruleType === "TIME_BLOCK" && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Start Time</Label>
                  <DatePicker
                    selected={startTime}
                    onChange={(date) => onChange("startTime", date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={30}
                    dateFormat="yyyy-MM-dd HH:mm"
                    placeholderText="Select start time"
                    className="border border-input p-2 rounded-md w-full focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Time</Label>
                  <DatePicker
                    selected={endTime}
                    onChange={(date) => onChange("endTime", date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={30}
                    dateFormat="yyyy-MM-dd HH:mm"
                    placeholderText="Select end time"
                    className="border border-input p-2 rounded-md w-full focus:ring-2 focus:ring-blue-500"
                    minDate={startTime || undefined}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Reason</Label>
            <Input
              type="text"
              name="reason"
              value={reason}
              onChange={(e) => onChange("reason", e.target.value)}
              placeholder="Enter reason for non-availability"
            />
          </div>

          <button type="submit" className="bg-gray-800/20 border-1 border-gray-600 w-full hover:text-white hover:bg-gray-800/60 font-medium px-4 py-2 mt-2" > Save </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
