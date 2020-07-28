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

import { crc16 } from "../src/crc16.ts";
import {
  assertEquals,
  assert,
} from "https://deno.land/std@0.61.0/testing/asserts.ts";

Deno.test("crc16 - should return [0xC8, 0xB2] given [0x41, 0x4C, 0x42, 0x45, 0x52, 0x54, 0x4F]", () => {
  const buf = new Uint8Array([0x41, 0x4C, 0x42, 0x45, 0x52, 0x54, 0x4F]);
  const crc = crc16.checksum(buf);
  assertEquals(crc, 51378);
});

Deno.test("crc16 - should validate [0xC8, 0xB2] given [0x41, 0x4C, 0x42, 0x45, 0x52, 0x54, 0x4F]", () => {
  const buf = new Uint8Array([0x41, 0x4C, 0x42, 0x45, 0x52, 0x54, 0x4F]);
  assert(crc16.validate(buf, 51378));
});

Deno.test("crc16 - should reject [0xCA, 0xB2] given [0x41, 0x4C, 0x42, 0x45, 0x52, 0x54, 0x4F]", () => {
  const buf = new Uint8Array([0x41, 0x4C, 0x42, 0x45, 0x52, 0x54, 0x4F]);
  assert(!crc16.validate(buf, 12345));
});

function crc16Macro(input: Uint8Array, eck: number, validates: boolean) {
  const ck = crc16.checksum(input);
  assertEquals(eck, ck);
  const ok = crc16.validate(input, eck);
  assert(ok == validates);
}

Deno.test("crc16 - empty string", () => {
  crc16Macro(new TextEncoder().encode(""), 0, true);
});
Deno.test("crc16 - abc", () => {
  crc16Macro(new TextEncoder().encode("abc"), 0x9DD6, true);
});
Deno.test("crc16 - ABC", () => {
  crc16Macro(new TextEncoder().encode("ABC"), 0x3994, true);
});
Deno.test("crc16 - this is a string", () => {
  crc16Macro(new TextEncoder().encode("This is a string"), 0x21E3, true);
});
Deno.test("crc16 - 123456789", () => {
  crc16Macro(new TextEncoder().encode("123456789"), 0x31C3, true);
});
Deno.test("crc16 - 0x7F", () => {
  crc16Macro(new Uint8Array([0x7F]), 0x8F78, true);
});
Deno.test("crc16 - 0x80", () => {
  crc16Macro(new Uint8Array([0x80]), 0x9188, true);
});
Deno.test("crc16 - 0xFF", () => {
  crc16Macro(new Uint8Array([0xFF]), 0x1EF0, true);
});
Deno.test("crc16 - 0x0,0x1,0x7D,0x7E, 0x7F, 0x80, 0xFE, 0xFF", () => {
  crc16Macro(
    new Uint8Array([0x0, 0x1, 0x7D, 0x7E, 0x7F, 0x80, 0xFE, 0xFF]),
    0xE26F,
    true,
  );
});
