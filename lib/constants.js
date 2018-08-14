export const inlineElements = [
  'a', 'abbr', 'acronym', 'b', 'bdo', 'big', 'br', 'button', 'cite', 'code', 'dfn', 'em', 'i',
  'img', 'input', 'kbd', 'label', 'map', 'object', 'q', 'samp', 'script', 'select', 'small',
  'span', 'strong', 'sub', 'sup', 'textarea', 'time', 'tt', 'var', 'u',
];

export const blockElements = [
  'address', 'article', 'aside', 'blockquote', 'canvas', 'dd', 'div', 'dl', 'dt', 'fieldset',
  'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hgroup',
  'hr', 'li', 'main', 'nav', 'noscript', 'ol', 'output', 'p', 'pre', 'section', 'table', 'tfoot',
  'ul',
];

export function isInline(tag) {
  return inlineElements.indexOf(tag.toLowerCase()) !== -1;
}
