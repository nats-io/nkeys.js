/*
 * Copyright 2024 The NATS Authors
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

import { type KeyPair, NKeysError, NKeysErrorCode } from "./nkeys.ts";
import nacl from "tweetnacl";
import { Codec } from "./codec.ts";
import { Prefix } from "./nkeys.ts";
import { base32 } from "./base32.ts";
import { crc16 } from "./crc16.ts";

export const curveKeyLen = 32;
const curveDecodeLen = 35;
export const curveNonceLen = 24;
// "xkv1" in bytes
const XKeyVersionV1 = [120, 107, 118, 49];

export class CurveKP implements KeyPair {
  seed?: Uint8Array;

  constructor(seed: Uint8Array) {
    this.seed = seed;
  }

  clear(): void {
    if (!this.seed) {
      return;
    }
    this.seed.fill(0);
    this.seed = undefined;
  }

  getPrivateKey(): Uint8Array {
    if (!this.seed) {
      throw new NKeysError(NKeysErrorCode.ClearedPair);
    }
    return Codec.encode(Prefix.Private, this.seed);
  }

  getPublicKey(): string {
    if (!this.seed) {
      throw new NKeysError(NKeysErrorCode.ClearedPair);
    }
    const pub = nacl.scalarMult.base(this.seed);
    const buf = Codec.encode(Prefix.Curve, pub);
    return new TextDecoder().decode(buf);
  }

  getSeed(): Uint8Array {
    if (!this.seed) {
      throw new NKeysError(NKeysErrorCode.ClearedPair);
    }
    return Codec.encodeSeed(Prefix.Curve, this.seed);
  }

  sign(): Uint8Array {
    throw new NKeysError(NKeysErrorCode.InvalidCurveOperation);
  }

  verify(): boolean {
    throw new NKeysError(NKeysErrorCode.InvalidCurveOperation);
  }

  decodePubCurveKey(src: string): Uint8Array {
    try {
      const raw = base32.decode(new TextEncoder().encode(src));
      if (raw.byteLength !== curveDecodeLen) {
        throw new NKeysError(NKeysErrorCode.InvalidCurveKey);
      }
      if (raw[0] !== Prefix.Curve) {
        throw new NKeysError(NKeysErrorCode.InvalidPublicKey);
      }

      const checkOffset = raw.byteLength - 2;
      const dv = new DataView(raw.buffer);
      const checksum = dv.getUint16(checkOffset, true);
      const payload = raw.slice(0, checkOffset);
      if (!crc16.validate(payload, checksum)) {
        throw new NKeysError(NKeysErrorCode.InvalidChecksum);
      }
      // remove the prefix byte
      return payload.slice(1);
    } catch (ex) {
      throw new NKeysError(NKeysErrorCode.InvalidRecipient, { cause: ex });
    }
  }

  seal(message: Uint8Array, recipient: string, nonce?: Uint8Array): Uint8Array {
    if (!this.seed) {
      throw new NKeysError(NKeysErrorCode.ClearedPair);
    }
    if (!nonce) {
      nonce = nacl.randomBytes(curveNonceLen);
    }
    const pub = this.decodePubCurveKey(recipient);

    // prefix a header to the nonce
    const out = new Uint8Array(XKeyVersionV1.length + curveNonceLen);
    out.set(XKeyVersionV1, 0);
    out.set(nonce, XKeyVersionV1.length);

    // this is only the encoded payload
    const encrypted = nacl.box(message, nonce, pub, this.seed);
    // the full message is the header+nonce+encrypted
    const fullMessage = new Uint8Array(out.length + encrypted.length);
    fullMessage.set(out);
    fullMessage.set(encrypted, out.length);
    return fullMessage;
  }

  open(message: Uint8Array, sender: string): Uint8Array | null {
    if (!this.seed) {
      throw new NKeysError(NKeysErrorCode.ClearedPair);
    }
    if (message.length <= curveNonceLen + XKeyVersionV1.length) {
      throw new NKeysError(NKeysErrorCode.InvalidEncrypted);
    }
    for (let i = 0; i < XKeyVersionV1.length; i++) {
      if (message[i] !== XKeyVersionV1[i]) {
        throw new NKeysError(NKeysErrorCode.InvalidEncrypted);
      }
    }

    const pub = this.decodePubCurveKey(sender);

    // strip off the header
    message = message.slice(XKeyVersionV1.length);
    // extract the nonce
    const nonce = message.slice(0, curveNonceLen);
    // stripe the nonce
    message = message.slice(curveNonceLen);

    return nacl.box.open(message, nonce, pub, this.seed);
  }
}
