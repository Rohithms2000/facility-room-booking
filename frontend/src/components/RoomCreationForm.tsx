import Select from "react-select";

interface RoomFormProps {
    name: string;
    capacity: number | null;
    location: string;
    resources: string[];
    errors: { name?: string; capacity?: string; location?: string; resources?: string; general?: string | null };
    onInputChange: (field: string, value: string | number | string[]) => void; onSubmit: (e: React.FormEvent) => void;
    title: string;
    submitText: string;
    onDelete?: () => void | Promise<void>;
}

export default function RoomCreationForm({
    name,
    capacity,
    location,
    resources,
    errors,
    onInputChange,
    onSubmit,
    submitText,
    onDelete
}: RoomFormProps) {
    const resourceOptions = [
        { value: "WiFi", label: "WiFi" },
        { value: "AC", label: "AC" },
        { value: "Projector", label: "Projector" },
        { value: "Whiteboard", label: "Whiteboard" },
        { value: "TV", label: "TV" },
    ];

    return (
        <div className="flex items-center justify-center">
            <div className="bg-white w-full p-8">
                <form
                    onSubmit={onSubmit}
                    className="space-y-2"
                    autoComplete="off"
                >
                    <label className="block">Name</label>
                    <input
                        type="text"
                        className="input border border-gray-300 rounded p-2 w-full focus:outline-none focus:border-gray-500"
                        value={name}
                        onChange={(e) => onInputChange("name", e.target.value)}
                    />
                    <p className="text-red-500 text-sm">{errors.name}</p>

                    <label className="block">Capacity</label>
                    <input
                        type="number"
                        className="input border border-gray-300 rounded p-2 w-full focus:outline-none focus:border-gray-500"
                        value={capacity ?? ""}
                        onChange={(e) => onInputChange("capacity", e.target.value)}
                    />
                    <p className="text-red-500 text-sm">{errors.capacity}</p>

                    <label className="block">Location</label>
                    <input
                        type="text"
                        className="input border border-gray-300 rounded p-2 w-full mb-2 focus:outline-none focus:border-gray-500"
                        value={location}
                        onChange={(e) => onInputChange("location", e.target.value)}
                    />
                    <p className="text-red-500 text-sm">{errors.location}</p>

                    <label className="block font-semibold">Resources</label>
                    <Select
                        isMulti
                        options={resourceOptions}
                        value={resourceOptions.filter((opt) => resources.includes(opt.value))}
                        onChange={(selectedOptions) =>
                            onInputChange(
                                "resources",
                                selectedOptions.map((opt) => opt.value)
                            )
                        }
                    />
                    <p className="text-red-500 text-sm">{errors.resources}</p>
                    <p className="text-red-500 text-sm">{errors.general}</p>
                    <div className="flex justify-end space-x-3 mt-6">
                        {onDelete && (
                            <button
                                type="button"
                                onClick={onDelete}
                                className="border-1 border-red-500 bg-red-500/40 px-4 py-2 hover:shadow-lg hover:text-white hover:bg-red-500 cursor-pointer transition duration-200"
                            >
                                Delete
                            </button>
                        )}
                        <button
                            type="submit"
                            className="border-1 border-green-500 bg-green-500/40 px-4 py-2 hover:shadow-lg hover:text-white hover:bg-green-500 cursor-pointer transition duration-200"
                        >
                            {submitText}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
