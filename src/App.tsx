import React, { useState, useEffect } from "react";
import { 
  Youtube, 
  Sparkles, 
  Copy, 
  Check, 
  RefreshCw, 
  Flame, 
  Zap, 
  FileText, 
  Users, 
  Sliders, 
  Target, 
  HelpCircle, 
  Lightbulb, 
  Smile, 
  TrendingUp, 
  ListChecks, 
  Volume2, 
  Maximize2,
  Clock,
  ArrowRight,
  Bookmark
} from "lucide-react";
import { PRESETS, TONE_SUGGESTIONS, AUDIENCE_SUGGESTIONS, PURPOSE_SUGGESTIONS, Preset } from "./data";
import { YoutubeScript, ScriptRequest } from "./types";

export default function App() {
  // Input states
  const [contentType, setContentType] = useState<'shorts' | 'longform'>('shorts');
  const [topic, setTopic] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [tone, setTone] = useState("");
  const [purpose, setPurpose] = useState("");

  // System states
  const [loading, setLoading] = useState(false);
  const [modifyLoading, setModifyLoading] = useState<string | null>(null);
  const [script, setScript] = useState<YoutubeScript | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Interactive UI states
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<'script' | 'captions' | 'tags'>('script');

  // Load a preset helper
  const applyPreset = (preset: Preset) => {
    setContentType(preset.contentType);
    setTopic(preset.topic);
    setTargetAudience(preset.targetAudience);
    setTone(preset.tone);
    setPurpose(preset.purpose);
    setError(null);
  };

  // Quick helper to simulate copy transition
  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  // Get current word counts & metrics
  const getStats = () => {
    if (!script) return { words: 0, timeSec: 0 };
    const fullText = `${script.opening} ${script.body} ${script.closing} ${script.cta}`;
    const words = fullText.trim().split(/\s+/).filter(Boolean).length;
    // Average Korean speaking rate: ~3-4 syllables per second. Let's estimate on space/character count.
    const charCount = fullText.replace(/\s+/g, '').length;
    const timeSec = Math.round(charCount / 5); // roughly 5 characters per second
    return { words, timeSec, charCount };
  };

  const { words, timeSec, charCount } = getStats();

  // Create a brand new script
  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!topic.trim()) {
      setError("비디오의 영상 주제를 입력해 주세요.");
      return;
    }

    setLoading(true);
    setError(null);
    setScript(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contentType,
          topic,
          targetAudience,
          tone,
          purpose,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "대본을 생성하는 중 예기치 못한 요류가 발생했습니다.");
      }

      setScript(data);
      setActiveTab('script');
    } catch (err: any) {
      console.error(err);
      setError(err.message || "서버 통신 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // Modify currently loaded script
  const handleModify = async (action: 'shorter' | 'stronger' | 'natural' | 'shorts_style' | 'longform_style') => {
    if (!script) return;
    
    setModifyLoading(action);
    setError(null);

    try {
      const response = await fetch("/api/modify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentScript: script,
          action,
          contentType,
          topic: topic || "유튜브 테스크"
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "대본 교정 작업이 응답에 실패했습니다.");
      }

      setScript(data);
    } catch (err: any) {
      console.error(err);
      setError(`대본 교정 중 에러가 발생했습니다: ${err.message}`);
    } finally {
      setModifyLoading(null);
    }
  };

  // Assemble full text copy for convenience
  const getFullScriptPlainText = () => {
    if (!script) return "";
    return `[추천 제목 후보]\n${script.titles.map((t, idx) => `${idx + 1}. ${t}`).join("\n")}\n\n` +
           `[추천 썸네일 카피]\n${script.thumbnails.map((t) => `"${t}"`).join(" / ")}\n\n` +
           `[오프닝 훅]\n${script.opening}\n\n` +
           `[본문 대사]\n${script.body}\n\n` +
           `[마무리 클로징]\n${script.closing}\n\n` +
           `[CTA 멘트]\n${script.cta}\n\n` +
           `[자막 리스트]\n${script.captions.join("\n")}\n\n` +
           `[추천 태그]\n${script.tags.join(", ")}`;
  };

  return (
    <div id="geometric_app" className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased selection:bg-red-100 selection:text-red-900">
      
      {/* HEADER SECTION (In harmony with Geometric Balance layout) */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 shrink-0 shadow-sm sticky top-0 z-40 transition-shadow">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-red-600 rounded flex items-center justify-center shadow-md shadow-red-100 transform hover:rotate-3 transition-transform">
            {/* Geometric Play icon */}
            <div className="w-0 h-0 border-t-[7px] border-t-transparent border-l-[11px] border-l-white border-b-[7px] border-b-transparent ml-0.5"></div>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-none">
                AI 유튜브 대본 생성기
              </h1>
              <a 
                href="https://www.threads.com/@tpp_studi.o" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-xs text-slate-500 hover:text-red-600 hover:underline transition-colors font-medium flex items-center gap-0.5 leading-none"
              >
                by @tpp_studi.o
              </a>
              <span className="text-slate-400 font-mono text-[11px] px-1.5 py-0.5 border border-slate-200 rounded bg-slate-50">
                v1.1 MVP
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1 font-medium hidden sm:block">
              기능 우선 • 쇼츠 전용 강력한 훅 & 롱폼 고밀도 스토리 고도화 디렉터
            </p>
          </div>
        </div>

        <nav className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-rose-500 animate-pulse flex-shrink-0" />
            <span className="hidden xs:inline">Gemini 3.5 Flash</span>
          </div>
        </nav>
      </header>

      {/* QUICK PRESET TOBAR (For frictionless 1-click test) */}
      <section className="bg-white border-b border-slate-200 px-4 py-2.5 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center gap-2">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1 shrink-0 mt-1">
            <Lightbulb className="w-3.5 h-3.5 text-yellow-500" />
            실제 작동 1초 체험 프리셋:
          </span>
          <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => applyPreset(preset)}
                className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg font-medium text-slate-700 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1"
              >
                <span>{preset.name}</span>
                <span className="text-[9px] px-1 py-0.2 bg-slate-200 text-slate-600 rounded">
                  {preset.contentType === 'shorts' ? '쇼츠' : '롱폼'}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* MAIN CONTAINER (Responsive Layout) */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 flex flex-col lg:flex-row gap-5 overflow-hidden">
        
        {/* LEFT SIDEBAR: INPUT CONFIGURATION PANELS */}
        <aside className="w-full lg:w-85 shrink-0 flex flex-col gap-4">
          <form onSubmit={handleGenerate} className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h2 id="config-title" className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-slate-500" />
                컨텐츠 세부 설정
              </h2>
              <span className="text-[10px] text-red-500 font-medium">* 필수 정보</span>
            </div>

            {/* Content Type Selector */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-500 mb-1.5">1. 콘텐츠 유형 선택 <span className="text-red-500">*</span></label>
              <div className="flex p-1 bg-slate-100 rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() => setContentType("shorts")}
                  className={`flex-1 py-2 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-1.5 ${
                    contentType === "shorts"
                      ? "bg-white shadow-sm text-red-600 border border-slate-200"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  쇼츠 (Shorts • 1분 미만)
                </button>
                <button
                  type="button"
                  onClick={() => setContentType("longform")}
                  className={`flex-1 py-2 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-1.5 ${
                    contentType === "longform"
                      ? "bg-white shadow-sm text-red-600 border border-slate-200"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  롱폼 (Long-f • 3분+)
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {/* Topic Input */}
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1 flex items-center justify-between">
                  <span>2. 비디오 주제 <span className="text-red-500">*</span></span>
                  <span className={`${topic.length > 0 ? "text-slate-600" : "text-slate-300"} text-[10px] font-mono`}>
                    {topic.length}자 입력됨
                  </span>
                </label>
                <textarea
                  required
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="예) 사회초년생이 돈 아끼는 직관적인 고정지출 방어 기법 3선"
                  rows={3}
                  className="w-full px-3 py-2 text-slate-800 border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-red-500 outline-none resize-none placeholder:text-slate-300 leading-relaxed bg-slate-50 focus:bg-white transition-all"
                />
              </div>

              {/* Target Audience Input */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-slate-500">
                    3. 타겟 시청자층
                  </label>
                  <span className="text-[9px] text-slate-400">선택 제안</span>
                </div>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="예) 돈을 아끼고 싶지만 동기가 약한 20대 청춘들"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-red-500 outline-none bg-slate-50 focus:bg-white transition-all"
                />
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {AUDIENCE_SUGGESTIONS.slice(0, 2).map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setTargetAudience(item)}
                      className="text-[9px] bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-200 rounded px-1.5 py-0.5 font-medium transition-colors cursor-pointer"
                    >
                      +{item.slice(0, 10)}...
                    </button>
                  ))}
                </div>
              </div>

              {/* Tone selection */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-slate-500">
                    4. 대사 톤앤매너
                  </label>
                  <span className="text-[9px] text-slate-400">어조 추천</span>
                </div>
                <input
                  type="text"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  placeholder="예) 친한 선배의 뼈 때리는 조언, 반말 투"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-red-500 outline-none bg-slate-50 focus:bg-white transition-all"
                />
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {TONE_SUGGESTIONS.slice(0, 2).map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setTone(item.substring(2))} // remove emoji for value
                      className="text-[9px] bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-200 rounded px-1.5 py-0.5 font-medium transition-colors cursor-pointer"
                    >
                      {item.split(" ")[0]} {item.split(" ")[1]?.slice(0, 5)}...
                    </button>
                  ))}
                </div>
              </div>

              {/* Purpose Input */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-slate-500">
                    5. 영상 최종 목적
                  </label>
                  <span className="text-[9px] text-slate-400">알고리즘 정조준</span>
                </div>
                <textarea
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="예) 알고리즘 확산을 위한 높은 공유 및 댓글창 소통 활성화"
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-red-500 outline-none bg-slate-50 focus:bg-white resize-none transition-all"
                />
                <div className="flex flex-wrap gap-1 mt-1">
                  {PURPOSE_SUGGESTIONS.slice(0, 1).map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPurpose(item.substring(2))}
                      className="text-[9px] bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-200 rounded px-1.5 py-0.5 font-medium transition-colors cursor-pointer text-left w-full truncate"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit handle */}
            <button
              type="submit"
              disabled={loading || !topic.trim()}
              className={`w-full py-3.5 rounded-xl font-bold text-xs mt-5 transition-all flex items-center justify-center gap-2 tracking-wide ${
                loading 
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                  : !topic.trim()
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                  : "bg-red-600 text-white hover:bg-red-700 active:translate-y-0.5 shadow-lg shadow-red-100"
              }`}
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-400" />
                  <span>비디오 대본 초고 고밀도 빌드 중...</span>
                </>
              ) : (
                <>
                  <span>대본 자동 생성하기</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick tips card */}
          <div className="bg-slate-100 border border-slate-200 rounded-xl p-4 text-xs text-slate-500 space-y-2">
            <h4 className="font-bold text-slate-700 flex items-center gap-1">
              <Smile className="w-3.5 h-3.5 text-red-500" />
              유튜브 대본 성공 전략 수칙
            </h4>
            <p className="leading-relaxed">
              <strong>쇼츠</strong>는 오프닝 훅(1~2초)이 전체 시청률의 80%를 결정합니다. AI가 후킹력이 넘치는 도발적인 문구와 스마트폰 자막에 가독성이 높은 짧은 간격을 최우선 설계합니다.
            </p>
            <p className="leading-relaxed">
              <strong>롱폼</strong>은 도입부터 이탈 없는 단계적 설명 및 완독 시간을 조화롭게 타겟하여 설계하기 때문에, 깊고 풍성한 설명 문장이 풍만하게 유지되도록 특화 생성됩니다.
            </p>
          </div>
        </aside>

        {/* RIGHT AREA: DYNAMIC SCRIPTS & RESULTS */}
        <section className="flex-1 flex flex-col gap-4 overflow-hidden">
          
          {/* Error notifications */}
          {error && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-xs text-rose-700">
              <p className="font-bold mb-1">⚠️ 원고 생성 중 알 수 없는 에러 리포트</p>
              <p className="leading-relaxed mb-3">{error}</p>
              {error.includes("GEMINI_API_KEY") && (
                <div className="bg-white border border-rose-100 p-3 rounded-lg text-rose-800 space-y-1">
                  <p className="font-bold">설치 가이드:</p>
                  <p>1. 화면 맨 앞 우측 상단의 <strong>[Settings] &gt; [Secrets]</strong> 탭을 클릭합니다.</p>
                  <p>2. 이름 필드에 <code className="bg-rose-50 text-rose-600 font-mono px-1 rounded">GEMINI_API_KEY</code>를 입력합니다.</p>
                  <p>3. Google AI Studio 등에서 확인받은 API 키 정보를 입력하고 저장해주세요.</p>
                </div>
              )}
              <button 
                onClick={() => setError(null)}
                className="mt-2 text-[10px] uppercase font-bold text-rose-600 hover:underline"
              >
                경고 닫기
              </button>
            </div>
          )}

          {/* Standby screen when there is no script generated */}
          {!script && !loading && (
            <div className="flex-1 min-h-[400px] bg-white border border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center shadow-sm">
              <div className="w-16 h-16 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center text-slate-300 mb-4 animate-bounce">
                <Youtube className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-1.5">
                대기 중: 유튜브 맞춤 대본 레시피를 만들어 드립니다
              </h3>
              <p className="text-xs text-slate-400 max-w-md leading-relaxed mb-6">
                주제와 타겟 독자, 목소리 톤을 입력하고 생성 버튼을 누르면, 클릭을 부르는 3가지 제목&썸네일 후보군부터 바로 소리 내어 녹음하기 좋은 100% 구어체 대본이 완성됩니다.
              </p>
              
              {/* Prompt helper suggestions */}
              <div className="w-full max-w-lg border-t border-dashed border-slate-200 pt-6">
                <h4 className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">
                  💡 원클릭 체험해보기 추천 예제 💡
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PRESETS.slice(0, 4).map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => applyPreset(preset)}
                      className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-left text-xs transition-all flex flex-col justify-between group cursor-pointer"
                    >
                      <div className="font-bold text-slate-700 mb-1 flex items-center justify-between">
                        <span>{preset.name.split(" ")[0]} {preset.name.split(" ")[1]}</span>
                        <span className="text-[9px] bg-slate-200 text-slate-600 px-1 rounded uppercase font-mono">
                          {preset.contentType === 'shorts' ? 'Shorts' : 'Video'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-tight group-hover:text-slate-600">
                        {preset.topic}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Spinner layout when actively calling the initial API */}
          {loading && (
            <div className="flex-1 min-h-[400px] bg-white border border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center shadow-sm">
              <div className="relative mb-5 flex items-center justify-center">
                <div className="absolute w-14 h-14 border-4 border-red-100 border-t-red-600 rounded-full animate-spin"></div>
                <Youtube className="w-6 h-6 text-red-600 animate-pulse" />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-1">
                AI 전문 작가 기획단 가동 중...
              </h3>
              <p className="text-xs text-slate-400 mb-4 font-mono">
                {contentType === 'shorts' ? '쇼츠(Shorts) 특유의 리듬감 넘치는 한국어 구어체 원고 설계 중' : '롱폼(Long-form)의 단계적 정밀 스토리텔링 구조 설계 중'}
              </p>
              
              <div className="w-full max-w-xs bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-red-600 h-full w-2/3 rounded-full animate-pulse"></div>
              </div>

              <div className="mt-8 space-y-1.5 max-w-md border border-slate-100 rounded-xl p-3 bg-slate-50">
                <div className="flex items-center gap-2 text-left text-xs text-slate-500">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping"></div>
                  <span>1단계: 조회수 유발형 고CTR 타이틀 브레인스토밍 완료</span>
                </div>
                <div className="flex items-center gap-2 text-left text-xs text-slate-500">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping"></div>
                  <span>2단계: 이탈률 제로화 오프닝 강탄 훅 문구 제련 중...</span>
                </div>
                <div className="flex items-center gap-2 text-left text-xs text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                  <span>3단계: 편집 자막용 똑단발 쪼개진 연출 대안 수립 대기</span>
                </div>
              </div>
            </div>
          )}

          {/* SCRIPT RESULTS (Once generated) */}
          {script && !loading && (
            <div className="flex-1 flex flex-col gap-4 overflow-hidden">
              
              {/* TOP GRID: Recommend Titles & Thumbnail Texts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 shrink-0">
                
                {/* 1. RECOMMENDED TITLES (제목 후보 3가지) */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col shadow-sm">
                  <div className="flex justify-between items-center mb-2.5 border-b border-slate-100 pb-2">
                    <h3 className="text-xs font-bold text-red-600 uppercase tracking-tight flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5 text-red-500" />
                      클릭을 부르는 추천 제목 (3개)
                    </h3>
                    <button 
                      type="button"
                      onClick={() => handleCopyText(script.titles.join("\n"), "all-titles")}
                      className="text-[10px] text-slate-500 border border-slate-200 px-2 py-0.5 rounded-md hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-1 font-medium"
                    >
                      {copiedId === "all-titles" ? (
                        <>
                          <Check className="w-3 text-green-600" />
                          <span className="text-green-600">복사 완료</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3" />
                          <span>전체 복사</span>
                        </>
                      )}
                    </button>
                  </div>
                  <ul className="text-xs sm:text-xs space-y-2 text-slate-700 flex-1 flex flex-col justify-center">
                    {script.titles.map((titleText, idx) => (
                      <li 
                        key={idx} 
                        className="flex items-start gap-2 font-medium bg-slate-50 p-2 border border-slate-100 rounded-lg group hover:border-slate-300 transition-all cursor-pointer"
                        onClick={() => handleCopyText(titleText, `title-${idx}`)}
                        title="클릭하여 해당 제목 복사"
                      >
                        <span className="text-red-500 font-bold shrink-0 font-mono">0{idx + 1}.</span>
                        <span className="flex-1 text-slate-800 text-xs sm:text-[13px] leading-snug">{titleText}</span>
                        <div className="shrink-0 text-slate-400 opacity-30 group-hover:opacity-100 transition-opacity">
                          {copiedId === `title-${idx}` ? (
                            <Check className="w-3 text-green-600" />
                          ) : (
                            <Copy className="w-3" />
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 2. THUMBNAIL COPY (썸네일 문구 3가지) */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col shadow-sm">
                  <div className="flex justify-between items-center mb-2.5 border-b border-slate-100 pb-2">
                    <h3 className="text-xs font-bold text-amber-600 uppercase tracking-tight flex items-center gap-1">
                      <Bookmark className="w-3.5 h-3.5 text-amber-500" />
                      썸네일 강조 키워드 카피 (3개)
                    </h3>
                    <button 
                      type="button"
                      onClick={() => handleCopyText(script.thumbnails.join(" / "), "all-thumbs")}
                      className="text-[10px] text-slate-500 border border-slate-200 px-2 py-0.5 rounded-md hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-1 font-medium"
                    >
                      {copiedId === "all-thumbs" ? (
                        <>
                          <Check className="w-3 text-green-600" />
                          <span className="text-green-600">복사 완료</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3" />
                          <span>전체 복사</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="flex flex-col gap-2 justify-center flex-1">
                    {script.thumbnails.map((thumbText, idx) => (
                      <div 
                        key={idx}
                        onClick={() => handleCopyText(thumbText, `thumb-${idx}`)}
                        className="flex items-center justify-between p-2 rounded-lg border border-yellow-100 bg-yellow-50/50 hover:bg-yellow-50 cursor-pointer group transition-colors"
                        title="클릭하여 복사"
                      >
                        <span className="text-xs font-extrabold text-amber-800 font-mono tracking-tight">
                          {idx === 0 ? "🔥 최강 후크" : idx === 1 ? "💡 직관 강조" : "🎯 호기심 유도"}
                        </span>
                        <span className="text-xs sm:text-[13px] font-bold text-slate-800 text-center flex-1 px-3">
                          "{thumbText}"
                        </span>
                        <div className="shrink-0 text-amber-600 opacity-30 group-hover:opacity-100 transition-opacity">
                          {copiedId === `thumb-${idx}` ? (
                            <Check className="w-3 text-green-600" />
                          ) : (
                            <Copy className="w-3" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* SCRIPT DETAIL CONTAINER (Middle tab architecture) */}
              <div className="flex-1 bg-white border border-slate-200 rounded-xl flex flex-col shadow-sm overflow-hidden min-h-[300px]">
                
                {/* Script Navigation and Copy button */}
                <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200 shrink-0">
                  <div className="flex items-center gap-1.5 sm:gap-2.5">
                    <button
                      onClick={() => setActiveTab('script')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                        activeTab === 'script' 
                          ? 'bg-white border border-slate-200 shadow-sm text-red-600'
                          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                      }`}
                    >
                      🗣️ 대스크 전체 대본
                    </button>
                    <button
                      onClick={() => setActiveTab('captions')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
                        activeTab === 'captions' 
                          ? 'bg-white border border-slate-200 shadow-sm text-red-600'
                          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                      }`}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      자막용 쪼개기 ({script.captions?.length || 0})
                    </button>
                    <button
                      onClick={() => setActiveTab('tags')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                        activeTab === 'tags' 
                          ? 'bg-white border border-slate-200 shadow-sm text-red-600'
                          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                      }`}
                    >
                      🏷️ 태그 최적화
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* General copy */}
                    <button
                      type="button"
                      onClick={() => handleCopyText(getFullScriptPlainText(), "full-script-copy")}
                      className="px-3 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-bold hover:bg-slate-950 hover:shadow transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      {copiedId === "full-script-copy" ? (
                        <>
                          <Check className="w-3 text-green-300 animate-pulse" />
                          <span className="text-green-300 font-bold">대본 패키지 전체 복사됨!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5" />
                          <span>통합 원고 전체 복사</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Main Script Scrollable Viewport */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-5 leading-relaxed text-slate-800 space-y-4">
                  {modifyLoading && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex flex-col items-center justify-center z-20">
                      <RefreshCw className="w-10 h-10 text-red-600 animate-spin mb-3" />
                      <p className="text-sm font-bold text-slate-800">
                        {modifyLoading === 'shorter' && '원고 불필요 지문 제거 및 초단축 세팅 중...'}
                        {modifyLoading === 'stronger' && '자극적이고 시선 강간 수준의 강력 키워드 도입 중...'}
                        {modifyLoading === 'natural' && '기계어 완전 소거 및 편안한 구어체 반말 교환 중...'}
                        {modifyLoading === 'shorts_style' && '단 60초 만에 시선 끄는 쇼츠 극대화 작업 중...'}
                        {modifyLoading === 'longform_style' && '체계적이고 깊이 있는 롱폼 빌드 세부 확장 중...'}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">이 작업은 약 3~5초 소요됩니다.</p>
                    </div>
                  )}

                  {/* TAB 1: SCRIPTS VIEW */}
                  {activeTab === 'script' && (
                    <div className="space-y-4 font-normal">
                      
                      {/* STATS CHIPS BANNER */}
                      <div className="flex flex-wrap items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-600 font-medium">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          입 낭독 예상 시간: <strong className="text-slate-800">{timeSec}초</strong>
                        </span>
                        <span className="text-slate-300">|</span>
                        <span>글자수: <strong className="text-slate-800">{charCount}자</strong></span>
                        <span className="text-slate-300">|</span>
                        <span>체감 템포: <strong className="text-red-600">{contentType === 'shorts' ? '매우 빠름 (Shorts 특화)' : '안정적 정보형'}</strong></span>
                      </div>

                      {/* OPENING BOX */}
                      <div className="border border-slate-200 rounded-lg overflow-hidden">
                        <div className="bg-red-50 px-3 py-1.5 border-b border-slate-200 flex justify-between items-center">
                          <span className="text-[10px] font-extrabold text-red-600 uppercase tracking-widest flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping"></span>
                            01. 이탈율 제로화 오프닝 (Opening & Hook)
                          </span>
                          <button 
                            onClick={() => handleCopyText(script.opening, "copy-opening")}
                            className="text-[10px] text-slate-500 hover:text-slate-800 transition-colors uppercase font-bold"
                          >
                            {copiedId === "copy-opening" ? "복사완료" : "복사"}
                          </button>
                        </div>
                        <div className="p-3 bg-red-50/10 text-xs sm:text-[13.5px] leading-relaxed text-slate-800 font-bold whitespace-pre-wrap">
                          {script.opening}
                        </div>
                      </div>

                      {/* BODY WORDS BOX */}
                      <div className="border border-slate-200 rounded-lg overflow-hidden">
                        <div className="bg-slate-50 px-3 py-1.5 border-b border-slate-200 flex justify-between items-center">
                          <span className="text-[10px] font-extrabold text-slate-600 uppercase tracking-widest">
                            02. 몰입 유도 본문 대사 (Core Content)
                          </span>
                          <button 
                            onClick={() => handleCopyText(script.body, "copy-body")}
                            className="text-[10px] text-slate-500 hover:text-slate-800 transition-colors uppercase font-bold"
                          >
                            {copiedId === "copy-body" ? "복사완료" : "복사"}
                          </button>
                        </div>
                        <div className="p-3 text-xs sm:text-[13.5px] leading-relaxed text-slate-700 whitespace-pre-wrap">
                          {script.body}
                        </div>
                      </div>

                      {/* OUTRO WORDS BOX */}
                      <div className="border border-slate-200 rounded-lg overflow-hidden">
                        <div className="bg-slate-50 px-3 py-1.5 border-b border-slate-200 flex justify-between items-center">
                          <span className="text-[10px] font-extrabold text-slate-600 uppercase tracking-widest">
                            03. 깔끔한 정리 마무리 연설 (Closing Outro)
                          </span>
                          <button 
                            onClick={() => handleCopyText(script.closing, "copy-closing")}
                            className="text-[10px] text-slate-500 hover:text-slate-800 transition-colors uppercase font-bold"
                          >
                            {copiedId === "copy-closing" ? "복사완료" : "복사"}
                          </button>
                        </div>
                        <div className="p-3 text-xs sm:text-[13.5px] leading-relaxed text-slate-700 whitespace-pre-wrap">
                          {script.closing}
                        </div>
                      </div>

                      {/* CTA BOX */}
                      <div className="border border-blue-100 rounded-lg overflow-hidden bg-blue-50/20">
                        <div className="bg-blue-50 px-3 py-1.5 border-b border-blue-100 flex justify-between items-center">
                          <span className="text-[10px] font-extrabold text-blue-700 uppercase tracking-widest">
                            04. 자발적 반응 촉진 호객 (CTA Focus)
                          </span>
                          <button 
                            onClick={() => handleCopyText(script.cta, "copy-cta")}
                            className="text-[10px] text-blue-700 hover:text-blue-900 transition-colors uppercase font-bold"
                          >
                            {copiedId === "copy-cta" ? "복사완료" : "복사"}
                          </button>
                        </div>
                        <div className="p-3 text-xs sm:text-[13px] font-medium text-blue-900 leading-relaxed whitespace-pre-wrap">
                          {script.cta}
                        </div>
                      </div>

                    </div>
                  )}

                  {/* TAB 2: SHORT CAPTIONS VIEW */}
                  {activeTab === 'captions' && (
                    <div className="space-y-3">
                      <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-lg text-xs leading-relaxed">
                        <p className="font-bold">📱 자막용 1행 문장 가이드</p>
                        <p className="mt-0.5 text-slate-600">쇼츠나 롱폼의 하단 자동 자막용 싱크 및 자막에 투입하기 좋게 호흡 주기에 맞춰 1줄 단위 분량으로 쪼갠 데이터입니다. 터치해서 개별 간편 복사해보세요.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {script.captions && script.captions.length > 0 ? (
                          script.captions.map((cap, idx) => (
                            <div 
                              key={idx}
                              onClick={() => handleCopyText(cap, `cap-${idx}`)}
                              className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg p-2.5 flex items-center justify-between text-xs cursor-pointer group transition-all"
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-[9px] bg-slate-200 text-slate-500 rounded px-1.5 py-0.5">
                                  {idx + 1}
                                </span>
                                <span className="text-slate-800 font-medium">{cap}</span>
                              </div>
                              <span className="text-[9px] text-slate-400 group-hover:text-slate-700 ml-2">
                                {copiedId === `cap-${idx}` ? "복사 완료" : "복사"}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="col-span-2 text-center py-8 text-slate-400 text-xs">
                            자막 정보가 출력되지 않았습니다. 대본 생성을 다시 요청해주시기 바랍니다.
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* TAB 3: TAGS */}
                  {activeTab === 'tags' && (
                    <div className="space-y-4">
                      <p className="text-xs text-slate-500">노출 시너지를 확보하여 추천 동영상 피드 및 검색 목록을 장악하도록 설계된 연관 핵심 태그 패키지입니다.</p>
                      
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-wrap gap-2">
                        {script.tags && script.tags.length > 0 ? (
                          script.tags.map((tag, idx) => (
                            <span 
                              key={idx}
                              onClick={() => handleCopyText(tag, `tag-${idx}`)}
                              className="px-3 py-1 bg-white hover:bg-red-50 hover:border-red-300 text-slate-700 hover:text-red-700 border border-slate-200 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center gap-1"
                            >
                              <span>#{tag}</span>
                              <span className="text-[9px] text-slate-300">
                                {copiedId === `tag-${idx}` ? "✓" : "copy"}
                              </span>
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400">등록된 추천 알고리즘 태그가 없습니다.</span>
                        )}
                      </div>

                      <div className="border border-slate-100 p-3 bg-red-50/10 rounded-lg text-xs space-y-2">
                        <p className="font-bold text-slate-700">해시태그 활용 팁</p>
                        <p className="text-slate-600 leading-relaxed">
                          복사한 해시태그는 유튜브 업로드 단계의 <strong className="text-slate-900">태그 설명란 하단</strong> 및 영상 정보 하단부에 첨부하여, 관심 유저 피드 배급률을 극대할 수 있습니다.
                        </p>
                      </div>
                    </div>
                  )}

                </div>
              </div>

              {/* BOTTOM ACTIONS: STYLE REFINEMENT (As outlined in Geometric Balance) */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shrink-0 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                    <Sliders className="w-3.5 h-3.5 text-slate-400" />
                    간편 원고 2차 교정 피드백 (미세 조율):
                  </span>
                  <span className="text-[10px] text-slate-400">현재 대본의 소재를 완전 분석하여, 즉석에서 교안을 수정합니다.</span>
                </div>
                <div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-5 gap-2">
                  <button 
                    type="button"
                    onClick={() => handleModify('shorter')}
                    disabled={!!modifyLoading}
                    className="py-2.5 px-2 text-xs font-bold border border-slate-200 bg-white rounded-lg hover:bg-slate-50 transition-all text-slate-700 flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    <span>더 짧게</span>
                    <span>🤏</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleModify('stronger')}
                    disabled={!!modifyLoading}
                    className="py-2.5 px-2 text-xs font-bold border border-slate-200 bg-white rounded-lg hover:bg-slate-50 transition-all text-slate-700 flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    <span>더 강하게</span>
                    <span>🔥</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleModify('natural')}
                    disabled={!!modifyLoading}
                    className="py-2.5 px-2 text-xs font-bold border border-slate-200 bg-white rounded-lg hover:bg-slate-50 transition-all text-slate-700 flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    <span>더 자연스럽게</span>
                    <span>✨</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleModify('shorts_style')}
                    disabled={!!modifyLoading}
                    className="py-2.5 px-2 text-xs font-bold bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-all flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer disabled:opacity-50 col-span-1"
                  >
                    <span>쇼츠강화</span>
                    <span>⚡</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleModify('longform_style')}
                    disabled={!!modifyLoading}
                    className="py-2.5 px-2 text-xs font-bold bg-red-650 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer disabled:opacity-50 col-span-1"
                  >
                    <span>롱폼강화</span>
                    <span>🚀</span>
                  </button>
                </div>
              </div>

            </div>
          )}

        </section>

      </main>

      {/* STATUS BAR (In harmony with Geometric Balance layout) */}
      <footer className="h-8 bg-slate-800 text-[10px] text-slate-400 flex items-center justify-between px-4 sm:px-6 shrink-0 font-mono">
        <div>
          서버 상태: <span className="text-green-400 font-bold">● 정상 작동 중</span> 
          <span className="hidden sm:inline"> | 유튜브 대본 알고리즘 디자이너</span>
        </div>
        <div className="flex items-center gap-3">
          {script && (
            <>
              <span className="hidden xs:inline">입력 자수: {topic.length}</span>
              <span>총 분량: ~{timeSec}초</span>
              <span>태그: {script.tags?.length || 0}개</span>
            </>
          )}
          <span className="text-slate-500 uppercase">UTF-8 / REGION-KOR</span>
        </div>
      </footer>

    </div>
  );
}
