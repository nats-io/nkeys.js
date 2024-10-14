// this scripts parses the version of tweetnacl library
// copies some of the source files from the library
// while attribution of its origin, shims if necessary,
// and reworking it to allow running it in different
// runtimes
import data from "../package.json" with { type: "json" };
const version = data.dependencies["tweetnacl"];

async function copyFromModulesDir(
  from: string,
  preamble = "",
  tail = "",
): Promise<void> {
  const head = `// this source from node_modules/tweetnacl@${version}/${from}\n
// deno-lint-ignore-file
// deno-fmt-ignore-file

`;

  let src = await Deno.readTextFile(
    `${Deno.cwd()}/node_modules/tweetnacl/${from}`,
  );

  src = src.replaceAll("self", "globalThis");
  src = src.replaceAll("require('crypto')", "require('node:crypto')");

  await Deno.writeTextFile(
    `${Deno.cwd()}/modules/esm/${from}`,
    head + preamble + src + tail,
    {
      create: true,
    },
  );
}

await copyFromModulesDir(
  "nacl.js",
  "",
  `
//added by nkeys.js export it - this line is added by bin/tweetnacl-esm.ts
export const nacl = typeof module !== 'undefined' && module.exports ? module.exports : globalThis.nacl;
`,
);
await copyFromModulesDir("nacl.d.ts");
