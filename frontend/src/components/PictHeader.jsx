export default function PictHeader() {
  return (
    <div className="bg-white w-full border-b-4 border-[#2c52ed]">
      <a 
        href="https://pict.edu" 
        target="_blank" 
        rel="noopener noreferrer"
        className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center gap-6 justify-center text-center md:text-left cursor-pointer hover:opacity-90 transition-opacity"
      >
        {/* Logo */}
        <div className="flex-shrink-0">
          <img 
            src="/pict_logo.jpg" 
            alt="PICT Logo" 
            className="w-24 h-24 md:w-32 md:h-32 object-contain hover:scale-105 transition-transform duration-200"
          />
        </div>
        
        {/* Text Details */}
        <div className="flex flex-col items-center justify-center space-y-1">
          <p className="text-[#e23b2c] font-bold text-sm md:text-base tracking-wide">
            Society for Computer Technology and Research's
          </p>
          <h1 className="text-[#1e3aed] font-black text-2xl md:text-4xl uppercase tracking-tight">
            Pune Institute of Computer Technology
          </h1>
          <p className="text-[#e23b2c] font-bold text-sm md:text-base">
            (An Autonomous Institute affiliated to Savitribai Phule Pune University)
          </p>
          <p className="text-[#e23b2c] font-bold text-xs md:text-sm mt-1">
            AICTE APPROVED | ISO 9001:2015 | NAAC A+ Grade | NBA [All Eligible UG Programs]
          </p>
        </div>
      </a>

    </div>
  );
}
