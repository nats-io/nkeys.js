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
import { assertThrowsErrorCode } from "./util.ts";

import {
  assertEquals,
} from "https://deno.land/std@0.61.0/testing/asserts.ts";
import { Codec } from "../src/codec.ts";
import { NKeysErrorCode, Prefix } from "../src/nkeys.ts";

Deno.test("codec - should fail to encode non Uint8Array", () => {
  assertThrowsErrorCode(() => {
    //@ts-ignore
    Codec.encode(Prefix.Private, 10);
  }, NKeysErrorCode.SerializationError);
});

Deno.test("codec - should fail to encode with invalid prefix", () => {
  assertThrowsErrorCode(() => {
    const rand = globalThis.crypto.getRandomValues(new Uint8Array(32));
    Codec.encode(13, rand);
  }, NKeysErrorCode.InvalidPrefixByte);
});

Deno.test("codec - should encode and decode", () => {
  const rand = globalThis.crypto.getRandomValues(new Uint8Array(32));
  const enc = Codec.encode(Prefix.Private, rand);
  assertEquals(enc[0], "P".charCodeAt(0));

  const dec = Codec._decode(enc);
  assertEquals(dec[0], Prefix.Private);
  assertEquals(dec.slice(1), rand);
});

Deno.test("codec - should fail to encode seeds that are not 32 bytes", () => {
  assertThrowsErrorCode(() => {
    const rand = globalThis.crypto.getRandomValues(new Uint8Array(64));
    Codec.encodeSeed(Prefix.Account, rand);
  }, NKeysErrorCode.InvalidSeedLen);
});

Deno.test("codec - should encode seed and decode account", () => {
  const rand = globalThis.crypto.getRandomValues(new Uint8Array(32));
  const enc = Codec.encodeSeed(Prefix.Account, rand);
  assertEquals(enc[0], "S".charCodeAt(0));
  assertEquals(enc[1], "A".charCodeAt(0));

  const dec = Codec.decode(Prefix.Seed, enc);
  assertEquals(dec[0], Prefix.Account);
  assertEquals(dec.slice(1), rand);
});

Deno.test("codec - should encode and decode seed", () => {
  const rand = globalThis.crypto.getRandomValues(new Uint8Array(32));
  const enc = Codec.encodeSeed(Prefix.Account, rand);
  assertEquals(enc[0], "S".charCodeAt(0));
  assertEquals(enc[1], "A".charCodeAt(0));

  let seed = Codec.decodeSeed(enc);
  assertEquals(seed.prefix, Prefix.Account);
  assertEquals(seed.buf, rand);
});

Deno.test("codec - should fail to decode non-base32", () => {
  assertThrowsErrorCode(() => {
    Codec.decodeSeed(new TextEncoder().encode("foo!"));
  }, NKeysErrorCode.InvalidEncoding);
});

Deno.test("codec - should fail to short string", () => {
  assertThrowsErrorCode(() => {
    Codec.decodeSeed(new TextEncoder().encode("OK"));
  }, NKeysErrorCode.InvalidEncoding);
});

Deno.test("codec - decode with invalid role should fail", () => {
  const rand = globalThis.crypto.getRandomValues(new Uint8Array(32));
  //@ts-ignore
  const badSeed = Codec._encode(false, "R", rand);
  assertThrowsErrorCode(() => {
    //@ts-ignore
    Codec.decode("Z", badSeed);
  }, NKeysErrorCode.InvalidPrefixByte);
});

Deno.test("codec - encode seed requires buffer", () => {
  //@ts-ignore
  assertThrowsErrorCode(() => {
    //@ts-ignore
    Codec.encodeSeed(false, Prefix.Account, "foo");
  }, NKeysErrorCode.ApiError);
});

Deno.test("codec - decodeSeed with invalid role should fail", () => {
  const rand = globalThis.crypto.getRandomValues(new Uint8Array(32));
  const badRole = 23 << 3; // X
  //@ts-ignore
  const badSeed = Codec._encode(true, badRole, rand);
  assertThrowsErrorCode(() => {
    //@ts-ignore
    Codec.decodeSeed(badSeed);
  }, NKeysErrorCode.InvalidPrefixByte);
});

Deno.test("codec - decode unexpected prefix should fail", () => {
  const rand = globalThis.crypto.getRandomValues(new Uint8Array(32));
  let seed = Codec._encode(false, Prefix.Account, rand);
  assertThrowsErrorCode(() => {
    //@ts-ignore
    Codec.decode(Prefix.User, seed);
  }, NKeysErrorCode.InvalidPrefixByte);
});
