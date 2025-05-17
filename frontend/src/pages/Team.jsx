import { motion } from "framer-motion";
import { Github, Instagram, Linkedin } from "lucide-react";
import Navbar from "../components/navbar";
import { CardBody, CardContainer, CardItem } from "../components/ui/3d-card";

const teamMembers = [
    {
        name: "Muhammad Saidi",
        id: "FC524D5Y1916",
        role: "Backend Developer",
        image: "/src/assets/saidi.webp",
        university: "Politeknik Negeri Banjarmasin",
        department: "Teknik Informatika",
        quote: "Code with passion, debug with patience",
        social: {
            linkedin: "https://linkedin.com/in/muhammad-saidi",
            github: "https://github.com/saidi0611",
            instagram: "https://instagram.com/saidi0611"
        }
    },
    {
        name: "Yuliagus",
        id: "FC558D5Y1116",
        role: "Frontend Developer",
        image: "/src/assets/agus2.jpeg",
        university: "Universitas Handayani Makassar",
        department: "Teknik Informatika",
        quote: "Building bridges between data and users",
        social: {
            linkedin: "https://linkedin.com/in/yuliagus",
            github: "https://github.com/yuliagus",
            instagram: "https://instagram.com/yuliagusmyunus"
        }
    },
    {
        name: "Ulfiani Latifah",
        id: "FC312D5X1540",
        role: "UI/UX Designer",
        image: "/src/assets/ulfi.jpg",
        university: "Universitas Sebelas Maret",
        department: "Ilmu Perpustakaan",
        quote: "Design is not just what it looks like, design is how it works",
        social: {
            linkedin: "https://linkedin.com/in/ulfiani",
            github: "https://github.com/ulfiani",
            instagram: "https://instagram.com/ulfiani"
        }
    },
];

const mlEngineers = [
    {
        name: "Ibrahim Akbar Arsanata",
        id: "MC283D5Y0062",
        role: "Machine Learning Engineer",
        image: "/src/assets/akbar3.png",
        university: "Universitas Negeri Semarang",
        department: "Statistika Terapan dan Komputasi",
        quote: "Turning data into intelligence",
        social: {
            linkedin: "https://linkedin.com/in/ibrahim-akbar",
            github: "https://github.com/ibrahim",
            instagram: "https://instagram.com/ibrahim"
        }
    },
    {
        name: "Annida Syamsa Hawa",
        id: "MC193D5X2313",
        role: "Machine Learning Engineer",
        image: "/src/assets/nida.png",
        university: "Universitas Bina Sarana Informatika",
        department: "Sistem Informasi",
        quote: "AI is the new electricity",
        social: {
            linkedin: "https://linkedin.com/in/annida",
            github: "https://github.com/annida",
            instagram: "https://instagram.com/annida"
        }
    },
    {
        name: "Noufal Zaidan",
        id: "MC193D5X2313",
        role: "Machine Learning Engineer",
        image: "/src/assets/noval.png",
        university: "Universitas Bina Sarana Informatika",
        department: "Teknik Informatika",
        quote: "Learning from data, one model at a time",
        social: {
            linkedin: "https://linkedin.com/in/noufal",
            github: "https://github.com/noufal",
            instagram: "https://instagram.com/noufal"
        }
    },
];

