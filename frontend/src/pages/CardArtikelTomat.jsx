const CardArtikelTomat = ({ image, title, deskripsi, onReadMore }) => {
  return (
    <div className="w-full bg-white rounded-xl shadow-md border border-[#d2e7c6] flex flex-col items-center p-3 sm:p-4 transition-transform duration-300 transform hover:scale-105 hover:shadow-2xl cursor-pointer">
      <div className="w-full aspect-[4/3] mb-2 sm:mb-3">
        <img src={image} alt={title} className="w-full h-full object-cover rounded-lg" />
      </div>
      <h3 className="font-semibold text-sm sm:text-base text-[#222] text-center mb-1 line-clamp-2">{title}</h3>
      <p className="text-gray-700 text-xs text-center mb-2 sm:mb-3 line-clamp-2">{deskripsi}</p>
      <button onClick={onReadMore} className="bg-[#3bb54a] hover:bg-[#2e7d32] text-white px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs font-semibold transition">Read More</button>
    </div>
  );
};

export default CardArtikelTomat;