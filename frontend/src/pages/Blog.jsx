import { useRef, useState } from 'react';

const articles = [
  {
    id: 1,
    title: "Tomato Mosaic Virus (ToMV)",
    image: "/src/assets/tomat.png",
    deskripsi: "Virus mosaik tomat menyebabkan daun bercak kuning-hijau dan pertumbuhan tanaman terhambat.....",
    penyebab: [
      "Virus Tomato Mosaic Virus, ditularkan melalui benih, tangan manusia, alat pertanian, dan tanaman inang lain.",
      "Bisa bertahan lama di tanah dan sisa tanaman."
    ],
    gejala: [
      "Daun menguning dengan pola mosaik (bintik kuning dan hijau).",
      "Pertumbuhan terhambat, buah kecil dan tidak normal."
    ],
    penanganan: [
      "Gunakan benih bebas virus (bersertifikat).",
      "Disinfeksi alat dan tangan sebelum menyentuh tanaman.",
      "Singkirkan dan bakar tanaman yang terinfeksi.",
      "Hindari merokok saat menangani tanaman (virus bisa terbawa dari tembakau).",
      "Rotasi tanaman dengan non-inang."
    ]
  },
  {
    id: 2,
    title: "Bacterial Spot (Xanthomonas spp.)",
    image: "/src/assets/tomat.png",
    deskripsi: "Bercak bakteri menyebabkan bercak hitam pada daun dan buah, menurunkan kualitas panen......",
    penyebab: [
      "Bakteri Xanthomonas campestris pv. vesicatoria, menyebar melalui benih, air, alat, dan pekerja.",
      "Bertahan di sisa tanaman dan tanah."
    ],
    gejala: [
      "Bercak kecil coklat kehitaman pada daun dan buah.",
      "Daun menguning dan rontok."
    ],
    penanganan: [
      "Gunakan benih bebas patogen.",
      "Semprot bakterisida berbahan dasar tembaga.",
      "Hindari penyiraman dari atas.",
      "Rotasi tanaman minimal 2 tahun.",
      "Bakar sisa tanaman setelah panen."
    ]
  },
  {
    id: 3,
    title: "Early Blight (Alternaria solani)",
    image: "/src/assets/tomat.png",
    deskripsi: "Penyakit jamur yang menyebabkan bercak konsentris pada daun tua dan menurunkan hasil panen......",
    penyebab: [
      "Jamur Alternaria solani, menyebar melalui cipratan air dan sisa tanaman."
    ],
    gejala: [
      "Bercak coklat tua dengan lingkaran konsentris pada daun tua.",
      "Daun menguning dan gugur."
    ],
    penanganan: [
      "Buang daun dan sisa tanaman terinfeksi.",
      "Rotasi tanaman 2–3 tahun.",
      "Mulsa tanah untuk cegah cipratan.",
      "Gunakan fungisida (chlorothalonil, mancozeb, copper).",
      "Pilih varietas tahan."
    ]
  },
  {
    id: 4,
    title: "Late Blight (Phytophthora infestans)",
    image: "/src/assets/tomat.png",
    deskripsi: "Penyakit busuk daun dan buah yang sangat merusak, terutama saat musim hujan......",
    penyebab: [
      "Jamur air Phytophthora infestans, menyebar lewat angin dan air."
    ],
    gejala: [
      "Bercak coklat kehitaman pada daun, batang, dan buah.",
      "Daun cepat layu dan membusuk."
    ],
    penanganan: [
      "Buang tanaman terinfeksi.",
      "Gunakan fungisida sistemik.",
      "Rotasi tanaman.",
      "Hindari kelembapan berlebih."
    ]
  },
  {
    id: 5,
    title: "Septoria Leaf Spot (Septoria lycopersici)",
    image: "/src/assets/tomat.png",
    deskripsi: "Jamur ini menyebabkan bercak kecil bulat pada daun bawah, membuat daun cepat rontok......",
    penyebab: [
      "Jamur Septoria lycopersici, menyukai lingkungan lembap."
    ],
    gejala: [
      "Bercak kecil bulat, coklat keabu-abuan dengan tepi gelap di daun bawah.",
      "Daun menguning dan rontok."
    ],
    penanganan: [
      "Buang daun dan sisa tanaman terinfeksi.",
      "Hindari membasahi daun saat menyiram.",
      "Rotasi tanaman.",
      "Gunakan fungisida (chlorothalonil, copper, mancozeb).",
      "Jaga jarak antar tanaman."
    ]
  },
  {
    id: 6,
    title: "Fusarium Wilt (Fusarium oxysporum)",
    image: "/src/assets/tomat.png",
    deskripsi: "Penyakit layu yang menyerang pembuluh tanaman, membuat daun menguning dan layu......",
    penyebab: [
      "Jamur Fusarium oxysporum f.sp. lycopersici di tanah."
    ],
    gejala: [
      "Daun menguning, layu satu sisi, akhirnya seluruh tanaman layu.",
      "Pembuluh batang kecoklatan."
    ],
    penanganan: [
      "Gunakan varietas tahan.",
      "Solarize tanah sebelum tanam.",
      "Rotasi tanaman.",
      "Buang tanaman terinfeksi."
    ]
  },
  {
    id: 7,
    title: "Verticillium Wilt (Verticillium spp.)",
    image: "/src/assets/tomat.png",
    deskripsi: "Jamur tanah yang menyebabkan daun menguning dan tanaman layu bertahap......",
    penyebab: [
      "Jamur Verticillium dahliae/Verticillium albo-atrum di tanah."
    ],
    gejala: [
      "Daun menguning, layu bertahap dari bawah ke atas.",
      "Pembuluh batang kecoklatan."
    ],
    penanganan: [
      "Gunakan varietas tahan.",
      "Rotasi tanaman.",
      "Solarize tanah.",
      "Buang tanaman terinfeksi."
    ]
  },
  {
    id: 8,
    title: "Anthracnose (Colletotrichum spp.)",
    image: "/src/assets/tomat.png",
    deskripsi: "Jamur ini menyerang buah matang, menimbulkan bercak cekung kehitaman......",
    penyebab: [
      "Jamur Colletotrichum, menyerang buah matang."
    ],
    gejala: [
      "Bercak bulat cekung pada buah matang, pusatnya kehitaman."
    ],
    penanganan: [
      "Panen buah segera setelah matang.",
      "Buang buah terinfeksi.",
      "Gunakan fungisida.",
      "Rotasi tanaman."
    ]
  },
  {
    id: 9,
    title: "Tomato Yellow Leaf Curl Virus (TYLCV)",
    image: "/src/assets/tomat.png",
    deskripsi: "Virus yang menyebabkan daun menggulung, tanaman kerdil, dan hasil buah menurun...... ",
    penyebab: [
      "Virus TYLCV, ditularkan oleh kutu kebul (Bemisia tabaci)."
    ],
    gejala: [
      "Daun menggulung ke atas, menguning, tanaman kerdil.",
      "Pertumbuhan terhambat, buah sedikit."
    ],
    penanganan: [
      "Gunakan benih tahan virus.",
      "Kendalikan kutu kebul.",
      "Gunakan mulsa plastik perak.",
      "Cabut dan musnahkan tanaman terinfeksi."
    ]
  },
  {
    id: 10,
    title: "Powdery Mildew (Oidium neolycopersici)",
    image: "/src/assets/tomat.png",
    deskripsi: "Jamur tepung ini menutupi daun dengan lapisan putih dan menyebabkan daun rontok......",
    penyebab: [
      "Jamur Oidium neolycopersici, menyukai cuaca kering."
    ],
    gejala: [
      "Lapisan putih seperti tepung di permukaan daun.",
      "Daun menguning dan rontok."
    ],
    penanganan: [
      "Gunakan fungisida sulfur atau kalium bikarbonat.",
      "Buang daun terinfeksi.",
      "Tingkatkan sirkulasi udara."
    ]
  },
  {
    id: 11,
    title: "Spider Mites (Tetranychus urticae)",
    image: "/src/assets/tomat.png",
    deskripsi: "Hama tungau menyebabkan bercak kuning dan jaring halus di bawah daun......",
    penyebab: [
      "Tungau laba-laba, berkembang di cuaca panas dan kering."
    ],
    gejala: [
      "Bercak kuning kecil (stippling) di daun.",
      "Jaring halus di bawah daun."
    ],
    penanganan: [
      "Semprot air tekanan tinggi ke daun.",
      "Gunakan musuh alami (Phytoseiulus persimilis).",
      "Gunakan mitisida (abamectin, spinosad, neem oil).",
      "Jaga kelembapan."
    ]
  },
  {
    id: 12,
    title: "Root-Knot Nematode (Meloidogyne spp.)",
    image: "/src/assets/tomat.png",
    deskripsi: "Nematoda akar menyebabkan akar membengkak dan tanaman tumbuh kerdil......",
    penyebab: [
      "Nematoda Meloidogyne, hidup di tanah."
    ],
    gejala: [
      "Akar membengkak (gall), tanaman kerdil, daun menguning."
    ],
    penanganan: [
      "Gunakan varietas tahan nematoda.",
      "Solarize tanah.",
      "Rotasi tanaman dengan non-inang.",
      "Cabut dan musnahkan tanaman terinfeksi."
    ]
  }
];

