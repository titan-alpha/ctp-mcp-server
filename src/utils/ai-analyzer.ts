/**
 * AI-powered tool analysis and parameter generation
 */

import { FieldType } from '@conveniencepro/ctp-core';

/**
 * Analyze tool description and generate metadata
 */
export function analyzeToolDescription(description: string): {
  name: string;
  category: string;
  tags: string[];
  icon: string;
} {
  const lower = description.toLowerCase();

  // Determine category
  let category = 'utilities';
  if (lower.includes('convert') || lower.includes('transform')) {
    category = 'converters';
  } else if (lower.includes('calculate') || lower.includes('compute')) {
    category = 'calculators';
  } else if (lower.includes('generate') || lower.includes('create')) {
    category = 'generators';
  } else if (lower.includes('format') || lower.includes('prettify')) {
    category = 'formatters';
  } else if (lower.includes('validate') || lower.includes('check')) {
    category = 'validators';
  } else if (lower.includes('encode') || lower.includes('decode')) {
    category = 'encoders';
  }

  // Extract potential name
  const name = extractToolName(description);

  // Generate tags
  const tags = extractTags(description, category);

  // Select icon
  const icon = selectIcon(category);

  return { name, category, tags, icon };
}

/**
 * Extract tool name from description
 */
function extractToolName(description: string): string {
  // Simple heuristic: take first few words and format as title
  const words = description.split(' ').slice(0, 4);
  return words
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Extract relevant tags from description
 */
function extractTags(description: string, category: string): string[] {
  const tags: string[] = [category];
  const lower = description.toLowerCase();

  // Common tool keywords
  const keywords = [
    'text', 'json', 'xml', 'html', 'css', 'url', 'base64',
    'hash', 'encrypt', 'decrypt', 'image', 'file', 'data',
    'color', 'date', 'time', 'number', 'string', 'api',
  ];

  for (const keyword of keywords) {
    if (lower.includes(keyword)) {
      tags.push(keyword);
    }
  }

  return [...new Set(tags)].slice(0, 5);
}

/**
 * Select appropriate icon for category
 */
function selectIcon(category: string): string {
  const icons: Record<string, string> = {
    converters: '🔄',
    calculators: '🧮',
    generators: '⚡',
    formatters: '📝',
    validators: '✅',
    encoders: '🔐',
    utilities: '🔧',
  };
  return icons[category] || '🛠️';
}

/**
 * Infer parameters from tool description
 */
export function inferParameters(_description: string, category: string): Array<{
  name: string;
  type: FieldType;
  label: string;
  description: string;
  required: boolean;
  placeholder?: string;
}> {
  const parameters: Array<{
    name: string;
    type: FieldType;
    label: string;
    description: string;
    required: boolean;
    placeholder?: string;
  }> = [];

  // Every tool needs an input
  if (category === 'converters' || category === 'formatters') {
    parameters.push({
      name: 'input',
      type: 'textarea',
      label: 'Input',
      description: 'Input data to process',
      required: true,
      placeholder: 'Enter your input here...',
    });
  } else {
    parameters.push({
      name: 'value',
      type: 'text',
      label: 'Value',
      description: 'Input value',
      required: true,
      placeholder: 'Enter value...',
    });
  }

  return parameters;
}

/**
 * Generate output fields based on category
 */
export function generateOutputFields(category: string): Array<{
  name: string;
  type: string;
  placeholder: string;
}> {
  if (category === 'converters' || category === 'formatters') {
    return [
      { name: 'output', type: 'string', placeholder: "''" },
      { name: 'inputLength', type: 'number', placeholder: '0' },
      { name: 'outputLength', type: 'number', placeholder: '0' },
    ];
  }

  return [
    { name: 'result', type: 'unknown', placeholder: 'null' },
  ];
}
