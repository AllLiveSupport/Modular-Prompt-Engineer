import { Platform } from '../types';

export const platforms: Platform[] = [
  { id: 'general-text', name: 'Genel Metin / ChatGPT' },
  { id: 'midjourney', name: 'Midjourney / Görüntü Üretimi' },
  { id: 'stable-diffusion', name: 'Stable Diffusion / Görüntü Üretimi' },
  { id: 'n8n-agent', name: 'n8n / Otomasyon Mimarisi' },
  { id: 'warp-agent', name: 'Warp.dev / AI Terminal Asistanı' },
  { id: 'zai-agent', name: 'Z.ai Code / Next.js Geliştiricisi' },
  { id: 'spawn-agent', name: 'Spawn / Oyun Geliştirme Asistanı' },
  { id: 'manus-agent', name: 'Manus Agent / Görev Otomasyonu' },
  { id: 'dia-agent', name: 'Dia / Web Tarayıcı Asistanı' },
  { id: 'junie-agent', name: 'Junie / Proje Kaşifi' },
  { id: 'kiro-agent', name: 'Kiro / IDE Asistanı' },
  { id: 'cluely-agent', name: 'Cluely / Canlı Toplantı Co-pilotu' },
  { id: 'samedev-agent', name: 'Same.dev / Ajan Yöneticisi' },
  { id: 'orchids-agent', name: 'Orchids.app / Next.js Asistanı' },
  { id: 'perplexity-agent', name: 'Perplexity / Arama Asistanı' },
  { id: 'lovable-agent', name: 'Lovable AI / Web Uygulama Editörü' },
  { id: 'roocode-agent', name: 'RooCode / Araç Tabanlı Mühendis' },
  { id: 'lumo-agent', name: 'Lumo / Proton AI Asistanı' },
  { id: 'codex-cli', name: 'Codex CLI / Terminal Asistanı' },
  { id: 'cline-agent', name: 'Cline / Araç Tabanlı Ajan' },
  { id: 'bolt-agent', name: 'Bolt / WebContainer Asistanı' },
  { id: 'windsurf-agent', name: 'Windsurf / Cascade Ajanı' },
  { id: 'v0-uidev', name: 'v0.dev / Arayüz (UI) Geliştirme' },
  { id: 'devin-ai', name: 'Devin AI / Otonom Yazılım Mühendisi' },
  { id: 'trae-ai', name: 'Trae AI / İkili Programlama Asistanı' },
  { id: 'cursor-agent', name: 'Cursor / Ajan Kodlama Asistanı' },
  { id: 'replit-ghostwriter', name: 'Replit / Ghostwriter (Kodlama)' },
  { id: 'vscode-agent', name: 'VSCode Agent / Kodlama' },
  { id: 'xcode-assistant', name: 'Xcode / Swift Asistanı' },
  { id: 'technical-expert', name: 'Teknik Uzman / Kod Açıklama' },
  { id: 'custom', name: 'Özel / Diğer' },
];

export interface GeminiModel {
  id: string;
  name: string;
}

export const geminiModels: GeminiModel[] = [
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash (Önerilen)' },
  { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro (Zeki)' },
  { id: 'gemini-2.5-flash-lite', name: 'Gemini 2.5 Flash Lite (Ekonomik)' },
  { id: 'gemini-3-flash-preview', name: 'Gemini 3 Flash Preview' },
  { id: 'gemini-3-pro-preview', name: 'Gemini 3 Pro Preview' },
];