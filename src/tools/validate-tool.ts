/**
 * Validate Tool - Validate tool definition against CTP spec
 */

import { validateToolDefinition, ToolDefinition } from '@conveniencepro/ctp-core';

interface ValidateToolArgs {
  definition: ToolDefinition;
}

export async function validateTool(args: ValidateToolArgs) {
  const { definition } = args;

  // Validate using CTP core validator
  const validation = validateToolDefinition(definition);

  if (validation.valid) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            valid: true,
            message: 'Tool definition is valid',
            definition: {
              id: definition.id,
              name: definition.name,
              category: definition.category,
              parameterCount: definition.parameters.length,
            },
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
          success: false,
          valid: false,
          errors: validation.errors,
          suggestions: validation.errors.map(error => {
            switch (error.code) {
              case 'required':
                return `Add the required field: ${error.field}`;
              case 'type':
                return `Fix type for ${error.field}: ${error.message}`;
              default:
                return error.message;
            }
          }),
        }, null, 2),
      },
    ],
  };
}
