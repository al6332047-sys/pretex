export function extractHtmlCode(rawText: string): string {
  if (!rawText) return '';

  // Case 1: Markdown html fence ```html ... ```
  const htmlFenceMatch = rawText.match(/```(?:html|xml)?\s*([\s\S]*?)\s*```/i);
  if (htmlFenceMatch && htmlFenceMatch[1]) {
    const code = htmlFenceMatch[1].trim();
    if (code.includes('<html') || code.includes('<!DOCTYPE') || code.includes('<div') || code.includes('<body')) {
      return code;
    }
  }

  // Case 2: Direct DOCTYPE or <html> detection
  const docTypeIndex = rawText.indexOf('<!DOCTYPE html');
  if (docTypeIndex !== -1) {
    const endHtmlIndex = rawText.lastIndexOf('</html>');
    if (endHtmlIndex !== -1) {
      return rawText.substring(docTypeIndex, endHtmlIndex + 7).trim();
    }
    return rawText.substring(docTypeIndex).trim();
  }

  const htmlTagIndex = rawText.indexOf('<html');
  if (htmlTagIndex !== -1) {
    const endHtmlIndex = rawText.lastIndexOf('</html>');
    if (endHtmlIndex !== -1) {
      return rawText.substring(htmlTagIndex, endHtmlIndex + 7).trim();
    }
    return rawText.substring(htmlTagIndex).trim();
  }

  // Case 3: Return raw trimmed string
  return rawText.trim();
}

export interface GenerateAppParams {
  prompt: string;
  model: string;
  apiKey?: string;
  contextCode?: string;
}

export interface GenerateAppResult {
  code: string;
  rawText: string;
  modelUsed: string;
  fallbackNotice?: string;
}

export async function requestAppGeneration(params: GenerateAppParams): Promise<GenerateAppResult> {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    let errorMsg = `خطأ في الخادم (${response.status})`;
    try {
      const errJson = await response.json();
      if (errJson.error) errorMsg = errJson.error;
    } catch {
      // ignore
    }
    throw new Error(errorMsg);
  }

  const data = await response.json();
  const rawText = data.content || '';
  const cleanCode = extractHtmlCode(rawText);

  return {
    code: cleanCode || rawText,
    rawText,
    modelUsed: data.modelUsed || params.model,
    fallbackNotice: data.fallbackNotice,
  };
}

export async function requestPromptEnhance(prompt: string, apiKey?: string): Promise<string> {
  const response = await fetch('/api/enhance-prompt', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt, apiKey, language: 'ar' }),
  });

  if (!response.ok) {
    throw new Error('فشل تحسين الوصف عبر الذكاء الاصطناعي');
  }

  const data = await response.json();
  return data.enhancedPrompt || prompt;
}
