"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
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
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import AvailabilityRulesList from "./AvailabilityRuleList";
import {
    addAvailabilityRule,
    getRules,
    deleteRule,
} from "@/services/availabilityService";
import { toast } from "react-toastify";

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

export default function RoomModal({
    isOpen,
    onClose,
    roomId,
    children,
}: RoomModalProps) {
    const [rules, setRules] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const { register, handleSubmit, control, reset, watch } = useForm<RuleForm>({
        defaultValues: {
            ruleType: "",
            date: null,
            dayOfWeek: null,
            startTime: null,
            endTime: null,
            reason: "",
        },
    });


    const isEditMode = Boolean(roomId);

    useEffect(() => {
        if (isOpen && roomId) {
            fetchRules();
        } else {
            reset({
                ruleType: "",
                date: null,
                dayOfWeek: null,
                startTime: null,
                endTime: null,
                reason: "",
            });
            setShowForm(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, roomId, reset]);


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

    const onSubmit = async (data: RuleForm) => {
        if (!data.ruleType || !data.reason) {
            toast.warning("Please fill required fields");
            return;
        }

        const payload = {
            ...data,
            roomId,
            date: data.date ? new Date(data.date).toISOString() : null,
            startTime: data.startTime ? new Date(`${data.date}T${data.startTime}`).toISOString() : null,
            endTime: data.endTime ? new Date(`${data.date}T${data.endTime}`).toISOString() : null,
        };

        await addAvailabilityRule(payload);
        reset();
        setShowForm(false);
        await fetchRules();
    };



    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-4xl rounded-2xl h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isEditMode ? "Edit Room" : "Create Room"}</DialogTitle>
                    <DialogDescription>
                        {isEditMode
                            ? "Update room details or manage availability rules."
                            : "Fill in the details to create a new room."}
                    </DialogDescription>
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
                                <h3 className="font-semibold text-gray-700">
                                    Availability Rules
                                </h3>
                                <Button size="sm" onClick={() => setShowForm((prev) => !prev)}>
                                    {showForm ? "Cancel" : "Add Rule"}
                                </Button>
                            </div>

                            {showForm && (
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 border p-4 rounded-xl bg-gray-50">
                                    {/* Rule Type */}
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Rule Type</label>
                                        <Controller
                                            control={control}
                                            name="ruleType"
                                            render={({ field }) => (
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="HOLIDAY">Holiday</SelectItem>
                                                        <SelectItem value="WEEKLY_CLOSED">Weekly Closed</SelectItem>
                                                        <SelectItem value="TIME_BLOCK">Time Block</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                    </div>

                                    {/* Conditional inputs */}
                                    {watch("ruleType") === "HOLIDAY" && (
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Date</label>
                                            <Input type="date" {...register("date")} />
                                        </div>
                                    )}

                                    {watch("ruleType") === "WEEKLY_CLOSED" && (
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Day of Week</label>
                                            <Controller
                                                control={control}
                                                name="dayOfWeek"
                                                render={({ field }) => (
                                                    <Select onValueChange={field.onChange} value={field.value || ""}>
                                                        <SelectTrigger><SelectValue placeholder="Select day" /></SelectTrigger>
                                                        <SelectContent>
                                                            {["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"].map(d => (
                                                                <SelectItem key={d} value={d}>{d}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                        </div>
                                    )}

                                    {watch("ruleType") === "TIME_BLOCK" && (
                                        <>
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Date</label>
                                                <Input type="date" {...register("date")} />
                                            </div>

                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <label className="block text-sm font-medium mb-1">Start Time</label>
                                                    <Input type="time" {...register("startTime")} />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium mb-1">End Time</label>
                                                    <Input type="time" {...register("endTime")} />
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {/* Reason */}
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Reason</label>
                                        <Input type="text" placeholder="e.g. Maintenance" {...register("reason")} />
                                    </div>

                                    <Button type="submit" className="w-full mt-2">Save Rule</Button>
                                </form>

                            )}

                            <AvailabilityRulesList
                                rules={rules}
                                loading={loading}
                                onDelete={handleDelete}
                            />
                        </TabsContent>
                    </Tabs>
                ) : (
                    <div className="mt-4">{children}</div>
                )}
            </DialogContent>
        </Dialog>
    );
}
