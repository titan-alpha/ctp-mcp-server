/**
 * Template rendering engine using Handlebars
 */

import Handlebars from 'handlebars';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { toCamelCase, toPascalCase, toKebabCase } from './string-utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Register Handlebars helpers
Handlebars.registerHelper('json', function (context) {
  return JSON.stringify(context, null, 2);
});

Handlebars.registerHelper('camelCase', function (str: string) {
  return toCamelCase(str);
});

Handlebars.registerHelper('pascalCase', function (str: string) {
  return toPascalCase(str);
});

Handlebars.registerHelper('kebabCase', function (str: string) {
  return toKebabCase(str);
});

/**
 * Load and compile a template
 */
export function loadTemplate(templateName: string): HandlebarsTemplateDelegate {
  const templatePath = join(__dirname, '..', 'templates', `${templateName}.hbs`);
  const templateSource = readFileSync(templatePath, 'utf-8');
  return Handlebars.compile(templateSource);
}

/**
 * Render a template with data
 */
export function renderTemplate(templateName: string, data: Record<string, unknown>): string {
  const template = loadTemplate(templateName);
  return template(data);
}
