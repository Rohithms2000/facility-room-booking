interface LoginFormProps {
  email: string;
  password: string;
  errors: {email?: string; password?: string; general?: string} ;
  onInputChange: (field: "email" | "password", value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function LoginForm({
  email,
  password,
  errors,
  onInputChange,
  onSubmit,
}: LoginFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4"
      autoComplete="off"
    >
      <h2 className="text-2xl mb-4 font-bold text-center">Login</h2>

      <input
        type="email"
        placeholder="Email"
        className="input border border-gray-300 rounded p-2 w-full mb-2 focus:outline-none focus:border-gray-500"
        value={email}
        onChange={(e) => onInputChange("email", e.target.value)}
      />
      <p className="text-red-500 text-sm">{errors.email}</p>

      <input
        type="password"
        placeholder="Password"
        className="input border border-gray-300 rounded p-2 w-full mb-2 focus:outline-none focus:border-gray-500"
        value={password}
        onChange={(e) => onInputChange("password", e.target.value)}
      />
      <p className="text-red-500 text-sm">{errors.password}</p>
      <p className="text-red-500 text-sm">{errors.general}</p>

      <button
        type="submit"
        className="bg-blue-600 text-white w-full hover:bg-blue-700 focus:bg-blue-700 focus:ring-2 focus:ring-blue-400 cursor-pointer focus:cursor-progress font-medium rounded-lg px-4 py-2 mt-2"
      >
        Login
      </button>
    </form>
  );
}
