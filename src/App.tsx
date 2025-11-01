import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { IncomingCall } from './components/IncomingCall';
import { StarRating } from './components/StarRating';

interface Message {
  id: number;
  type: 'bot' | 'user' | 'buttons' | 'call' | 'stars';
  content: string;
  buttons?: string[];
  showCheckmark?: boolean;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [showCall, setShowCall] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [ratingGiven, setRatingGiven] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const chatFlow: Message[] = [
    {
      id: 1,
      type: 'bot',
      content: `Здравствуйте 👋\nЯ AIDA — цифровой консьерж клиники ALTA.\nЯ помогу определить насколько срочно вам нужен и какой специальности врач и какие обследования могут понадобиться.\nЭто не диагноз, а предварительная медицинская навигация.`,
    },
    {
      id: 2,
      type: 'buttons',
      content: '',
      buttons: ['Помогите', 'В другой раз'],
    },
    {
      id: 3,
      type: 'user',
      content: 'Помогите',
      showCheckmark: true,
    },
    {
      id: 4,
      type: 'bot',
      content: `Перед началом ответьте на несколько вопросов.\nВаши данные защищены и используются только для сопровождения вас до приема.\n☑️ Я соглашаюсь с условиями обработки данных и телемедициной`,
    },
    {
      id: 5,
      type: 'buttons',
      content: '',
      buttons: ['Да, согласен'],
    },
    {
      id: 6,
      type: 'user',
      content: 'Да, согласен',
    },
    {
      id: 7,
      type: 'bot',
      content: 'Что вас беспокоит?',
    },
    {
      id: 8,
      type: 'user',
      content: 'Кашель',
    },
    {
      id: 9,
      type: 'bot',
      content: 'Кашель сухой?',
    },
    {
      id: 10,
      type: 'user',
      content: 'Да',
    },
    {
      id: 11,
      type: 'bot',
      content: 'Начался недавно?',
    },
    {
      id: 12,
      type: 'user',
      content: 'Да',
    },
    {
      id: 13,
      type: 'bot',
      content: 'Температура выше 38?',
    },
    {
      id: 14,
      type: 'user',
      content: 'Нет',
    },
    {
      id: 15,
      type: 'bot',
      content: `✅ Предварительное заключение\n\nВаши симптомы похожи на ОРВИ.\n⚠️ Признаков тяжёлого состояния нет.\n\nРекомендуем:\n• домашний режим 🛌\n• питьё + симптоматические средства (назначит врач) 💧\n• контроль температуры 🌡️\n\nДополнительный шаг для точности:\n🧪 Сдать общий анализ крови + СОЭ\n\nПлан дальше:\n👨‍⚕️ Консультация терапевта (1–2 дня)`,
    },
    {
      id: 16,
      type: 'buttons',
      content: '',
      buttons: [
        '📅 Только записаться к терапевту',
        '🧾 Сначала сдать анализы и с результатами записаться к терапевту',
        '❓ Задать вопрос оператору',
      ],
    },
    {
      id: 17,
      type: 'user',
      content: 'Сначала сдать анализы и с результатами записаться к терапевту',
    },
    {
      id: 18,
      type: 'bot',
      content: 'Спасибо! Администратор свяжется с Вами в течение 10 минут 👩‍⚕️\nМы также пришлём вам памятку и рекомендации.',
    },
    {
      id: 19,
      type: 'call',
      content: '',
    },
    {
      id: 20,
      type: 'bot',
      content: '12 декабря в 9:00 — лаборатория\n13 декабря в 14:15 — консультация врача-терапевта',
    },
    {
      id: 21,
      type: 'buttons',
      content: '',
      buttons: [
        'Напомнить о визитах заранее',
        'Рассказать подробнее о подготовке',
        'Я приду',
      ],
    },
    {
      id: 22,
      type: 'user',
      content: 'Я приду',
    },
    {
      id: 23,
      type: 'bot',
      content: 'Рад был помочь! Скорейшего выздоровления!',
    },
    {
      id: 24,
      type: 'bot',
      content: 'После приема оцените качество оказанной помощи.',
    },
    {
      id: 25,
      type: 'stars',
      content: '',
    },
  ];

  useEffect(() => {
    if (currentStep < chatFlow.length) {
      const message = chatFlow[currentStep];
      
      // Special handling for call
      if (message.type === 'call') {
        const timer = setTimeout(() => {
          setShowCall(true);
        }, 1000);
        return () => clearTimeout(timer);
      }

      // Don't auto-advance after call until it's ended
      if (currentStep > 0 && chatFlow[currentStep - 1].type === 'call' && !callEnded) {
        return;
      }

      const delay = currentStep === 0 ? 500 : currentStep === chatFlow.length - 1 ? 1500 : 1000;
      
      const timer = setTimeout(() => {
        if (message.type !== 'call') {
          setMessages((prev) => [...prev, message]);
        }
        setCurrentStep((prev) => prev + 1);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [currentStep, callEnded]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleCallEnd = () => {
    setShowCall(false);
    setCallEnded(true);
    // Continue with next messages after call
    setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
    }, 500);
  };

  const handleRating = (rating: number) => {
    if (!ratingGiven) {
      setRatingGiven(true);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: 26,
            type: 'user',
            content: `${'⭐'.repeat(rating)}`,
          },
        ]);
      }, 500);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
      {/* iPhone 13 Container */}
      <div className="w-[390px] h-[844px] bg-[#ECECEC] rounded-[40px] shadow-2xl overflow-hidden flex flex-col relative">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-black rounded-b-3xl z-50"></div>

        {/* Header */}
        <div className="bg-white px-4 pt-10 pb-3 flex items-center justify-between shadow-sm relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white">A</span>
            </div>
            <div>
              <div className="text-gray-900">AIDA</div>
              <div className="text-xs text-gray-500">Цифровой консьерж</div>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div ref={scrollRef} className="flex-1 px-4 py-4 overflow-y-auto">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {message.type === 'bot' && (
                  <div className="flex justify-start mb-3">
                    <div className="max-w-[80%] px-4 py-3 rounded-2xl bg-white text-gray-800 rounded-tl-none shadow-sm">
                      <span className="whitespace-pre-line">{message.content}</span>
                    </div>
                  </div>
                )}

                {message.type === 'user' && (
                  <div className="flex justify-end mb-3">
                    <div className="max-w-[80%] px-4 py-3 rounded-2xl bg-blue-500 text-white rounded-tr-none shadow-sm">
                      {message.showCheckmark && <span className="mr-1">✅</span>}
                      <span className="whitespace-pre-line">{message.content}</span>
                    </div>
                  </div>
                )}

                {message.type === 'buttons' && message.buttons && (
                  <div className="flex flex-col gap-2 mb-3 ml-2">
                    {message.buttons.map((button, index) => (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2, delay: index * 0.1 }}
                        className="bg-white border-2 border-blue-500 text-blue-500 px-4 py-2.5 rounded-lg shadow-sm"
                      >
                        {button}
                      </motion.button>
                    ))}
                  </div>
                )}

                {message.type === 'stars' && (
                  <StarRating onRate={handleRating} />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Bottom Safe Area */}
        <div className="h-8 bg-[#ECECEC]"></div>

        {/* Incoming Call Overlay */}
        <AnimatePresence>
          {showCall && <IncomingCall onEnd={handleCallEnd} />}
        </AnimatePresence>
      </div>
    </div>
  );
}
