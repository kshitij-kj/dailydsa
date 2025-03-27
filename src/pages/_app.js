import "@/styles/globals.css";
import { Inter } from "next/font/google";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { AuthProvider } from "@/context/AuthContext";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <AuthProvider>
        <div className={`${inter.className} min-h-screen flex flex-col`}>
          <Header />
          <main className="flex-grow pt-16">
            <Component {...pageProps} />
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </SessionProvider>
  );
}
