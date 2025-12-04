/**
 * Simple test to verify tool generation works
 *
 * This is a minimal test to ensure the core functionality is working.
 * In production, use the MCP protocol via Claude Desktop or other MCP clients.
 */

import { createTool } from '../dist/tools/create-tool.js';

async function testToolCreation() {
  console.log('Testing CTP tool generation...\n');

  // Test creating a simple converter tool
  const result = await createTool({
    description: 'Convert hexadecimal color codes to RGB values',
    category: 'converters',
    executionMode: 'client',
  });

  const response = JSON.parse(result.content[0].text);

  if (response.success) {
    console.log('✅ Tool generation successful!\n');
    console.log('Generated tool:');
    console.log(`  ID: ${response.tool.id}`);
    console.log(`  Name: ${response.tool.name}`);
    console.log(`  Category: ${response.tool.category}`);
    console.log(`  Execution Mode: ${response.tool.executionMode}\n`);

    console.log('Generated files:');
    response.files.forEach((file, i) => {
      console.log(`  ${i + 1}. ${file.path}`);
      console.log(`     ${file.description}`);
    });

    console.log('\nNext steps:');
    response.nextSteps.forEach((step, i) => {
      console.log(`  ${step}`);
    });

    console.log('\n✅ All tests passed!');
  } else {
    console.error('❌ Tool generation failed:', response.error);
    process.exit(1);
  }
}

testToolCreation().catch((error) => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});
