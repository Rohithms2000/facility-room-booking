interface RegisterFormProps {
    name: string;
    email: string;
    password: string;
    errors: any;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
}

export default function RegisterForm({
    name,
    email,
    password,
    errors,
    onChange,
    onSubmit
}: RegisterFormProps) {
    return (
        <form onSubmit={onSubmit} className="space-y-4 ">
            <input
                name="name"
                value={name}
                onChange={onChange}
                placeholder="Name"
                className="input border border-gray-300 rounded p-2 w-full mb-2 focus:outline-none focus:border-gray-500"
            />
            <p className="text-red-500 text-sm">{errors.name}</p>

            <input
                name="email"
                value={email}
                onChange={onChange}
                placeholder="Email"
                className="input border border-gray-300 rounded p-2 w-full mb-2 focus:outline-none focus:border-gray-500"
            />
            <p className="text-red-500 text-sm">{errors.email}</p>

            <input
                name="password"
                type="password"
                value={password}
                onChange={onChange}
                placeholder="Password"
                className="input border border-gray-300 rounded p-2 w-full mb-2 focus:outline-none focus:border-gray-500"
            />
            <p className="text-red-500 text-sm">{errors.password}</p>
            <p className="text-red-500 text-sm">{errors.general}</p>

            <button type="submit" className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 cursor-pointer focus:cursor-progress font-medium rounded-lg px-4 py-2 mt-2 bg-blue-600">
                Register
            </button>
        </form>
    );
}
