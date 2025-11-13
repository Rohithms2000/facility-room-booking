"use client";

import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import AvailabilityRulesList from "./AvailabilityRuleList";
import { addAvailabilityRule, getRules, deleteRule } from "@/services/availabilityService";

interface RoomModalProps {
    isOpen: boolean;
    onClose: () => void;
    roomId: string;
    title?: string;
    children: React.ReactNode;
}

interface RuleForm {
    ruleType: string;
    date: string | null;
    dayOfWeek: string | null;
    startTime: string | null;
    endTime: string | null;
    reason: string;
}

export default function RoomModal({ isOpen, onClose, roomId, children }: RoomModalProps) {
    const [rules, setRules] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState<RuleForm>({
        ruleType: "",
        date: null,
        dayOfWeek: null,
        startTime: null,
        endTime: null,
        reason: "",
    });
    const isEditMode = Boolean(roomId);

    useEffect(() => {
        if (isOpen && roomId) fetchRules();
    }, [isOpen, roomId]);

    const fetchRules = async () => {
        try {
            setLoading(true);
            const data = await getRules(roomId);
            setRules(data);
        } catch (err) {
            console.error("Error fetching rules:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        await deleteRule(id);
        await fetchRules();
    };

    const handleAddRule = async () => {
        if (!form.ruleType || !form.reason) return alert("Please fill required fields");
        await addAvailabilityRule({ roomId, ...form });
        setShowForm(false);
        setForm({
            ruleType: "",
            date: null,
            dayOfWeek: null,
            startTime: null,
            endTime: null,
            reason: "",
        });
        await fetchRules();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-xl rounded-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isEditMode ? "Edit Room" : "Create Room"}</DialogTitle>
                    <DialogDescription>{isEditMode
                        ? "Update room details or manage availability rules."
                        : "Fill in the details to create a new room."}</DialogDescription>
                </DialogHeader>

                {isEditMode ? (
                    <Tabs defaultValue="details" className="mt-4">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="details">Room Details</TabsTrigger>
                            <TabsTrigger value="rules">Availability Rules</TabsTrigger>
                        </TabsList>

                        <TabsContent value="details">{children}</TabsContent>

                        <TabsContent value="rules" className="space-y-4 mt-2">
                            <div className="flex justify-between items-center">
                                <h3 className="font-semibold text-gray-700">Availability Rules</h3>
                                <Button size="sm" onClick={() => setShowForm((prev) => !prev)}>
                                    {showForm ? "Cancel" : "Add Rule"}
                                </Button>
                            </div>

                            {showForm && (
                                <div className="border p-4 rounded-xl bg-gray-50 space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Rule Type</label>
                                        <Select
                                            onValueChange={(value) => setForm((f) => ({ ...f, ruleType: value }))}
                                            value={form.ruleType}
                                        >
                                            <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="HOLIDAY">Holiday</SelectItem>
                                                <SelectItem value="TIME_BLOCK">Time Block</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {form.ruleType === "HOLIDAY" && (
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Date</label>
                                            <Input
                                                type="date"
                                                value={form.date || ""}
                                                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                                            />
                                        </div>
                                    )}

                                    {form.ruleType === "TIME_BLOCK" && (
                                        <>
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Day of Week</label>
                                                <Select
                                                    onValueChange={(value) => setForm((f) => ({ ...f, dayOfWeek: value }))}
                                                    value={form.dayOfWeek || ""}
                                                >
                                                    <SelectTrigger><SelectValue placeholder="Select day" /></SelectTrigger>
                                                    <SelectContent>
                                                        {["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"].map((d) => (
                                                            <SelectItem key={d} value={d}>{d}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <label className="block text-sm font-medium mb-1">Start Time</label>
                                                    <Input
                                                        type="time"
                                                        value={form.startTime || ""}
                                                        onChange={(e) => setForm((f) => ({ ...f, startTime: e.target.value }))}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium mb-1">End Time</label>
                                                    <Input
                                                        type="time"
                                                        value={form.endTime || ""}
                                                        onChange={(e) => setForm((f) => ({ ...f, endTime: e.target.value }))}
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Reason</label>
                                        <Input
                                            type="text"
                                            placeholder="e.g. Maintenance, Meeting, Holiday"
                                            value={form.reason}
                                            onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
                                        />
                                    </div>

                                    <Button onClick={handleAddRule} className="w-full mt-2">Save Rule</Button>
                                </div>
                            )}

                            <AvailabilityRulesList rules={rules} loading={loading} onDelete={handleDelete} />

                        </TabsContent>
                    </Tabs>
                ) : (<div className="mt-4">{children}</div>)}
            </DialogContent>
        </Dialog>
    );
}
