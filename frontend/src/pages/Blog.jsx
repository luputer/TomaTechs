import { useRef, useState } from 'react';
import CardArtikelTomat from './CardArtikelTomat';

const articles = [
  {
    id: 1,
    title: "Tomato Mosaic Virus (ToMV)",
    titleId: "Virus Mosaik Tomat",
    image: "https://blogs.ifas.ufl.edu/stlucieco/files/2023/03/1-29-1024x768.png",
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
    titleId: "Bercak Bakteri",
    image: "https://bugwoodcloud.org/images/768x512/5465779.jpg",
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
    titleId: "Hawar Daun Dini",
    image: "https://bugwoodcloud.org/images/1536x1024/1573854.jpg",
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
    titleId: "Hawar Daun Akhir",
    image: "https://cropaia.com/wp-content/uploads/Potato-blight-phytophthora-infestans.jpg",
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
    titleId: "Bercak Septoria",
    image: "https://bugwoodcloud.org/images/1536x1024/5553629.jpg",
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
    titleId: "Layu Fusarium",
    image: "https://bugwoodcloud.org/images/1536x1024/1436102.jpg",
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
    titleId: "Layu Verticillium",
    image: "https://www.sunflowernsa.com/uploads/119/Fig4SAM_2298.jpg",
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
    titleId: "Antraknosa",
    image: "https://bugwoodcloud.org/images/1536x1024/1577298.jpg",
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
    titleId: "Virus Keriting Kuning Tomat",
    image: "https://th.bing.com/th/id/OIP.o4CH6AlBLfLo_pqFBsyrFwHaG4?rs=1&pid=ImgDetMain",
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
    titleId: "Embun Tepung",
    image: "https://www.idainature.com/wp-content/uploads/2022/07/Oidio-hoja-3-1024x679.jpg",
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
    titleId: "Tungau Laba-laba",
    image: "https://as2.ftcdn.net/v2/jpg/05/24/53/55/1000_F_524535513_cffGvIPFlu0rba55kdRwWOgBFjs1KziK.jpg",
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
    titleId: "Nematoda Puru Akar",
    image: "https://th.bing.com/th/id/OIP.-XIwsCdaBACMgHaKCHhMHAHaE8?rs=1&pid=ImgDetMain",
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

// Data artikel tentang tomat (dummy)
const artikelTomatLain = [
  {
    id: 1,
    title: "11 Manfaat Tomat bagi Kesehatan Tubuh",
    image: "https://res.cloudinary.com/dk0z4ums3/image/upload/v1629681326/attached_image/9-manfaat-tomat-buah-yang-disangka-sayur-0-alodokter.jpg",
    deskripsi: "Penasaran dengan semua kebaikan yang bisa Anda dapatkan dari sebiji tomat? Temukan 11 manfaat kesehatan tomat yang luar biasa, dari menjaga mata tetap sehat hingga melindungi jantung Anda!",
    url: "https://www.alodokter.com/11-manfaat-tomat-bagi-kesehatan-tubuh"
  },
  {
    id: 2,
    title: "10 Manfaat Tomat bagi Kesehatan Tubuh, Baik untuk Mata hingga Cegah Kanker",
    image: "https://i0.wp.com/ciputrahospital.com/wp-content/uploads/2023/12/shutterstock_2016295385-1.jpg?w=1000&ssl=1",
    deskripsi: "Jangan remehkan kekuatan tomat! Artikel ini mengupas 10 manfaat kesehatan tomat yang penting, termasuk kemampuannya dalam mencegah penyakit serius seperti kanker dan menjaga penglihatan tetap tajam.",
    url: "https://ciputrahospital.com/manfaat-tomat-bagi-kesehatan/"
  },
  {
    id: 3,
    title: "6 Resep Serba Tomat Lezat yang Ampuh Turunkan Kolesterol Tinggi",
    image: "https://cdn0-production-images-kly.akamaized.net/Cl3Phm_07e5kRfm20m7KvA7-k-4=/680x383/smart/filters:quality(75):strip_icc():format(webp)/kly-media-production/medias/3031099/original/010927500_1579839938-shutterstock_1175408092.jpg",
    deskripsi: "Ingin cara lezat dan sehat untuk menjaga kadar kolesterol Anda? Coba 6 resep serba tomat ini yang tidak hanya nikmat di lidah tapi juga baik untuk kesehatan jantung Anda!",
    url: "https://www.fimela.com/food/read/5426966/6-resep-serba-tomat-lezat-yang-ampuh-turunkan-kolesterol-tinggi"
  },
  {
    id: 4,
    title: "5 Resep Serba Tomat yang Enak Dijadikan Lauk Makan",
    image: "https://cdn1-production-images-kly.akamaized.net/yBcWQRXyaUfzH1gjpMlp0sH8Hqo=/1x89:1000x652/680x383/filters:quality(75):strip_icc():format(webp)/kly-media-production/medias/3127609/original/059618500_1589427681-shutterstock_311320658.jpg",
    deskripsi: "Bosan dengan lauk yang biasa-biasa saja? Saatnya berkreasi dengan tomat! Temukan 5 resep olahan tomat yang praktis dan lezat untuk menemani santap nasi Anda sehari-hari.",
    url: "https://www.fimela.com/food/read/4706434/5-resep-serba-tomat-yang-enak-dijadikan-lauk-makan"
  },
  {
    id: 5,
    title: "6 Resep Olahan Tomat Mentah dan Matang Enak, Gampang Banget!",
    image: "https://www.rukita.co/stories/wp-content/uploads/2022/06/resep-olahan-tomat.jpg",
    deskripsi: "Dari kesegaran tomat mentah hingga kelezatan tomat matang, artikel ini menyajikan 6 resep olahan tomat yang mudah diikuti dan pastinya akan menggugah selera Anda!",
    url: "https://www.rukita.co/stories/resep-olahan-tomat/"
  },
  {
    id: 6,
    title: "5 Keuntungan Menanam Tomat Hidroponik, Bisa Membuat Rumah Lebih Indah",
    image: "https://asset.kompas.com/crops/nYL3BDUyxo4qA-GWcNUpn07DK0E=/101x66:899x599/1200x800/data/photo/2022/09/25/63302c8a86c4f.jpg",
    deskripsi: "Tertarik menanam tomat di rumah tapi lahan terbatas? Pelajari 5 keuntungan menanam tomat secara hidroponik yang tidak hanya menghasilkan panen tapi juga mempercantik lingkungan rumah Anda!",
    url: "https://agri.kompas.com/read/2022/12/19/144622884/5-keuntungan-menanam-tomat-hidroponik-bisa-membuat-rumah-lebih-indah"
  },
  {
    id: 7,
    title: "Cerita Debt Collector Banting Setir Tanam Tomat, Raup Jutaan Rupiah",
    image: "https://akcdn.detik.net.id/community/media/visual/2024/02/25/petani-tomat_169.jpeg?w=700&q=90",
    deskripsi: "Kisah inspiratif tentang perubahan hidup! Ikuti perjalanan seorang mantan debt collector di Kupang yang sukses menjadi petani tomat dan berhasil meraih penghasilan hingga jutaan rupiah.",
    url: "https://www.detik.com/bali/bisnis/d-7211577/cerita-debt-collector-banting-setir-tanam-tomat-raup-jutaan-rupiah"
  },
  {
    id: 8,
    title: "Kesuksesan Petani Tomat di Tengah Kondisi Ekstrem Tanah Biak",
    image: "https://www.binatani.or.id/wp-content/uploads/2024/12/June-7-Tomat-Cabai-Biak-770x481-1.png",
    deskripsi: "Di tengah segala keterbatasan, semangat dan inovasi petani tomat di Biak patut diacungi jempol. Simak bagaimana mereka berhasil menaklukkan tantangan dan meraih keberhasilan dalam bertani tomat.",
    url: "https://www.binatani.or.id/id/kesuksesan-petani-tomat-di-tengah-kondisi-ekstrem-tanah-biak/"
  },
  {
    id: 9,
    title: "Cara Budidaya Tomat Yang Baik Dan Benar",
    image: "https://petanibertani.com/wp-content/uploads/2024/06/cara-menanam-tomat.jpg",
    deskripsi: "Bagi Anda yang tertarik atau baru ingin memulai budidaya tomat, artikel ini menyediakan informasi dasar yang penting, mulai dari syarat tumbuh hingga teknik panen yang benar.",
    url: "https://petanibertani.com/cara-budidaya-tomat-yang-baik-dan-benar/"
  },
  {
    id: 10,
    title: "ANALISIS PENDAPATAN PETANI TOMAT PADA LAHAN SAWAH DI DESA TOSURAYA SELATAN",
    image: "https://th.bing.com/th/id/OIP.mSWK175WSmqpCPd9K4KrjAHaED?rs=1&pid=ImgDetMain",
    deskripsi: "Ingin tahu lebih dalam tentang aspek ekonomi budidaya tomat? Artikel ilmiah ini menganalisis secara rinci pendapatan petani tomat di lahan sawah wilayah Minahasa Tenggara.",
    url: "https://ejournal.unsrat.ac.id/index.php/jisep/article/view/7242"
  },
  {
    id: 11,
    title: "ANALISIS PENDAPATAN USAHATANI TANAMAN TOMAT (Lycopersiyum Exsculentum Mill)",
    image: "https://i.ytimg.com/vi/bcjJ9e5ebjM/maxresdefault.jpg",
    deskripsi: "Artikel akademis ini mengkaji secara mendalam tentang analisis pendapatan dan tingkat keuntungan yang diperoleh dari usahatani tanaman tomat. Cocok bagi Anda yang tertarik pada aspek bisnis pertanian.",
    url: "https://adoc.pub/analisis-usahatani-tomat-lycopersicon-esculentum-mill-di-des.html"
  },
  {
    id: 12,
    title: "Kamu Wajib Tau, Inilah 30 Manfaat Tomat Buah yang Bikin Penasaran",
    image: "https://pancaranpendidikan.or.id/cdn/manfaat-buah/manfaat-tomat-buah.webp",
    deskripsi: "Meskipun sering dianggap sayur, tomat adalah buah dengan segudang manfaat. Temukan kandungan nutrisi penting dan berbagai khasiat kesehatan yang menjadikan tomat sebagai pilihan cerdas untuk menu harian Anda.",
    url: "https://pancaranpendidikan.or.id/kamu-wajib-tau-inilah-30-manfaat-tomat-buah-yang-bikin-penasaran/"
  }
];

const Blog = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const cardRefs = useRef([]);
  const [selectedArticle, setSelectedArticle] = useState(null);

  // Tambahkan state dan variabel pagination untuk artikel tomat
  const ARTICLES_PER_PAGE = 3;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(artikelTomatLain.length / ARTICLES_PER_PAGE);
  const paginatedArticles = artikelTomatLain.slice(
    (currentPage - 1) * ARTICLES_PER_PAGE,
    currentPage * ARTICLES_PER_PAGE
  );

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
          <div className="flex overflow-x-auto gap-4 md:gap-6 pb-4 scrollbar-thin scrollbar-thumb-[#b7e2a6] scrollbar-track-[#f3fbe9]">
            {articles.map((article, idx) => (
              <div
                key={article.id}
                ref={el => cardRefs.current[idx] = el}
                className="min-w-[calc(50%-8px)] md:min-w-[370px] max-w-md bg-white rounded-xl shadow-md border border-[#d2e7c6] flex flex-col items-center p-4 md:p-8 transition-transform duration-300 transform hover:scale-105 hover:shadow-2xl cursor-pointer"
              >
                <div className="w-full aspect-[5/3] mb-3 md:mb-4 overflow-hidden rounded-lg border-2 border-[#d2e7c6]">
                  <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-semibold text-sm md:text-lg text-[#222] text-center mb-1 line-clamp-2">{article.title}</h3>
                <p className="text-[#478800] text-xs md:text-sm text-center mb-2 line-clamp-1">{article.titleId}</p>
                <p className="text-gray-700 text-xs md:text-sm text-center mb-3 md:mb-4 line-clamp-2">{article.deskripsi}</p>
                <button onClick={() => { setActiveIndex(idx); setSelectedArticle(true); }} className="bg-[#3bb54a] hover:bg-[#2e7d32] text-white px-4 py-1.5 rounded-full text-xs md:text-sm font-semibold transition mb-2">Read More</button>
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
        {/* Section Daftar Artikel Tentang Tomat dengan pagination */}
        <div className="bg-white/30 backdrop-blur-sm border-2 border-white shadow-lg rounded-xl p-4 md:p-8 mb-8 relative">
          <h2 className="text-3xl md:text-4xl font-bold text-[#478800] text-center mb-8 mt-8">Daftar Artikel Tentang Tomat</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-4">
            {paginatedArticles.map((artikel) => (
              <CardArtikelTomat
                key={artikel.id}
                image={artikel.image}
                title={artikel.title}
                deskripsi={artikel.deskripsi}
                onReadMore={() => window.open(artikel.url, "_blank")}
              />
            ))}
          </div>
          {/* Pagination */}
          <div className="flex flex-col items-center mt-4">
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="text-[#478800] text-2xl px-2 disabled:opacity-50"
              >
                &lt;
              </button>
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`w-8 h-8 border-2 rounded-md text-[#478800] font-bold ${
                    currentPage === idx + 1
                      ? 'bg-[#478800] text-white'
                      : 'bg-transparent'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="text-[#478800] text-2xl px-2 disabled:opacity-50"
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;