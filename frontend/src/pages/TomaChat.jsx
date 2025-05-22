import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { MessageSquare, Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

const TomaChat = () => {
    const { user } = useAuth();
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 'welcome',
            text: "Halo! Saya TomaChat, asisten virtual untuk membantu Anda dengan pertanyaan seputar tomat. Kami tidak bisa menjawab diluar topik tomat. Untuk pertanyaan seputar fitur, developer dan aplikasi silakan kunjungi [TomaHelp](/chats).",
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

    // Load chat history when component mounts
    useEffect(() => {
        const loadChatHistory = async () => {
            if (!user?.id) return;

            try {
                setIsLoading(true);
                const response = await fetch(`http://localhost:8080/chat_history/${user.id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch chat history');
                }
                const data = await response.json();

                if (Array.isArray(data)) {
                    console.log('Received chat history:', data); // Debug log
                    // Sort messages by timestamp if needed
                    const sortedMessages = data.sort((a, b) =>
                        new Date(a.timestamp) - new Date(b.timestamp)
                    );
                    setMessages(prev => [prev[0], ...sortedMessages]); // Keep welcome message and add history
                }
            } catch (error) {
                console.error('Error loading chat history:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadChatHistory();
    }, [user?.id]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!message.trim() || !user?.id) return;

        // Add user message
        const userMessage = {
            id: Date.now(),
            text: message,
            sender: 'user'
        };
        setMessages(prev => [...prev, userMessage]);
        setMessage('');
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:8080/toma_chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message.trim(),
                    user_id: user.id
                })
            });

            const data = await response.json();

            // Add bot response
            const botResponse = {
                id: Date.now() + 1,
                text: data.response,
                sender: 'bot'
            };
            setMessages(prev => [...prev, botResponse]);
        } catch (error) {
            console.error('Error:', error);
            // Add error message
            const errorResponse = {
                id: Date.now() + 1,
                text: "Maaf, terjadi kesalahan dalam memproses permintaan Anda. Silakan coba lagi.",
                sender: 'bot'
            };
            setMessages(prev => [...prev, errorResponse]);
        } finally {
            setIsLoading(false);
        }
    };

    const formatMessageTime = (timestamp) => {
        if (!timestamp) return '';
        try {
            return format(new Date(timestamp), "d MMMM yyyy 'pukul' HH.mm", { locale: id });
        } catch (error) {
            console.error('Error formatting date:', error);
            return '';
        }
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
                                        className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                                    >
                                        <div
                                            className={`max-w-[75%] rounded-xl p-3 sm:p-4 text-sm sm:text-base shadow-sm ${msg.sender === 'user'
                                                ? 'bg-green-600 text-white'
                                                : 'bg-white text-gray-800 border border-gray-200'
                                                }`}
                                        >
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {msg.text}
                                            </ReactMarkdown>
                                        </div>
                                        <span className="text-xs text-gray-500 mt-1 px-1">
                                            {formatMessageTime(msg.timestamp)}
                                        </span>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex justify-start">
                                        <div className="max-w-[75%] rounded-xl p-3 sm:p-4 text-sm sm:text-base shadow-sm bg-white text-gray-800 border border-gray-200">
                                            Sedang mengetik...
                                        </div>
                                    </div>
                                )}
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
                                    disabled={isLoading || !user?.id}
                                />
                                <button
                                    type="submit"
                                    disabled={!message.trim() || isLoading || !user?.id}
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