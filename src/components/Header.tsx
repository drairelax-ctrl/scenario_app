import { Youtube, Sparkles, HelpCircle } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-red-600 to-rose-500 text-white p-2.5 rounded-xl shadow-md flex items-center justify-center">
            <Youtube className="w-5 h-5 flex-shrink-0" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 tracking-tight flex flex-wrap items-center gap-1.5 leading-none">
              유튜브 대본 생성기
              <a 
                href="https://www.threads.com/@tpp_studi.o" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-xs text-slate-500 hover:text-red-600 hover:underline transition-colors font-medium"
              >
                by @tpp_studi.o
              </a>
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-50 text-red-600 border border-red-100">
                AI MVP
              </span>
            </h1>
            <p className="text-[11px] text-gray-500 mt-0.5 font-sans font-medium">Shorts & Longform Script Studio</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 text-gray-600 text-xs font-medium border border-gray-100 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            Gemini 3.5 Flash Powered
          </div>
        </div>
      </div>
    </header>
  );
}
