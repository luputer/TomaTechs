import React from 'react';
import Navbar from '../components/navbar';

const Team = () => {
    const teamMembers = [
        {
            name: 'Muhammad Saidi',
            id: 'FC524D5Y1916',
            role: 'JOB',
            image: '/src/assets/saidi.png',
        },
        {
            name: 'Yuliagus',
            id: 'FC558D5Y1116',
            role: 'JOB',
            image: '/src/assets/agus.png',
        },
        {
            name: 'Ulfiani Latifah',
            id: 'FC312D5X1540',
            role: 'UI/UX Designer',
            image: '/src/assets/ulfii.png',
        },
    ];

    const mlEngineers = [
        {
            name: 'Ibrahim Akbar Arsanata',
            id: 'MC283D5Y0062',
            role: 'JOB',
            image: '/src/assets/akbar.png',
        },
        {
            name: 'Annida Syamsa Hawa',
            id: 'MC193D5X2313',
            role: 'JOB',
            image: '/src/assets/nida.webp',
        },
        {
            name: 'Noufal Zaidan',
            id: 'MC193D5X2313',
            role: 'JOB',
            image: '/src/assets/noufal.png',
        },
    ];

    return (
        <div className=" bg-gradient-to-b from-white to-[#f3fbe9]">
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
                            <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden text-center p-6 transform transition-transform duration-300 hover:scale-105">
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-32 h-32 mx-auto rounded-full object-cover mb-6 border-4 border-[#478800]/20"
                                />
                                <h3 className="text-xl font-semibold text-[#478800] mb-2">{member.name}</h3>
                                <p className="text-gray-600 mb-4">{member.id}</p>
                                <span className="px-6 py-2 bg-[#478800] text-white rounded-full inline-block">
                                    {member.role}
                                </span>
                            </div>
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
                            <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden text-center p-6 transform transition-transform duration-300 hover:scale-105">
                                <img
                                    src={engineer.image}
                                    alt={engineer.name}
                                    className="w-32 h-32 mx-auto rounded-full object-cover mb-6 border-4 border-[#478800]/20"
                                />
                                <h3 className="text-xl font-semibold text-[#478800] mb-2">{engineer.name}</h3>
                                <p className="text-gray-600 mb-4">{engineer.id}</p>
                                <span className="px-6 py-2 bg-[#478800] text-white rounded-full inline-block">
                                    {engineer.role}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Team;