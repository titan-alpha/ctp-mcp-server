/**
 * Search Duplicates - Find similar existing tools
 */

interface SearchDuplicatesArgs {
  description: string;
  category?: string;
}

// Known tools database (in production, this would query a real registry)
const KNOWN_TOOLS = [
  { id: 'base64-encoder', name: 'Base64 Encoder', category: 'encoders', tags: ['base64', 'encode', 'decode'] },
  { id: 'json-formatter', name: 'JSON Formatter', category: 'formatters', tags: ['json', 'format', 'prettify'] },
  { id: 'hash-generator', name: 'Hash Generator', category: 'generators', tags: ['hash', 'sha', 'checksum'] },
];

export async function searchDuplicates(args: SearchDuplicatesArgs) {
  const { description, category } = args;

  const lower = description.toLowerCase();
  const words = lower.split(/\s+/);

  // Simple keyword matching
  const matches = KNOWN_TOOLS.filter(tool => {
    // Category match
    if (category && tool.category !== category) {
      return false;
    }

    // Check if any word matches tool name or tags
    const toolTerms = [
      tool.name.toLowerCase(),
      ...tool.tags,
      tool.id,
    ];

    return words.some(word =>
      toolTerms.some(term => term.includes(word) || word.includes(term))
    );
  });

  if (matches.length === 0) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            found: false,
            message: 'No similar tools found. This appears to be a unique tool.',
            canProceed: true,
          }, null, 2),
        },
      ],
    };
  }

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          success: true,
          found: true,
          matches: matches.map(tool => ({
            id: tool.id,
            name: tool.name,
            category: tool.category,
            similarity: 'medium', // In production, use embeddings for better matching
          })),
          message: `Found ${matches.length} similar tool(s). Consider reviewing these before creating a new one.`,
          canProceed: true,
        }, null, 2),
        },
      ],
    };
}
