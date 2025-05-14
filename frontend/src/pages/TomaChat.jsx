import { MessageSquare, Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

const TomaChat = () => {
    const { user } = useAuth();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Halo! Saya TomaBot, asisten virtual untuk membantu Anda dengan pertanyaan seputar budidaya tomat. Apa yang ingin Anda tanyakan?",
            sender: 'bot'
        }
    ]);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        // Add user message
        const userMessage = {
            id: messages.length + 1,
            text: message,
            sender: 'user'
        };
        setMessages(prev => [...prev, userMessage]);
        setMessage('');

        // Simulate bot response
        setTimeout(() => {
            const botResponse = {
                id: messages.length + 2,
                text: "Terima kasih atas pertanyaannya. Saya akan membantu Anda dengan informasi seputar budidaya tomat.",
                sender: 'bot'
            };
            setMessages(prev => [...prev, botResponse]);
        }, 1000);
    };

    return (
        <div className="relative min-h-screen flex bg-[#3B5D3D]">
            <Sidebar user={user} />
            <div className="flex-1 p-4">
                {/* Main card container */}
                <div className="bg-white min-h-[calc(100vh-2rem)] rounded-3xl shadow-xl p-6">
                    <div className="max-w-4xl mx-auto h-full flex flex-col">
                        {/* Inner chat card */}
                        <div className="bg-slate-50 rounded-xl shadow-md p-6 sm:p-8 flex-grow flex flex-col">
                            <div className="flex items-center gap-3 mb-6">
                                <MessageSquare className="w-8 h-8 sm:w-9 sm:h-9 text-green-600" />
                                <h1 className="text-2xl sm:text-3xl font-bold text-green-700">TomaChat</h1>
                            </div>

                            {/* Chat Messages Area */}
                            <div className="flex-grow h-[calc(100vh-20rem)] sm:h-[calc(100vh-22rem)] overflow-y-auto mb-4 space-y-4 pr-2">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[75%] rounded-xl p-3 sm:p-4 text-sm sm:text-base shadow-sm ${
                                                msg.sender === 'user'
                                                    ? 'bg-green-600 text-white'
                                                    : 'bg-white text-gray-800 border border-gray-200'
                                            }`}
                                        >
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Message Input Form */}
                            <form onSubmit={handleSendMessage} className="flex items-center gap-2 sm:gap-3 pt-2">
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Ketik pesan Anda di sini..."
                                    className="flex-1 p-3 sm:p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow"
                                />
                                <button
                                    type="submit"
                                    disabled={!message.trim()}
                                    className="bg-green-600 text-white p-3 sm:p-4 rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed"
                                >
                                    <Send className="w-5 h-5 sm:w-6 sm:h-6" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TomaChat;