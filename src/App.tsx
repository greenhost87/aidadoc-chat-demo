import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { IncomingCall } from './components/IncomingCall';
import { InteractiveStars } from './components/InteractiveStars';
import { MultiChoice } from './components/MultiChoice';

interface Message {
  id: number;
  type: 'bot' | 'user' | 'buttons' | 'call' | 'stars' | 'multi-choice' | 'link-text';
  content: string;
  buttons?: string[];
  options?: string[];
  showCheckmark?: boolean;
  allowMultiple?: boolean;
  autoSelectStars?: number;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [showCall, setShowCall] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const chatFlow: Message[] = [
    {
      id: 1,
      type: 'bot',
      content: `Здравствуйте 👋\nЯ AIDADOC — цифровой консьерж клиники ALTA\n\nЯ помогу понять:\n• насколько ваше состояние срочное\n• к какому врачу лучше обратиться\n• и какие обследования могут быть полезны\n\nЭто не диагноз, а дружеская медицинская навигация 🩺✨`,
    },
    {
      id: 2,
      type: 'buttons',
      content: '',
      buttons: ['✅ Помогите', '⏳ В другой раз'],
    },
    {
      id: 3,
      type: 'user',
      content: '✅ Помогите',
    },
    {
      id: 4,
      type: 'link-text',
      content: 'Перед началом — пара формальностей\n\nВаши ответы нужны только для того, чтобы быстро и аккуратно направить вас к нужному специалисту\nВсе данные защищены и используются только в медицинских целях\n\n☑️ Я соглашаюсь с условиями обработки данных и дистанционной консультации',
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
      content: 'Понимаю. Давайте разберёмся чуть подробнее\n\nКакой у вас кашель?',
    },
    {
      id: 10,
      type: 'buttons',
      content: '',
      buttons: ['• Сухой', '• Влажный', '• С прожилками крови'],
    },
    {
      id: 11,
      type: 'user',
      content: 'Сухой',
    },
    {
      id: 12,
      type: 'bot',
      content: 'Кашель длится меньше недели?',
    },
    {
      id: 13,
      type: 'buttons',
      content: '',
      buttons: ['• Да', '• Нет, больше месяца'],
    },
    {
      id: 14,
      type: 'user',
      content: 'Да',
    },
    {
      id: 15,
      type: 'bot',
      content: 'Температура выше 38 °C?',
    },
    {
      id: 16,
      type: 'buttons',
      content: '',
      buttons: ['• Да', '• Нет'],
    },
    {
      id: 17,
      type: 'user',
      content: 'Нет',
    },
    {
      id: 18,
      type: 'bot',
      content: 'Есть насморк или заложенность носа?',
    },
    {
      id: 19,
      type: 'buttons',
      content: '',
      buttons: ['• Да', '• Нет'],
    },
    {
      id: 20,
      type: 'user',
      content: 'Да',
    },
    {
      id: 21,
      type: 'bot',
      content: 'Появилась слабость, головная боль или ломота?',
    },
    {
      id: 22,
      type: 'buttons',
      content: '',
      buttons: ['• Да', '• Нет'],
    },
    {
      id: 23,
      type: 'user',
      content: 'Да',
    },
    {
      id: 24,
      type: 'bot',
      content: `Спасибо! Проанализировала ваши ответы 🙌\n\nПредварительно — симптомы похожи на ОРВИ\n⚠️ Признаков опасного состояния сейчас нет\n\nЧто рекомендуем:\n🛌 Отдых и восстановление\n💧 Тёплое питьё\n🌡️ Контроль температуры\n💊 Симптоматическая терапия — подскажет врач\n\nЧтобы подтвердить состояние и ускорить назначение лечения, полезно сдать:\n🧪 Общий анализ крови + СОЭ\n\nДальше лучше всего:\n👨‍⚕️ Консультация терапевта в ближайшие 1–2 дня`,
    },
    {
      id: 25,
      type: 'buttons',
      content: '',
      buttons: [
        '📅 Сразу записаться к терапевту',
        '🧾 Сначала сдать анализы, потом — к терапевту',
        '❓ Задать вопрос администратору',
      ],
    },
    {
      id: 26,
      type: 'user',
      content: '🧾 Сначала сдать анализы, потом — к терапевту',
    },
    {
      id: 27,
      type: 'bot',
      content: 'Отличный план 👌\n\nСейчас администратор свяжется с вами, чтобы подобрать удобное время. Обычно это занимает не больше 10 минут 👩‍⚕️',
    },
    {
      id: 28,
      type: 'call',
      content: '',
    },
    {
      id: 29,
      type: 'bot',
      content: 'Ваша запись:\n\n📍 Лаборатория — 12 декабря, 09:00\n👨‍⚕️ Терапевт — 13 декабря, 14:15',
    },
    {
      id: 30,
      type: 'buttons',
      content: '',
      buttons: [
        '⏰ Напомнить заранее',
        'ℹ️ Подготовка к визиту',
        '✅ Всё верно, я приду',
      ],
    },
    {
      id: 31,
      type: 'user',
      content: '✅ Всё верно, я приду',
    },
    {
      id: 32,
      type: 'bot',
      content: 'Отлично! Будем рады помочь вам восстановиться 🙏\nЖелаю скорейшего выздоровления 🌿',
    },
    {
      id: 33,
      type: 'bot',
      content: 'Мы надеемся, что вы быстро идёте на поправку 💙\nПоделитесь, пожалуйста, как все прошло',
    },
    {
      id: 34,
      type: 'buttons',
      content: '',
      buttons: ['⭐ Оценить', '⏳ В другой раз'],
    },
    {
      id: 35,
      type: 'user',
      content: '⭐ Оценить',
    },
    {
      id: 36,
      type: 'bot',
      content: 'Как вы оцениваете работу лаборатории?',
    },
    {
      id: 37,
      type: 'stars',
      content: '',
      autoSelectStars: 4,
    },
    {
      id: 38,
      type: 'user',
      content: '⭐⭐⭐⭐☆',
    },
    {
      id: 39,
      type: 'bot',
      content: 'Спасибо! А что понравилось больше всего? (можно выбрать несколько)',
    },
    {
      id: 40,
      type: 'multi-choice',
      content: '',
      options: [
        '• Быстрая сдача анализов',
        '• Вежливый персонал',
        '• Удобное время',
        '• Чистота и комфорт',
        '• Другое (написать)',
        '• Пропустить',
      ],
      allowMultiple: true,
    },
    {
      id: 41,
      type: 'user',
      content: '• Быстрая сдача анализов\n• Вежливый персонал',
    },
    {
      id: 42,
      type: 'bot',
      content: 'А как прошла консультация врача?',
    },
    {
      id: 43,
      type: 'stars',
      content: '',
      autoSelectStars: 5,
    },
    {
      id: 44,
      type: 'user',
      content: '⭐⭐⭐⭐⭐',
    },
    {
      id: 45,
      type: 'bot',
      content: 'Спасибо 💙\nХотите добавить короткий отзыв? (не обязательно)',
    },
    {
      id: 46,
      type: 'buttons',
      content: '',
      buttons: ['• Да, написать', '• Всё отлично 🙌', '• Нет, пропустить'],
    },
    {
      id: 47,
      type: 'user',
      content: '• Всё отлично 🙌',
    },
    {
      id: 48,
      type: 'bot',
      content: 'И ещё маленький вопрос 😊\n\nКак вам помощь AIDADOC?',
    },
    {
      id: 49,
      type: 'multi-choice',
      content: '',
      options: [
        '⭐ Плохо',
        '⭐⭐ Нормально',
        '⭐⭐⭐ Удобно',
        '⭐⭐⭐⭐ Отлично',
        '⭐⭐⭐⭐⭐ Очень помог(ла)',
      ],
      allowMultiple: false,
    },
    {
      id: 50,
      type: 'user',
      content: '⭐⭐⭐⭐⭐ Очень помог(ла)',
    },
    {
      id: 51,
      type: 'bot',
      content: 'Спасибо! Это помогает нам становиться лучше 🙏',
    },
    {
      id: 52,
      type: 'bot',
      content: 'И чтобы мы точнее подбирали маршруты:\n\nНаши рекомендации совпали с тем, что сказал врач?',
    },
    {
      id: 53,
      type: 'buttons',
      content: '',
      buttons: ['• Да, полностью ✅', '• В целом да', '• Частично', '• Нет, отличались'],
    },
    {
      id: 54,
      type: 'user',
      content: '• Да, полностью ✅',
    },
    {
      id: 55,
      type: 'bot',
      content: 'Здорово! Очень рады 🎉',
    },
    {
      id: 56,
      type: 'bot',
      content: 'Выздоравливайте 🌿\n\nЕсли понадобится помощь снова — просто напишите «Начать» 💬\n\nМы всегда рядом 💙',
    },
  ];