const Team = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-[#f3fbe9]">
            <Navbar />
            <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
                {/* Team Header */}
                <div className="flex flex-col items-center justify-center mb-8 md:mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, type: "spring", bounce: 0.3 }}
                        className="rounded-full bg-[#4d9300] shadow-2xl px-4 py-4 md:px-16 md:py-8 flex flex-col items-center"
                        style={{ boxShadow: '0 12px 20px 0 rgba(0,0,0,0.30)' }}
                    >
                        <span className="text-white text-lg md:text-3xl font-bold text-center leading-tight">
                            Profil Anggota Team<br />
                            <span className="text-white text-base md:text-xl font-semibold">Group ID : CC25-CF191</span>
                        </span>
                    </motion.div>
                </div>

                {/* Frontend & Backend Team */}
                <div className="mb-12 md:mb-16">
                    <div className="relative flex flex-col items-center">
                        <div className="w-full bg-white rounded-xl shadow-2xl pt-0 pb-4 px-4 md:px-8 mt-4">
                            <div className="flex justify-center mb-6 mt-14">
                                <div className="bg-[#eafbe2] px-6 md:px-8 py-2 rounded-full border border-[#b7e2a6] shadow text-center">
                                    <h2 className="text-2xl md:text-3xl font-bold text-[#478800]">Team Front-End dan Back-End Developer</h2>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 lg:gap-8">
                                {teamMembers.map((member, index) => (
                                    <ThreeDCardDemo key={index} member={member} index={index} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ML Team */}
                <div className="mb-8 md:mb-12">
                    <div className="relative flex flex-col items-center">
                        <div className="w-full bg-white rounded-xl shadow-2xl pt-0 pb-4 px-4 md:px-8 mt-4">
                            <div className="flex justify-center mb-6 mt-14">
                                <div className="bg-[#eafbe2] px-6 md:px-8 py-2 rounded-full border border-[#b7e2a6] shadow text-center">
                                    <h2 className="text-2xl md:text-3xl font-bold text-[#478800]">Team Machine Learning Engineer</h2>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 lg:gap-8">
                                {mlEngineers.map((engineer, index) => (
                                    <ThreeDCardDemo key={index} member={engineer} index={index} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Team;

export function ThreeDCardDemo({ member, index }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: index * 0.15, type: "spring", bounce: 0.3 }}
        >
            <CardContainer className="inter-var">
                <motion.div
                    whileHover={{ scale: 1.04, boxShadow: "0 8px 32px 0 rgba(72,136,0,0.15)" }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <CardBody className="bg-gradient-to-br from-white/60 to-[#eafbe2]/60 backdrop-blur-md border border-white/60 relative group/card w-full h-full rounded-2xl p-4 pb-2 md:p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
                        {/* Profile Image */}
                        <CardItem translateZ="100" className="w-full">
                            <div className="relative aspect-square w-full overflow-hidden rounded-xl shadow-md">
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-full h-full object-cover pointer-events-none"
                                    style={{ transform: 'none' }}
                                />
                            </div>
                        </CardItem>

                        {/* Content */}
                        <div className="mt-6 space-y-4">
                            {/* Card Nama & ID */}
                            <div className="bg-white/80 rounded-xl p-4 shadow-inner mb-2">
                                <CardItem translateZ="50" className="text-2xl font-bold text-[#478800] mb-1">
                                    {member.name}
                                </CardItem>
                                <CardItem as="p" translateZ="60" className="text-sm text-gray-500">
                                    ID: {member.id}
                                </CardItem>
                            </div>
                            {/* Card Role */}
                            <div className="mb-2 ml-2">
                                <CardItem translateZ="70" className="px-5 py-2 bg-gradient-to-r from-[#478800] to-[#2d5a00] text-white rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-shadow duration-300 w-fit">
                                    {member.role}
                                </CardItem>
                            </div>
                            {/* Card Kampus & Jurusan */}
                            <div className="bg-white/80 rounded-xl p-4 shadow-inner mb-2">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-[#478800]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                        <p className="text-sm font-medium text-gray-700">{member.university}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-[#478800]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                        <p className="text-sm text-gray-600">{member.department}</p>
                                    </div>
                                </div>
                            </div>
                            {/* Quote */}
                            <CardItem as="p" translateZ="80" className="text-sm italic text-gray-700 text-center bg-white/40 rounded-lg p-3 shadow-inner">
                                "{member.quote}"
                            </CardItem>
                        </div>

                        {/* Social Links */}
                        <div className="flex justify-center items-center gap-4 mt-2 pt-2 md:mt-6 md:pt-4 border-t border-white/30">
                            <motion.a
                                href={member.social.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.2, rotate: -10 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className="text-blue-600 hover:text-blue-800 transition-all duration-300 p-2 hover:bg-blue-50 rounded-full"
                            >
                                <Linkedin className="w-5 h-5" />
                            </motion.a>
                            <motion.a
                                href={member.social.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.2, rotate: 10 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className="text-gray-800 hover:text-gray-600 transition-all duration-300 p-2 hover:bg-gray-50 rounded-full"
                            >
                                <Github className="w-5 h-5" />
                            </motion.a>
                            <motion.a
                                href={member.social.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.2, rotate: 8 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className="text-pink-600 hover:text-pink-800 transition-all duration-300 p-2 hover:bg-pink-50 rounded-full"
                            >
                                <Instagram className="w-5 h-5" />
                            </motion.a>
                        </div>
                    </CardBody>
                </motion.div>
            </CardContainer>
        </motion.div>
    );
}