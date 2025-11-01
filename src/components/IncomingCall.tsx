import React from 'react';
import { motion } from 'motion/react';
import { Phone, PhoneOff } from 'lucide-react';

interface IncomingCallProps {
  onEnd: () => void;
}

export function IncomingCall({ onEnd }: IncomingCallProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 bg-gradient-to-b from-blue-600 to-blue-800 z-50 flex flex-col items-center justify-between py-20 px-8"
    >
      {/* Caller Info */}
      <div className="flex flex-col items-center text-white mt-20">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mb-6 backdrop-blur-sm"
        >
          <div className="w-24 h-24 bg-white/30 rounded-full flex items-center justify-center">
            <span className="text-5xl">👩‍⚕️</span>
          </div>
        </motion.div>
        <h2 className="text-3xl mb-2">Клиника ALTA</h2>
        <p className="text-xl text-blue-100">Администратор</p>
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="mt-4 text-blue-100"
        >
          Входящий звонок...
        </motion.p>
      </div>

      {/* Call Buttons */}
      <div className="flex gap-20 mb-10">
        {/* Decline Button */}
        <button className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
            <PhoneOff className="text-white" size={28} />
          </div>
          <span className="text-white text-sm">Отклонить</span>
        </button>

        {/* Accept Button */}
        <button
          onClick={onEnd}
          className="flex flex-col items-center gap-2"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
          >
            <Phone className="text-white" size={28} />
          </motion.div>
          <span className="text-white text-sm">Принять</span>
        </button>
      </div>
    </motion.div>
  );
}