  useEffect(() => {
    if (currentStep < chatFlow.length) {
      const message = chatFlow[currentStep];
      
      if (message.type === 'call') {
        const timer = setTimeout(() => {
          setShowCall(true);
        }, 1000);
        return () => clearTimeout(timer);
      }

      if (currentStep > 0 && chatFlow[currentStep - 1].type === 'call' && !callEnded) {
        return;
      }

      const delay = currentStep === 0 ? 500 : 1200;
      
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
    setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
    }, 500);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
      <div className="w-[390px] h-[844px] bg-[#ECECEC] rounded-[40px] shadow-2xl overflow-hidden flex flex-col relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-black rounded-b-3xl z-50"></div>

        <div className="bg-white px-4 pt-10 pb-3 flex items-center justify-between shadow-sm relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white">A</span>
            </div>
            <div>
              <div className="text-gray-900">AIDADOC</div>
              <div className="text-xs text-gray-500">Цифровой консьерж</div>
            </div>
          </div>
        </div>

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

                {message.type === 'link-text' && (
                  <div className="flex justify-start mb-3">
                    <div className="max-w-[80%] px-4 py-3 rounded-2xl bg-white text-gray-800 rounded-tl-none shadow-sm">
                      <div className="whitespace-pre-line">
                        {message.content.split('условиями обработки данных')[0]}
                        <a href="#" className="text-blue-500 underline">условиями обработки данных</a>
                        {' и '}
                        <a href="#" className="text-blue-500 underline">дистанционной консультации</a>
                      </div>
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
                        className="bg-white border-2 border-blue-500 text-blue-500 px-4 py-2.5 rounded-lg shadow-sm text-left"
                      >
                        {button}
                      </motion.button>
                    ))}
                  </div>
                )}

                {message.type === 'stars' && (
                  <InteractiveStars autoSelect={message.autoSelectStars} />
                )}

                {message.type === 'multi-choice' && message.options && (
                  <MultiChoice 
                    options={message.options} 
                    allowMultiple={message.allowMultiple ?? true}
                  />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="h-8 bg-[#ECECEC]"></div>

        <AnimatePresence>
          {showCall && <IncomingCall onEnd={handleCallEnd} />}
        </AnimatePresence>
      </div>
    </div>
  );
}