const Blog = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const cardRefs = useRef([]);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const handleScrollToCard = (idx) => {
    setActiveIndex(idx);
    cardRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  };

  return (
    <div className="mt-2 bg-gradient-to-b from-white to-[#f3fbe9] min-h-screen">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="bg-white/30 backdrop-blur-sm border-2 border-white shadow-lg rounded-xl p-4 md:p-8 mb-8 relative">
          <div className="absolute -top-4 md:-top-5 left-4 md:left-8 bg-[#eafbe2] px-4 md:px-6 py-1.5 md:py-2 rounded-full border border-[#b7e2a6] shadow-md text-[#478800] font-bold text-lg md:text-xl flex items-center gap-2 mb-4">
            <span className="text-[#478800]">Blog & Artikel</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#478800] text-center mb-8 mt-8 md:mt-12">Daftar Penyakit Tomat</h2>
          {/* Horizontal scrollable cards */}
          <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-thin scrollbar-thumb-[#b7e2a6] scrollbar-track-[#f3fbe9]">
            {articles.map((article, idx) => (
              <div
                key={article.id}
                ref={el => cardRefs.current[idx] = el}
                className="min-w-[370px] max-w-md bg-white rounded-xl shadow-md border border-[#d2e7c6] flex flex-col items-center p-8 transition-transform duration-300 transform hover:scale-105 hover:shadow-2xl cursor-pointer"
              >
                <img src={article.image} alt={article.title} className="w-full h-36 md:h-32 object-cover rounded-lg mb-4 max-w-full" />
                <h3 className="font-semibold text-lg text-[#222] text-center mb-2">{article.title}</h3>
                <p className="text-gray-700 text-sm text-center mb-4">{article.deskripsi}</p>
                <button onClick={() => { setActiveIndex(idx); setSelectedArticle(true); }} className="bg-[#3bb54a] hover:bg-[#2e7d32] text-white px-5 py-2 rounded-full text-sm font-semibold transition mb-2">Read More</button>
              </div>
            ))}
          </div>
          {/* Modal for Article Detail */}
          {selectedArticle !== null && activeIndex !== null && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="bg-white rounded-2xl shadow-2xl border border-[#b7e2a6] max-w-3xl w-full p-6 md:p-10 relative animate-fadeIn">
                <button
                  className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-2xl font-bold"
                  onClick={() => { setActiveIndex(null); setSelectedArticle(null); }}
                  aria-label="Close"
                >
                  &times;
                </button>
                <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                  <img
                    src={articles[activeIndex].image}
                    alt={articles[activeIndex].title}
                    className="w-48 h-48 object-cover rounded-xl border-4 border-[#478800] mb-4 md:mb-0"
                  />
                  <div className="flex-1">
                    <h3 className="text-2xl md:text-3xl font-bold text-[#478800] mb-2">{articles[activeIndex].title}</h3>
                    <div className="text-gray-800 text-base md:text-lg">
                      <div className="mb-2">
                        <b>Penyebab:</b>
                        <ul className="list-disc ml-5">
                          {articles[activeIndex].penyebab.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="mb-2">
                        <b>Gejala:</b>
                        <ul className="list-disc ml-5">
                          {articles[activeIndex].gejala.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <b>Penanganan:</b>
                        <ul className="list-disc ml-5">
                          {articles[activeIndex].penanganan.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Blog;