# CTP MCP Server

MCP server for AI-powered CTP tool generation - describe a tool, get production-ready code.

## Overview

The CTP MCP Server is a [Model Context Protocol](https://modelcontextprotocol.io) server that helps developers create [ConveniencePro Tool Protocol](https://github.com/titan-alpha/ctp) (CTP) tools quickly and easily. Simply describe what tool you want to build, and the MCP server generates complete, production-ready code including:

- Tool definitions following the CTP specification
- Implementation code (client-side or server-side)
- Complete test suites
- TypeScript types and validation

## Features

- **AI-Powered Generation**: Describe your tool in natural language
- **Complete Scaffolding**: Get definition, implementation, and tests
- **CTP Validation**: Ensures generated tools follow the specification
- **Duplicate Detection**: Checks for similar existing tools
- **Template-Based**: Consistent, best-practice code generation
- **Type-Safe**: Full TypeScript support

## Installation

```bash
npm install -g @conveniencepro/ctp-mcp-server
```

Or use directly with npx:

```bash
npx @conveniencepro/ctp-mcp-server
```

## Usage with Claude Desktop

Add to your Claude Desktop configuration (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "ctp-tools": {
      "command": "npx",
      "args": ["-y", "@conveniencepro/ctp-mcp-server"]
    }
  }
}
```

## Available Tools

### `ctp_create_tool`

Generate a complete CTP tool from a natural language description.

**Parameters:**
- `description` (required): Natural language description of what the tool should do
- `name` (optional): Tool name (auto-generated if not provided)
- `category` (optional): Tool category
- `executionMode` (optional): Where the tool runs (`client`, `server`, or `both`)

**Example:**
```
Create a tool that converts YAML to JSON
```

### `ctp_validate_tool`

Validate a tool definition against the CTP specification.

**Parameters:**
- `definition` (required): The tool definition object to validate

### `ctp_generate_implementation`

Generate implementation code from a tool definition.

**Parameters:**
- `definition` (required): The tool definition
- `executionMode` (optional): Execution mode (`client` or `server`)

### `ctp_generate_tests`

Generate a test suite for a CTP tool.

**Parameters:**
- `definition` (required): The tool definition
- `implementation` (optional): The tool implementation code

### `ctp_search_duplicates`

Search for existing tools with similar functionality.

**Parameters:**
- `description` (required): Description of the tool to search for
- `category` (optional): Category to narrow search

## Example Workflow

1. **Search for duplicates:**
   ```
   Use ctp_search_duplicates to check if a "markdown to HTML converter" already exists
   ```

2. **Generate the tool:**
   ```
   Use ctp_create_tool with description: "Convert Markdown text to HTML"
   ```

3. **Review generated files:**
   - `src/tools/markdown-to-html-definition.ts` - Tool definition
   - `src/tools/markdown-to-html.ts` - Implementation
   - `src/tools/__tests__/markdown-to-html.test.ts` - Tests

4. **Implement the logic:**
   Replace the placeholder implementation with actual logic

5. **Test and deploy:**
   ```bash
   npm test
   npm run build
   ```

## Generated Code Structure

```typescript
// Tool Definition
export const markdownToHtmlDefinition: ToolDefinition = {
  id: 'markdown-to-html',
  name: 'Markdown to HTML',
  description: 'Convert Markdown text to HTML',
  category: 'converters',
  // ... full specification
};

// Implementation
export const markdownToHtmlFn: ToolFunction<MarkdownToHtmlResult> = (params) => {
  // Your implementation here
};

// Tests
describe('Markdown to HTML', () => {
  it('should convert markdown to HTML', () => {
    // Generated tests
  });
});
```

## Development

```bash
# Clone the repository
git clone https://github.com/titan-alpha/ctp-mcp-server.git
cd ctp-mcp-server

# Install dependencies
npm install

# Build
npm run build

# Run locally
npm start
```

## Architecture

```
ctp-mcp-server/
├── src/
│   ├── index.ts              # MCP server entry point
│   ├── tools/                # MCP tool implementations
│   │   ├── create-tool.ts    # Tool scaffolding
│   │   ├── validate-tool.ts  # Validation
│   │   ├── generate-*.ts     # Code generators
│   │   └── search-*.ts       # Duplicate detection
│   ├── templates/            # Handlebars templates
│   │   ├── tool-definition.hbs
│   │   ├── client-implementation.hbs
│   │   └── test-suite.hbs
│   └── utils/                # Utilities
│       ├── template-engine.ts
│       ├── string-utils.ts
│       └── ai-analyzer.ts
└── dist/                     # Compiled output
```

## Contributing

Contributions are welcome! Please see the [CTP repository](https://github.com/titan-alpha/ctp) for contribution guidelines.

## License

MIT

## Links

- [CTP Specification](https://spec.conveniencepro.cc)
- [CTP Repository](https://github.com/titan-alpha/ctp)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [Issues](https://github.com/titan-alpha/ctp-mcp-server/issues)

## Related Packages

- [@conveniencepro/ctp-core](https://www.npmjs.com/package/@conveniencepro/ctp-core) - Core types and validation
- [@conveniencepro/ctp-runtime](https://www.npmjs.com/package/@conveniencepro/ctp-runtime) - Execution runtime
- [@conveniencepro/ctp-sdk](https://www.npmjs.com/package/@conveniencepro/ctp-sdk) - Embeddable SDK
- [@conveniencepro/ctp-examples](https://www.npmjs.com/package/@conveniencepro/ctp-examples) - Example tools
