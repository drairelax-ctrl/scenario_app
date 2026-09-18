export interface YoutubeScript {
  titles: string[];
  thumbnails: string[];
  opening: string;
  body: string;
  closing: string;
  cta: string;
  captions: string[];
  tags: string[];
}

export interface ScriptRequest {
  contentType: 'shorts' | 'longform';
  topic: string;
  targetAudience: string;
  tone: string;
  purpose: string;
}

export interface ModifyRequest {
  currentScript: YoutubeScript;
  action: 'shorter' | 'stronger' | 'natural' | 'shorts_style' | 'longform_style';
  contentType: 'shorts' | 'longform';
  topic: string;
}
