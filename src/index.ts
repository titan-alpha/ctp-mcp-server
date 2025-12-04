#!/usr/bin/env node

/**
 * CTP MCP Server
 *
 * Model Context Protocol server for generating ConveniencePro Tool Protocol tools.
 * Provides AI-powered tool scaffolding and code generation.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { createTool } from './tools/create-tool.js';
import { validateTool } from './tools/validate-tool.js';
import { generateImplementation } from './tools/generate-implementation.js';
import { generateTests } from './tools/generate-tests.js';
import { searchDuplicates } from './tools/search-duplicates.js';

// MCP Server instance
const server = new Server(
  {
    name: '@conveniencepro/ctp-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'ctp_create_tool',
        description: 'Generate a complete CTP tool from a natural language description. Creates tool definition, implementation, and tests.',
        inputSchema: {
          type: 'object',
          properties: {
            description: {
              type: 'string',
              description: 'Natural language description of what the tool should do',
            },
            name: {
              type: 'string',
              description: 'Tool name (optional - will be auto-generated if not provided)',
            },
            category: {
              type: 'string',
              description: 'Tool category (e.g., "converters", "calculators", "generators")',
            },
            executionMode: {
              type: 'string',
              enum: ['client', 'server', 'both'],
              description: 'Where the tool should execute (default: client)',
            },
          },
          required: ['description'],
        },
      },
      {
        name: 'ctp_validate_tool',
        description: 'Validate a tool definition against the CTP specification',
        inputSchema: {
          type: 'object',
          properties: {
            definition: {
              type: 'object',
              description: 'The tool definition to validate',
            },
          },
          required: ['definition'],
        },
      },
      {
        name: 'ctp_generate_implementation',
        description: 'Generate implementation code from a tool definition',
        inputSchema: {
          type: 'object',
          properties: {
            definition: {
              type: 'object',
              description: 'The tool definition',
            },
            executionMode: {
              type: 'string',
              enum: ['client', 'server', 'both'],
              description: 'Execution mode (default: client)',
            },
          },
          required: ['definition'],
        },
      },
      {
        name: 'ctp_generate_tests',
        description: 'Generate test suite for a CTP tool',
        inputSchema: {
          type: 'object',
          properties: {
            definition: {
              type: 'object',
              description: 'The tool definition',
            },
            implementation: {
              type: 'string',
              description: 'The tool implementation code',
            },
          },
          required: ['definition'],
        },
      },
      {
        name: 'ctp_search_duplicates',
        description: 'Search for existing tools with similar functionality',
        inputSchema: {
          type: 'object',
          properties: {
            description: {
              type: 'string',
              description: 'Description of the tool to search for',
            },
            category: {
              type: 'string',
              description: 'Optional category to narrow search',
            },
          },
          required: ['description'],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (!args) {
      throw new Error('Missing arguments');
    }

    switch (name) {
      case 'ctp_create_tool':
        return await createTool(args as never);

      case 'ctp_validate_tool':
        return await validateTool(args as never);

      case 'ctp_generate_implementation':
        return await generateImplementation(args as never);

      case 'ctp_generate_tests':
        return await generateTests(args as never);

      case 'ctp_search_duplicates':
        return await searchDuplicates(args as never);

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: false,
            error: message,
          }, null, 2),
        },
      ],
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('CTP MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
