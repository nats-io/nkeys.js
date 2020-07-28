/*
 * Copyright 2018 The NATS Authors
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
//
import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.61.0/testing/asserts.ts";
import {
  createAccount,
  createOperator,
  createPair,
  createUser,
  fromPublic,
  fromSeed,
  KeyPair,
  NKeysErrorCode,
} from "../modules/esm/mod.ts";
import {
  createCluster,
  createServer,
  Prefix,
  Prefixes,
} from "../src/nkeys.ts";
import { KP } from "../src/kp.ts";
import { Codec } from "../src/codec.ts";
import { assertThrowsErrorCode } from "./util.ts";

function test(kp: KeyPair, kind: string) {
  assert(kp);

  const seed = kp.getSeed();
  assertEquals(seed[0], "S".charCodeAt(0));
  assertEquals(seed[1], kind.charCodeAt(0));

  const publicKey = kp.getPublicKey();
  assertEquals(publicKey[0], kind.charAt(0));

  const data = new TextEncoder().encode("HelloWorld");
  const sig = kp.sign(data);
  assertEquals(sig.length, 64);
  assert(kp.verify(data, sig));

  const sk = fromSeed(seed);
  assert(sk.verify(data, sig));

  const pub = fromPublic(publicKey);
  assertEquals(pub.getPublicKey(), publicKey);
  assert(pub.verify(data, sig));

  assertThrowsErrorCode(() => {
    pub.getPrivateKey();
  }, NKeysErrorCode.PublicKeyOnly);
  assert(pub.verify(data, sig));

  assertThrowsErrorCode(() => {
    pub.getSeed();
  }, NKeysErrorCode.PublicKeyOnly);

  testClear(kp);
  testClear(pub);
}

Deno.test("basics - operator", () => {
  test(createOperator(), "O");
});

Deno.test("basics - account", () => {
  test(createAccount(), "A");
});

Deno.test("basics - user", () => {
  test(createUser(), "U");
});

Deno.test("basics - cluster", () => {
  test(createCluster(), "C");
});

Deno.test("basics - server", () => {
  test(createServer(), "N");
});

Deno.test("basics - should fail with non public prefix", () => {
  assertThrowsErrorCode(() => {
    createPair(Prefix.Private);
  }, NKeysErrorCode.InvalidPrefixByte);
});

Deno.test("basics - should fail getting public key on bad seed", () => {
  assertThrowsErrorCode(() => {
    let kp = new KP(new TextEncoder().encode("SEEDBAD"));
    kp.getPublicKey();
    createPair(Prefix.Private);
  }, NKeysErrorCode.InvalidChecksum);
});

Deno.test("basics - should fail getting private key on bad seed", () => {
  assertThrowsErrorCode(() => {
    let kp = new KP(new TextEncoder().encode("SEEDBAD"));
    kp.getPrivateKey();
    createPair(Prefix.Private);
  }, NKeysErrorCode.InvalidChecksum);
});

Deno.test("basics - should fail signing on bad seed", () => {
  assertThrowsErrorCode(() => {
    let kp = new KP(new TextEncoder().encode("SEEDBAD"));
    kp.sign(new TextEncoder().encode("HelloWorld"));
    createPair(Prefix.Private);
  }, NKeysErrorCode.InvalidChecksum);
});

function badKey(): Uint8Array {
  let a = createAccount();
  let pk = new TextEncoder().encode(a.getPublicKey());
  pk[pk.byteLength - 1] = "0".charCodeAt(0);
  pk[pk.byteLength - 2] = "0".charCodeAt(0);
  return pk;
}

Deno.test("basics - should reject decoding bad checksums", () => {
  assertThrowsErrorCode(() => {
    const bk = badKey();
    Codec._decode(bk);
  }, NKeysErrorCode.InvalidEncoding);
});

Deno.test("basics - should reject decoding expected byte with bad checksum", () => {
  assertThrowsErrorCode(() => {
    const bk = badKey();
    Codec.decode(Prefix.User, bk);
  }, NKeysErrorCode.InvalidEncoding);
});

Deno.test("basics - should reject decoding expected bad prefix", () => {
  assertThrowsErrorCode(() => {
    const bk = badKey();
    Codec.decode(3 << 3, bk);
  }, NKeysErrorCode.InvalidPrefixByte);
});

Deno.test("basics - should reject decoding expected bad checksum", () => {
  assertThrowsErrorCode(() => {
    const bk = badKey();
    Codec.decode(Prefix.Account, bk);
  }, NKeysErrorCode.InvalidEncoding);
});

Deno.test("basics - should reject decoding seed with bad checksum", () => {
  assertThrowsErrorCode(() => {
    const bk = badKey();
    Codec.decodeSeed(bk);
  }, NKeysErrorCode.InvalidEncoding);
});

Deno.test("basics - fromPublicKey should reject bad checksum", () => {
  assertThrowsErrorCode(() => {
    const bk = badKey();
    fromPublic(new TextDecoder().decode(bk));
  }, NKeysErrorCode.InvalidEncoding);
});

Deno.test("basics - should reject decoding seed bad checksum", () => {
  assertThrowsErrorCode(() => {
    const a = createAccount();
    let pk = a.getPublicKey();
    Codec.decodeSeed(new TextEncoder().encode(pk));
  }, NKeysErrorCode.InvalidSeed);
});

function generateBadSeed(): Uint8Array {
  const a = createAccount();
  let seed = a.getSeed();
  seed[1] = "S".charCodeAt(0);
  return seed;
}

Deno.test("basics - should reject decoding bad seed prefix", () => {
  assertThrowsErrorCode(() => {
    const s = generateBadSeed();
    Codec.decodeSeed(s);
  }, NKeysErrorCode.InvalidChecksum);
});

Deno.test("basics - fromSeed should reject decoding bad seed prefix", () => {
  assertThrowsErrorCode(() => {
    const s = generateBadSeed();
    fromSeed(s);
  }, NKeysErrorCode.InvalidChecksum);
});

Deno.test("basics - fromSeed should reject decoding bad public key", () => {
  assertThrowsErrorCode(() => {
    const s = generateBadSeed();
    fromPublic(new TextDecoder().decode(s));
  }, NKeysErrorCode.InvalidChecksum);
});

Deno.test("basics - public key cannot sign", () => {
  assertThrowsErrorCode(() => {
    const a = createAccount();
    const pks = a.getPublicKey();
    const pk = fromPublic(pks);
    const pks2 = pk.getPublicKey();
    assertEquals(pks, pks2);
    pk.sign(new TextEncoder().encode(""));
  }, NKeysErrorCode.CannotSign);
});

Deno.test("basics - from public rejects non-public keys", () => {
  assertThrowsErrorCode(() => {
    const a = createAccount();
    const pks = a.getSeed();
    fromPublic(new TextDecoder().decode(pks));
  }, NKeysErrorCode.InvalidPublicKey);
});

Deno.test("basics - test valid prefixes", () => {
  let valid = ["S", "P", "O", "N", "C", "A", "U"];
  valid.forEach((v: string) => {
    assert(Prefixes.startsWithValidPrefix(v));
  });
  const b32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=";
  b32.split("").forEach((c: string) => {
    const ok = valid.indexOf(c) !== -1;
    if (ok) {
      assert(Prefixes.startsWithValidPrefix(c), `expected ${c} to be ok`);
    } else {
      assert(!Prefixes.startsWithValidPrefix(c), `expected ${c} to fail`);
    }
  });
});

function testClear(kp: KeyPair) {
  kp.clear();

  assertThrowsErrorCode(() => {
    kp.getPublicKey();
  }, NKeysErrorCode.ClearedPair);

  assertThrowsErrorCode(() => {
    kp.getPrivateKey();
  }, NKeysErrorCode.ClearedPair);

  assertThrowsErrorCode(() => {
    kp.getSeed();
  }, NKeysErrorCode.ClearedPair);

  assertThrowsErrorCode(() => {
    const data = new TextEncoder().encode("hello");
    kp.sign(data);
  }, NKeysErrorCode.ClearedPair);

  assertThrowsErrorCode(() => {
    const data = new TextEncoder().encode("hello");
    const sig = kp.sign(data);
    kp.verify(data, sig);
  }, NKeysErrorCode.ClearedPair);
}
