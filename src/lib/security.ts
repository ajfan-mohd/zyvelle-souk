import DOMPurify from 'dompurify';

/**
 * Sanitizes input text to prevent XSS.
 * Use this before rendering any user-provided string as HTML.
 */
export function sanitize(text: string): string {
  if (!text) return '';
  // DOMPurify uses the global window object in the browser
  return DOMPurify.sanitize(text);
}

/**
 * Validates and cleans search queries.
 */
export function cleanSearchQuery(query: string): string {
  if (!query) return '';
  // Remove special characters that might be used for injections or weird queries
  return query.replace(/[^\w\s\u00C0-\u017F]/gi, '').trim();
}
