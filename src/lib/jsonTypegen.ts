
// Generate TypeScript types from a JSON sample string, with output_mode option
export async function generateTypesFromJson(json: string, options?: { typealias?: boolean }) {
  const { run } = await import("json_typegen_wasm");
  return run(
    "Root",
    json,
    JSON.stringify({
      output_mode: options?.typealias ? "typescript/typealias" : "typescript"
    })
  );
}
