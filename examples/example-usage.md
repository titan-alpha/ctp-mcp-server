# Example Usage

## Creating a Simple Converter Tool

**User Request:**
```
Create a tool that converts CSV to JSON
```

**MCP Server Response:**
```json
{
  "success": true,
  "tool": {
    "id": "csv-to-json",
    "name": "CSV to JSON",
    "category": "converters",
    "executionMode": "client"
  },
  "files": [
    {
      "path": "src/tools/csv-to-json-definition.ts",
      "content": "...",
      "description": "Tool definition following CTP specification"
    },
    {
      "path": "src/tools/csv-to-json.ts",
      "content": "...",
      "description": "Tool implementation"
    },
    {
      "path": "src/tools/__tests__/csv-to-json.test.ts",
      "content": "...",
      "description": "Test suite"
    }
  ],
  "nextSteps": [
    "1. Review the generated code",
    "2. Implement the actual logic in the implementation file",
    "3. Run tests: npm test",
    "4. Register the tool in your registry"
  ]
}
```

## Generated Tool Definition

```typescript
/**
 * CSV to JSON Tool Definition
 *
 * Convert CSV data to JSON format
 *
 * Category: converters
 * Execution Mode: client
 */

import { ToolDefinition, ToolFunction, ToolResult } from '@conveniencepro/ctp-core';

export const csvToJsonDefinition: ToolDefinition = {
  id: 'csv-to-json',
  name: 'CSV to JSON',
  description: 'Convert CSV data to JSON format',
  category: 'converters',
  tags: ['converters', 'csv', 'json', 'data'],
  method: 'POST',
  parameters: [
    {
      name: 'input',
      type: 'textarea',
      label: 'Input',
      description: 'Input data to process',
      required: true,
      placeholder: 'Enter your input here...',
    },
  ],
  outputDescription: 'Result of csv to json operation',
  example: {
    input: {
      input: 'name,age\nJohn,30\nJane,25',
    },
    output: {
      output: '[{"name":"John","age":"30"},{"name":"Jane","age":"25"}]',
      inputLength: 26,
      outputLength: 58,
    },
    name: 'Example CSV to JSON',
  },
  version: '1.0.0',
  icon: '🔄',
  executionMode: 'client',
};
```

## Validating an Existing Tool

**User Request:**
```
Validate this tool definition: { id: 'my-tool', name: 'My Tool' }
```

**MCP Server Response:**
```json
{
  "success": false,
  "valid": false,
  "errors": [
    {
      "field": "description",
      "code": "required",
      "message": "Field 'description' is required"
    },
    {
      "field": "category",
      "code": "required",
      "message": "Field 'category' is required"
    }
  ],
  "suggestions": [
    "Add the required field: description",
    "Add the required field: category"
  ]
}
```

## Searching for Duplicates

**User Request:**
```
Search for tools similar to "base64 encoder"
```

**MCP Server Response:**
```json
{
  "success": true,
  "found": true,
  "matches": [
    {
      "id": "base64-encoder",
      "name": "Base64 Encoder",
      "category": "encoders",
      "similarity": "high"
    }
  ],
  "message": "Found 1 similar tool(s). Consider reviewing these before creating a new one.",
  "canProceed": true
}
```

## Complete Workflow Example

### 1. Check for Duplicates
```
Use ctp_search_duplicates with:
- description: "URL query string parser"
- category: "parsers"
```

### 2. Create the Tool
```
Use ctp_create_tool with:
- description: "Parse URL query strings into key-value objects"
- category: "parsers"
- executionMode: "client"
```

### 3. Implement the Logic

Edit the generated `src/tools/url-query-parser.ts`:

```typescript
export const urlQueryParserFn: ToolFunction<UrlQueryParserResult> = (
  params
): ToolResult<UrlQueryParserResult> => {
  const startTime = performance.now();

  try {
    const input = params.input;
    if (!input) {
      return failure('Input is required');
    }

    // Implementation
    const queryString = input.split('?')[1] || input;
    const params = new URLSearchParams(queryString);
    const result: Record<string, string> = {};

    params.forEach((value, key) => {
      result[key] = value;
    });

    const duration = performance.now() - startTime;

    return success({
      output: result,
      inputLength: input.length,
      paramCount: Object.keys(result).length,
    }, {
      durationMs: duration,
    });
  } catch (error) {
    return failure(
      error instanceof Error ? error.message : 'Unknown error occurred'
    );
  }
};
```

### 4. Run Tests

```bash
npm test
```

### 5. Build and Deploy

```bash
npm run build
# Tool is now ready to use
```

## Advanced: Custom Templates

You can customize the templates in `src/templates/`:

1. `tool-definition.hbs` - Customize tool definition structure
2. `client-implementation.hbs` - Customize implementation boilerplate
3. `test-suite.hbs` - Customize test generation

Example custom template helper:

```typescript
// In template-engine.ts
Handlebars.registerHelper('customHelper', function(context) {
  // Your custom logic
  return transformedValue;
});
```
