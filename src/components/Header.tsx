import { Zap } from "lucide-react";

const Header = () => {
  return (
    <header className="text-center">
      <div className="inline-flex items-center gap-4 mb-8">
        <div className="relative">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-violet-500 rounded-xl flex items-center justify-center shadow-lg">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 to-violet-500 rounded-xl blur opacity-30"></div>
        </div>
        <h1 className="text-5xl lg:text-6xl font-bold gradient-text">
          HYPin Compress
        </h1>
      </div>

      <p className="text-lg lg:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
        Advanced AI-powered compression for images, PDFs, and videos with
        <span className="text-blue-400 font-medium">
          {" "}
          intelligent optimization
        </span>{" "}
        and
        <span className="text-violet-400 font-medium"> modern technology</span>
      </p>

      <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
          <span>Images: JPG, PNG, WebP, HEIC</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-violet-400 rounded-full"></div>
          <span>PDFs: All formats</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
          <span>Videos: MP4, WebM, AVI, MOV</span>
        </div>
      </div>

      <div className="section-divider mt-12"></div>
    </header>
  );
};

export default Header;
