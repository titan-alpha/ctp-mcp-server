/**
 * Create Tool - Generate complete CTP tool from description
 */

import { analyzeToolDescription, inferParameters, generateOutputFields } from '../utils/ai-analyzer.js';
import { renderTemplate } from '../utils/template-engine.js';
import { generateToolId, toCamelCase, toPascalCase, toKebabCase } from '../utils/string-utils.js';

interface CreateToolArgs {
  description: string;
  name?: string;
  category?: string;
  executionMode?: 'client' | 'server' | 'both';
}

export async function createTool(args: CreateToolArgs) {
  const { description, name: providedName, category: providedCategory, executionMode = 'client' } = args;

  // Analyze the description
  const analyzed = analyzeToolDescription(description);
  const name = providedName || analyzed.name;
  const category = providedCategory || analyzed.category;
  const id = generateToolId(name);

  // Generate parameters
  const parameters = inferParameters(description, category);

  // Generate output fields
  const outputFields = generateOutputFields(category);

  // Create tool definition data
  const toolData = {
    id,
    name,
    description,
    category,
    tags: analyzed.tags,
    icon: analyzed.icon,
    method: 'POST' as const,
    executionMode,
    parameters,
    outputDescription: `Result of ${name.toLowerCase()} operation`,
    example: {
      name: `Example ${name}`,
      input: parameters.reduce((acc, p) => {
        acc[p.name] = p.placeholder || 'example';
        return acc;
      }, {} as Record<string, string>),
      output: outputFields.reduce((acc, f) => {
        acc[f.name] = f.placeholder;
        return acc;
      }, {} as Record<string, unknown>),
    },
    outputFields,
    camelCaseName: toCamelCase(name),
    pascalCaseName: toPascalCase(name),
    kebabCaseName: toKebabCase(name),
  };

  // Render templates
  const definitionCode = renderTemplate('tool-definition', toolData);
  const implementationCode = renderTemplate('client-implementation', toolData);
  const testCode = renderTemplate('test-suite', {
    ...toolData,
    testCases: [
      {
        description: 'should handle valid input',
        input: toolData.example.input,
        expectedSuccess: true,
        assertions: [
          {
            assertType: 'ok',
            field: outputFields[0].name,
            expected: 'result should exist',
          },
        ],
      },
    ],
  });

  // Build file structure
  const files = [
    {
      path: `src/tools/${toolData.kebabCaseName}-definition.ts`,
      content: definitionCode,
      description: 'Tool definition following CTP specification',
    },
    {
      path: `src/tools/${toolData.kebabCaseName}.ts`,
      content: implementationCode,
      description: 'Tool implementation',
    },
    {
      path: `src/tools/__tests__/${toolData.kebabCaseName}.test.ts`,
      content: testCode,
      description: 'Test suite',
    },
  ];

  // Return success response
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          success: true,
          tool: {
            id,
            name,
            category,
            executionMode,
          },
          files,
          nextSteps: [
            '1. Review the generated code',
            '2. Implement the actual logic in the implementation file',
            '3. Run tests: npm test',
            '4. Register the tool in your registry',
          ],
        }, null, 2),
      },
    ],
  };
}
