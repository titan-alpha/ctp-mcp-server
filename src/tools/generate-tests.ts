/**
 * Generate Tests - Create test suite for a tool
 */

import { ToolDefinition } from '@conveniencepro/ctp-core';
import { renderTemplate } from '../utils/template-engine.js';
import { toCamelCase, toPascalCase, toKebabCase } from '../utils/string-utils.js';

interface GenerateTestsArgs {
  definition: ToolDefinition;
  implementation?: string;
}

export async function generateTests(args: GenerateTestsArgs) {
  const { definition } = args;

  const templateData = {
    ...definition,
    camelCaseName: toCamelCase(definition.name),
    pascalCaseName: toPascalCase(definition.name),
    kebabCaseName: toKebabCase(definition.name),
    testCases: [
      {
        description: 'should process example input correctly',
        input: definition.example.input,
        expectedSuccess: true,
        assertions: [],
      },
      {
        description: 'should validate required parameters',
        input: {},
        expectedSuccess: false,
        expectedError: 'required',
      },
    ],
  };

  const testCode = renderTemplate('test-suite', templateData);

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          success: true,
          tests: {
            code: testCode,
            filename: `${templateData.kebabCaseName}.test.ts`,
            testCount: templateData.testCases.length + 4, // base tests + generated
          },
        }, null, 2),
      },
    ],
  };
}
