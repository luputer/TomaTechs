import React from 'react';

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
        <div className="bg-gradient-to-b from-white to-[#f3fbe9]">
            <div className="container mx-auto px-4 py-12">
            <div className="bg-gradient-to-b from-white to-[#f3fbe9] flex items-center justify-center">
            <div className="bg-[#478800] text-white rounded-full px-6 py-4 shadow-lg text-center">
                <h1 className="text-lg font-bold">Profil Anggota Team</h1>
                <p className="text-sm">Group ID : CC25-CF191</p>
            </div>
        </div>

                <div className="mb-12">
                    <h2 className="text-xl text-center my-10 font-semibold text-[#478800] mb-6">Team Front-End dan Back-End Developer</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {teamMembers.map((member, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden text-center p-4">
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-24 h-24 mx-auto rounded-full object-cover mb-4"
                                />
                                <h3 className="text-lg font-semibold text-[#478800]">{member.name}</h3>
                                <p className="text-gray-700">{member.id}</p>
                                <button className="mt-4 px-4 py-2 bg-[#478800] text-white rounded-full">
                                    {member.role}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h2 className="text-xl text-center my-10 font-semibold text-[#478800] mb-6">Team Machine Learning Engineer</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {mlEngineers.map((engineer, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden text-center p-4">
                                <img
                                    src={engineer.image}
                                    alt={engineer.name}
                                    className="w-24 h-24 mx-auto rounded-full object-cover mb-4"
                                />
                                <h3 className="text-lg font-semibold text-[#478800]">{engineer.name}</h3>
                                <p className="text-gray-700">{engineer.id}</p>
                                <button className="mt-4 px-4 py-2 bg-[#478800] text-white rounded-full">
                                    {engineer.role}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Team;