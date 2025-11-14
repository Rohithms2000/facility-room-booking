import { AuthProvider } from "@/context/authContext";
import "./globals.css";
import ToastProvider from "@/components/ToastProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ToastProvider />
          {children}</AuthProvider>
      </body>
    </html>
  );
}
