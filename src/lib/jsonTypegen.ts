import { run } from 'json_typegen_wasm';

// Generate TypeScript types from a JSON sample string
export function generateTypescriptTypes(json: string, rootTypeName = 'Root') {
  // The third argument is options (empty string for defaults)
  return run(rootTypeName, json, '');
}
