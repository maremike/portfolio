export const SUPPORTED_LANGUAGES = ['en', 'de', 'ru', 'zh', 'es', 'ja'];

export function isSupportedLanguage(code: string): boolean {
  return SUPPORTED_LANGUAGES.includes(code);
}

export function detectLanguage(): string {
  const rawLang = navigator.language || navigator.languages[0] || 'en';
  const browserLang = rawLang.split('-')[0].toLowerCase();
  const defaultLang = isSupportedLanguage(browserLang) ? browserLang : 'en';
  return defaultLang;
}

export function initLanguage(): string {
  const defaultLang = detectLanguage();
  
  const path = window.location.pathname;
  const pathParts = path.split('/').filter(Boolean); // e.g. ['', 'about'] → ['about']

  const firstSegment = pathParts[0];

  // CASE 1: URL starts with a language code
  if (isSupportedLanguage(firstSegment)) {
    return firstSegment; // already correct
  }

  // CASE 2: Starts with unsupported language (e.g., /fr/...)
  if (firstSegment && firstSegment.length === 2) {
    pathParts[0] = defaultLang;
    const newPath = '/' + pathParts.join('/');
    redirectTo(newPath);
    return defaultLang;
  }

  // CASE 3: No language code in path at all (e.g., /about, /, etc.)
  const newPath = '/' + [defaultLang, ...pathParts].join('/');
  redirectTo(newPath);
  return defaultLang;
}

function redirectTo(newPath: string) {
  const search = window.location.search;
  const hash = window.location.hash;
  const fullUrl = `${newPath}${search}${hash}`;
  window.location.replace(fullUrl);
}

export function extractLangAndPath(fullPath: string): { lang: string | null; path: string } {
  const parts = fullPath.split("/").filter(Boolean);
  if (parts.length > 0 && isSupportedLanguage(parts[0])) {
    return { lang: parts[0], path: "/" + parts.slice(1).join("/") || "/" };
  }
  return { lang: null, path: fullPath || "/" };
}