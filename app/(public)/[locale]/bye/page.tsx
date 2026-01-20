"use client";

import { motion } from "framer-motion";

export default function FarewellPage() {
  return (
    <motion.main
      animate={{ backgroundPosition: "100% 50%" }}
      className="
        flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8
        bg-linear-to-br from-slate-900 via-slate-800 to-slate-900
        bg-size-[200%_200%] w-full
      "
      initial={{ backgroundPosition: "0% 50%" }}
      transition={{
        duration: 18,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      }}
    >
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="
          w-full max-w-xs sm:max-w-md lg:max-w-lg
          text-center
        "
        initial={{ opacity: 0, y: 12 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h1
          className="
            mb-4
            text-2xl sm:text-3xl lg:text-4xl
            font-semibold
            tracking-tight
            text-white
          "
        >
          {"Es hora de pasar página."}
        </h1>

        <p className="text-sm sm:text-base text-slate-300">
          {"No te preocupes, no eres tú, eres… en realidad, sí, eres tú."}
        </p>

        <p className="mt-2 text-sm sm:text-base text-slate-400">
          Gracias por pasar por aquí, y que tus clics siempre sean a tu favor.
        </p>
      </motion.div>
    </motion.main>
  );
}
