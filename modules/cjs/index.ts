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
if (typeof TextEncoder === "undefined") {
  //@ts-ignore
  const util = require("util");
  //@ts-ignore
  global.TextEncoder = util.TextEncoder;
  //@ts-ignore
  global.TextDecoder = util.TextDecoder;
}

if (typeof atob === "undefined") {
  global.atob = (a) => {
    return Buffer.from(a, "base64").toString("binary");
  };
  global.btoa = (b) => {
    return Buffer.from(b, "binary").toString("base64");
  };
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
