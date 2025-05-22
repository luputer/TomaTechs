import axios from 'axios';
import { MessageSquare, Send, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState(() => {
        // Load messages from localStorage when component mounts
        const savedMessages = localStorage.getItem('chatMessages');
        return savedMessages ? JSON.parse(savedMessages) : [];
    });
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Save messages to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('chatMessages', JSON.stringify(messages));
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;

        const userMessage = {
            role: 'user',
            content: inputMessage
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/cs_chat`, {
                messages: [...messages, userMessage]
            });

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: response.data.response
            }]);
        } catch (error) {
            console.error('Error generating response:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Maaf, terjadi kesalahan. Silakan coba lagi.'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const clearChat = () => {
        setMessages([]);
        localStorage.removeItem('chatMessages');
        setIsOpen(false);
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {isOpen && (
                <div className="bg-black text-white rounded-2xl shadow-xl w-[380px] mb-4 overflow-hidden">
                    {/* Header */}
                    <div className="p-6 pb-4 bg-gradient-to-r from-blue-600 to-blue-700">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <img
                                    src="/images/logos/logo.png"
                                    alt="TomaTech"
                                    className="w-10 h-10 rounded-full bg-white p-1"
                                />
                                <div>
                                    <h2 className="text-xl font-semibold">TomaHelp</h2>
                                    <p className="text-sm text-gray-200">Siap membantu Anda 24/7</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={clearChat}
                                    className="text-white hover:text-gray-200 transition-colors"
                                    title="Hapus Chat"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Welcome Message */}
                    {messages.length === 0 && (
                        <div className="p-6 text-center bg-gradient-to-b from-gray-900 to-black">
                            <h3 className="text-xl font-semibold mb-2">👋 Selamat datang di TomaHelp!</h3>
                            <p className="text-gray-300">
                                Saya asisten virtual yang siap membantu info tentang aplikasi. Pertanyaan seputar tomat, silakan tanyakan ke {" "}
                                <a href="/chats" className="text-blue-500 hover:text-blue-600">TomaChat</a>
                            </p>
                        </div>
                    )}

                    {/* Chat Messages */}
                    <div className="p-4 bg-gradient-to-b from-gray-900 to-black h-[400px] overflow-y-auto">
                        <div className="space-y-4">
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] p-3 rounded-xl ${message.role === 'user'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-800 text-white'
                                            }`}
                                    >
                                        {message.content}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-gray-800 text-white p-3 rounded-xl">
                                        <div className="flex space-x-2">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100"></div>
                                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200"></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* Message Input */}
                    <div className="p-4 bg-gray-900 border-t border-gray-800">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Ketik pesan Anda..."
                                className="flex-1 bg-gray-800 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={isLoading}
                                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`${isOpen ? 'bg-gray-700' : 'bg-blue-600'
                    } hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all transform hover:scale-105`}
            >
                {isOpen ? (
                    <X className="h-6 w-6" />
                ) : (
                    <MessageSquare className="h-6 w-6" />
                )}
            </button>
        </div>
    );
};

export default Chatbot;