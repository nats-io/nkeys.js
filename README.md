# nkeys.js

A public-key signature system based on Ed25519 for the
[NATS ecosystem system](https://nats.io) for JavaScript.

[![License](https://img.shields.io/badge/Licence-Apache%202.0-blue.svg)](./LICENSE)
![node](https://github.com/nats-io/nkeys.js/actions/workflows/node.yml/badge.svg)
![deno](https://github.com/nats-io/nkeys.js/actions/workflows/deno.yml/badge.svg)
[![coverage](https://coveralls.io/repos/github/nats-io/nkeys.js/badge.svg?branch=main)](https://coveralls.io/github/nats-io/nkeys.js?branch=main)
[![JSDoc](https://img.shields.io/badge/JSDoc-reference-blue)](https://nats-io.github.io/nkeys.js/index.html)

[![JSR](https://jsr.io/badges/@nats-io/nkeys)](https://jsr.io/@nats-io/nkeys)
[![JSR](https://jsr.io/badges/@nats-io/nkeys/score)](https://jsr.io/@nats-io/nkeys)

[![npm](https://img.shields.io/npm/v/%40nats-io%2Fnkeys)](https://www.npmjs.com/package/@nats-io/nkeys)
[![npm](https://img.shields.io/npm/dt/%40nats-io%2Fnkeys)](https://www.npmjs.com/package/@nats-io/nkeys)
[![npm](https://img.shields.io/npm/dm/%40nats-io%2Fnkeys)](https://www.npmjs.com/package/@nats-io/nkeys)

[![npm](https://img.shields.io/npm/v/nkeys.js.svg)](https://www.npmjs.com/package/nkeys.js)
[![npm](https://img.shields.io/npm/dt/nkeys.js.svg)](https://www.npmjs.com/package/nkeys.js)
[![npm](https://img.shields.io/npm/dm/nkeys.js.svg)](https://www.npmjs.com/package/nkeys.js)

> [!IMPORTANT]
>
> With the 2.0.0 release, the library changed module name from `nkeys.js` to
> `@nats-io/nkeys`.

The nkeys.js library works in Deno, Node.js, Bun, and the browser!

## Installation

The nkeys library is available on both
[npm](https://www.npmjs.com/package/nkeys.js) and
[jsr.io](https://jsr.io/@nats-io/nkeys)

```bash
deno add jsr:@nats-io/nkeys
```

```javascript
import { createUser, fromPublic, fromSeed } from "@nats-io/nkeys";
```

In Node:

```bash
npm install @nats-io/nkeys
```

```javascript
const { createUser, fromSeed, fromPublic } = require("nkeys.js");
// or
import { createUser, fromPublic, fromSeed } from "nkeys.js";
```

## Basic Usage

The [documentation is here](https://nats-io.github.io/nkeys.js/)

```typescript
// create an user nkey KeyPair (can also create accounts, operators, etc).
const user = createUser();

// A seed is the public and private keys together.
const seed: Uint8Array = user.getSeed();

// Seeds are encoded into Uint8Array, and start with
// the letter 'S'. Seeds need to be kept safe and never shared
console.log(`seeds start with s: ${seed[0] === "S".charCodeAt(0)}`);

// A seed's second letter encodes it's type:
// `U` for user,
// `A` for account,
// `O` for operators
console.log(`nkey is for a user? ${seed[1] === "U".charCodeAt(0)}`);

// To view a seed, simply decode it:
console.log(new TextDecoder().decode(seed));

// you can recreate the keypair with its seed:
const priv = fromSeed(seed);

// Using the KeyPair, you can cryptographically sign content:
const data = new TextEncoder().encode("Hello World!");
const sig = priv.sign(data);

// and verify a signature:
const valid = user.verify(data, sig);
if (!valid) {
  console.error("couldn't validate the data/signature against my key");
} else {
  console.error("data was verified by my key");
}

// others can validate using your public key:
const publicKey = user.getPublicKey();
const pub = fromPublic(publicKey);
if (!pub.verify(data, sig)) {
  console.error(`couldn't validate the data/signature with ${publicKey}`);
} else {
  console.info(`data was verified by ${publicKey}`);
}

// when extracting with seeds or private keys
// you should clear them when done:
seed.fill(0);

// you should also clear the keypairs:
user.clear();
priv.clear();
```

## Curve Keys

Curve keys seal/open (encrypt/decrypt) payloads only, but look like regular
nkeys. The `getSeed()`, `getPrivate()`, `getPublic()`, `clear()` work have the
same functionality as the normal nkeys. The APIs to `sign()`, `verify()` however
will throw an error (regular nkeys will throw an error for `seal()` and
`open()`)

```javascript
// let's create 3 different curve keys, as with other nkeys
// private/seeds should be kept private, and public keys can be
// shared.
const a = createCurve();
const b = createCurve();
const c = createCurve();

// encryption api works on bytes - so lets make a message
const payload = new TextEncoder().encode("hello!");

// let's encrypt the message so that "b" can read it
const encrypted = a.seal(payload, b.getPublicKey());

// "b" can then open the message, we need to know the sender
let decrypted = b.open(encrypted, a.getPublicKey());
if (decrypted === null) {
  throw new Error("failed to decrypt");
}
console.log(new TextDecoder().decode(decrypted));

// wrong recipient - will return `null`
decrypted = c.open(encrypted, a.getPublicKey());
if (decrypted !== null) {
  throw new Error("this should have been null");
}

// wrong sender - will return `null`
decrypted = b.open(encrypted, c.getPublicKey());
if (decrypted !== null) {
  throw new Error("shouldn't have decrypted");
}

// seal can take an user-specified nonce - the nonce will make
// it so that 2 equal payloads encrypt to different values
// when not specified seal uses a random nonce (a good thing).
// for this example, we'll use the same nonce
const nonce = new Uint8Array(24);

// same payload, but with the specified nonce, different encrypted results
// comparing the outputs you wouldn't be able to guess they are the
// same exact unencrytped payload.
const encrypted2 = a.seal(payload, b.getPublicKey(), nonce);
console.log(encrypted, encrypted2);

console.log("---------");

// now re-encrypt with the same nonce, encrypted2 and encrypted3 are equal
// which would provide a hint that the unencrypted payloads are
// the same (not a good thing).
const encrypted3 = a.seal(payload, b.getPublicKey(), nonce);
console.log(encrypted2, encrypted3);
```

## Supported Node Versions

Our support policy for Nodejs versions follows
[Nodejs release support](https://github.com/nodejs/Release). We will support and
build nkeys.js on even-numbered Nodejs versions that are current or in LTS.

Note that this library no longer shims `atob`, `btoa`, `TextEncoder`, nor
`TextDecoder`. These should be available in fairly old node builds going as far
back as Node 16. If you need to run on an older environment, use one of the
older versions on npm.

## License

Unless otherwise noted, the NATS source files are distributed under the Apache
Version 2.0 license found in the LICENSE file.
