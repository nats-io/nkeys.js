import npmConfig from "../package.json" with { type: "json" };
import denoConfig from "../deno.json" with { type: "json" };

if (npmConfig.version !== denoConfig.version) {
  throw new Error(
    `unmatched versions - npm: ${npmConfig.version}  jsr: ${denoConfig.version}`,
  );
}

const v = npmConfig.version;

Deno.writeTextFileSync(
  "./src/version.ts",
  `
// this file is autogenerated - do not edit
export const version = "${v}";`,
  { create: true },
);
