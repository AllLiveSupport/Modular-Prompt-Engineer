import { Platform } from '../types';

export const platforms: Platform[] = [
  { id: 'general-text', name: 'General Text / ChatGPT' },
  { id: 'midjourney', name: 'Midjourney / Image Generation' },
  { id: 'stable-diffusion', name: 'Stable Diffusion / Image Generation' },
  { id: 'n8n-agent', name: 'n8n / Automation Architecture' },
  { id: 'warp-agent', name: 'Warp.dev / AI Terminal Assistant' },
  { id: 'zai-agent', name: 'Z.ai Code / Next.js Generator' },
  { id: 'spawn-agent', name: 'Spawn / Game Development Assistant' },
  { id: 'manus-agent', name: 'Manus Agent / Task Automation' },
  { id: 'dia-agent', name: 'Dia / Web Browser Assistant' },
  { id: 'junie-agent', name: 'Junie / Project Explorer' },
  { id: 'kiro-agent', name: 'Kiro / IDE Assistant' },
  { id: 'cluely-agent', name: 'Cluely / Live Meeting Co-pilot' },
  { id: 'samedev-agent', name: 'Same.dev / Agent Manager' },
  { id: 'orchids-agent', name: 'Orchids.app / Next.js Assistant' },
  { id: 'perplexity-agent', name: 'Perplexity / Search Assistant' },
  { id: 'lovable-agent', name: 'Lovable AI / Web App Editor' },
  { id: 'roocode-agent', name: 'RooCode / Tool-Based Engineer' },
  { id: 'lumo-agent', name: 'Lumo / Proton AI Assistant' },
  { id: 'codex-cli', name: 'Codex CLI / Terminal Assistant' },
  { id: 'cline-agent', name: 'Cline / Tool-Based Agent' },
  { id: 'bolt-agent', name: 'Bolt / WebContainer Assistant' },
  { id: 'windsurf-agent', name: 'Windsurf / Cascade Agent' },
  { id: 'v0-uidev', name: 'v0.dev / Interface (UI) Development' },
  { id: 'devin-ai', name: 'Devin AI / Autonomous Software Engineer' },
  { id: 'trae-ai', name: 'Trae AI / Pair Programming Assistant' },
  { id: 'cursor-agent', name: 'Cursor / Agent Coding Assistant' },
  { id: 'replit-ghostwriter', name: 'Replit / Ghostwriter (Coding)' },
  { id: 'vscode-agent', name: 'VSCode Agent / Coding' },
  { id: 'xcode-assistant', name: 'Xcode / Swift Assistant' },
  { id: 'technical-expert', name: 'Technical Expert / Code Explanation' },
  { id: 'custom', name: 'Custom / Other' },
];

export interface GeminiModel {
  id: string;
  name: string;
}

export const geminiModels: GeminiModel[] = [
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash (Recommended)' },
  { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro (Intelligent)' },
  { id: 'gemini-2.5-flash-lite', name: 'Gemini 2.5 Flash Lite (Economic)' },
  { id: 'gemini-3-flash-preview', name: 'Gemini 3 Flash Preview' },
  { id: 'gemini-3-pro-preview', name: 'Gemini 3 Pro Preview' },
];