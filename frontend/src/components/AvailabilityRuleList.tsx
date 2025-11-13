"use client";
import {
    Trash
} from "lucide-react";
interface Rule {
    id: string;
    ruleType: string;
    date?: string | null;
    dayOfWeek?: string | null;
    startTime?: string | null;
    endTime?: string | null;
    reason: string;
}

interface RulesTableProps {
    rules: Rule[];
    loading: boolean;
    onDelete: (id: string)=> void;
}

export default function AvailabilityRulesList({ rules, loading, onDelete }: RulesTableProps) {
    if (loading) {
        return (
            <div className="flex justify-center items-center py-10 text-gray-500">
                Loading rules...
            </div>
        );
    }

    if (rules.length === 0) {
        return (
            <div className="text-center text-gray-500 py-8">
                No availability rules found.
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 text-sm">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-2 text-left border-b">Type</th>
                        <th className="px-4 py-2 text-left border-b">Date</th>
                        <th className="px-4 py-2 text-left border-b">Day</th>
                        <th className="px-4 py-2 text-left border-b">Start</th>
                        <th className="px-4 py-2 text-left border-b">End</th>
                        <th className="px-4 py-2 text-left border-b">Reason</th>
                        <th className="px-4 py-2 text-left border-b">Action</th>
                    </tr>
                </thead>

                <tbody>
                    {rules.map((rule) => (
                        <tr key={rule.id} className="hover:bg-gray-50">
                            <td className="px-4 py-2 border-b font-medium">
                                <span
                                    className={`px-2 py-1 text-xs rounded ${rule.ruleType === "HOLIDAY"
                                            ? "bg-red-100 text-red-700"
                                            : rule.ruleType === "TIME_BLOCK"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-gray-100 text-gray-700"
                                        }`}
                                >
                                    {rule.ruleType}
                                </span>
                            </td>
                            <td className="px-4 py-2 border-b">
                                {rule.date ? new Date(rule.date).toLocaleDateString() : "-"}
                            </td>
                            <td className="px-4 py-2 border-b">{rule.dayOfWeek ?? "-"}</td>
                            <td className="px-4 py-2 border-b">
                                {rule.startTime ? new Date(rule.startTime).toLocaleTimeString() : "-"}
                            </td>
                            <td className="px-4 py-2 border-b">
                                {rule.endTime ? new Date(rule.endTime).toLocaleTimeString() : "-"}
                            </td>
                            <td className="px-4 py-2 border-b">{rule.reason || "-"}</td>
                            <td className="px-4 py-2 border-b">
                                <button onClick={()=> onDelete(rule.id)} className="text-red-500 hover:text-red-700"><Trash className="w-5 h-5 "/></button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
