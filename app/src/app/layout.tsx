import Navbar from "@/components/Navbar";
import { UserProvider } from "./context/useContext";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; 

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ToastContainer/>
        <UserProvider>
          <Navbar />
          <div className="pt-[70px]"></div>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
