import { motion } from "framer-motion";
import { PlayCircle, LogIn, Code2, Users, ShieldCheck } from "lucide-react";
import { Features } from "./Features";
import { useUser } from "@clerk/clerk-react";
import toast from "react-hot-toast";

export const Hero = ({ onStartSessionClick, onJoinSessionClick }) => {
  const { user } = useUser();
  return (
    <section className="relative py-24 px-6 sm:px-12 lg:px-20 bg-gradient-to-br from-blue-50 to-purple-100 min-h-screen flex flex-col justify-center items-center overflow-hidden text-gray-900">
      {/* Background Icons */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <Code2 className="absolute top-20 left-10 w-24 h-24 text-blue-400 opacity-10 rotate-12" />
        <Users className="absolute bottom-20 right-16 w-20 h-20 text-purple-400 opacity-10 -rotate-12" />
        <ShieldCheck className="absolute top-1/2 right-1/3 w-20 h-20 text-indigo-400 opacity-10 rotate-6" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto">
        <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-6xl font-extrabold leading-tight"
          >
            <span className="text-gray-900">Code together in sync with </span>
            <motion.span
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7, duration: 0.4 }}
              className="bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 text-transparent bg-clip-text"
            >
              CodeSync
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-lg sm:text-xl text-gray-700 max-w-xl"
          >
            Instantly share your code sessions and build together in real-time.
            No setup needed.
          </motion.p>

          <motion.div
            className="flex flex-wrap justify-center gap-4 mt-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            <button
              onClick={() => {
                if (user) {
                  onStartSessionClick();
                } else {
                  toast.error("Please login to start a session.", {
                    position: "top-center",
                  });

                }
              }}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow hover:shadow-lg transition-all text-sm sm:text-base"
            >
              <PlayCircle className="h-5 w-5" />
              Start a Session
            </button>

            <button
              onClick={onJoinSessionClick}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-md shadow hover:shadow-lg transition-all text-sm sm:text-base"
            >
              <LogIn className="h-5 w-5" />
              Join a Session
            </button>
          </motion.div>
        </div>
      </div>
      <Features />
    </section>
  );
};
