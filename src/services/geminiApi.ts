import { fileToBase64 } from '../utils/fileUtils';
import { platforms } from '../constants/platforms';
import { translations } from '../constants/translations';
import { getPlatformSpecificInstructions } from '../constants/platformInstructions';

interface GeneratePromptParams {
  apiKey: string;
  userIdea: string;
  images: File[];
  targetPlatform: string;
  model: string;
  outputLanguage: string;
  t: (key: string, params?: Record<string, any>) => string;
}

export const generateSinglePrompt = async ({
  apiKey,
  userIdea,
  images,
  targetPlatform,
  model,
  outputLanguage,
  t
}: GeneratePromptParams): Promise<string> => {
  if (!apiKey) throw new Error(t('errorApi'));
  if (!userIdea && images.length === 0) throw new Error(t('errorIdeaOrImage'));

  const platformName = platforms.find(p => p.id === targetPlatform)?.name || 'Unknown Platform';
  const platformInstructions = getPlatformSpecificInstructions(targetPlatform);

  // Helper function to get translation (Always use English for Meta Prompts to ensure consistent AI behavior)
  const getT = (key: string, params: Record<string, any> = {}) => {
    let text = translations['en']?.[key] || key;
    Object.keys(params).forEach(pk => {
      text = text.replace(`{${pk}}`, params[pk]);
    });
    return text;
  };

  const imageParts = await Promise.all(
    images.map(async (file) => {
      const base64 = await fileToBase64(file);
      return { inlineData: { mimeType: file.type, data: base64 } };
    })
  );

  const textPart = {
    text: `
      ${getT('metaPromptIntro', { metaPromptTitle: getT('metaPromptTitle') })}
      ${getT('metaPromptKnowledge')}
      ${getT('metaPromptPrinciplesTitle')}
      ${getT('metaPromptPrinciple1')}
      ${getT('metaPromptPrinciple2')}
      ${getT('metaPromptPrinciple3')}
      ${getT('metaPromptPrinciple4')}
      ${getT('metaPromptPrinciple5')}
      ${getT('metaPromptPrinciple6')}
      ${images.length > 0 ? getT('metaPromptImageInstruction') : ''}
      ${getT('metaPromptUserRequestTitle')}
      ${getT('metaPromptUserIdea')} "${userIdea || '(Metin girilmedi)'}"
      ${images.length > 0 ? getT('metaPromptUserImage', { imageCount: images.length }) : ''}
      ${getT('metaPromptTargetPlatform')} "${platformName}"
      ${getT('metaPromptYourTask')}
      ${platformInstructions}
      ${getT('metaPromptFinalInstruction')}

      CRITICAL LANGUAGE REQUIREMENT:
      The generated professional prompt MUST be written ENTIRELY in ${outputLanguage === 'tr' ? 'TURKISH' : 'ENGLISH'}.
      Even if the user's idea or the platform instructions are in another language, your final output (the professional prompt) must be in ${outputLanguage === 'tr' ? 'TURKISH' : 'ENGLISH'}.
    `
  };

  const allParts = [textPart, ...imageParts];

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: allParts }] }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || t('errorApiInvalid'));
  }

  const result = await response.json();
  const promptText = result.candidates?.[0]?.content?.parts?.[0]?.text;

  if (promptText) {
    return promptText.trim();
  } else {
    console.log('API Response:', result);
    throw new Error(t('errorApiNoPrompt'));
  }
};

interface RefinePromptParams {
  apiKey: string;
  originalPrompt: string;
  action: 'enhance' | 'shorten' | 'creative' | 'clarify';
  model: string;
  outputLanguage: string;
  t: (key: string, params?: Record<string, any>) => string;
}

export const refinePrompt = async ({
  apiKey,
  originalPrompt,
  action,
  model,
  outputLanguage,
  t
}: RefinePromptParams): Promise<string> => {
  if (!apiKey) throw new Error(t('errorApi'));

  const actionInstructions = {
    enhance: "Make this prompt more detailed, descriptive, and comprehensive. Add more context and specific instructions to improve the output quality.",
    shorten: "Make this prompt more concise and direct. Remove redundant information while keeping the core instructions.",
    creative: "Make this prompt more creative, experimental, and unique. Use artistic or unconventional framing.",
    clarify: "Improve the structure, logic, and clarity of this prompt. Use better formatting and more precise language."
  };

  const textPart = {
    text: `
      You are an expert Prompt Engineer. Your task is to REFINE the following professional prompt based on a specific goal.

      GOAL: ${actionInstructions[action]}
      OUTPUT LANGUAGE: ${outputLanguage === 'tr' ? 'TURKISH' : 'ENGLISH'}

      ORIGINAL PROMPT:
      """
      ${originalPrompt}
      """

      INSTRUCTIONS:
      1. ONLY output the refined professional prompt.
      2. DO NOT add any explanations, introductions, or closing remarks.
      3. Maintain the core intent of the original prompt but transform it according to the GOAL.
      4. Ensure the output is entirely in ${outputLanguage === 'tr' ? 'TURKISH' : 'ENGLISH'}.
    `
  };

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [textPart] }] }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || t('errorApiInvalid'));
  }

  const result = await response.json();
  const refinedText = result.candidates?.[0]?.content?.parts?.[0]?.text;

  if (refinedText) {
    return refinedText.trim();
  } else {
    throw new Error(t('errorApiNoPrompt'));
  }
};