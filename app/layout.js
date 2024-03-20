import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { NavBar } from "./_components/NavBar";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Code Runner",
  description: "A code runner web app, Run your codes in C++, Python, JavaScript, Java",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster position="top-right" reverseOrder={false} />
        <div className="h-full flex-1">
          {/* to add nav-bar */}
          <NavBar />
          {children}
        </div>
      </body>
    </html>
  );
}
