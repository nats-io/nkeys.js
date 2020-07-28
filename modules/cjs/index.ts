/**
 * @ignore
 */
//@ts-ignore
const nacl = require("tweetnacl");
/**
 * @ignore
 */
//@ts-ignore
const helper = {
  randomBytes: nacl.randomBytes,
  verify: nacl.sign.detached.verify,
  fromSeed: nacl.sign.keyPair.fromSeed,
  sign: nacl.sign.detached,
};

// This here to support node 10.
if (typeof TextEncoder !== "function") {
  //@ts-ignore
  const TextEncodingPolyfill = require("text-encoding");
  //@ts-ignore
  global.TextEncoder = TextEncodingPolyfill.TextEncoder;
  //@ts-ignore
  global.TextDecoder = TextEncodingPolyfill.TextDecoder;
}

/**
 * @ignore
 */
//@ts-ignore
const { setEd25519Helper } = require("./helper.ts");
setEd25519Helper(helper);

/**
 * @ignore
 */
//@ts-ignore
export * from "./mod.ts";
