/**
 * Generate Implementation - Create implementation code from definition
 */

import { ToolDefinition } from '@conveniencepro/ctp-core';
import { renderTemplate } from '../utils/template-engine.js';
import { toCamelCase, toPascalCase, toKebabCase } from '../utils/string-utils.js';
import { generateOutputFields } from '../utils/ai-analyzer.js';

interface GenerateImplementationArgs {
  definition: ToolDefinition;
  executionMode?: 'client' | 'server' | 'both';
}

export async function generateImplementation(args: GenerateImplementationArgs) {
  const { definition, executionMode = 'client' } = args;

  const outputFields = generateOutputFields(definition.category);

  const templateData = {
    ...definition,
    outputFields,
    camelCaseName: toCamelCase(definition.name),
    pascalCaseName: toPascalCase(definition.name),
    kebabCaseName: toKebabCase(definition.name),
  };

  const implementationCode = renderTemplate('client-implementation', templateData);

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          success: true,
          implementation: {
            code: implementationCode,
            executionMode,
            filename: `${templateData.kebabCaseName}.ts`,
          },
        }, null, 2),
      },
    ],
  };
}
