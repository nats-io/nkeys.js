/*
 * Copyright 2018-2020 The NATS Authors
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

import { base32 } from "../src/base32.ts";
import {
  assertEquals,
} from "https://deno.land/std@0.61.0/testing/asserts.ts";

function assertEqualUint8Arrays(a: Uint8Array, b: Uint8Array) {
  assertEquals(a.length, b.length);
  for (let i = 0; i < a.length; i++) {
    assertEquals(a[i], b[i]);
  }
}

function base32Macro(input: string, expected: string) {
  const inbuf = new TextEncoder().encode(input);
  const outbuf = new TextEncoder().encode(expected);
  const enc = base32.encode(inbuf);
  assertEqualUint8Arrays(outbuf, enc);
  const dec = base32.decode(outbuf);
  assertEqualUint8Arrays(inbuf, dec);
}

// Tests copied from go library
// https://tools.ietf.org/html/rfc4648 and wikipedia ported

Deno.test("base32 - empty strings", () => {
  base32Macro("", "");
});

Deno.test("base32 - f", () => {
  base32Macro("f", "MY");
});

Deno.test("base32 - fo", () => {
  base32Macro("fo", "MZXQ");
});
Deno.test("base32 - foo", () => {
  base32Macro("foo", "MZXW6");
});
Deno.test("base32 - foob", () => {
  base32Macro("foob", "MZXW6YQ");
});
Deno.test("base32 - fooba", () => {
  base32Macro("fooba", "MZXW6YTB");
});
Deno.test("base32 - foobar", () => {
  base32Macro("foobar", "MZXW6YTBOI");
});
Deno.test("base32 - sure.", () => {
  base32Macro("sure.", "ON2XEZJO");
});
Deno.test("base32 - sure", () => {
  base32Macro("sure", "ON2XEZI");
});
Deno.test("base32 - sur", () => {
  base32Macro("sur", "ON2XE");
});
Deno.test("base32 - su", () => {
  base32Macro("su", "ON2Q");
});
Deno.test("base32 - leasure.", () => {
  base32Macro("leasure.", "NRSWC43VOJSS4");
});
Deno.test("base32 - easure.", () => {
  base32Macro("easure.", "MVQXG5LSMUXA");
});
Deno.test("base32 - asure.", () => {
  base32Macro("asure.", "MFZXK4TFFY");
});
