import { motion } from "framer-motion";
import Head from "next/head";

export default function Discuss() {
  return (
    <>
      <Head>
        <title>Discuss - DailyDSA</title>
        <meta name="description" content="Discuss DSA problems with other users" />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Discussion Forum
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Coming soon! Join our community to discuss DSA problems and solutions.
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
}