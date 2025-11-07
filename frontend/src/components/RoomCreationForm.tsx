interface RoomFormProps {
    name: string;
    capacity: number | null;
    location: string;
    resources: string[];
    errors: { name?: string; capacity?: string; location?: string; resources?: string; general?: string };
    isOpen: boolean;
    onClose: () => void;
    onInputChange: (field: string, value: any) => void;
    onSubmit: (e: React.FormEvent) => void;
}

export default function RoomCreationForm({
    name,
    capacity,
    location,
    resources,
    errors,
    onClose,
    isOpen,
    onInputChange,
    onSubmit,
}: RoomFormProps) {

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-xs z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-900"
                >
                    ✕
                </button>
                <form
                    onSubmit={onSubmit}
                    className="space-y-4"
                    autoComplete="off"
                >
                    <h2 className="text-2xl mb-4 font-bold text-center">Create room</h2>

                    <input
                        type="text"
                        placeholder="Name"
                        className="input border border-gray-300 rounded p-2 w-full mb-2 focus:outline-none focus:border-gray-500"
                        value={name}
                        onChange={(e) => onInputChange("name", e.target.value)}
                    />
                    <p className="text-red-500 text-sm">{errors.name}</p>

                    <input
                        type="text"
                        placeholder="Capacity"
                        className="input border border-gray-300 rounded p-2 w-full mb-2 focus:outline-none focus:border-gray-500"
                        value={Number(capacity)}
                        onChange={(e) => onInputChange("capacity", e.target.value)}
                    />
                    <p className="text-red-500 text-sm">{errors.capacity}</p>

                    <input
                        type="text"
                        placeholder="Location"
                        className="input border border-gray-300 rounded p-2 w-full mb-2 focus:outline-none focus:border-gray-500"
                        value={location}
                        onChange={(e) => onInputChange("location", e.target.value)}
                    />
                    <p className="text-red-500 text-sm">{errors.location}</p>

                    <input
                        type="text"
                        placeholder="Resources"
                        className="input border border-gray-300 rounded p-2 w-full mb-2 focus:outline-none focus:border-gray-500"
                        value={resources.join(", ")}
                        onChange={(e) => onInputChange("resources", e.target.value.split(",").map(r => r.trim()))}

                    />
                    <p className="text-red-500 text-sm">{errors.resources}</p>
                    <p className="text-red-500 text-sm">{errors.general}</p>

                    <button
                        type="submit"
                        className="bg-gray-700 text-white w-full hover:bg-gray-700 focus:bg-gray-700 focus:ring-3 focus:ring-gray-400 cursor-pointer font-medium rounded-lg px-4 py-2 mt-2"
                    >
                        Create
                    </button>
                </form>
            </div>
        </div>
    );
}
