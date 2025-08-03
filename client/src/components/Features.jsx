import { Users, Code2, ShieldCheck, Clock } from "lucide-react";
import { motion } from "framer-motion";

export const Features = () => {
  const features = [
    {
      title: "Real-Time Collaboration",
      icon: Code2,
      description: "Write code with your team. Zero lag, full sync.",
    },
    {
      title: "End-to-End Encryption",
      icon: ShieldCheck,
      description: "Secure communication with robust encryption.",
    },
    {
      title: "Team Friendly",
      icon: Users,
      description: "Invite and manage team members with ease.",
    },
    {
      title: "Always in Sync",
      icon: Clock,
      description: "All changes appear instantly on every screen.",
    },
  ];

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 mt-16 w-full px-4">
      {features.map((feature, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.15, duration: 0.4 }}
          className="bg-white border border-gray-200 rounded-xl p-5 text-center shadow-lg hover:shadow-2xl hover:bg-blue-50 hover:border-blue-500 transition-all duration-300 transform hover:scale-105"
        >
          <feature.icon className="h-7 w-7 mx-auto text-blue-600 mb-3" />
          <h3 className="text-base font-semibold text-gray-800 mb-1">
            {feature.title}
          </h3>
          <p className="text-sm text-gray-600">{feature.description}</p>
        </motion.div>
      ))}
    </div>
  );
};
