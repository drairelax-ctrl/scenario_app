import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route - Generate Youtube Script
  app.post("/api/generate", async (req, res) => {
    try {
      const { contentType, topic, targetAudience, tone, purpose } = req.body;
      if (!topic) {
        return res.status(400).json({ error: "영상 주제를 반드시 입력해야 합니다." });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
        return res.status(400).json({ 
          error: "API 키가 설정되지 않았습니다. 개발 환경의 Settings > Secrets 메뉴에서 GEMINI_API_KEY를 설정해주시기 바랍니다." 
        });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const systemInstruction = "당신은 한국 최고의 유튜브 크리에이티브 디렉터이자 최고 흥행 성과를 내는 전문 대본 작가입니다. 시청자를 몰입시키는 스토리텔링과 높은 클릭율(CTR), 그리고 폭발적인 조회수를 유도하기 위해 마케팅 기법과 유튜브 채널 성장 노하우가 완전히 체화되어 있으며, 어감이 탁월한 한국어 구어체 원고를 단어 하나하나 엄선해 작성합니다.";

      const prompt = `유튜브 대본을 제작해 주세요.

[요청 내역]
- 종류: ${contentType === 'shorts' ? '쇼츠 (YouTube Shorts - 60초 미만 세로 영상)' : '롱폼 (YouTube Long-form - 일반 가로형 비디오)'}
- 주제: ${topic}
- 타겟 시청자: ${targetAudience || '대중 일반 (유튜브 시청자)'}
- 톤앤매너: ${tone || '친근하고 유쾌한 톤'}
- 영상 제작 목적: ${purpose || '정보 전달 및 시청 지속시간 최대화'}

[작성 수칙]
1. 모든 출력(제목, 썸네일 카피, 대본, 자막 등)은 반드시 한글(한국어)로 작성합니다.
2. 편안하고 자연스럽게 입 밖으로 말할 수 있는 '생생한 구어체'로 교체해 작성해 주세요. 대본 원고에 [비주얼 전환], (비장한 배경음악), [영상 인서트] 같은 비구어적 연출 지문이나 마크다운 텍스트를 대사 필드 내에 절대 절대 쓰지 마세요. 음성 전용으로만 읽히는 깨끗한 한국어만 들어가 있어야 합니다.
3. ${contentType === 'shorts' ? `[쇼츠 제작 특수 지침]
- 도입(Hook): 1~2초 내에 허를 찌르거나 시선을 확 끌어당겨 스와이프를 막는 강력한 훅 오프닝 대사를 무조건 처음에 제공하십시오.
- 리듬감: 문장이 극도로 짧아 지적 호흡이 미세하고 빠른 템포여야 하며, 가독성이 높고 경쾌하게 쓰십시오.
- 자막 최적화: 스마트폰 화면 자막에 최적화되게끔 자막 단위(captions 배열)를 한 줄 형태의 짧은 호흡으로 잘게 쪼개 주십시오.` : `[롱폼 제작 특수 지침]
- 구조화: 유기적으로 연결된 '도입(도발 및 흥미 소개) -> 전개(스토리 구성 또는 정보 핵심 상세) -> 정리 및 후킹' 단계를 따를 수 있도록 완성도 높게 구성해 주십시오.
- 몰입 유도: 단순 열거는 배제하고, 원인과 충격적인 사실 혹은 유ف익한 노하우를 충분한 길이로 깊고 촘촘하게 빌드하여 시청 이탈 동축을 완전히 통제하십시오. 너무 짧지 않게 유익한 대사 글 전체를 정성스레 채워주세요.`}

[출력 스키마 매핑 가이드]
- titles: 호기심과 호응을 폭발시켜 클릭율을 최대화하는 트렌디하고 도발적인 제목 3개.
- thumbnails: 스마트폰 화면에 크게 들어갈 가독성 높은 직관적인 썸네일 강조 키워드 카피 3개 (7자 내외로 가장 임팩트 있는 문구).
- opening: 첫 시작의 이탈율을 극단적으로 방지할 오프닝 대본 본문 전체.
- body: 설득력 있게 핵심 정보와 스토리를 풀어나가는 완성도 높은 본문 대본 전체.
- closing: 전체 메시지를 기분 좋게 뇌리에 매조지으며 정돈하는 아웃트로 마무리 대본 전체.
- cta: 채널 정착과 다음 액션을 자연스럽게 이끄는 구독/좋아요/댓글 호응 유도 멘트.
- captions: 영상 전체를 통틀어 타격감 높게 밑에 깔릴 가독성 넘치는 쪼개진 자막 텍스트의 배열 (최소 10개 이상 24개 이하, 인서트로 띄워 주기 좋은 리드미컬하고 압축적인 한 줄 단위 한국어들의 집합).
- tags: 영상 노출과 추천 동영상 유도 알고리즘에 강력 대응하는 고노출 추천 키워드 태그 리스트 5~8개.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              titles: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "제목 후보 3개"
              },
              thumbnails: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "썸네일 노출용 짧고 굵은 카피 문구 3개"
              },
              opening: {
                type: Type.STRING,
                description: "오프닝 단락 대본 전체 (지문 제외)"
              },
              body: {
                type: Type.STRING,
                description: "본문 단락 대본 전체 (지문 제외)"
              },
              closing: {
                type: Type.STRING,
                description: "마무리 단락 대본 전체 (지문 제외)"
              },
              cta: {
                type: Type.STRING,
                description: "구독/좋아요 및 피드백 유도 전용 멘트"
              },
              captions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "영상의 구절들을 가독성 높게 한 줄로 똑똑 끊어 놓은 자막용 짧은 문장 리스트"
              },
              tags: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "검색 추천용 연관 핵심 크리에이티브 태그 리스트"
              }
            },
            required: ["titles", "thumbnails", "opening", "body", "closing", "cta", "captions", "tags"]
          }
        }
      });

      const text = response.text;
      if (!text) {
        return res.status(500).json({ error: "대본 정보를 생성하지 못했습니다. 다시 시도해 주세요." });
      }

      const scriptData = JSON.parse(text);
      res.json(scriptData);
    } catch (error: any) {
      console.error("Generation error:", error);
      res.status(500).json({ error: error.message || "대본 생성 중 알 수 없는 오류가 발생했습니다." });
    }
  });

  // API Route - Modify script with fine-tuning action (Shorter, Stronger, Natural, Boost Shorts/Longform)
  app.post("/api/modify", async (req, res) => {
    try {
      const { currentScript, action, contentType, topic } = req.body;
      if (!currentScript || !action) {
        return res.status(400).json({ error: "유효하지 않은 교정 요청 데이터입니다." });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
        return res.status(400).json({ 
          error: "API 키가 설정되지 않았습니다. 개발 환경의 Settings > Secrets 메뉴에서 GEMINI_API_KEY를 설정해주시기 바랍니다." 
        });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const systemInstruction = "당신은 한국 최고의 유튜브 에디터이자 원고 및 대본 크리에이티브 디자이너입니다. 원본 대본의 뼈대와 기조는 깔끔하게 중심을 지키면서도, 사용자가 선택한 교정 미션에 완벽하게 일치하도록 원고를 극적으로 튜닝하고 퀄리티를 최상으로 격상해 줍니다.";

      let actionGuide = "";
      if (action === 'shorter') {
        actionGuide = "더 짧게 (Shorter): 원고 대사 및 한 줄 자막들을 콤팩트하고 간결하며 빠른 템포로 마이너 리딩이 될 수 있도록 불필요한 군더더기와 수사 형태를 극도로 축약해 주세요. 전달 효율 및 속도감, 박진감을 극대화합니다.";
      } else if (action === 'stronger') {
        actionGuide = "더 강하게 (Stronger): 오프닝 훅을 자극적으로 갈아치우고, 제목이나 썸네일 노출 문구에 뇌리에 영원히 남을 쇼킹하고 지적 충격감 있는 파워 키워드(예: '비상사태', '최초공개', '소름돋는 이유', '비법 폭로' 등)를 심고 호기심을 폭발적으로 불어넣으세요.";
      } else if (action === 'natural') {
        actionGuide = "더 자연스럽게 (More Natural): 발표 형식이나 설명문 투의 기계적인 말투를 털어버리세요. 정말 평소 구독하던 옆집 유튜버 형, 친한 친구가 스낵이나 커피를 두고 편하게 이야기하는 듯한 느낌으로 리액션을 섞은 탁월한 유기적 입맞춤 말투로 갈아 끼워 주세요.";
      } else if (action === 'shorts_style') {
        actionGuide = "쇼츠 스타일 강화 (Boost Shorts Style): 영상 1초 만에 스마트폰 화면을 보는 타겟의 눈알을 번쩍 뜨게 할 초강력 스파이크 훅을 심어주시고, 템포가 숨 쉴 틈 없이 팽팽하게 이어지도록 전체 스토리를 초단축 자막 호흡 위주로 날카롭게 재정비해 주세요.";
      } else if (action === 'longform_style') {
        actionGuide = "롱폼 스타일 강화 (Boost Longform Style): 흐름의 질적인 탄탄한 체계를 확대하십시오. 서두만 거창하고 마는 대본이 되지 않도록 유익한 추가 사례나 매력적인 부연 설명, 인상적인 지혜를 세세히 녹여내어, 약 2-3분 이상의 영상 시간 동안 고밀도로 정보를 청취할 수 있는 흥미로운 완독용 대안으로 확장하십시오.";
      }

      const prompt = `원본 대본의 구성을 이어 받으면서도 지정된 [핵심 수정 미션]의 니즈를 압도적으로 반영한 "완전히 개선된 교정 유튜브 원고"를 작성하십시오.

[기존 영상 정보]
- 종류: ${contentType === 'shorts' ? '쇼츠' : '롱폼'}
- 주제: ${topic || '유튜브 소재'}
- 대본 원본 상태:
  - 기존 제목들: ${JSON.stringify(currentScript.titles)}
  - 변경 전 썸네일: ${JSON.stringify(currentScript.thumbnails)}
  - 변경 전 오프닝: ${currentScript.opening}
  - 변경 전 본문: ${currentScript.body}
  - 변경 전 마무리: ${currentScript.closing}
  - 변경 전 CTA: ${currentScript.cta}
  - 변경 전 자막 리스트: ${JSON.stringify(currentScript.captions)}
  - 변경 전 검색어 태그: ${JSON.stringify(currentScript.tags || [])}

[핵심 수정 미션]
${actionGuide}

[작성 수칙 및 피드백 규정]
1. 모든 결과 단락에 눈길을 끌어내는 자연스러운 대사(한글)만 담고, [소리 효과] 같은 연출용 대본 지문 괄호들은 대사 필드에서 절대 모두 소거하십시오.
2. 제목들과 썸네일 카피 역시 수정된 무드에 완벽하게 버무려지는 최상급 카피라이팅 3개로 새롭게 탈바꿈해 주세요.
3. captions 리스트 또한 수정된 대사 흐름 및 템포에 100% 매칭되고 눈으로 읽기 알맞은 신규 쪼개진 자막 텍스트 배열로 치환해서 출력하십시오 (기조와 맥락에 맞춘 최소 10개 이상, 24개 이하 자막 단위).`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              titles: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "보정된 유튜브 인기 제목 후보 3개"
              },
              thumbnails: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "보정된 썸네일 시인성 극강 카피 문구 3개"
              },
              opening: {
                type: Type.STRING,
                description: "오프닝 교정본 대본 전체 (지문 제외)"
              },
              body: {
                type: Type.STRING,
                description: "본문 교정본 대본 전체 (지문 제외)"
              },
              closing: {
                type: Type.STRING,
                description: "마무리 교정본 대본 전체 (지문 제외)"
              },
              cta: {
                type: Type.STRING,
                description: "소통 및 채널 지속 촉진용 CTA 멘트 전체"
              },
              captions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "개정 대본을 한 줄씩 똑단발로 나눠놓은 자막용 짧은 문장 리스트"
              },
              tags: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "검색 노출 최적화용 신규 타겟 태그 리스트"
              }
            },
            required: ["titles", "thumbnails", "opening", "body", "closing", "cta", "captions", "tags"]
          }
        }
      });

      const text = response.text;
      if (!text) {
        return res.status(500).json({ error: "대본 수정 결과를 생성하지 못했습니다." });
      }

      const scriptData = JSON.parse(text);
      res.json(scriptData);
    } catch (error: any) {
      console.error("Modification error:", error);
      res.status(500).json({ error: error.message || "대본 교정 진행 중 도중에 알 수 없는 에러가 터졌습니다." });
    }
  });

  // Serve Frontend with Vite in development or static folder in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[YouTube Script Server] Running at http://localhost:${PORT}`);
  });
}

startServer();
