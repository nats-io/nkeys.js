// this scripts parses the version of tweetnacl referenced
// and uses the https://esm.sh service to convert it to an
// esm module which we download from fastly and cache locally

import data from "../package.json" assert { type: "json" };

async function get(u: string): Promise<string> {
  const r = await fetch(u);
  if (!r.ok) {
    return Promise.reject(new Error(`error fetching ${u}`));
  }
  return await r.text();
}

const version = data.dependencies["tweetnacl"];
const url = `https://esm.sh/tweetnacl@${version}?target=es2022`;
const code = await get(url);
await Deno.writeTextFile(`${Deno.cwd()}/modules/esm/tweetnacl.js`, code, {create: true});



