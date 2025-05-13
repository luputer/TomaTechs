import React from "react";
import Navbar from "../components/navbar";
import { CardBody, CardContainer, CardItem } from "../components/ui/3d-card";

const teamMembers = [
    {
        name: "Muhammad Saidi",
        id: "FC524D5Y1916",
        role: "Frontend Developer",
        image: "/src/assets/saidi.webp",
        university: "Universitas Lambung Mangkurat",
        department: "Ilmu Komputer",
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
        role: "Backend Developer",
        image: "/src/assets/agus2.jpeg",
        university: "Universitas Lambung Mangkurat",
        department: "Ilmu Komputer",
        quote: "Building bridges between data and users",
        social: {
            linkedin: "https://linkedin.com/in/yuliagus",
            github: "https://github.com/yuliagus",
            instagram: "https://instagram.com/yuliagus"
        }
    },
    {
        name: "Ulfiani Latifah",
        id: "FC312D5X1540",
        role: "UI/UX Designer",
        image: "/src/assets/ulfi.jpg",
        university: "Universitas Lambung Mangkurat",
        department: "Ilmu Komputer",
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
        university: "Universitas Lambung Mangkurat",
        department: "Ilmu Komputer",
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
        university: "Universitas Lambung Mangkurat",
        department: "Ilmu Komputer",
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
        university: "Universitas Lambung Mangkurat",
        department: "Ilmu Komputer",
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
        <div className="bg-gradient-to-b from-white to-[#f3fbe9]">
            <Navbar />
            <div className="container mx-auto px-4 py-12 mb-16">
                {/* Team Header */}
                <div className="flex items-center justify-center mb-16">
                    <div className="bg-[#478800] text-white rounded-full px-6 py-4 shadow-lg text-center">
                        <h1 className="text-lg font-bold">Profil Anggota Team</h1>
                        <p className="text-sm">Group ID : CC25-CF191</p>
                    </div>
                </div>

                {/* Frontend & Backend Team */}
                <div className="mb-16">
                    <h2 className="text-2xl text-center font-semibold text-[#478800] mb-10">
                        Team Front-End dan Back-End Developer
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {teamMembers.map((member, index) => (
                            <ThreeDCardDemo key={index} member={member} />
                        ))}
                    </div>
                </div>

                {/* ML Team */}
                <div className="mb-16">
                    <h2 className="text-2xl text-center font-semibold text-[#478800] mb-10">
                        Team Machine Learning Engineer
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {mlEngineers.map((engineer, index) => (
                            <ThreeDCardDemo key={index} member={engineer} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Team;

export function ThreeDCardDemo({ member }) {
    return (
        <CardContainer className="inter-var">
            <CardBody className="bg-[#F6C8DD] relative group/card border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border">
                <CardItem translateZ="50" className="text-xl font-bold text-neutral-600">
                    {member.name}
                </CardItem>
                <CardItem as="p" translateZ="60" className="text-neutral-500 text-sm max-w-sm mt-2">
                    ID: {member.id}
                </CardItem>
                <CardItem translateZ="100" rotateX={20} rotateZ={-10} className="w-full mt-4">
                    <img src={member.image} alt={member.name} className="h-40 w-80 object-cover rounded-xl group-hover/card:shadow-xl" />
                </CardItem>
                <div className="flex justify-center items-center mt-5">
                    <span className="px-6 py-2 bg-[#478800] text-white rounded-full inline-block">{member.role}</span>
                </div>
            </CardBody>
        </CardContainer>
    );
}