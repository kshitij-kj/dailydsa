import "@/styles/globals.css";
import { Inter } from "next/font/google";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { AuthProvider } from "@/context/AuthContext";
import { SessionProvider } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";

const inter = Inter({ subsets: ["latin"] });

const pageVariants = {
  initial: {
    opacity: 0,
  },
  enter: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
};

export default function App({ Component, pageProps, router }) {
  return (
    <SessionProvider session={pageProps.session}>
      <AuthProvider>
        <div className={`${inter.className} min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800`}>
          <Header />
          <AnimatePresence
            mode="wait"
            initial={false}
            onExitComplete={() => window.scrollTo(0, 0)}
          >
            <motion.main
              key={router.pathname}
              initial="initial"
              animate="enter"
              exit="exit"
              variants={pageVariants}
              className="flex-grow pt-16 relative"
            >
              <Component {...pageProps} />
            </motion.main>
          </AnimatePresence>
          <Footer />
        </div>
      </AuthProvider>
    </SessionProvider>
  );
}
