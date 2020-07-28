// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

// This is a specialised implementation of a System module loader.

"use strict";

// @ts-nocheck
/* eslint-disable */
let System, __instantiate;
(() => {
  const r = new Map();

  System = {
    register(id, d, f) {
      r.set(id, { d, f, exp: {} });
    },
  };
  async function dI(mid, src) {
    let id = mid.replace(/\.\w+$/i, "");
    if (id.includes("./")) {
      const [o, ...ia] = id.split("/").reverse(),
        [, ...sa] = src.split("/").reverse(),
        oa = [o];
      let s = 0,
        i;
      while ((i = ia.shift())) {
        if (i === "..") s++;
        else if (i === ".") break;
        else oa.push(i);
      }
      if (s < sa.length) oa.push(...sa.slice(s));
      id = oa.reverse().join("/");
    }
    return r.has(id) ? gExpA(id) : import(mid);
  }

  function gC(id, main) {
    return {
      id,
      import: (m) => dI(m, id),
      meta: { url: id, main },
    };
  }

  function gE(exp) {
    return (id, v) => {
      v = typeof id === "string" ? { [id]: v } : id;
      for (const [id, value] of Object.entries(v)) {
        Object.defineProperty(exp, id, {
          value,
          writable: true,
          enumerable: true,
        });
      }
    };
  }

  function rF(main) {
    for (const [id, m] of r.entries()) {
      const { f, exp } = m;
      const { execute: e, setters: s } = f(gE(exp), gC(id, id === main));
      delete m.f;
      m.e = e;
      m.s = s;
    }
  }

  async function gExpA(id) {
    if (!r.has(id)) return;
    const m = r.get(id);
    if (m.s) {
      const { d, e, s } = m;
      delete m.s;
      delete m.e;
      for (let i = 0; i < s.length; i++) s[i](await gExpA(d[i]));
      const r = e();
      if (r) await r;
    }
    return m.exp;
  }

  function gExp(id) {
    if (!r.has(id)) return;
    const m = r.get(id);
    if (m.s) {
      const { d, e, s } = m;
      delete m.s;
      delete m.e;
      for (let i = 0; i < s.length; i++) s[i](gExp(d[i]));
      e();
    }
    return m.exp;
  }
  __instantiate = (m, a) => {
    System = __instantiate = undefined;
    rF(m);
    return a ? gExpA(m) : gExp(m);
  };
})();

System.register("file:///Users/synadia/Dropbox/code/src/github.com/aricart/nkeys.js/src/helper", [], function (exports_1, context_1) {
    "use strict";
    var helper;
    var __moduleName = context_1 && context_1.id;
    function setEd25519Helper(lib) {
        helper = lib;
    }
    exports_1("setEd25519Helper", setEd25519Helper);
    function getEd25519Helper() {
        return helper;
    }
    exports_1("getEd25519Helper", getEd25519Helper);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("https://deno.land/x/tweetnacl_deno/src/array", [], function (exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    function ByteArray(n) {
        return new Uint8Array(n);
    }
    exports_2("ByteArray", ByteArray);
    function HalfArray(n) {
        return new Uint16Array(n);
    }
    exports_2("HalfArray", HalfArray);
    function WordArray(n) {
        return new Uint32Array(n);
    }
    exports_2("WordArray", WordArray);
    function IntArray(n) {
        return new Int32Array(n);
    }
    exports_2("IntArray", IntArray);
    function NumArray(n) {
        return new Float64Array(n);
    }
    exports_2("NumArray", NumArray);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("https://deno.land/x/tweetnacl_deno/src/validate", [], function (exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    function validateBase64(s) {
        if (!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(s)) {
            throw new TypeError('invalid base64 string');
        }
    }
    exports_3("validateBase64", validateBase64);
    function validateHex(s) {
        if (!/^(?:[A-Fa-f0-9]{2})+$/.test(s)) {
            throw new TypeError('invalid hex string');
        }
    }
    exports_3("validateHex", validateHex);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("https://raw.githubusercontent.com/chiefbiiko/base64/master/base", [], function (exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    function getLengths(b64) {
        const len = b64.length;
        if (len % 4 > 0) {
            throw new TypeError("Invalid string. Length must be a multiple of 4");
        }
        let validLen = b64.indexOf("=");
        if (validLen === -1) {
            validLen = len;
        }
        const placeHoldersLen = validLen === len ? 0 : 4 - (validLen % 4);
        return [validLen, placeHoldersLen];
    }
    function init(lookup, revLookup) {
        function _byteLength(validLen, placeHoldersLen) {
            return ((validLen + placeHoldersLen) * 3) / 4 - placeHoldersLen;
        }
        function tripletToBase64(num) {
            return (lookup[(num >> 18) & 0x3f] +
                lookup[(num >> 12) & 0x3f] +
                lookup[(num >> 6) & 0x3f] +
                lookup[num & 0x3f]);
        }
        function encodeChunk(buf, start, end) {
            const out = new Array((end - start) / 3);
            for (let i = start, curTriplet = 0; i < end; i += 3) {
                out[curTriplet++] = tripletToBase64((buf[i] << 16) + (buf[i + 1] << 8) + buf[i + 2]);
            }
            return out.join("");
        }
        return {
            byteLength(b64) {
                return _byteLength.apply(null, getLengths(b64));
            },
            toUint8Array(b64) {
                const [validLen, placeHoldersLen] = getLengths(b64);
                const buf = new Uint8Array(_byteLength(validLen, placeHoldersLen));
                const len = placeHoldersLen ? validLen - 4 : validLen;
                let tmp;
                let curByte = 0;
                let i;
                for (i = 0; i < len; i += 4) {
                    tmp =
                        (revLookup[b64.charCodeAt(i)] << 18) |
                            (revLookup[b64.charCodeAt(i + 1)] << 12) |
                            (revLookup[b64.charCodeAt(i + 2)] << 6) |
                            revLookup[b64.charCodeAt(i + 3)];
                    buf[curByte++] = (tmp >> 16) & 0xff;
                    buf[curByte++] = (tmp >> 8) & 0xff;
                    buf[curByte++] = tmp & 0xff;
                }
                if (placeHoldersLen === 2) {
                    tmp =
                        (revLookup[b64.charCodeAt(i)] << 2) |
                            (revLookup[b64.charCodeAt(i + 1)] >> 4);
                    buf[curByte++] = tmp & 0xff;
                }
                else if (placeHoldersLen === 1) {
                    tmp =
                        (revLookup[b64.charCodeAt(i)] << 10) |
                            (revLookup[b64.charCodeAt(i + 1)] << 4) |
                            (revLookup[b64.charCodeAt(i + 2)] >> 2);
                    buf[curByte++] = (tmp >> 8) & 0xff;
                    buf[curByte++] = tmp & 0xff;
                }
                return buf;
            },
            fromUint8Array(buf) {
                const maxChunkLength = 16383;
                const len = buf.length;
                const extraBytes = len % 3;
                const len2 = len - extraBytes;
                const parts = new Array(Math.ceil(len2 / maxChunkLength) + (extraBytes ? 1 : 0));
                let curChunk = 0;
                let chunkEnd;
                for (let i = 0; i < len2; i += maxChunkLength) {
                    chunkEnd = i + maxChunkLength;
                    parts[curChunk++] = encodeChunk(buf, i, chunkEnd > len2 ? len2 : chunkEnd);
                }
                let tmp;
                if (extraBytes === 1) {
                    tmp = buf[len2];
                    parts[curChunk] = lookup[tmp >> 2] + lookup[(tmp << 4) & 0x3f] + "==";
                }
                else if (extraBytes === 2) {
                    tmp = (buf[len2] << 8) | (buf[len2 + 1] & 0xff);
                    parts[curChunk] =
                        lookup[tmp >> 10] +
                            lookup[(tmp >> 4) & 0x3f] +
                            lookup[(tmp << 2) & 0x3f] +
                            "=";
                }
                return parts.join("");
            }
        };
    }
    exports_4("init", init);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("https://raw.githubusercontent.com/chiefbiiko/base64/master/mod", ["https://raw.githubusercontent.com/chiefbiiko/base64/master/base"], function (exports_5, context_5) {
    "use strict";
    var base_ts_1, lookup, revLookup, code, mod, byteLength, toUint8Array, fromUint8Array;
    var __moduleName = context_5 && context_5.id;
    return {
        setters: [
            function (base_ts_1_1) {
                base_ts_1 = base_ts_1_1;
            }
        ],
        execute: function () {
            lookup = [];
            revLookup = [];
            code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            for (let i = 0, l = code.length; i < l; ++i) {
                lookup[i] = code[i];
                revLookup[code.charCodeAt(i)] = i;
            }
            revLookup["-".charCodeAt(0)] = 62;
            revLookup["_".charCodeAt(0)] = 63;
            mod = base_ts_1.init(lookup, revLookup);
            exports_5("byteLength", byteLength = mod.byteLength);
            exports_5("toUint8Array", toUint8Array = mod.toUint8Array);
            exports_5("fromUint8Array", fromUint8Array = mod.fromUint8Array);
        }
    };
});
System.register("https://deno.land/std@0.52.0/encoding/hex", [], function (exports_6, context_6) {
    "use strict";
    var hextable;
    var __moduleName = context_6 && context_6.id;
    function errInvalidByte(byte) {
        return new Error("encoding/hex: invalid byte: " +
            new TextDecoder().decode(new Uint8Array([byte])));
    }
    exports_6("errInvalidByte", errInvalidByte);
    function errLength() {
        return new Error("encoding/hex: odd length hex string");
    }
    exports_6("errLength", errLength);
    function fromHexChar(byte) {
        switch (true) {
            case 48 <= byte && byte <= 57:
                return [byte - 48, true];
            case 97 <= byte && byte <= 102:
                return [byte - 97 + 10, true];
            case 65 <= byte && byte <= 70:
                return [byte - 65 + 10, true];
        }
        return [0, false];
    }
    function encodedLen(n) {
        return n * 2;
    }
    exports_6("encodedLen", encodedLen);
    function encode(dst, src) {
        const srcLength = encodedLen(src.length);
        if (dst.length !== srcLength) {
            throw new Error("Out of index.");
        }
        for (let i = 0; i < src.length; i++) {
            const v = src[i];
            dst[i * 2] = hextable[v >> 4];
            dst[i * 2 + 1] = hextable[v & 0x0f];
        }
        return srcLength;
    }
    exports_6("encode", encode);
    function encodeToString(src) {
        const dest = new Uint8Array(encodedLen(src.length));
        encode(dest, src);
        return new TextDecoder().decode(dest);
    }
    exports_6("encodeToString", encodeToString);
    function decode(dst, src) {
        let i = 0;
        for (; i < Math.floor(src.length / 2); i++) {
            const [a, aOK] = fromHexChar(src[i * 2]);
            if (!aOK) {
                return [i, errInvalidByte(src[i * 2])];
            }
            const [b, bOK] = fromHexChar(src[i * 2 + 1]);
            if (!bOK) {
                return [i, errInvalidByte(src[i * 2 + 1])];
            }
            dst[i] = (a << 4) | b;
        }
        if (src.length % 2 == 1) {
            const [, ok] = fromHexChar(src[i * 2]);
            if (!ok) {
                return [i, errInvalidByte(src[i * 2])];
            }
            return [i, errLength()];
        }
        return [i, undefined];
    }
    exports_6("decode", decode);
    function decodedLen(x) {
        return Math.floor(x / 2);
    }
    exports_6("decodedLen", decodedLen);
    function decodeString(s) {
        const src = new TextEncoder().encode(s);
        const [n, err] = decode(src, src);
        if (err) {
            throw err;
        }
        return src.slice(0, n);
    }
    exports_6("decodeString", decodeString);
    return {
        setters: [],
        execute: function () {
            hextable = new TextEncoder().encode("0123456789abcdef");
        }
    };
});
System.register("https://deno.land/x/tweetnacl_deno/src/server/convert", ["https://deno.land/x/tweetnacl_deno/src/validate", "https://raw.githubusercontent.com/chiefbiiko/base64/master/mod", "https://deno.land/std@0.52.0/encoding/hex"], function (exports_7, context_7) {
    "use strict";
    var validate_ts_1, base64, hex_ts_1, encoder, decoder;
    var __moduleName = context_7 && context_7.id;
    function encodeUTF8(a) {
        return decoder.decode(a);
    }
    exports_7("encodeUTF8", encodeUTF8);
    function decodeUTF8(s) {
        return encoder.encode(s);
    }
    exports_7("decodeUTF8", decodeUTF8);
    function encodeBase64(a) {
        return base64.fromUint8Array(a);
    }
    exports_7("encodeBase64", encodeBase64);
    function decodeBase64(s) {
        validate_ts_1.validateBase64(s);
        return base64.toUint8Array(s);
    }
    exports_7("decodeBase64", decodeBase64);
    function encodeHex(a) {
        return hex_ts_1.encodeToString(a);
    }
    exports_7("encodeHex", encodeHex);
    function decodeHex(s) {
        validate_ts_1.validateHex(s);
        return hex_ts_1.decodeString(s);
    }
    exports_7("decodeHex", decodeHex);
    return {
        setters: [
            function (validate_ts_1_1) {
                validate_ts_1 = validate_ts_1_1;
            },
            function (base64_1) {
                base64 = base64_1;
            },
            function (hex_ts_1_1) {
                hex_ts_1 = hex_ts_1_1;
            }
        ],
        execute: function () {
            encoder = new TextEncoder();
            decoder = new TextDecoder();
        }
    };
});
System.register("https://deno.land/x/tweetnacl_deno/src/convert", ["https://deno.land/x/tweetnacl_deno/src/server/convert"], function (exports_8, context_8) {
    "use strict";
    var __moduleName = context_8 && context_8.id;
    function exportStar_1(m) {
        var exports = {};
        for (var n in m) {
            if (n !== "default") exports[n] = m[n];
        }
        exports_8(exports);
    }
    return {
        setters: [
            function (convert_ts_1_1) {
                exportStar_1(convert_ts_1_1);
            }
        ],
        execute: function () {
        }
    };
});
System.register("https://deno.land/x/tweetnacl_deno/src/salsa20", ["https://deno.land/x/tweetnacl_deno/src/array"], function (exports_9, context_9) {
    "use strict";
    var array_ts_1, _sigma;
    var __moduleName = context_9 && context_9.id;
    function _salsa20(o, p, k, c) {
        const j0 = c[0] & 0xff | (c[1] & 0xff) << 8 | (c[2] & 0xff) << 16 | (c[3] & 0xff) << 24, j1 = k[0] & 0xff | (k[1] & 0xff) << 8 | (k[2] & 0xff) << 16 | (k[3] & 0xff) << 24, j2 = k[4] & 0xff | (k[5] & 0xff) << 8 | (k[6] & 0xff) << 16 | (k[7] & 0xff) << 24, j3 = k[8] & 0xff | (k[9] & 0xff) << 8 | (k[10] & 0xff) << 16 | (k[11] & 0xff) << 24, j4 = k[12] & 0xff | (k[13] & 0xff) << 8 | (k[14] & 0xff) << 16 | (k[15] & 0xff) << 24, j5 = c[4] & 0xff | (c[5] & 0xff) << 8 | (c[6] & 0xff) << 16 | (c[7] & 0xff) << 24, j6 = p[0] & 0xff | (p[1] & 0xff) << 8 | (p[2] & 0xff) << 16 | (p[3] & 0xff) << 24, j7 = p[4] & 0xff | (p[5] & 0xff) << 8 | (p[6] & 0xff) << 16 | (p[7] & 0xff) << 24, j8 = p[8] & 0xff | (p[9] & 0xff) << 8 | (p[10] & 0xff) << 16 | (p[11] & 0xff) << 24, j9 = p[12] & 0xff | (p[13] & 0xff) << 8 | (p[14] & 0xff) << 16 | (p[15] & 0xff) << 24, j10 = c[8] & 0xff | (c[9] & 0xff) << 8 | (c[10] & 0xff) << 16 | (c[11] & 0xff) << 24, j11 = k[16] & 0xff | (k[17] & 0xff) << 8 | (k[18] & 0xff) << 16 | (k[19] & 0xff) << 24, j12 = k[20] & 0xff | (k[21] & 0xff) << 8 | (k[22] & 0xff) << 16 | (k[23] & 0xff) << 24, j13 = k[24] & 0xff | (k[25] & 0xff) << 8 | (k[26] & 0xff) << 16 | (k[27] & 0xff) << 24, j14 = k[28] & 0xff | (k[29] & 0xff) << 8 | (k[30] & 0xff) << 16 | (k[31] & 0xff) << 24, j15 = c[12] & 0xff | (c[13] & 0xff) << 8 | (c[14] & 0xff) << 16 | (c[15] & 0xff) << 24;
        let x0 = j0, x1 = j1, x2 = j2, x3 = j3, x4 = j4, x5 = j5, x6 = j6, x7 = j7, x8 = j8, x9 = j9, x10 = j10, x11 = j11, x12 = j12, x13 = j13, x14 = j14, x15 = j15, u;
        for (let i = 0; i < 20; i += 2) {
            u = x0 + x12 | 0;
            x4 ^= u << 7 | u >>> (32 - 7);
            u = x4 + x0 | 0;
            x8 ^= u << 9 | u >>> (32 - 9);
            u = x8 + x4 | 0;
            x12 ^= u << 13 | u >>> (32 - 13);
            u = x12 + x8 | 0;
            x0 ^= u << 18 | u >>> (32 - 18);
            u = x5 + x1 | 0;
            x9 ^= u << 7 | u >>> (32 - 7);
            u = x9 + x5 | 0;
            x13 ^= u << 9 | u >>> (32 - 9);
            u = x13 + x9 | 0;
            x1 ^= u << 13 | u >>> (32 - 13);
            u = x1 + x13 | 0;
            x5 ^= u << 18 | u >>> (32 - 18);
            u = x10 + x6 | 0;
            x14 ^= u << 7 | u >>> (32 - 7);
            u = x14 + x10 | 0;
            x2 ^= u << 9 | u >>> (32 - 9);
            u = x2 + x14 | 0;
            x6 ^= u << 13 | u >>> (32 - 13);
            u = x6 + x2 | 0;
            x10 ^= u << 18 | u >>> (32 - 18);
            u = x15 + x11 | 0;
            x3 ^= u << 7 | u >>> (32 - 7);
            u = x3 + x15 | 0;
            x7 ^= u << 9 | u >>> (32 - 9);
            u = x7 + x3 | 0;
            x11 ^= u << 13 | u >>> (32 - 13);
            u = x11 + x7 | 0;
            x15 ^= u << 18 | u >>> (32 - 18);
            u = x0 + x3 | 0;
            x1 ^= u << 7 | u >>> (32 - 7);
            u = x1 + x0 | 0;
            x2 ^= u << 9 | u >>> (32 - 9);
            u = x2 + x1 | 0;
            x3 ^= u << 13 | u >>> (32 - 13);
            u = x3 + x2 | 0;
            x0 ^= u << 18 | u >>> (32 - 18);
            u = x5 + x4 | 0;
            x6 ^= u << 7 | u >>> (32 - 7);
            u = x6 + x5 | 0;
            x7 ^= u << 9 | u >>> (32 - 9);
            u = x7 + x6 | 0;
            x4 ^= u << 13 | u >>> (32 - 13);
            u = x4 + x7 | 0;
            x5 ^= u << 18 | u >>> (32 - 18);
            u = x10 + x9 | 0;
            x11 ^= u << 7 | u >>> (32 - 7);
            u = x11 + x10 | 0;
            x8 ^= u << 9 | u >>> (32 - 9);
            u = x8 + x11 | 0;
            x9 ^= u << 13 | u >>> (32 - 13);
            u = x9 + x8 | 0;
            x10 ^= u << 18 | u >>> (32 - 18);
            u = x15 + x14 | 0;
            x12 ^= u << 7 | u >>> (32 - 7);
            u = x12 + x15 | 0;
            x13 ^= u << 9 | u >>> (32 - 9);
            u = x13 + x12 | 0;
            x14 ^= u << 13 | u >>> (32 - 13);
            u = x14 + x13 | 0;
            x15 ^= u << 18 | u >>> (32 - 18);
        }
        x0 = x0 + j0 | 0;
        x1 = x1 + j1 | 0;
        x2 = x2 + j2 | 0;
        x3 = x3 + j3 | 0;
        x4 = x4 + j4 | 0;
        x5 = x5 + j5 | 0;
        x6 = x6 + j6 | 0;
        x7 = x7 + j7 | 0;
        x8 = x8 + j8 | 0;
        x9 = x9 + j9 | 0;
        x10 = x10 + j10 | 0;
        x11 = x11 + j11 | 0;
        x12 = x12 + j12 | 0;
        x13 = x13 + j13 | 0;
        x14 = x14 + j14 | 0;
        x15 = x15 + j15 | 0;
        o[0] = x0 >>> 0 & 0xff;
        o[1] = x0 >>> 8 & 0xff;
        o[2] = x0 >>> 16 & 0xff;
        o[3] = x0 >>> 24 & 0xff;
        o[4] = x1 >>> 0 & 0xff;
        o[5] = x1 >>> 8 & 0xff;
        o[6] = x1 >>> 16 & 0xff;
        o[7] = x1 >>> 24 & 0xff;
        o[8] = x2 >>> 0 & 0xff;
        o[9] = x2 >>> 8 & 0xff;
        o[10] = x2 >>> 16 & 0xff;
        o[11] = x2 >>> 24 & 0xff;
        o[12] = x3 >>> 0 & 0xff;
        o[13] = x3 >>> 8 & 0xff;
        o[14] = x3 >>> 16 & 0xff;
        o[15] = x3 >>> 24 & 0xff;
        o[16] = x4 >>> 0 & 0xff;
        o[17] = x4 >>> 8 & 0xff;
        o[18] = x4 >>> 16 & 0xff;
        o[19] = x4 >>> 24 & 0xff;
        o[20] = x5 >>> 0 & 0xff;
        o[21] = x5 >>> 8 & 0xff;
        o[22] = x5 >>> 16 & 0xff;
        o[23] = x5 >>> 24 & 0xff;
        o[24] = x6 >>> 0 & 0xff;
        o[25] = x6 >>> 8 & 0xff;
        o[26] = x6 >>> 16 & 0xff;
        o[27] = x6 >>> 24 & 0xff;
        o[28] = x7 >>> 0 & 0xff;
        o[29] = x7 >>> 8 & 0xff;
        o[30] = x7 >>> 16 & 0xff;
        o[31] = x7 >>> 24 & 0xff;
        o[32] = x8 >>> 0 & 0xff;
        o[33] = x8 >>> 8 & 0xff;
        o[34] = x8 >>> 16 & 0xff;
        o[35] = x8 >>> 24 & 0xff;
        o[36] = x9 >>> 0 & 0xff;
        o[37] = x9 >>> 8 & 0xff;
        o[38] = x9 >>> 16 & 0xff;
        o[39] = x9 >>> 24 & 0xff;
        o[40] = x10 >>> 0 & 0xff;
        o[41] = x10 >>> 8 & 0xff;
        o[42] = x10 >>> 16 & 0xff;
        o[43] = x10 >>> 24 & 0xff;
        o[44] = x11 >>> 0 & 0xff;
        o[45] = x11 >>> 8 & 0xff;
        o[46] = x11 >>> 16 & 0xff;
        o[47] = x11 >>> 24 & 0xff;
        o[48] = x12 >>> 0 & 0xff;
        o[49] = x12 >>> 8 & 0xff;
        o[50] = x12 >>> 16 & 0xff;
        o[51] = x12 >>> 24 & 0xff;
        o[52] = x13 >>> 0 & 0xff;
        o[53] = x13 >>> 8 & 0xff;
        o[54] = x13 >>> 16 & 0xff;
        o[55] = x13 >>> 24 & 0xff;
        o[56] = x14 >>> 0 & 0xff;
        o[57] = x14 >>> 8 & 0xff;
        o[58] = x14 >>> 16 & 0xff;
        o[59] = x14 >>> 24 & 0xff;
        o[60] = x15 >>> 0 & 0xff;
        o[61] = x15 >>> 8 & 0xff;
        o[62] = x15 >>> 16 & 0xff;
        o[63] = x15 >>> 24 & 0xff;
    }
    exports_9("_salsa20", _salsa20);
    function _hsalsa20(o, p, k, c) {
        const j0 = c[0] & 0xff | (c[1] & 0xff) << 8 | (c[2] & 0xff) << 16 | (c[3] & 0xff) << 24, j1 = k[0] & 0xff | (k[1] & 0xff) << 8 | (k[2] & 0xff) << 16 | (k[3] & 0xff) << 24, j2 = k[4] & 0xff | (k[5] & 0xff) << 8 | (k[6] & 0xff) << 16 | (k[7] & 0xff) << 24, j3 = k[8] & 0xff | (k[9] & 0xff) << 8 | (k[10] & 0xff) << 16 | (k[11] & 0xff) << 24, j4 = k[12] & 0xff | (k[13] & 0xff) << 8 | (k[14] & 0xff) << 16 | (k[15] & 0xff) << 24, j5 = c[4] & 0xff | (c[5] & 0xff) << 8 | (c[6] & 0xff) << 16 | (c[7] & 0xff) << 24, j6 = p[0] & 0xff | (p[1] & 0xff) << 8 | (p[2] & 0xff) << 16 | (p[3] & 0xff) << 24, j7 = p[4] & 0xff | (p[5] & 0xff) << 8 | (p[6] & 0xff) << 16 | (p[7] & 0xff) << 24, j8 = p[8] & 0xff | (p[9] & 0xff) << 8 | (p[10] & 0xff) << 16 | (p[11] & 0xff) << 24, j9 = p[12] & 0xff | (p[13] & 0xff) << 8 | (p[14] & 0xff) << 16 | (p[15] & 0xff) << 24, j10 = c[8] & 0xff | (c[9] & 0xff) << 8 | (c[10] & 0xff) << 16 | (c[11] & 0xff) << 24, j11 = k[16] & 0xff | (k[17] & 0xff) << 8 | (k[18] & 0xff) << 16 | (k[19] & 0xff) << 24, j12 = k[20] & 0xff | (k[21] & 0xff) << 8 | (k[22] & 0xff) << 16 | (k[23] & 0xff) << 24, j13 = k[24] & 0xff | (k[25] & 0xff) << 8 | (k[26] & 0xff) << 16 | (k[27] & 0xff) << 24, j14 = k[28] & 0xff | (k[29] & 0xff) << 8 | (k[30] & 0xff) << 16 | (k[31] & 0xff) << 24, j15 = c[12] & 0xff | (c[13] & 0xff) << 8 | (c[14] & 0xff) << 16 | (c[15] & 0xff) << 24;
        let x0 = j0, x1 = j1, x2 = j2, x3 = j3, x4 = j4, x5 = j5, x6 = j6, x7 = j7, x8 = j8, x9 = j9, x10 = j10, x11 = j11, x12 = j12, x13 = j13, x14 = j14, x15 = j15, u;
        for (let i = 0; i < 20; i += 2) {
            u = x0 + x12 | 0;
            x4 ^= u << 7 | u >>> (32 - 7);
            u = x4 + x0 | 0;
            x8 ^= u << 9 | u >>> (32 - 9);
            u = x8 + x4 | 0;
            x12 ^= u << 13 | u >>> (32 - 13);
            u = x12 + x8 | 0;
            x0 ^= u << 18 | u >>> (32 - 18);
            u = x5 + x1 | 0;
            x9 ^= u << 7 | u >>> (32 - 7);
            u = x9 + x5 | 0;
            x13 ^= u << 9 | u >>> (32 - 9);
            u = x13 + x9 | 0;
            x1 ^= u << 13 | u >>> (32 - 13);
            u = x1 + x13 | 0;
            x5 ^= u << 18 | u >>> (32 - 18);
            u = x10 + x6 | 0;
            x14 ^= u << 7 | u >>> (32 - 7);
            u = x14 + x10 | 0;
            x2 ^= u << 9 | u >>> (32 - 9);
            u = x2 + x14 | 0;
            x6 ^= u << 13 | u >>> (32 - 13);
            u = x6 + x2 | 0;
            x10 ^= u << 18 | u >>> (32 - 18);
            u = x15 + x11 | 0;
            x3 ^= u << 7 | u >>> (32 - 7);
            u = x3 + x15 | 0;
            x7 ^= u << 9 | u >>> (32 - 9);
            u = x7 + x3 | 0;
            x11 ^= u << 13 | u >>> (32 - 13);
            u = x11 + x7 | 0;
            x15 ^= u << 18 | u >>> (32 - 18);
            u = x0 + x3 | 0;
            x1 ^= u << 7 | u >>> (32 - 7);
            u = x1 + x0 | 0;
            x2 ^= u << 9 | u >>> (32 - 9);
            u = x2 + x1 | 0;
            x3 ^= u << 13 | u >>> (32 - 13);
            u = x3 + x2 | 0;
            x0 ^= u << 18 | u >>> (32 - 18);
            u = x5 + x4 | 0;
            x6 ^= u << 7 | u >>> (32 - 7);
            u = x6 + x5 | 0;
            x7 ^= u << 9 | u >>> (32 - 9);
            u = x7 + x6 | 0;
            x4 ^= u << 13 | u >>> (32 - 13);
            u = x4 + x7 | 0;
            x5 ^= u << 18 | u >>> (32 - 18);
            u = x10 + x9 | 0;
            x11 ^= u << 7 | u >>> (32 - 7);
            u = x11 + x10 | 0;
            x8 ^= u << 9 | u >>> (32 - 9);
            u = x8 + x11 | 0;
            x9 ^= u << 13 | u >>> (32 - 13);
            u = x9 + x8 | 0;
            x10 ^= u << 18 | u >>> (32 - 18);
            u = x15 + x14 | 0;
            x12 ^= u << 7 | u >>> (32 - 7);
            u = x12 + x15 | 0;
            x13 ^= u << 9 | u >>> (32 - 9);
            u = x13 + x12 | 0;
            x14 ^= u << 13 | u >>> (32 - 13);
            u = x14 + x13 | 0;
            x15 ^= u << 18 | u >>> (32 - 18);
        }
        o[0] = x0 >>> 0 & 0xff;
        o[1] = x0 >>> 8 & 0xff;
        o[2] = x0 >>> 16 & 0xff;
        o[3] = x0 >>> 24 & 0xff;
        o[4] = x5 >>> 0 & 0xff;
        o[5] = x5 >>> 8 & 0xff;
        o[6] = x5 >>> 16 & 0xff;
        o[7] = x5 >>> 24 & 0xff;
        o[8] = x10 >>> 0 & 0xff;
        o[9] = x10 >>> 8 & 0xff;
        o[10] = x10 >>> 16 & 0xff;
        o[11] = x10 >>> 24 & 0xff;
        o[12] = x15 >>> 0 & 0xff;
        o[13] = x15 >>> 8 & 0xff;
        o[14] = x15 >>> 16 & 0xff;
        o[15] = x15 >>> 24 & 0xff;
        o[16] = x6 >>> 0 & 0xff;
        o[17] = x6 >>> 8 & 0xff;
        o[18] = x6 >>> 16 & 0xff;
        o[19] = x6 >>> 24 & 0xff;
        o[20] = x7 >>> 0 & 0xff;
        o[21] = x7 >>> 8 & 0xff;
        o[22] = x7 >>> 16 & 0xff;
        o[23] = x7 >>> 24 & 0xff;
        o[24] = x8 >>> 0 & 0xff;
        o[25] = x8 >>> 8 & 0xff;
        o[26] = x8 >>> 16 & 0xff;
        o[27] = x8 >>> 24 & 0xff;
        o[28] = x9 >>> 0 & 0xff;
        o[29] = x9 >>> 8 & 0xff;
        o[30] = x9 >>> 16 & 0xff;
        o[31] = x9 >>> 24 & 0xff;
    }
    exports_9("_hsalsa20", _hsalsa20);
    function _stream_salsa20_xor(c, cpos, m, mpos, b, n, k) {
        const z = array_ts_1.ByteArray(16), x = array_ts_1.ByteArray(64);
        let u, i;
        for (i = 0; i < 16; i++)
            z[i] = 0;
        for (i = 0; i < 8; i++)
            z[i] = n[i];
        while (b >= 64) {
            _salsa20(x, z, k, _sigma);
            for (i = 0; i < 64; i++)
                c[cpos + i] = m[mpos + i] ^ x[i];
            u = 1;
            for (i = 8; i < 16; i++) {
                u = u + (z[i] & 0xff) | 0;
                z[i] = u & 0xff;
                u >>>= 8;
            }
            b -= 64;
            cpos += 64;
            mpos += 64;
        }
        if (b > 0) {
            _salsa20(x, z, k, _sigma);
            for (i = 0; i < b; i++)
                c[cpos + i] = m[mpos + i] ^ x[i];
        }
        return 0;
    }
    function _stream_salsa20(c, cpos, b, n, k) {
        const z = array_ts_1.ByteArray(16), x = array_ts_1.ByteArray(64);
        let u, i;
        for (i = 0; i < 16; i++)
            z[i] = 0;
        for (i = 0; i < 8; i++)
            z[i] = n[i];
        while (b >= 64) {
            _salsa20(x, z, k, _sigma);
            for (i = 0; i < 64; i++)
                c[cpos + i] = x[i];
            u = 1;
            for (i = 8; i < 16; i++) {
                u = u + (z[i] & 0xff) | 0;
                z[i] = u & 0xff;
                u >>>= 8;
            }
            b -= 64;
            cpos += 64;
        }
        if (b > 0) {
            _salsa20(x, z, k, _sigma);
            for (i = 0; i < b; i++)
                c[cpos + i] = x[i];
        }
        return 0;
    }
    function _stream(c, cpos, d, n, k) {
        const s = array_ts_1.ByteArray(32), sn = array_ts_1.ByteArray(8);
        _hsalsa20(s, n, k, _sigma);
        for (let i = 0; i < 8; i++)
            sn[i] = n[i + 16];
        return _stream_salsa20(c, cpos, d, sn, s);
    }
    exports_9("_stream", _stream);
    function _stream_xor(c, cpos, m, mpos, d, n, k) {
        const s = array_ts_1.ByteArray(32), sn = array_ts_1.ByteArray(8);
        _hsalsa20(s, n, k, _sigma);
        for (let i = 0; i < 8; i++)
            sn[i] = n[i + 16];
        return _stream_salsa20_xor(c, cpos, m, mpos, d, sn, s);
    }
    exports_9("_stream_xor", _stream_xor);
    return {
        setters: [
            function (array_ts_1_1) {
                array_ts_1 = array_ts_1_1;
            }
        ],
        execute: function () {
            exports_9("_sigma", _sigma = array_ts_1.ByteArray([101, 120, 112, 97, 110, 100, 32, 51, 50, 45, 98, 121, 116, 101, 32, 107]));
        }
    };
});
System.register("https://deno.land/x/tweetnacl_deno/src/poly1305", ["https://deno.land/x/tweetnacl_deno/src/array"], function (exports_10, context_10) {
    "use strict";
    var array_ts_2;
    var __moduleName = context_10 && context_10.id;
    function poly1305_init(key) {
        const r = array_ts_2.HalfArray(10);
        const pad = array_ts_2.HalfArray(8);
        let t0, t1, t2, t3, t4, t5, t6, t7;
        t0 = key[0] & 0xff | (key[1] & 0xff) << 8;
        r[0] = (t0) & 0x1fff;
        t1 = key[2] & 0xff | (key[3] & 0xff) << 8;
        r[1] = ((t0 >>> 13) | (t1 << 3)) & 0x1fff;
        t2 = key[4] & 0xff | (key[5] & 0xff) << 8;
        r[2] = ((t1 >>> 10) | (t2 << 6)) & 0x1f03;
        t3 = key[6] & 0xff | (key[7] & 0xff) << 8;
        r[3] = ((t2 >>> 7) | (t3 << 9)) & 0x1fff;
        t4 = key[8] & 0xff | (key[9] & 0xff) << 8;
        r[4] = ((t3 >>> 4) | (t4 << 12)) & 0x00ff;
        r[5] = ((t4 >>> 1)) & 0x1ffe;
        t5 = key[10] & 0xff | (key[11] & 0xff) << 8;
        r[6] = ((t4 >>> 14) | (t5 << 2)) & 0x1fff;
        t6 = key[12] & 0xff | (key[13] & 0xff) << 8;
        r[7] = ((t5 >>> 11) | (t6 << 5)) & 0x1f81;
        t7 = key[14] & 0xff | (key[15] & 0xff) << 8;
        r[8] = ((t6 >>> 8) | (t7 << 8)) & 0x1fff;
        r[9] = ((t7 >>> 5)) & 0x007f;
        pad[0] = key[16] & 0xff | (key[17] & 0xff) << 8;
        pad[1] = key[18] & 0xff | (key[19] & 0xff) << 8;
        pad[2] = key[20] & 0xff | (key[21] & 0xff) << 8;
        pad[3] = key[22] & 0xff | (key[23] & 0xff) << 8;
        pad[4] = key[24] & 0xff | (key[25] & 0xff) << 8;
        pad[5] = key[26] & 0xff | (key[27] & 0xff) << 8;
        pad[6] = key[28] & 0xff | (key[29] & 0xff) << 8;
        pad[7] = key[30] & 0xff | (key[31] & 0xff) << 8;
        return {
            buffer: array_ts_2.ByteArray(16),
            r,
            h: array_ts_2.HalfArray(10),
            pad,
            leftover: 0,
            fin: 0,
        };
    }
    exports_10("poly1305_init", poly1305_init);
    function poly1305_blocks(self, m, mpos, bytes) {
        const hibit = self.fin ? 0 : (1 << 11);
        let t0, t1, t2, t3, t4, t5, t6, t7, c;
        let d0, d1, d2, d3, d4, d5, d6, d7, d8, d9;
        const { h, r } = self;
        let h0 = h[0], h1 = h[1], h2 = h[2], h3 = h[3], h4 = h[4], h5 = h[5], h6 = h[6], h7 = h[7], h8 = h[8], h9 = h[9];
        const r0 = r[0], r1 = r[1], r2 = r[2], r3 = r[3], r4 = r[4], r5 = r[5], r6 = r[6], r7 = r[7], r8 = r[8], r9 = r[9];
        while (bytes >= 16) {
            t0 = m[mpos + 0] & 0xff | (m[mpos + 1] & 0xff) << 8;
            h0 += (t0) & 0x1fff;
            t1 = m[mpos + 2] & 0xff | (m[mpos + 3] & 0xff) << 8;
            h1 += ((t0 >>> 13) | (t1 << 3)) & 0x1fff;
            t2 = m[mpos + 4] & 0xff | (m[mpos + 5] & 0xff) << 8;
            h2 += ((t1 >>> 10) | (t2 << 6)) & 0x1fff;
            t3 = m[mpos + 6] & 0xff | (m[mpos + 7] & 0xff) << 8;
            h3 += ((t2 >>> 7) | (t3 << 9)) & 0x1fff;
            t4 = m[mpos + 8] & 0xff | (m[mpos + 9] & 0xff) << 8;
            h4 += ((t3 >>> 4) | (t4 << 12)) & 0x1fff;
            h5 += ((t4 >>> 1)) & 0x1fff;
            t5 = m[mpos + 10] & 0xff | (m[mpos + 11] & 0xff) << 8;
            h6 += ((t4 >>> 14) | (t5 << 2)) & 0x1fff;
            t6 = m[mpos + 12] & 0xff | (m[mpos + 13] & 0xff) << 8;
            h7 += ((t5 >>> 11) | (t6 << 5)) & 0x1fff;
            t7 = m[mpos + 14] & 0xff | (m[mpos + 15] & 0xff) << 8;
            h8 += ((t6 >>> 8) | (t7 << 8)) & 0x1fff;
            h9 += ((t7 >>> 5)) | hibit;
            c = 0;
            d0 = c;
            d0 += h0 * r0;
            d0 += h1 * (5 * r9);
            d0 += h2 * (5 * r8);
            d0 += h3 * (5 * r7);
            d0 += h4 * (5 * r6);
            c = (d0 >>> 13);
            d0 &= 0x1fff;
            d0 += h5 * (5 * r5);
            d0 += h6 * (5 * r4);
            d0 += h7 * (5 * r3);
            d0 += h8 * (5 * r2);
            d0 += h9 * (5 * r1);
            c += (d0 >>> 13);
            d0 &= 0x1fff;
            d1 = c;
            d1 += h0 * r1;
            d1 += h1 * r0;
            d1 += h2 * (5 * r9);
            d1 += h3 * (5 * r8);
            d1 += h4 * (5 * r7);
            c = (d1 >>> 13);
            d1 &= 0x1fff;
            d1 += h5 * (5 * r6);
            d1 += h6 * (5 * r5);
            d1 += h7 * (5 * r4);
            d1 += h8 * (5 * r3);
            d1 += h9 * (5 * r2);
            c += (d1 >>> 13);
            d1 &= 0x1fff;
            d2 = c;
            d2 += h0 * r2;
            d2 += h1 * r1;
            d2 += h2 * r0;
            d2 += h3 * (5 * r9);
            d2 += h4 * (5 * r8);
            c = (d2 >>> 13);
            d2 &= 0x1fff;
            d2 += h5 * (5 * r7);
            d2 += h6 * (5 * r6);
            d2 += h7 * (5 * r5);
            d2 += h8 * (5 * r4);
            d2 += h9 * (5 * r3);
            c += (d2 >>> 13);
            d2 &= 0x1fff;
            d3 = c;
            d3 += h0 * r3;
            d3 += h1 * r2;
            d3 += h2 * r1;
            d3 += h3 * r0;
            d3 += h4 * (5 * r9);
            c = (d3 >>> 13);
            d3 &= 0x1fff;
            d3 += h5 * (5 * r8);
            d3 += h6 * (5 * r7);
            d3 += h7 * (5 * r6);
            d3 += h8 * (5 * r5);
            d3 += h9 * (5 * r4);
            c += (d3 >>> 13);
            d3 &= 0x1fff;
            d4 = c;
            d4 += h0 * r4;
            d4 += h1 * r3;
            d4 += h2 * r2;
            d4 += h3 * r1;
            d4 += h4 * r0;
            c = (d4 >>> 13);
            d4 &= 0x1fff;
            d4 += h5 * (5 * r9);
            d4 += h6 * (5 * r8);
            d4 += h7 * (5 * r7);
            d4 += h8 * (5 * r6);
            d4 += h9 * (5 * r5);
            c += (d4 >>> 13);
            d4 &= 0x1fff;
            d5 = c;
            d5 += h0 * r5;
            d5 += h1 * r4;
            d5 += h2 * r3;
            d5 += h3 * r2;
            d5 += h4 * r1;
            c = (d5 >>> 13);
            d5 &= 0x1fff;
            d5 += h5 * r0;
            d5 += h6 * (5 * r9);
            d5 += h7 * (5 * r8);
            d5 += h8 * (5 * r7);
            d5 += h9 * (5 * r6);
            c += (d5 >>> 13);
            d5 &= 0x1fff;
            d6 = c;
            d6 += h0 * r6;
            d6 += h1 * r5;
            d6 += h2 * r4;
            d6 += h3 * r3;
            d6 += h4 * r2;
            c = (d6 >>> 13);
            d6 &= 0x1fff;
            d6 += h5 * r1;
            d6 += h6 * r0;
            d6 += h7 * (5 * r9);
            d6 += h8 * (5 * r8);
            d6 += h9 * (5 * r7);
            c += (d6 >>> 13);
            d6 &= 0x1fff;
            d7 = c;
            d7 += h0 * r7;
            d7 += h1 * r6;
            d7 += h2 * r5;
            d7 += h3 * r4;
            d7 += h4 * r3;
            c = (d7 >>> 13);
            d7 &= 0x1fff;
            d7 += h5 * r2;
            d7 += h6 * r1;
            d7 += h7 * r0;
            d7 += h8 * (5 * r9);
            d7 += h9 * (5 * r8);
            c += (d7 >>> 13);
            d7 &= 0x1fff;
            d8 = c;
            d8 += h0 * r8;
            d8 += h1 * r7;
            d8 += h2 * r6;
            d8 += h3 * r5;
            d8 += h4 * r4;
            c = (d8 >>> 13);
            d8 &= 0x1fff;
            d8 += h5 * r3;
            d8 += h6 * r2;
            d8 += h7 * r1;
            d8 += h8 * r0;
            d8 += h9 * (5 * r9);
            c += (d8 >>> 13);
            d8 &= 0x1fff;
            d9 = c;
            d9 += h0 * r9;
            d9 += h1 * r8;
            d9 += h2 * r7;
            d9 += h3 * r6;
            d9 += h4 * r5;
            c = (d9 >>> 13);
            d9 &= 0x1fff;
            d9 += h5 * r4;
            d9 += h6 * r3;
            d9 += h7 * r2;
            d9 += h8 * r1;
            d9 += h9 * r0;
            c += (d9 >>> 13);
            d9 &= 0x1fff;
            c = (((c << 2) + c)) | 0;
            c = (c + d0) | 0;
            d0 = c & 0x1fff;
            c = (c >>> 13);
            d1 += c;
            h0 = d0;
            h1 = d1;
            h2 = d2;
            h3 = d3;
            h4 = d4;
            h5 = d5;
            h6 = d6;
            h7 = d7;
            h8 = d8;
            h9 = d9;
            mpos += 16;
            bytes -= 16;
        }
        h[0] = h0;
        h[1] = h1;
        h[2] = h2;
        h[3] = h3;
        h[4] = h4;
        h[5] = h5;
        h[6] = h6;
        h[7] = h7;
        h[8] = h8;
        h[9] = h9;
    }
    exports_10("poly1305_blocks", poly1305_blocks);
    function poly1305_finish(self, mac, macpos) {
        const g = array_ts_2.HalfArray(10);
        let c, mask, f, i;
        const { buffer, h, pad, leftover } = self;
        if (leftover) {
            i = leftover;
            buffer[i++] = 1;
            for (; i < 16; i++)
                buffer[i] = 0;
            self.fin = 1;
            poly1305_blocks(self, buffer, 0, 16);
        }
        c = h[1] >>> 13;
        h[1] &= 0x1fff;
        for (i = 2; i < 10; i++) {
            h[i] += c;
            c = h[i] >>> 13;
            h[i] &= 0x1fff;
        }
        h[0] += (c * 5);
        c = h[0] >>> 13;
        h[0] &= 0x1fff;
        h[1] += c;
        c = h[1] >>> 13;
        h[1] &= 0x1fff;
        h[2] += c;
        g[0] = h[0] + 5;
        c = g[0] >>> 13;
        g[0] &= 0x1fff;
        for (i = 1; i < 10; i++) {
            g[i] = h[i] + c;
            c = g[i] >>> 13;
            g[i] &= 0x1fff;
        }
        g[9] -= (1 << 13);
        mask = (c ^ 1) - 1;
        for (i = 0; i < 10; i++)
            g[i] &= mask;
        mask = ~mask;
        for (i = 0; i < 10; i++)
            h[i] = (h[i] & mask) | g[i];
        h[0] = ((h[0]) | (h[1] << 13)) & 0xffff;
        h[1] = ((h[1] >>> 3) | (h[2] << 10)) & 0xffff;
        h[2] = ((h[2] >>> 6) | (h[3] << 7)) & 0xffff;
        h[3] = ((h[3] >>> 9) | (h[4] << 4)) & 0xffff;
        h[4] = ((h[4] >>> 12) | (h[5] << 1) | (h[6] << 14)) & 0xffff;
        h[5] = ((h[6] >>> 2) | (h[7] << 11)) & 0xffff;
        h[6] = ((h[7] >>> 5) | (h[8] << 8)) & 0xffff;
        h[7] = ((h[8] >>> 8) | (h[9] << 5)) & 0xffff;
        f = h[0] + pad[0];
        h[0] = f & 0xffff;
        for (i = 1; i < 8; i++) {
            f = (((h[i] + pad[i]) | 0) + (f >>> 16)) | 0;
            h[i] = f & 0xffff;
        }
        mac[macpos + 0] = (h[0] >>> 0) & 0xff;
        mac[macpos + 1] = (h[0] >>> 8) & 0xff;
        mac[macpos + 2] = (h[1] >>> 0) & 0xff;
        mac[macpos + 3] = (h[1] >>> 8) & 0xff;
        mac[macpos + 4] = (h[2] >>> 0) & 0xff;
        mac[macpos + 5] = (h[2] >>> 8) & 0xff;
        mac[macpos + 6] = (h[3] >>> 0) & 0xff;
        mac[macpos + 7] = (h[3] >>> 8) & 0xff;
        mac[macpos + 8] = (h[4] >>> 0) & 0xff;
        mac[macpos + 9] = (h[4] >>> 8) & 0xff;
        mac[macpos + 10] = (h[5] >>> 0) & 0xff;
        mac[macpos + 11] = (h[5] >>> 8) & 0xff;
        mac[macpos + 12] = (h[6] >>> 0) & 0xff;
        mac[macpos + 13] = (h[6] >>> 8) & 0xff;
        mac[macpos + 14] = (h[7] >>> 0) & 0xff;
        mac[macpos + 15] = (h[7] >>> 8) & 0xff;
    }
    exports_10("poly1305_finish", poly1305_finish);
    function poly1305_update(self, m, mpos, bytes) {
        let i, want;
        const { buffer } = self;
        if (self.leftover) {
            want = (16 - self.leftover);
            if (want > bytes)
                want = bytes;
            for (i = 0; i < want; i++)
                buffer[self.leftover + i] = m[mpos + i];
            bytes -= want;
            mpos += want;
            self.leftover += want;
            if (self.leftover < 16)
                return;
            poly1305_blocks(self, buffer, 0, 16);
            self.leftover = 0;
        }
        if (bytes >= 16) {
            want = bytes - (bytes % 16);
            poly1305_blocks(self, m, mpos, want);
            mpos += want;
            bytes -= want;
        }
        if (bytes) {
            for (i = 0; i < bytes; i++)
                buffer[self.leftover + i] = m[mpos + i];
            self.leftover += bytes;
        }
    }
    exports_10("poly1305_update", poly1305_update);
    return {
        setters: [
            function (array_ts_2_1) {
                array_ts_2 = array_ts_2_1;
            }
        ],
        execute: function () {
            ;
            ;
            ;
        }
    };
});
System.register("https://deno.land/x/tweetnacl_deno/src/secretbox", ["https://deno.land/x/tweetnacl_deno/src/array", "https://deno.land/x/tweetnacl_deno/src/verify", "https://deno.land/x/tweetnacl_deno/src/salsa20", "https://deno.land/x/tweetnacl_deno/src/poly1305", "https://deno.land/x/tweetnacl_deno/src/check"], function (exports_11, context_11) {
    "use strict";
    var array_ts_3, verify_ts_1, salsa20_ts_1, poly1305_ts_1, check_ts_1;
    var __moduleName = context_11 && context_11.id;
    function secretbox(msg, nonce, key) {
        check_ts_1.checkArrayTypes(msg, nonce, key);
        check_ts_1.checkLengths(key, nonce);
        const m = array_ts_3.ByteArray(32 + msg.length);
        const c = array_ts_3.ByteArray(m.length);
        for (let i = 0; i < msg.length; i++)
            m[i + 32] = msg[i];
        _secretbox(c, m, m.length, nonce, key);
        return c.subarray(16);
    }
    exports_11("secretbox", secretbox);
    function secretbox_open(box, nonce, key) {
        check_ts_1.checkArrayTypes(box, nonce, key);
        check_ts_1.checkLengths(key, nonce);
        const c = array_ts_3.ByteArray(16 + box.length);
        const m = array_ts_3.ByteArray(c.length);
        for (let i = 0; i < box.length; i++)
            c[i + 16] = box[i];
        if (c.length < 32 || _secretbox_open(m, c, c.length, nonce, key) !== 0)
            return;
        return m.subarray(32);
    }
    exports_11("secretbox_open", secretbox_open);
    function _secretbox(c, m, d, n, k) {
        if (d < 32)
            return -1;
        salsa20_ts_1._stream_xor(c, 0, m, 0, d, n, k);
        _onetimeauth(c, 16, c, 32, d - 32, c);
        for (let i = 0; i < 16; i++)
            c[i] = 0;
        return 0;
    }
    function _secretbox_open(m, c, d, n, k) {
        const x = array_ts_3.ByteArray(32);
        if (d < 32)
            return -1;
        salsa20_ts_1._stream(x, 0, 32, n, k);
        if (_onetimeauth_verify(c, 16, c, 32, d - 32, x) !== 0)
            return -1;
        salsa20_ts_1._stream_xor(m, 0, c, 0, d, n, k);
        for (let i = 0; i < 32; i++)
            m[i] = 0;
        return 0;
    }
    function _onetimeauth(out, outpos, m, mpos, n, k) {
        const s = poly1305_ts_1.poly1305_init(k);
        poly1305_ts_1.poly1305_update(s, m, mpos, n);
        poly1305_ts_1.poly1305_finish(s, out, outpos);
        return 0;
    }
    exports_11("_onetimeauth", _onetimeauth);
    function _onetimeauth_verify(h, hpos, m, mpos, n, k) {
        const x = array_ts_3.ByteArray(16);
        _onetimeauth(x, 0, m, mpos, n, k);
        return verify_ts_1._verify_16(h, hpos, x, 0);
    }
    return {
        setters: [
            function (array_ts_3_1) {
                array_ts_3 = array_ts_3_1;
            },
            function (verify_ts_1_1) {
                verify_ts_1 = verify_ts_1_1;
            },
            function (salsa20_ts_1_1) {
                salsa20_ts_1 = salsa20_ts_1_1;
            },
            function (poly1305_ts_1_1) {
                poly1305_ts_1 = poly1305_ts_1_1;
            },
            function (check_ts_1_1) {
                check_ts_1 = check_ts_1_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("https://deno.land/x/tweetnacl_deno/src/core", ["https://deno.land/x/tweetnacl_deno/src/array"], function (exports_12, context_12) {
    "use strict";
    var array_ts_4, _0, _9, gf0, gf1, _121665, D, D2, X, Y, I;
    var __moduleName = context_12 && context_12.id;
    function gf(init) {
        const r = array_ts_4.NumArray(16);
        if (init)
            for (let i = 0; i < init.length; i++)
                r[i] = init[i];
        return r;
    }
    exports_12("gf", gf);
    function A(o, a, b) {
        for (let i = 0; i < 16; i++)
            o[i] = a[i] + b[i];
    }
    exports_12("A", A);
    function Z(o, a, b) {
        for (let i = 0; i < 16; i++)
            o[i] = a[i] - b[i];
    }
    exports_12("Z", Z);
    function M(o, a, b) {
        let v, c, t0 = 0, t1 = 0, t2 = 0, t3 = 0, t4 = 0, t5 = 0, t6 = 0, t7 = 0, t8 = 0, t9 = 0, t10 = 0, t11 = 0, t12 = 0, t13 = 0, t14 = 0, t15 = 0, t16 = 0, t17 = 0, t18 = 0, t19 = 0, t20 = 0, t21 = 0, t22 = 0, t23 = 0, t24 = 0, t25 = 0, t26 = 0, t27 = 0, t28 = 0, t29 = 0, t30 = 0, b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5], b6 = b[6], b7 = b[7], b8 = b[8], b9 = b[9], b10 = b[10], b11 = b[11], b12 = b[12], b13 = b[13], b14 = b[14], b15 = b[15];
        v = a[0];
        t0 += v * b0;
        t1 += v * b1;
        t2 += v * b2;
        t3 += v * b3;
        t4 += v * b4;
        t5 += v * b5;
        t6 += v * b6;
        t7 += v * b7;
        t8 += v * b8;
        t9 += v * b9;
        t10 += v * b10;
        t11 += v * b11;
        t12 += v * b12;
        t13 += v * b13;
        t14 += v * b14;
        t15 += v * b15;
        v = a[1];
        t1 += v * b0;
        t2 += v * b1;
        t3 += v * b2;
        t4 += v * b3;
        t5 += v * b4;
        t6 += v * b5;
        t7 += v * b6;
        t8 += v * b7;
        t9 += v * b8;
        t10 += v * b9;
        t11 += v * b10;
        t12 += v * b11;
        t13 += v * b12;
        t14 += v * b13;
        t15 += v * b14;
        t16 += v * b15;
        v = a[2];
        t2 += v * b0;
        t3 += v * b1;
        t4 += v * b2;
        t5 += v * b3;
        t6 += v * b4;
        t7 += v * b5;
        t8 += v * b6;
        t9 += v * b7;
        t10 += v * b8;
        t11 += v * b9;
        t12 += v * b10;
        t13 += v * b11;
        t14 += v * b12;
        t15 += v * b13;
        t16 += v * b14;
        t17 += v * b15;
        v = a[3];
        t3 += v * b0;
        t4 += v * b1;
        t5 += v * b2;
        t6 += v * b3;
        t7 += v * b4;
        t8 += v * b5;
        t9 += v * b6;
        t10 += v * b7;
        t11 += v * b8;
        t12 += v * b9;
        t13 += v * b10;
        t14 += v * b11;
        t15 += v * b12;
        t16 += v * b13;
        t17 += v * b14;
        t18 += v * b15;
        v = a[4];
        t4 += v * b0;
        t5 += v * b1;
        t6 += v * b2;
        t7 += v * b3;
        t8 += v * b4;
        t9 += v * b5;
        t10 += v * b6;
        t11 += v * b7;
        t12 += v * b8;
        t13 += v * b9;
        t14 += v * b10;
        t15 += v * b11;
        t16 += v * b12;
        t17 += v * b13;
        t18 += v * b14;
        t19 += v * b15;
        v = a[5];
        t5 += v * b0;
        t6 += v * b1;
        t7 += v * b2;
        t8 += v * b3;
        t9 += v * b4;
        t10 += v * b5;
        t11 += v * b6;
        t12 += v * b7;
        t13 += v * b8;
        t14 += v * b9;
        t15 += v * b10;
        t16 += v * b11;
        t17 += v * b12;
        t18 += v * b13;
        t19 += v * b14;
        t20 += v * b15;
        v = a[6];
        t6 += v * b0;
        t7 += v * b1;
        t8 += v * b2;
        t9 += v * b3;
        t10 += v * b4;
        t11 += v * b5;
        t12 += v * b6;
        t13 += v * b7;
        t14 += v * b8;
        t15 += v * b9;
        t16 += v * b10;
        t17 += v * b11;
        t18 += v * b12;
        t19 += v * b13;
        t20 += v * b14;
        t21 += v * b15;
        v = a[7];
        t7 += v * b0;
        t8 += v * b1;
        t9 += v * b2;
        t10 += v * b3;
        t11 += v * b4;
        t12 += v * b5;
        t13 += v * b6;
        t14 += v * b7;
        t15 += v * b8;
        t16 += v * b9;
        t17 += v * b10;
        t18 += v * b11;
        t19 += v * b12;
        t20 += v * b13;
        t21 += v * b14;
        t22 += v * b15;
        v = a[8];
        t8 += v * b0;
        t9 += v * b1;
        t10 += v * b2;
        t11 += v * b3;
        t12 += v * b4;
        t13 += v * b5;
        t14 += v * b6;
        t15 += v * b7;
        t16 += v * b8;
        t17 += v * b9;
        t18 += v * b10;
        t19 += v * b11;
        t20 += v * b12;
        t21 += v * b13;
        t22 += v * b14;
        t23 += v * b15;
        v = a[9];
        t9 += v * b0;
        t10 += v * b1;
        t11 += v * b2;
        t12 += v * b3;
        t13 += v * b4;
        t14 += v * b5;
        t15 += v * b6;
        t16 += v * b7;
        t17 += v * b8;
        t18 += v * b9;
        t19 += v * b10;
        t20 += v * b11;
        t21 += v * b12;
        t22 += v * b13;
        t23 += v * b14;
        t24 += v * b15;
        v = a[10];
        t10 += v * b0;
        t11 += v * b1;
        t12 += v * b2;
        t13 += v * b3;
        t14 += v * b4;
        t15 += v * b5;
        t16 += v * b6;
        t17 += v * b7;
        t18 += v * b8;
        t19 += v * b9;
        t20 += v * b10;
        t21 += v * b11;
        t22 += v * b12;
        t23 += v * b13;
        t24 += v * b14;
        t25 += v * b15;
        v = a[11];
        t11 += v * b0;
        t12 += v * b1;
        t13 += v * b2;
        t14 += v * b3;
        t15 += v * b4;
        t16 += v * b5;
        t17 += v * b6;
        t18 += v * b7;
        t19 += v * b8;
        t20 += v * b9;
        t21 += v * b10;
        t22 += v * b11;
        t23 += v * b12;
        t24 += v * b13;
        t25 += v * b14;
        t26 += v * b15;
        v = a[12];
        t12 += v * b0;
        t13 += v * b1;
        t14 += v * b2;
        t15 += v * b3;
        t16 += v * b4;
        t17 += v * b5;
        t18 += v * b6;
        t19 += v * b7;
        t20 += v * b8;
        t21 += v * b9;
        t22 += v * b10;
        t23 += v * b11;
        t24 += v * b12;
        t25 += v * b13;
        t26 += v * b14;
        t27 += v * b15;
        v = a[13];
        t13 += v * b0;
        t14 += v * b1;
        t15 += v * b2;
        t16 += v * b3;
        t17 += v * b4;
        t18 += v * b5;
        t19 += v * b6;
        t20 += v * b7;
        t21 += v * b8;
        t22 += v * b9;
        t23 += v * b10;
        t24 += v * b11;
        t25 += v * b12;
        t26 += v * b13;
        t27 += v * b14;
        t28 += v * b15;
        v = a[14];
        t14 += v * b0;
        t15 += v * b1;
        t16 += v * b2;
        t17 += v * b3;
        t18 += v * b4;
        t19 += v * b5;
        t20 += v * b6;
        t21 += v * b7;
        t22 += v * b8;
        t23 += v * b9;
        t24 += v * b10;
        t25 += v * b11;
        t26 += v * b12;
        t27 += v * b13;
        t28 += v * b14;
        t29 += v * b15;
        v = a[15];
        t15 += v * b0;
        t16 += v * b1;
        t17 += v * b2;
        t18 += v * b3;
        t19 += v * b4;
        t20 += v * b5;
        t21 += v * b6;
        t22 += v * b7;
        t23 += v * b8;
        t24 += v * b9;
        t25 += v * b10;
        t26 += v * b11;
        t27 += v * b12;
        t28 += v * b13;
        t29 += v * b14;
        t30 += v * b15;
        t0 += 38 * t16;
        t1 += 38 * t17;
        t2 += 38 * t18;
        t3 += 38 * t19;
        t4 += 38 * t20;
        t5 += 38 * t21;
        t6 += 38 * t22;
        t7 += 38 * t23;
        t8 += 38 * t24;
        t9 += 38 * t25;
        t10 += 38 * t26;
        t11 += 38 * t27;
        t12 += 38 * t28;
        t13 += 38 * t29;
        t14 += 38 * t30;
        c = 1;
        v = t0 + c + 65535;
        c = Math.floor(v / 65536);
        t0 = v - c * 65536;
        v = t1 + c + 65535;
        c = Math.floor(v / 65536);
        t1 = v - c * 65536;
        v = t2 + c + 65535;
        c = Math.floor(v / 65536);
        t2 = v - c * 65536;
        v = t3 + c + 65535;
        c = Math.floor(v / 65536);
        t3 = v - c * 65536;
        v = t4 + c + 65535;
        c = Math.floor(v / 65536);
        t4 = v - c * 65536;
        v = t5 + c + 65535;
        c = Math.floor(v / 65536);
        t5 = v - c * 65536;
        v = t6 + c + 65535;
        c = Math.floor(v / 65536);
        t6 = v - c * 65536;
        v = t7 + c + 65535;
        c = Math.floor(v / 65536);
        t7 = v - c * 65536;
        v = t8 + c + 65535;
        c = Math.floor(v / 65536);
        t8 = v - c * 65536;
        v = t9 + c + 65535;
        c = Math.floor(v / 65536);
        t9 = v - c * 65536;
        v = t10 + c + 65535;
        c = Math.floor(v / 65536);
        t10 = v - c * 65536;
        v = t11 + c + 65535;
        c = Math.floor(v / 65536);
        t11 = v - c * 65536;
        v = t12 + c + 65535;
        c = Math.floor(v / 65536);
        t12 = v - c * 65536;
        v = t13 + c + 65535;
        c = Math.floor(v / 65536);
        t13 = v - c * 65536;
        v = t14 + c + 65535;
        c = Math.floor(v / 65536);
        t14 = v - c * 65536;
        v = t15 + c + 65535;
        c = Math.floor(v / 65536);
        t15 = v - c * 65536;
        t0 += c - 1 + 37 * (c - 1);
        c = 1;
        v = t0 + c + 65535;
        c = Math.floor(v / 65536);
        t0 = v - c * 65536;
        v = t1 + c + 65535;
        c = Math.floor(v / 65536);
        t1 = v - c * 65536;
        v = t2 + c + 65535;
        c = Math.floor(v / 65536);
        t2 = v - c * 65536;
        v = t3 + c + 65535;
        c = Math.floor(v / 65536);
        t3 = v - c * 65536;
        v = t4 + c + 65535;
        c = Math.floor(v / 65536);
        t4 = v - c * 65536;
        v = t5 + c + 65535;
        c = Math.floor(v / 65536);
        t5 = v - c * 65536;
        v = t6 + c + 65535;
        c = Math.floor(v / 65536);
        t6 = v - c * 65536;
        v = t7 + c + 65535;
        c = Math.floor(v / 65536);
        t7 = v - c * 65536;
        v = t8 + c + 65535;
        c = Math.floor(v / 65536);
        t8 = v - c * 65536;
        v = t9 + c + 65535;
        c = Math.floor(v / 65536);
        t9 = v - c * 65536;
        v = t10 + c + 65535;
        c = Math.floor(v / 65536);
        t10 = v - c * 65536;
        v = t11 + c + 65535;
        c = Math.floor(v / 65536);
        t11 = v - c * 65536;
        v = t12 + c + 65535;
        c = Math.floor(v / 65536);
        t12 = v - c * 65536;
        v = t13 + c + 65535;
        c = Math.floor(v / 65536);
        t13 = v - c * 65536;
        v = t14 + c + 65535;
        c = Math.floor(v / 65536);
        t14 = v - c * 65536;
        v = t15 + c + 65535;
        c = Math.floor(v / 65536);
        t15 = v - c * 65536;
        t0 += c - 1 + 37 * (c - 1);
        o[0] = t0;
        o[1] = t1;
        o[2] = t2;
        o[3] = t3;
        o[4] = t4;
        o[5] = t5;
        o[6] = t6;
        o[7] = t7;
        o[8] = t8;
        o[9] = t9;
        o[10] = t10;
        o[11] = t11;
        o[12] = t12;
        o[13] = t13;
        o[14] = t14;
        o[15] = t15;
    }
    exports_12("M", M);
    function S(o, a) {
        M(o, a, a);
    }
    exports_12("S", S);
    return {
        setters: [
            function (array_ts_4_1) {
                array_ts_4 = array_ts_4_1;
            }
        ],
        execute: function () {
            exports_12("_0", _0 = array_ts_4.ByteArray(16));
            exports_12("_9", _9 = array_ts_4.ByteArray(32));
            _9[0] = 9;
            exports_12("gf0", gf0 = gf());
            exports_12("gf1", gf1 = gf([1]));
            exports_12("_121665", _121665 = gf([0xdb41, 1]));
            exports_12("D", D = gf([0x78a3, 0x1359, 0x4dca, 0x75eb, 0xd8ab, 0x4141, 0x0a4d, 0x0070, 0xe898, 0x7779, 0x4079, 0x8cc7, 0xfe73, 0x2b6f, 0x6cee, 0x5203]));
            exports_12("D2", D2 = gf([0xf159, 0x26b2, 0x9b94, 0xebd6, 0xb156, 0x8283, 0x149a, 0x00e0, 0xd130, 0xeef3, 0x80f2, 0x198e, 0xfce7, 0x56df, 0xd9dc, 0x2406]));
            exports_12("X", X = gf([0xd51a, 0x8f25, 0x2d60, 0xc956, 0xa7b2, 0x9525, 0xc760, 0x692c, 0xdc5c, 0xfdd6, 0xe231, 0xc0a4, 0x53fe, 0xcd6e, 0x36d3, 0x2169]));
            exports_12("Y", Y = gf([0x6658, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666]));
            exports_12("I", I = gf([0xa0b0, 0x4a0e, 0x1b27, 0xc4ee, 0xe478, 0xad2f, 0x1806, 0x2f43, 0xd7a7, 0x3dfb, 0x0099, 0x2b4d, 0xdf0b, 0x4fc1, 0x2480, 0x2b83]));
        }
    };
});
System.register("https://deno.land/x/tweetnacl_deno/src/random", ["https://deno.land/x/tweetnacl_deno/src/array"], function (exports_13, context_13) {
    "use strict";
    var array_ts_5;
    var __moduleName = context_13 && context_13.id;
    function randomBytes(n) {
        let b = array_ts_5.ByteArray(n);
        window.crypto.getRandomValues(b);
        return b;
    }
    exports_13("randomBytes", randomBytes);
    return {
        setters: [
            function (array_ts_5_1) {
                array_ts_5 = array_ts_5_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("https://deno.land/x/tweetnacl_deno/src/curve25519", ["https://deno.land/x/tweetnacl_deno/src/array", "https://deno.land/x/tweetnacl_deno/src/verify", "https://deno.land/x/tweetnacl_deno/src/core"], function (exports_14, context_14) {
    "use strict";
    var array_ts_6, verify_ts_2, core_ts_1;
    var __moduleName = context_14 && context_14.id;
    function set25519(r, a) {
        for (let i = 0; i < 16; i++)
            r[i] = a[i] | 0;
    }
    exports_14("set25519", set25519);
    function car25519(o) {
        let i, v, c = 1;
        for (i = 0; i < 16; i++) {
            v = o[i] + c + 65535;
            c = Math.floor(v / 65536);
            o[i] = v - c * 65536;
        }
        o[0] += c - 1 + 37 * (c - 1);
    }
    function sel25519(p, q, b) {
        let t, c = ~(b - 1);
        for (let i = 0; i < 16; i++) {
            t = c & (p[i] ^ q[i]);
            p[i] ^= t;
            q[i] ^= t;
        }
    }
    exports_14("sel25519", sel25519);
    function pack25519(o, n) {
        const m = core_ts_1.gf(), t = core_ts_1.gf();
        let i, j, b;
        for (i = 0; i < 16; i++)
            t[i] = n[i];
        car25519(t);
        car25519(t);
        car25519(t);
        for (j = 0; j < 2; j++) {
            m[0] = t[0] - 0xffed;
            for (i = 1; i < 15; i++) {
                m[i] = t[i] - 0xffff - ((m[i - 1] >> 16) & 1);
                m[i - 1] &= 0xffff;
            }
            m[15] = t[15] - 0x7fff - ((m[14] >> 16) & 1);
            b = (m[15] >> 16) & 1;
            m[14] &= 0xffff;
            sel25519(t, m, 1 - b);
        }
        for (i = 0; i < 16; i++) {
            o[2 * i] = t[i] & 0xff;
            o[2 * i + 1] = t[i] >> 8;
        }
    }
    exports_14("pack25519", pack25519);
    function neq25519(a, b) {
        const c = array_ts_6.ByteArray(32), d = array_ts_6.ByteArray(32);
        pack25519(c, a);
        pack25519(d, b);
        return verify_ts_2._verify_32(c, 0, d, 0);
    }
    exports_14("neq25519", neq25519);
    function par25519(a) {
        const d = array_ts_6.ByteArray(32);
        pack25519(d, a);
        return d[0] & 1;
    }
    exports_14("par25519", par25519);
    function unpack25519(o, n) {
        for (let i = 0; i < 16; i++)
            o[i] = n[2 * i] + (n[2 * i + 1] << 8);
        o[15] &= 0x7fff;
    }
    exports_14("unpack25519", unpack25519);
    function inv25519(o, i) {
        const c = core_ts_1.gf();
        let a;
        for (a = 0; a < 16; a++)
            c[a] = i[a];
        for (a = 253; a >= 0; a--) {
            core_ts_1.S(c, c);
            if (a !== 2 && a !== 4)
                core_ts_1.M(c, c, i);
        }
        for (a = 0; a < 16; a++)
            o[a] = c[a];
    }
    exports_14("inv25519", inv25519);
    return {
        setters: [
            function (array_ts_6_1) {
                array_ts_6 = array_ts_6_1;
            },
            function (verify_ts_2_1) {
                verify_ts_2 = verify_ts_2_1;
            },
            function (core_ts_1_1) {
                core_ts_1 = core_ts_1_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("https://deno.land/x/tweetnacl_deno/src/scalarmult", ["https://deno.land/x/tweetnacl_deno/src/array", "https://deno.land/x/tweetnacl_deno/src/core", "https://deno.land/x/tweetnacl_deno/src/curve25519", "https://deno.land/x/tweetnacl_deno/src/check"], function (exports_15, context_15) {
    "use strict";
    var array_ts_7, core_ts_2, curve25519_ts_1, check_ts_2;
    var __moduleName = context_15 && context_15.id;
    function scalarMult(n, p) {
        check_ts_2.checkArrayTypes(n, p);
        if (n.length !== 32)
            throw new Error('bad n size');
        if (p.length !== 32)
            throw new Error('bad p size');
        const q = array_ts_7.ByteArray(32);
        _scalarMult(q, n, p);
        return q;
    }
    exports_15("scalarMult", scalarMult);
    function scalarMult_base(n) {
        check_ts_2.checkArrayTypes(n);
        if (n.length !== 32)
            throw new Error('bad n size');
        const q = array_ts_7.ByteArray(32);
        _scalarMult_base(q, n);
        return q;
    }
    exports_15("scalarMult_base", scalarMult_base);
    function _scalarMult(q, n, p) {
        const z = array_ts_7.ByteArray(32);
        const x = array_ts_7.NumArray(80);
        const a = core_ts_2.gf();
        const b = core_ts_2.gf();
        const c = core_ts_2.gf();
        const d = core_ts_2.gf();
        const e = core_ts_2.gf();
        const f = core_ts_2.gf();
        let r, i;
        for (i = 0; i < 31; i++)
            z[i] = n[i];
        z[31] = (n[31] & 127) | 64;
        z[0] &= 248;
        curve25519_ts_1.unpack25519(x, p);
        for (i = 0; i < 16; i++) {
            b[i] = x[i];
            d[i] = a[i] = c[i] = 0;
        }
        a[0] = d[0] = 1;
        for (i = 254; i >= 0; --i) {
            r = (z[i >>> 3] >>> (i & 7)) & 1;
            curve25519_ts_1.sel25519(a, b, r);
            curve25519_ts_1.sel25519(c, d, r);
            core_ts_2.A(e, a, c);
            core_ts_2.Z(a, a, c);
            core_ts_2.A(c, b, d);
            core_ts_2.Z(b, b, d);
            core_ts_2.S(d, e);
            core_ts_2.S(f, a);
            core_ts_2.M(a, c, a);
            core_ts_2.M(c, b, e);
            core_ts_2.A(e, a, c);
            core_ts_2.Z(a, a, c);
            core_ts_2.S(b, a);
            core_ts_2.Z(c, d, f);
            core_ts_2.M(a, c, core_ts_2._121665);
            core_ts_2.A(a, a, d);
            core_ts_2.M(c, c, a);
            core_ts_2.M(a, d, f);
            core_ts_2.M(d, b, x);
            core_ts_2.S(b, e);
            curve25519_ts_1.sel25519(a, b, r);
            curve25519_ts_1.sel25519(c, d, r);
        }
        for (i = 0; i < 16; i++) {
            x[i + 16] = a[i];
            x[i + 32] = c[i];
            x[i + 48] = b[i];
            x[i + 64] = d[i];
        }
        const x32 = x.subarray(32);
        const x16 = x.subarray(16);
        curve25519_ts_1.inv25519(x32, x32);
        core_ts_2.M(x16, x16, x32);
        curve25519_ts_1.pack25519(q, x16);
        return 0;
    }
    exports_15("_scalarMult", _scalarMult);
    function _scalarMult_base(q, n) {
        return _scalarMult(q, n, core_ts_2._9);
    }
    exports_15("_scalarMult_base", _scalarMult_base);
    return {
        setters: [
            function (array_ts_7_1) {
                array_ts_7 = array_ts_7_1;
            },
            function (core_ts_2_1) {
                core_ts_2 = core_ts_2_1;
            },
            function (curve25519_ts_1_1) {
                curve25519_ts_1 = curve25519_ts_1_1;
            },
            function (check_ts_2_1) {
                check_ts_2 = check_ts_2_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("https://deno.land/x/tweetnacl_deno/src/box", ["https://deno.land/x/tweetnacl_deno/src/array", "https://deno.land/x/tweetnacl_deno/src/core", "https://deno.land/x/tweetnacl_deno/src/random", "https://deno.land/x/tweetnacl_deno/src/salsa20", "https://deno.land/x/tweetnacl_deno/src/scalarmult", "https://deno.land/x/tweetnacl_deno/src/secretbox", "https://deno.land/x/tweetnacl_deno/src/check"], function (exports_16, context_16) {
    "use strict";
    var array_ts_8, core_ts_3, random_ts_1, salsa20_ts_2, scalarmult_ts_1, secretbox_ts_1, check_ts_3, box_after, box_open_after;
    var __moduleName = context_16 && context_16.id;
    function box(msg, nonce, publicKey, secretKey) {
        const k = box_before(publicKey, secretKey);
        return secretbox_ts_1.secretbox(msg, nonce, k);
    }
    exports_16("box", box);
    function box_before(publicKey, secretKey) {
        check_ts_3.checkArrayTypes(publicKey, secretKey);
        check_ts_3.checkBoxLengths(publicKey, secretKey);
        const k = array_ts_8.ByteArray(32);
        _box_beforenm(k, publicKey, secretKey);
        return k;
    }
    exports_16("box_before", box_before);
    function box_open(msg, nonce, publicKey, secretKey) {
        const k = box_before(publicKey, secretKey);
        return secretbox_ts_1.secretbox_open(msg, nonce, k);
    }
    exports_16("box_open", box_open);
    function box_keyPair() {
        const pk = array_ts_8.ByteArray(32);
        const sk = array_ts_8.ByteArray(32);
        _box_keypair(pk, sk);
        return { publicKey: pk, secretKey: sk };
    }
    exports_16("box_keyPair", box_keyPair);
    function box_keyPair_fromSecretKey(secretKey) {
        check_ts_3.checkArrayTypes(secretKey);
        if (secretKey.length !== 32)
            throw new Error(`bad secret key size (${secretKey.length}), should be ${32}`);
        const pk = array_ts_8.ByteArray(32);
        scalarmult_ts_1._scalarMult_base(pk, secretKey);
        return { publicKey: pk, secretKey: array_ts_8.ByteArray(secretKey) };
    }
    exports_16("box_keyPair_fromSecretKey", box_keyPair_fromSecretKey);
    function _box_keypair(y, x) {
        x.set(random_ts_1.randomBytes(32));
        return scalarmult_ts_1._scalarMult_base(y, x);
    }
    function _box_beforenm(k, y, x) {
        const s = array_ts_8.ByteArray(32);
        scalarmult_ts_1._scalarMult(s, x, y);
        return salsa20_ts_2._hsalsa20(k, core_ts_3._0, s, salsa20_ts_2._sigma);
    }
    return {
        setters: [
            function (array_ts_8_1) {
                array_ts_8 = array_ts_8_1;
            },
            function (core_ts_3_1) {
                core_ts_3 = core_ts_3_1;
            },
            function (random_ts_1_1) {
                random_ts_1 = random_ts_1_1;
            },
            function (salsa20_ts_2_1) {
                salsa20_ts_2 = salsa20_ts_2_1;
            },
            function (scalarmult_ts_1_1) {
                scalarmult_ts_1 = scalarmult_ts_1_1;
            },
            function (secretbox_ts_1_1) {
                secretbox_ts_1 = secretbox_ts_1_1;
            },
            function (check_ts_3_1) {
                check_ts_3 = check_ts_3_1;
            }
        ],
        execute: function () {
            exports_16("box_after", box_after = secretbox_ts_1.secretbox);
            exports_16("box_open_after", box_open_after = secretbox_ts_1.secretbox_open);
        }
    };
});
System.register("https://deno.land/x/tweetnacl_deno/src/check", [], function (exports_17, context_17) {
    "use strict";
    var __moduleName = context_17 && context_17.id;
    function checkLengths(k, n) {
        if (k.length != 32)
            throw new Error('bad key size');
        if (n.length != 24)
            throw new Error('bad nonce size');
    }
    exports_17("checkLengths", checkLengths);
    function checkBoxLengths(pk, sk) {
        if (pk.length != 32)
            throw new Error('bad public key size');
        if (sk.length != 32)
            throw new Error('bad secret key size');
    }
    exports_17("checkBoxLengths", checkBoxLengths);
    function checkArrayTypes(...arrays) {
        for (const array of arrays) {
            if (!(array instanceof Uint8Array)) {
                throw new TypeError('unexpected type, use ByteArray');
            }
        }
    }
    exports_17("checkArrayTypes", checkArrayTypes);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("https://deno.land/x/tweetnacl_deno/src/verify", ["https://deno.land/x/tweetnacl_deno/src/check"], function (exports_18, context_18) {
    "use strict";
    var check_ts_4;
    var __moduleName = context_18 && context_18.id;
    function vn(x, xi, y, yi, n) {
        let i, d = 0;
        for (i = 0; i < n; i++)
            d |= x[xi + i] ^ y[yi + i];
        return (1 & ((d - 1) >>> 8)) - 1;
    }
    function _verify_16(x, xi, y, yi) {
        return vn(x, xi, y, yi, 16);
    }
    exports_18("_verify_16", _verify_16);
    function _verify_32(x, xi, y, yi) {
        return vn(x, xi, y, yi, 32);
    }
    exports_18("_verify_32", _verify_32);
    function verify(x, y) {
        check_ts_4.checkArrayTypes(x, y);
        return x.length > 0 && y.length > 0 &&
            x.length == y.length &&
            vn(x, 0, y, 0, x.length) == 0;
    }
    exports_18("verify", verify);
    return {
        setters: [
            function (check_ts_4_1) {
                check_ts_4 = check_ts_4_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("https://deno.land/x/tweetnacl_deno/src/hash", ["https://deno.land/x/tweetnacl_deno/src/array", "https://deno.land/x/tweetnacl_deno/src/check"], function (exports_19, context_19) {
    "use strict";
    var array_ts_9, check_ts_5, _K;
    var __moduleName = context_19 && context_19.id;
    function hash(msg, len) {
        check_ts_5.checkArrayTypes(msg);
        const h = array_ts_9.ByteArray(len || 64);
        _hash(h, msg, msg.length);
        return h;
    }
    exports_19("hash", hash);
    function _hash(out, m, n) {
        const hh = array_ts_9.IntArray(8), hl = array_ts_9.IntArray(8), x = array_ts_9.ByteArray(256);
        let i, b = n;
        hh[0] = 0x6a09e667;
        hh[1] = 0xbb67ae85;
        hh[2] = 0x3c6ef372;
        hh[3] = 0xa54ff53a;
        hh[4] = 0x510e527f;
        hh[5] = 0x9b05688c;
        hh[6] = 0x1f83d9ab;
        hh[7] = 0x5be0cd19;
        hl[0] = 0xf3bcc908;
        hl[1] = 0x84caa73b;
        hl[2] = 0xfe94f82b;
        hl[3] = 0x5f1d36f1;
        hl[4] = 0xade682d1;
        hl[5] = 0x2b3e6c1f;
        hl[6] = 0xfb41bd6b;
        hl[7] = 0x137e2179;
        _hashblocks_hl(hh, hl, m, n);
        n %= 128;
        for (i = 0; i < n; i++)
            x[i] = m[b - n + i];
        x[n] = 128;
        n = 256 - 128 * (n < 112 ? 1 : 0);
        x[n - 9] = 0;
        _ts64(x, n - 8, (b / 0x20000000) | 0, b << 3);
        _hashblocks_hl(hh, hl, x, n);
        for (i = 0; i < 8; i++)
            _ts64(out, 8 * i, hh[i], hl[i]);
        return 0;
    }
    exports_19("_hash", _hash);
    function _hashblocks_hl(hh, hl, m, n) {
        const wh = array_ts_9.IntArray(16), wl = array_ts_9.IntArray(16);
        let bh0, bh1, bh2, bh3, bh4, bh5, bh6, bh7, bl0, bl1, bl2, bl3, bl4, bl5, bl6, bl7, th, tl, i, j, h, l, a, b, c, d;
        let ah0 = hh[0], ah1 = hh[1], ah2 = hh[2], ah3 = hh[3], ah4 = hh[4], ah5 = hh[5], ah6 = hh[6], ah7 = hh[7], al0 = hl[0], al1 = hl[1], al2 = hl[2], al3 = hl[3], al4 = hl[4], al5 = hl[5], al6 = hl[6], al7 = hl[7];
        let pos = 0;
        while (n >= 128) {
            for (i = 0; i < 16; i++) {
                j = 8 * i + pos;
                wh[i] = (m[j + 0] << 24) | (m[j + 1] << 16) | (m[j + 2] << 8) | m[j + 3];
                wl[i] = (m[j + 4] << 24) | (m[j + 5] << 16) | (m[j + 6] << 8) | m[j + 7];
            }
            for (i = 0; i < 80; i++) {
                bh0 = ah0;
                bh1 = ah1;
                bh2 = ah2;
                bh3 = ah3;
                bh4 = ah4;
                bh5 = ah5;
                bh6 = ah6;
                bh7 = ah7;
                bl0 = al0;
                bl1 = al1;
                bl2 = al2;
                bl3 = al3;
                bl4 = al4;
                bl5 = al5;
                bl6 = al6;
                bl7 = al7;
                h = ah7;
                l = al7;
                a = l & 0xffff;
                b = l >>> 16;
                c = h & 0xffff;
                d = h >>> 16;
                h = ((ah4 >>> 14) | (al4 << (32 - 14))) ^ ((ah4 >>> 18) | (al4 << (32 - 18))) ^ ((al4 >>> (41 - 32)) | (ah4 << (32 - (41 - 32))));
                l = ((al4 >>> 14) | (ah4 << (32 - 14))) ^ ((al4 >>> 18) | (ah4 << (32 - 18))) ^ ((ah4 >>> (41 - 32)) | (al4 << (32 - (41 - 32))));
                a += l & 0xffff;
                b += l >>> 16;
                c += h & 0xffff;
                d += h >>> 16;
                h = (ah4 & ah5) ^ (~ah4 & ah6);
                l = (al4 & al5) ^ (~al4 & al6);
                a += l & 0xffff;
                b += l >>> 16;
                c += h & 0xffff;
                d += h >>> 16;
                h = _K[i * 2];
                l = _K[i * 2 + 1];
                a += l & 0xffff;
                b += l >>> 16;
                c += h & 0xffff;
                d += h >>> 16;
                h = wh[i % 16];
                l = wl[i % 16];
                a += l & 0xffff;
                b += l >>> 16;
                c += h & 0xffff;
                d += h >>> 16;
                b += a >>> 16;
                c += b >>> 16;
                d += c >>> 16;
                th = c & 0xffff | d << 16;
                tl = a & 0xffff | b << 16;
                h = th;
                l = tl;
                a = l & 0xffff;
                b = l >>> 16;
                c = h & 0xffff;
                d = h >>> 16;
                h = ((ah0 >>> 28) | (al0 << (32 - 28))) ^ ((al0 >>> (34 - 32)) | (ah0 << (32 - (34 - 32)))) ^ ((al0 >>> (39 - 32)) | (ah0 << (32 - (39 - 32))));
                l = ((al0 >>> 28) | (ah0 << (32 - 28))) ^ ((ah0 >>> (34 - 32)) | (al0 << (32 - (34 - 32)))) ^ ((ah0 >>> (39 - 32)) | (al0 << (32 - (39 - 32))));
                a += l & 0xffff;
                b += l >>> 16;
                c += h & 0xffff;
                d += h >>> 16;
                h = (ah0 & ah1) ^ (ah0 & ah2) ^ (ah1 & ah2);
                l = (al0 & al1) ^ (al0 & al2) ^ (al1 & al2);
                a += l & 0xffff;
                b += l >>> 16;
                c += h & 0xffff;
                d += h >>> 16;
                b += a >>> 16;
                c += b >>> 16;
                d += c >>> 16;
                bh7 = (c & 0xffff) | (d << 16);
                bl7 = (a & 0xffff) | (b << 16);
                h = bh3;
                l = bl3;
                a = l & 0xffff;
                b = l >>> 16;
                c = h & 0xffff;
                d = h >>> 16;
                h = th;
                l = tl;
                a += l & 0xffff;
                b += l >>> 16;
                c += h & 0xffff;
                d += h >>> 16;
                b += a >>> 16;
                c += b >>> 16;
                d += c >>> 16;
                bh3 = (c & 0xffff) | (d << 16);
                bl3 = (a & 0xffff) | (b << 16);
                ah1 = bh0;
                ah2 = bh1;
                ah3 = bh2;
                ah4 = bh3;
                ah5 = bh4;
                ah6 = bh5;
                ah7 = bh6;
                ah0 = bh7;
                al1 = bl0;
                al2 = bl1;
                al3 = bl2;
                al4 = bl3;
                al5 = bl4;
                al6 = bl5;
                al7 = bl6;
                al0 = bl7;
                if (i % 16 === 15) {
                    for (j = 0; j < 16; j++) {
                        h = wh[j];
                        l = wl[j];
                        a = l & 0xffff;
                        b = l >>> 16;
                        c = h & 0xffff;
                        d = h >>> 16;
                        h = wh[(j + 9) % 16];
                        l = wl[(j + 9) % 16];
                        a += l & 0xffff;
                        b += l >>> 16;
                        c += h & 0xffff;
                        d += h >>> 16;
                        th = wh[(j + 1) % 16];
                        tl = wl[(j + 1) % 16];
                        h = ((th >>> 1) | (tl << (32 - 1))) ^ ((th >>> 8) | (tl << (32 - 8))) ^ (th >>> 7);
                        l = ((tl >>> 1) | (th << (32 - 1))) ^ ((tl >>> 8) | (th << (32 - 8))) ^ ((tl >>> 7) | (th << (32 - 7)));
                        a += l & 0xffff;
                        b += l >>> 16;
                        c += h & 0xffff;
                        d += h >>> 16;
                        th = wh[(j + 14) % 16];
                        tl = wl[(j + 14) % 16];
                        h = ((th >>> 19) | (tl << (32 - 19))) ^ ((tl >>> (61 - 32)) | (th << (32 - (61 - 32)))) ^ (th >>> 6);
                        l = ((tl >>> 19) | (th << (32 - 19))) ^ ((th >>> (61 - 32)) | (tl << (32 - (61 - 32)))) ^ ((tl >>> 6) | (th << (32 - 6)));
                        a += l & 0xffff;
                        b += l >>> 16;
                        c += h & 0xffff;
                        d += h >>> 16;
                        b += a >>> 16;
                        c += b >>> 16;
                        d += c >>> 16;
                        wh[j] = (c & 0xffff) | (d << 16);
                        wl[j] = (a & 0xffff) | (b << 16);
                    }
                }
            }
            h = ah0;
            l = al0;
            a = l & 0xffff;
            b = l >>> 16;
            c = h & 0xffff;
            d = h >>> 16;
            h = hh[0];
            l = hl[0];
            a += l & 0xffff;
            b += l >>> 16;
            c += h & 0xffff;
            d += h >>> 16;
            b += a >>> 16;
            c += b >>> 16;
            d += c >>> 16;
            hh[0] = ah0 = (c & 0xffff) | (d << 16);
            hl[0] = al0 = (a & 0xffff) | (b << 16);
            h = ah1;
            l = al1;
            a = l & 0xffff;
            b = l >>> 16;
            c = h & 0xffff;
            d = h >>> 16;
            h = hh[1];
            l = hl[1];
            a += l & 0xffff;
            b += l >>> 16;
            c += h & 0xffff;
            d += h >>> 16;
            b += a >>> 16;
            c += b >>> 16;
            d += c >>> 16;
            hh[1] = ah1 = (c & 0xffff) | (d << 16);
            hl[1] = al1 = (a & 0xffff) | (b << 16);
            h = ah2;
            l = al2;
            a = l & 0xffff;
            b = l >>> 16;
            c = h & 0xffff;
            d = h >>> 16;
            h = hh[2];
            l = hl[2];
            a += l & 0xffff;
            b += l >>> 16;
            c += h & 0xffff;
            d += h >>> 16;
            b += a >>> 16;
            c += b >>> 16;
            d += c >>> 16;
            hh[2] = ah2 = (c & 0xffff) | (d << 16);
            hl[2] = al2 = (a & 0xffff) | (b << 16);
            h = ah3;
            l = al3;
            a = l & 0xffff;
            b = l >>> 16;
            c = h & 0xffff;
            d = h >>> 16;
            h = hh[3];
            l = hl[3];
            a += l & 0xffff;
            b += l >>> 16;
            c += h & 0xffff;
            d += h >>> 16;
            b += a >>> 16;
            c += b >>> 16;
            d += c >>> 16;
            hh[3] = ah3 = (c & 0xffff) | (d << 16);
            hl[3] = al3 = (a & 0xffff) | (b << 16);
            h = ah4;
            l = al4;
            a = l & 0xffff;
            b = l >>> 16;
            c = h & 0xffff;
            d = h >>> 16;
            h = hh[4];
            l = hl[4];
            a += l & 0xffff;
            b += l >>> 16;
            c += h & 0xffff;
            d += h >>> 16;
            b += a >>> 16;
            c += b >>> 16;
            d += c >>> 16;
            hh[4] = ah4 = (c & 0xffff) | (d << 16);
            hl[4] = al4 = (a & 0xffff) | (b << 16);
            h = ah5;
            l = al5;
            a = l & 0xffff;
            b = l >>> 16;
            c = h & 0xffff;
            d = h >>> 16;
            h = hh[5];
            l = hl[5];
            a += l & 0xffff;
            b += l >>> 16;
            c += h & 0xffff;
            d += h >>> 16;
            b += a >>> 16;
            c += b >>> 16;
            d += c >>> 16;
            hh[5] = ah5 = (c & 0xffff) | (d << 16);
            hl[5] = al5 = (a & 0xffff) | (b << 16);
            h = ah6;
            l = al6;
            a = l & 0xffff;
            b = l >>> 16;
            c = h & 0xffff;
            d = h >>> 16;
            h = hh[6];
            l = hl[6];
            a += l & 0xffff;
            b += l >>> 16;
            c += h & 0xffff;
            d += h >>> 16;
            b += a >>> 16;
            c += b >>> 16;
            d += c >>> 16;
            hh[6] = ah6 = (c & 0xffff) | (d << 16);
            hl[6] = al6 = (a & 0xffff) | (b << 16);
            h = ah7;
            l = al7;
            a = l & 0xffff;
            b = l >>> 16;
            c = h & 0xffff;
            d = h >>> 16;
            h = hh[7];
            l = hl[7];
            a += l & 0xffff;
            b += l >>> 16;
            c += h & 0xffff;
            d += h >>> 16;
            b += a >>> 16;
            c += b >>> 16;
            d += c >>> 16;
            hh[7] = ah7 = (c & 0xffff) | (d << 16);
            hl[7] = al7 = (a & 0xffff) | (b << 16);
            pos += 128;
            n -= 128;
        }
        return n;
    }
    function _ts64(x, i, h, l) {
        x[i] = (h >> 24) & 0xff;
        x[i + 1] = (h >> 16) & 0xff;
        x[i + 2] = (h >> 8) & 0xff;
        x[i + 3] = h & 0xff;
        x[i + 4] = (l >> 24) & 0xff;
        x[i + 5] = (l >> 16) & 0xff;
        x[i + 6] = (l >> 8) & 0xff;
        x[i + 7] = l & 0xff;
    }
    return {
        setters: [
            function (array_ts_9_1) {
                array_ts_9 = array_ts_9_1;
            },
            function (check_ts_5_1) {
                check_ts_5 = check_ts_5_1;
            }
        ],
        execute: function () {
            _K = [
                0x428a2f98, 0xd728ae22, 0x71374491, 0x23ef65cd,
                0xb5c0fbcf, 0xec4d3b2f, 0xe9b5dba5, 0x8189dbbc,
                0x3956c25b, 0xf348b538, 0x59f111f1, 0xb605d019,
                0x923f82a4, 0xaf194f9b, 0xab1c5ed5, 0xda6d8118,
                0xd807aa98, 0xa3030242, 0x12835b01, 0x45706fbe,
                0x243185be, 0x4ee4b28c, 0x550c7dc3, 0xd5ffb4e2,
                0x72be5d74, 0xf27b896f, 0x80deb1fe, 0x3b1696b1,
                0x9bdc06a7, 0x25c71235, 0xc19bf174, 0xcf692694,
                0xe49b69c1, 0x9ef14ad2, 0xefbe4786, 0x384f25e3,
                0x0fc19dc6, 0x8b8cd5b5, 0x240ca1cc, 0x77ac9c65,
                0x2de92c6f, 0x592b0275, 0x4a7484aa, 0x6ea6e483,
                0x5cb0a9dc, 0xbd41fbd4, 0x76f988da, 0x831153b5,
                0x983e5152, 0xee66dfab, 0xa831c66d, 0x2db43210,
                0xb00327c8, 0x98fb213f, 0xbf597fc7, 0xbeef0ee4,
                0xc6e00bf3, 0x3da88fc2, 0xd5a79147, 0x930aa725,
                0x06ca6351, 0xe003826f, 0x14292967, 0x0a0e6e70,
                0x27b70a85, 0x46d22ffc, 0x2e1b2138, 0x5c26c926,
                0x4d2c6dfc, 0x5ac42aed, 0x53380d13, 0x9d95b3df,
                0x650a7354, 0x8baf63de, 0x766a0abb, 0x3c77b2a8,
                0x81c2c92e, 0x47edaee6, 0x92722c85, 0x1482353b,
                0xa2bfe8a1, 0x4cf10364, 0xa81a664b, 0xbc423001,
                0xc24b8b70, 0xd0f89791, 0xc76c51a3, 0x0654be30,
                0xd192e819, 0xd6ef5218, 0xd6990624, 0x5565a910,
                0xf40e3585, 0x5771202a, 0x106aa070, 0x32bbd1b8,
                0x19a4c116, 0xb8d2d0c8, 0x1e376c08, 0x5141ab53,
                0x2748774c, 0xdf8eeb99, 0x34b0bcb5, 0xe19b48a8,
                0x391c0cb3, 0xc5c95a63, 0x4ed8aa4a, 0xe3418acb,
                0x5b9cca4f, 0x7763e373, 0x682e6ff3, 0xd6b2b8a3,
                0x748f82ee, 0x5defb2fc, 0x78a5636f, 0x43172f60,
                0x84c87814, 0xa1f0ab72, 0x8cc70208, 0x1a6439ec,
                0x90befffa, 0x23631e28, 0xa4506ceb, 0xde82bde9,
                0xbef9a3f7, 0xb2c67915, 0xc67178f2, 0xe372532b,
                0xca273ece, 0xea26619c, 0xd186b8c7, 0x21c0c207,
                0xeada7dd6, 0xcde0eb1e, 0xf57d4f7f, 0xee6ed178,
                0x06f067aa, 0x72176fba, 0x0a637dc5, 0xa2c898a6,
                0x113f9804, 0xbef90dae, 0x1b710b35, 0x131c471b,
                0x28db77f5, 0x23047d84, 0x32caab7b, 0x40c72493,
                0x3c9ebe0a, 0x15c9bebc, 0x431d67c4, 0x9c100d4c,
                0x4cc5d4be, 0xcb3e42b6, 0x597f299c, 0xfc657e2a,
                0x5fcb6fab, 0x3ad6faec, 0x6c44198c, 0x4a475817
            ];
        }
    };
});
System.register("https://deno.land/x/tweetnacl_deno/src/sign", ["https://deno.land/x/tweetnacl_deno/src/array", "https://deno.land/x/tweetnacl_deno/src/verify", "https://deno.land/x/tweetnacl_deno/src/core", "https://deno.land/x/tweetnacl_deno/src/random", "https://deno.land/x/tweetnacl_deno/src/curve25519", "https://deno.land/x/tweetnacl_deno/src/hash", "https://deno.land/x/tweetnacl_deno/src/check"], function (exports_20, context_20) {
    "use strict";
    var array_ts_10, verify_ts_3, core_ts_4, random_ts_2, curve25519_ts_2, hash_ts_1, check_ts_6, L;
    var __moduleName = context_20 && context_20.id;
    function sign(msg, secretKey) {
        check_ts_6.checkArrayTypes(msg, secretKey);
        if (secretKey.length !== 64)
            throw new Error('bad secret key size');
        const signedMsg = array_ts_10.ByteArray(64 + msg.length);
        _sign(signedMsg, msg, msg.length, secretKey);
        return signedMsg;
    }
    exports_20("sign", sign);
    function sign_open(signedMsg, publicKey) {
        check_ts_6.checkArrayTypes(signedMsg, publicKey);
        if (publicKey.length !== 32)
            throw new Error('bad public key size');
        const tmp = array_ts_10.ByteArray(signedMsg.length);
        const mlen = _sign_open(tmp, signedMsg, signedMsg.length, publicKey);
        if (mlen < 0)
            return;
        const m = array_ts_10.ByteArray(mlen);
        for (let i = 0; i < m.length; i++)
            m[i] = tmp[i];
        return m;
    }
    exports_20("sign_open", sign_open);
    function sign_detached(msg, secretKey) {
        const signedMsg = sign(msg, secretKey);
        const sig = array_ts_10.ByteArray(64);
        for (let i = 0; i < sig.length; i++)
            sig[i] = signedMsg[i];
        return sig;
    }
    exports_20("sign_detached", sign_detached);
    function sign_detached_verify(msg, sig, publicKey) {
        check_ts_6.checkArrayTypes(msg, sig, publicKey);
        if (sig.length !== 64)
            throw new Error('bad signature size');
        if (publicKey.length !== 32)
            throw new Error('bad public key size');
        const sm = array_ts_10.ByteArray(64 + msg.length);
        const m = array_ts_10.ByteArray(64 + msg.length);
        let i;
        for (i = 0; i < 64; i++)
            sm[i] = sig[i];
        for (i = 0; i < msg.length; i++)
            sm[i + 64] = msg[i];
        return _sign_open(m, sm, sm.length, publicKey) >= 0;
    }
    exports_20("sign_detached_verify", sign_detached_verify);
    function sign_keyPair() {
        const pk = array_ts_10.ByteArray(32);
        const sk = array_ts_10.ByteArray(64);
        _sign_keypair(pk, sk, false);
        return { publicKey: pk, secretKey: sk };
    }
    exports_20("sign_keyPair", sign_keyPair);
    function sign_keyPair_fromSecretKey(secretKey) {
        check_ts_6.checkArrayTypes(secretKey);
        if (secretKey.length !== 64)
            throw new Error('bad secret key size');
        const pk = array_ts_10.ByteArray(32);
        for (let i = 0; i < pk.length; i++)
            pk[i] = secretKey[32 + i];
        return { publicKey: pk, secretKey: array_ts_10.ByteArray(secretKey) };
    }
    exports_20("sign_keyPair_fromSecretKey", sign_keyPair_fromSecretKey);
    function sign_keyPair_fromSeed(seed) {
        check_ts_6.checkArrayTypes(seed);
        if (seed.length !== 32)
            throw new Error('bad seed size');
        const pk = array_ts_10.ByteArray(32);
        const sk = array_ts_10.ByteArray(64);
        for (let i = 0; i < 32; i++)
            sk[i] = seed[i];
        _sign_keypair(pk, sk, true);
        return { publicKey: pk, secretKey: sk };
    }
    exports_20("sign_keyPair_fromSeed", sign_keyPair_fromSeed);
    function _sign_keypair(pk, sk, seeded) {
        const d = array_ts_10.ByteArray(64);
        const p = [core_ts_4.gf(), core_ts_4.gf(), core_ts_4.gf(), core_ts_4.gf()];
        let i;
        if (!seeded)
            sk.set(random_ts_2.randomBytes(32));
        hash_ts_1._hash(d, sk, 32);
        d[0] &= 248;
        d[31] &= 127;
        d[31] |= 64;
        scalarbase(p, d);
        pack(pk, p);
        for (i = 0; i < 32; i++)
            sk[i + 32] = pk[i];
        return 0;
    }
    function _sign(sm, m, n, sk) {
        const d = array_ts_10.ByteArray(64), h = array_ts_10.ByteArray(64), r = array_ts_10.ByteArray(64);
        const x = array_ts_10.NumArray(64);
        const p = [core_ts_4.gf(), core_ts_4.gf(), core_ts_4.gf(), core_ts_4.gf()];
        let i, j;
        hash_ts_1._hash(d, sk, 32);
        d[0] &= 248;
        d[31] &= 127;
        d[31] |= 64;
        const smlen = n + 64;
        for (i = 0; i < n; i++)
            sm[64 + i] = m[i];
        for (i = 0; i < 32; i++)
            sm[32 + i] = d[32 + i];
        hash_ts_1._hash(r, sm.subarray(32), n + 32);
        reduce(r);
        scalarbase(p, r);
        pack(sm, p);
        for (i = 32; i < 64; i++)
            sm[i] = sk[i];
        hash_ts_1._hash(h, sm, n + 64);
        reduce(h);
        for (i = 0; i < 64; i++)
            x[i] = 0;
        for (i = 0; i < 32; i++)
            x[i] = r[i];
        for (i = 0; i < 32; i++) {
            for (j = 0; j < 32; j++) {
                x[i + j] += h[i] * d[j];
            }
        }
        modL(sm.subarray(32), x);
        return smlen;
    }
    function _sign_open(m, sm, n, pk) {
        const t = array_ts_10.ByteArray(32), h = array_ts_10.ByteArray(64);
        const p = [core_ts_4.gf(), core_ts_4.gf(), core_ts_4.gf(), core_ts_4.gf()], q = [core_ts_4.gf(), core_ts_4.gf(), core_ts_4.gf(), core_ts_4.gf()];
        let i, mlen;
        mlen = -1;
        if (n < 64 || unpackneg(q, pk))
            return -1;
        for (i = 0; i < n; i++)
            m[i] = sm[i];
        for (i = 0; i < 32; i++)
            m[i + 32] = pk[i];
        hash_ts_1._hash(h, m, n);
        reduce(h);
        scalarmult(p, q, h);
        scalarbase(q, sm.subarray(32));
        add(p, q);
        pack(t, p);
        n -= 64;
        if (verify_ts_3._verify_32(sm, 0, t, 0)) {
            for (i = 0; i < n; i++)
                m[i] = 0;
            return -1;
        }
        for (i = 0; i < n; i++)
            m[i] = sm[i + 64];
        mlen = n;
        return mlen;
    }
    function scalarbase(p, s) {
        const q = [core_ts_4.gf(), core_ts_4.gf(), core_ts_4.gf(), core_ts_4.gf()];
        curve25519_ts_2.set25519(q[0], core_ts_4.X);
        curve25519_ts_2.set25519(q[1], core_ts_4.Y);
        curve25519_ts_2.set25519(q[2], core_ts_4.gf1);
        core_ts_4.M(q[3], core_ts_4.X, core_ts_4.Y);
        scalarmult(p, q, s);
    }
    exports_20("scalarbase", scalarbase);
    function scalarmult(p, q, s) {
        let b, i;
        curve25519_ts_2.set25519(p[0], core_ts_4.gf0);
        curve25519_ts_2.set25519(p[1], core_ts_4.gf1);
        curve25519_ts_2.set25519(p[2], core_ts_4.gf1);
        curve25519_ts_2.set25519(p[3], core_ts_4.gf0);
        for (i = 255; i >= 0; --i) {
            b = (s[(i / 8) | 0] >> (i & 7)) & 1;
            cswap(p, q, b);
            add(q, p);
            add(p, p);
            cswap(p, q, b);
        }
    }
    exports_20("scalarmult", scalarmult);
    function pack(r, p) {
        const tx = core_ts_4.gf(), ty = core_ts_4.gf(), zi = core_ts_4.gf();
        curve25519_ts_2.inv25519(zi, p[2]);
        core_ts_4.M(tx, p[0], zi);
        core_ts_4.M(ty, p[1], zi);
        curve25519_ts_2.pack25519(r, ty);
        r[31] ^= curve25519_ts_2.par25519(tx) << 7;
    }
    function unpackneg(r, p) {
        const t = core_ts_4.gf(), chk = core_ts_4.gf(), num = core_ts_4.gf(), den = core_ts_4.gf(), den2 = core_ts_4.gf(), den4 = core_ts_4.gf(), den6 = core_ts_4.gf();
        curve25519_ts_2.set25519(r[2], core_ts_4.gf1);
        curve25519_ts_2.unpack25519(r[1], p);
        core_ts_4.S(num, r[1]);
        core_ts_4.M(den, num, core_ts_4.D);
        core_ts_4.Z(num, num, r[2]);
        core_ts_4.A(den, r[2], den);
        core_ts_4.S(den2, den);
        core_ts_4.S(den4, den2);
        core_ts_4.M(den6, den4, den2);
        core_ts_4.M(t, den6, num);
        core_ts_4.M(t, t, den);
        pow2523(t, t);
        core_ts_4.M(t, t, num);
        core_ts_4.M(t, t, den);
        core_ts_4.M(t, t, den);
        core_ts_4.M(r[0], t, den);
        core_ts_4.S(chk, r[0]);
        core_ts_4.M(chk, chk, den);
        if (curve25519_ts_2.neq25519(chk, num))
            core_ts_4.M(r[0], r[0], core_ts_4.I);
        core_ts_4.S(chk, r[0]);
        core_ts_4.M(chk, chk, den);
        if (curve25519_ts_2.neq25519(chk, num))
            return -1;
        if (curve25519_ts_2.par25519(r[0]) === (p[31] >> 7))
            core_ts_4.Z(r[0], core_ts_4.gf0, r[0]);
        core_ts_4.M(r[3], r[0], r[1]);
        return 0;
    }
    function reduce(r) {
        const x = array_ts_10.NumArray(64);
        let i;
        for (i = 0; i < 64; i++)
            x[i] = r[i];
        for (i = 0; i < 64; i++)
            r[i] = 0;
        modL(r, x);
    }
    function modL(r, x) {
        let carry, i, j, k;
        for (i = 63; i >= 32; --i) {
            carry = 0;
            for (j = i - 32, k = i - 12; j < k; ++j) {
                x[j] += carry - 16 * x[i] * L[j - (i - 32)];
                carry = (x[j] + 128) >> 8;
                x[j] -= carry * 256;
            }
            x[j] += carry;
            x[i] = 0;
        }
        carry = 0;
        for (j = 0; j < 32; j++) {
            x[j] += carry - (x[31] >> 4) * L[j];
            carry = x[j] >> 8;
            x[j] &= 255;
        }
        for (j = 0; j < 32; j++)
            x[j] -= carry * L[j];
        for (i = 0; i < 32; i++) {
            x[i + 1] += x[i] >> 8;
            r[i] = x[i] & 255;
        }
    }
    function add(p, q) {
        const a = core_ts_4.gf(), b = core_ts_4.gf(), c = core_ts_4.gf(), d = core_ts_4.gf(), e = core_ts_4.gf(), f = core_ts_4.gf(), g = core_ts_4.gf(), h = core_ts_4.gf(), t = core_ts_4.gf();
        core_ts_4.Z(a, p[1], p[0]);
        core_ts_4.Z(t, q[1], q[0]);
        core_ts_4.M(a, a, t);
        core_ts_4.A(b, p[0], p[1]);
        core_ts_4.A(t, q[0], q[1]);
        core_ts_4.M(b, b, t);
        core_ts_4.M(c, p[3], q[3]);
        core_ts_4.M(c, c, core_ts_4.D2);
        core_ts_4.M(d, p[2], q[2]);
        core_ts_4.A(d, d, d);
        core_ts_4.Z(e, b, a);
        core_ts_4.Z(f, d, c);
        core_ts_4.A(g, d, c);
        core_ts_4.A(h, b, a);
        core_ts_4.M(p[0], e, f);
        core_ts_4.M(p[1], h, g);
        core_ts_4.M(p[2], g, f);
        core_ts_4.M(p[3], e, h);
    }
    function cswap(p, q, b) {
        for (let i = 0; i < 4; i++) {
            curve25519_ts_2.sel25519(p[i], q[i], b);
        }
    }
    function pow2523(o, i) {
        const c = core_ts_4.gf();
        let a;
        for (a = 0; a < 16; a++)
            c[a] = i[a];
        for (a = 250; a >= 0; a--) {
            core_ts_4.S(c, c);
            if (a !== 1)
                core_ts_4.M(c, c, i);
        }
        for (a = 0; a < 16; a++)
            o[a] = c[a];
    }
    return {
        setters: [
            function (array_ts_10_1) {
                array_ts_10 = array_ts_10_1;
            },
            function (verify_ts_3_1) {
                verify_ts_3 = verify_ts_3_1;
            },
            function (core_ts_4_1) {
                core_ts_4 = core_ts_4_1;
            },
            function (random_ts_2_1) {
                random_ts_2 = random_ts_2_1;
            },
            function (curve25519_ts_2_1) {
                curve25519_ts_2 = curve25519_ts_2_1;
            },
            function (hash_ts_1_1) {
                hash_ts_1 = hash_ts_1_1;
            },
            function (check_ts_6_1) {
                check_ts_6 = check_ts_6_1;
            }
        ],
        execute: function () {
            L = array_ts_10.NumArray([0xed, 0xd3, 0xf5, 0x5c, 0x1a, 0x63, 0x12, 0x58, 0xd6, 0x9c, 0xf7, 0xa2, 0xde, 0xf9, 0xde, 0x14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x10]);
        }
    };
});
System.register("https://deno.land/x/tweetnacl_deno/src/auth", ["https://deno.land/x/tweetnacl_deno/src/array", "https://deno.land/x/tweetnacl_deno/src/hash"], function (exports_21, context_21) {
    "use strict";
    var array_ts_11, hash_ts_2, BLOCK_SIZE, HASH_SIZE, auth_full;
    var __moduleName = context_21 && context_21.id;
    function auth(msg, key) {
        const out = array_ts_11.ByteArray(32);
        out.set(hmac(msg, key).subarray(0, 32));
        return out;
    }
    exports_21("auth", auth);
    function hmac(msg, key) {
        const buf = array_ts_11.ByteArray(BLOCK_SIZE + Math.max(HASH_SIZE, msg.length));
        let i, innerHash;
        if (key.length > BLOCK_SIZE)
            key = hash_ts_2.hash(key);
        for (i = 0; i < BLOCK_SIZE; i++)
            buf[i] = 0x36;
        for (i = 0; i < key.length; i++)
            buf[i] ^= key[i];
        buf.set(msg, BLOCK_SIZE);
        innerHash = hash_ts_2.hash(buf.subarray(0, BLOCK_SIZE + msg.length));
        for (i = 0; i < BLOCK_SIZE; i++)
            buf[i] = 0x5c;
        for (i = 0; i < key.length; i++)
            buf[i] ^= key[i];
        buf.set(innerHash, BLOCK_SIZE);
        return hash_ts_2.hash(buf.subarray(0, BLOCK_SIZE + innerHash.length));
    }
    return {
        setters: [
            function (array_ts_11_1) {
                array_ts_11 = array_ts_11_1;
            },
            function (hash_ts_2_1) {
                hash_ts_2 = hash_ts_2_1;
            }
        ],
        execute: function () {
            BLOCK_SIZE = 128;
            HASH_SIZE = 64;
            exports_21("auth_full", auth_full = hmac);
        }
    };
});
System.register("https://deno.land/x/tweetnacl_deno/src/blake2s", ["https://deno.land/x/tweetnacl_deno/src/array"], function (exports_22, context_22) {
    "use strict";
    var array_ts_12, BLAKE2S_IV, SIGMA, v, m;
    var __moduleName = context_22 && context_22.id;
    function blake2s(input, key, outlen = 32) {
        const ctx = blake2s_init(outlen, key);
        blake2s_update(ctx, input);
        return blake2s_final(ctx);
    }
    exports_22("blake2s", blake2s);
    function blake2s_init(outlen, key) {
        if (!(outlen > 0 && outlen <= 32)) {
            throw new Error('Incorrect output length, should be in [1, 32]');
        }
        const keylen = key ? key.length : 0;
        if (key && !(keylen > 0 && keylen <= 32)) {
            throw new Error('Incorrect key length, should be in [1, 32]');
        }
        const ctx = {
            h: array_ts_12.WordArray(BLAKE2S_IV),
            b: array_ts_12.WordArray(64),
            c: 0,
            t: 0,
            outlen: outlen
        };
        ctx.h[0] ^= 0x01010000 ^ (keylen << 8) ^ outlen;
        if (keylen) {
            blake2s_update(ctx, key);
            ctx.c = 64;
        }
        return ctx;
    }
    exports_22("blake2s_init", blake2s_init);
    function blake2s_update(ctx, input) {
        for (let i = 0; i < input.length; i++) {
            if (ctx.c === 64) {
                ctx.t += ctx.c;
                blake2s_compress(ctx, false);
                ctx.c = 0;
            }
            ctx.b[ctx.c++] = input[i];
        }
    }
    exports_22("blake2s_update", blake2s_update);
    function blake2s_final(ctx) {
        ctx.t += ctx.c;
        while (ctx.c < 64) {
            ctx.b[ctx.c++] = 0;
        }
        blake2s_compress(ctx, true);
        const out = array_ts_12.ByteArray(ctx.outlen);
        for (var i = 0; i < ctx.outlen; i++) {
            out[i] = (ctx.h[i >> 2] >> (8 * (i & 3))) & 0xFF;
        }
        return out;
    }
    exports_22("blake2s_final", blake2s_final);
    function blake2s_compress(ctx, last) {
        let i = 0;
        for (i = 0; i < 8; i++) {
            v[i] = ctx.h[i];
            v[i + 8] = BLAKE2S_IV[i];
        }
        v[12] ^= ctx.t;
        v[13] ^= (ctx.t / 0x100000000);
        if (last) {
            v[14] = ~v[14];
        }
        for (i = 0; i < 16; i++) {
            m[i] = B2S_GET32(ctx.b, 4 * i);
        }
        for (i = 0; i < 10; i++) {
            B2S_G(0, 4, 8, 12, m[SIGMA[i * 16 + 0]], m[SIGMA[i * 16 + 1]]);
            B2S_G(1, 5, 9, 13, m[SIGMA[i * 16 + 2]], m[SIGMA[i * 16 + 3]]);
            B2S_G(2, 6, 10, 14, m[SIGMA[i * 16 + 4]], m[SIGMA[i * 16 + 5]]);
            B2S_G(3, 7, 11, 15, m[SIGMA[i * 16 + 6]], m[SIGMA[i * 16 + 7]]);
            B2S_G(0, 5, 10, 15, m[SIGMA[i * 16 + 8]], m[SIGMA[i * 16 + 9]]);
            B2S_G(1, 6, 11, 12, m[SIGMA[i * 16 + 10]], m[SIGMA[i * 16 + 11]]);
            B2S_G(2, 7, 8, 13, m[SIGMA[i * 16 + 12]], m[SIGMA[i * 16 + 13]]);
            B2S_G(3, 4, 9, 14, m[SIGMA[i * 16 + 14]], m[SIGMA[i * 16 + 15]]);
        }
        for (i = 0; i < 8; i++) {
            ctx.h[i] ^= v[i] ^ v[i + 8];
        }
    }
    function B2S_GET32(v, i) {
        return v[i] ^ (v[i + 1] << 8) ^ (v[i + 2] << 16) ^ (v[i + 3] << 24);
    }
    function B2S_G(a, b, c, d, x, y) {
        v[a] = v[a] + v[b] + x;
        v[d] = ROTR32(v[d] ^ v[a], 16);
        v[c] = v[c] + v[d];
        v[b] = ROTR32(v[b] ^ v[c], 12);
        v[a] = v[a] + v[b] + y;
        v[d] = ROTR32(v[d] ^ v[a], 8);
        v[c] = v[c] + v[d];
        v[b] = ROTR32(v[b] ^ v[c], 7);
    }
    function ROTR32(x, y) {
        return (x >>> y) ^ (x << (32 - y));
    }
    return {
        setters: [
            function (array_ts_12_1) {
                array_ts_12 = array_ts_12_1;
            }
        ],
        execute: function () {
            BLAKE2S_IV = array_ts_12.WordArray([
                0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A,
                0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19
            ]);
            SIGMA = array_ts_12.ByteArray([
                0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
                14, 10, 4, 8, 9, 15, 13, 6, 1, 12, 0, 2, 11, 7, 5, 3,
                11, 8, 12, 0, 5, 2, 15, 13, 10, 14, 3, 6, 7, 1, 9, 4,
                7, 9, 3, 1, 13, 12, 11, 14, 2, 6, 5, 10, 4, 0, 15, 8,
                9, 0, 5, 7, 2, 4, 10, 15, 14, 1, 11, 12, 6, 8, 3, 13,
                2, 12, 6, 10, 0, 11, 8, 3, 4, 13, 7, 5, 15, 14, 1, 9,
                12, 5, 1, 15, 14, 13, 4, 10, 0, 7, 6, 3, 9, 2, 8, 11,
                13, 11, 7, 14, 12, 1, 3, 9, 5, 0, 15, 4, 8, 6, 2, 10,
                6, 15, 14, 9, 11, 3, 0, 8, 12, 2, 13, 7, 1, 4, 10, 5,
                10, 2, 8, 4, 7, 6, 1, 5, 15, 11, 9, 14, 3, 12, 13, 0
            ]);
            v = array_ts_12.WordArray(16);
            m = array_ts_12.WordArray(16);
        }
    };
});
System.register("https://deno.land/x/tweetnacl_deno/src/blake2b", ["https://deno.land/x/tweetnacl_deno/src/array"], function (exports_23, context_23) {
    "use strict";
    var array_ts_13, BLAKE2B_IV32, SIGMA8, SIGMA82, v, m;
    var __moduleName = context_23 && context_23.id;
    function blake2b(input, key, outlen = 64) {
        const ctx = blake2b_init(outlen, key);
        blake2b_update(ctx, input);
        return blake2b_final(ctx);
    }
    exports_23("blake2b", blake2b);
    function blake2b_init(outlen, key) {
        if (outlen === 0 || outlen > 64)
            throw new Error('Illegal output length, expected 0 < length <= 64');
        if (key && key.length > 64)
            throw new Error('Illegal key, expected Uint8Array with 0 < length <= 64');
        const h = array_ts_13.WordArray(16);
        for (let i = 0; i < 16; i++)
            h[i] = BLAKE2B_IV32[i];
        const keylen = key ? key.length : 0;
        h[0] ^= 0x01010000 ^ (keylen << 8) ^ outlen;
        const ctx = {
            b: array_ts_13.ByteArray(128),
            h,
            t: 0,
            c: 0,
            outlen
        };
        if (key) {
            blake2b_update(ctx, key);
            ctx.c = 128;
        }
        return ctx;
    }
    exports_23("blake2b_init", blake2b_init);
    function blake2b_update(ctx, input) {
        for (let i = 0; i < input.length; i++) {
            if (ctx.c === 128) {
                ctx.t += ctx.c;
                blake2b_compress(ctx, false);
                ctx.c = 0;
            }
            ctx.b[ctx.c++] = input[i];
        }
    }
    exports_23("blake2b_update", blake2b_update);
    function blake2b_final(ctx) {
        ctx.t += ctx.c;
        while (ctx.c < 128) {
            ctx.b[ctx.c++] = 0;
        }
        blake2b_compress(ctx, true);
        const out = array_ts_13.ByteArray(ctx.outlen);
        for (let i = 0; i < ctx.outlen; i++) {
            out[i] = ctx.h[i >> 2] >> (8 * (i & 3));
        }
        return out;
    }
    exports_23("blake2b_final", blake2b_final);
    function blake2b_compress(ctx, last) {
        let i;
        for (i = 0; i < 16; i++) {
            v[i] = ctx.h[i];
            v[i + 16] = BLAKE2B_IV32[i];
        }
        v[24] = v[24] ^ ctx.t;
        v[25] = v[25] ^ (ctx.t / 0x100000000);
        if (last) {
            v[28] = ~v[28];
            v[29] = ~v[29];
        }
        for (i = 0; i < 32; i++) {
            m[i] = B2B_GET32(ctx.h, 4 * i);
        }
        for (i = 0; i < 12; i++) {
            B2B_G(0, 8, 16, 24, SIGMA82[i * 16 + 0], SIGMA82[i * 16 + 1]);
            B2B_G(2, 10, 18, 26, SIGMA82[i * 16 + 2], SIGMA82[i * 16 + 3]);
            B2B_G(4, 12, 20, 28, SIGMA82[i * 16 + 4], SIGMA82[i * 16 + 5]);
            B2B_G(6, 14, 22, 30, SIGMA82[i * 16 + 6], SIGMA82[i * 16 + 7]);
            B2B_G(0, 10, 20, 30, SIGMA82[i * 16 + 8], SIGMA82[i * 16 + 9]);
            B2B_G(2, 12, 22, 24, SIGMA82[i * 16 + 10], SIGMA82[i * 16 + 11]);
            B2B_G(4, 14, 16, 26, SIGMA82[i * 16 + 12], SIGMA82[i * 16 + 13]);
            B2B_G(6, 8, 18, 28, SIGMA82[i * 16 + 14], SIGMA82[i * 16 + 15]);
        }
        for (i = 0; i < 16; i++) {
            ctx.h[i] = ctx.h[i] ^ v[i] ^ v[i + 16];
        }
    }
    function ADD64AA(v, a, b) {
        let o0 = v[a] + v[b], o1 = v[a + 1] + v[b + 1];
        if (o0 >= 0x100000000)
            o1++;
        v[a] = o0;
        v[a + 1] = o1;
    }
    function ADD64AC(v, a, b0, b1) {
        let o0 = v[a] + b0;
        if (b0 < 0)
            o0 += 0x100000000;
        let o1 = v[a + 1] + b1;
        if (o0 >= 0x100000000)
            o1++;
        v[a] = o0;
        v[a + 1] = o1;
    }
    function B2B_GET32(arr, i) {
        return arr[i] ^ (arr[i + 1] << 8) ^ (arr[i + 2] << 16) ^ (arr[i + 3] << 24);
    }
    function B2B_G(a, b, c, d, ix, iy) {
        const x0 = m[ix];
        const x1 = m[ix + 1];
        const y0 = m[iy];
        const y1 = m[iy + 1];
        ADD64AA(v, a, b);
        ADD64AC(v, a, x0, x1);
        let xor0 = v[d] ^ v[a];
        let xor1 = v[d + 1] ^ v[a + 1];
        v[d] = xor1;
        v[d + 1] = xor0;
        ADD64AA(v, c, d);
        xor0 = v[b] ^ v[c];
        xor1 = v[b + 1] ^ v[c + 1];
        v[b] = (xor0 >>> 24) ^ (xor1 << 8);
        v[b + 1] = (xor1 >>> 24) ^ (xor0 << 8);
        ADD64AA(v, a, b);
        ADD64AC(v, a, y0, y1);
        xor0 = v[d] ^ v[a];
        xor1 = v[d + 1] ^ v[a + 1];
        v[d] = (xor0 >>> 16) ^ (xor1 << 16);
        v[d + 1] = (xor1 >>> 16) ^ (xor0 << 16);
        ADD64AA(v, c, d);
        xor0 = v[b] ^ v[c];
        xor1 = v[b + 1] ^ v[c + 1];
        v[b] = (xor1 >>> 31) ^ (xor0 << 1);
        v[b + 1] = (xor0 >>> 31) ^ (xor1 << 1);
    }
    return {
        setters: [
            function (array_ts_13_1) {
                array_ts_13 = array_ts_13_1;
            }
        ],
        execute: function () {
            BLAKE2B_IV32 = array_ts_13.WordArray([
                0xF3BCC908, 0x6A09E667, 0x84CAA73B, 0xBB67AE85,
                0xFE94F82B, 0x3C6EF372, 0x5F1D36F1, 0xA54FF53A,
                0xADE682D1, 0x510E527F, 0x2B3E6C1F, 0x9B05688C,
                0xFB41BD6B, 0x1F83D9AB, 0x137E2179, 0x5BE0CD19
            ]);
            SIGMA8 = [
                0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
                14, 10, 4, 8, 9, 15, 13, 6, 1, 12, 0, 2, 11, 7, 5, 3,
                11, 8, 12, 0, 5, 2, 15, 13, 10, 14, 3, 6, 7, 1, 9, 4,
                7, 9, 3, 1, 13, 12, 11, 14, 2, 6, 5, 10, 4, 0, 15, 8,
                9, 0, 5, 7, 2, 4, 10, 15, 14, 1, 11, 12, 6, 8, 3, 13,
                2, 12, 6, 10, 0, 11, 8, 3, 4, 13, 7, 5, 15, 14, 1, 9,
                12, 5, 1, 15, 14, 13, 4, 10, 0, 7, 6, 3, 9, 2, 8, 11,
                13, 11, 7, 14, 12, 1, 3, 9, 5, 0, 15, 4, 8, 6, 2, 10,
                6, 15, 14, 9, 11, 3, 0, 8, 12, 2, 13, 7, 1, 4, 10, 5,
                10, 2, 8, 4, 7, 6, 1, 5, 15, 11, 9, 14, 3, 12, 13, 0,
                0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
                14, 10, 4, 8, 9, 15, 13, 6, 1, 12, 0, 2, 11, 7, 5, 3
            ];
            SIGMA82 = array_ts_13.ByteArray(SIGMA8.map(x => x * 2));
            v = array_ts_13.WordArray(32);
            m = array_ts_13.WordArray(32);
        }
    };
});
System.register("https://deno.land/x/tweetnacl_deno/src/sealedbox", ["https://deno.land/x/tweetnacl_deno/src/array", "https://deno.land/x/tweetnacl_deno/src/box", "https://deno.land/x/tweetnacl_deno/src/blake2b"], function (exports_24, context_24) {
    "use strict";
    var array_ts_14, box_ts_1, blake2b_ts_1;
    var __moduleName = context_24 && context_24.id;
    function sealedbox(m, pk) {
        const c = array_ts_14.ByteArray(48 + m.length);
        const ek = box_ts_1.box_keyPair();
        c.set(ek.publicKey);
        const nonce = nonce_gen(ek.publicKey, pk);
        const boxed = box_ts_1.box(m, nonce, pk, ek.secretKey);
        c.set(boxed, ek.publicKey.length);
        for (let i = 0; i < ek.secretKey.length; i++)
            ek.secretKey[i] = 0;
        return c;
    }
    exports_24("sealedbox", sealedbox);
    function sealedbox_open(c, pk, sk) {
        if (c.length < 48)
            return;
        const epk = c.subarray(0, 32);
        const nonce = nonce_gen(epk, pk);
        const boxData = c.subarray(32);
        return box_ts_1.box_open(boxData, nonce, epk, sk);
    }
    exports_24("sealedbox_open", sealedbox_open);
    function nonce_gen(pk1, pk2) {
        const state = blake2b_ts_1.blake2b_init(24);
        blake2b_ts_1.blake2b_update(state, pk1);
        blake2b_ts_1.blake2b_update(state, pk2);
        return blake2b_ts_1.blake2b_final(state);
    }
    return {
        setters: [
            function (array_ts_14_1) {
                array_ts_14 = array_ts_14_1;
            },
            function (box_ts_1_1) {
                box_ts_1 = box_ts_1_1;
            },
            function (blake2b_ts_1_1) {
                blake2b_ts_1 = blake2b_ts_1_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("https://deno.land/x/tweetnacl_deno/src/nacl", ["https://deno.land/x/tweetnacl_deno/src/array", "https://deno.land/x/tweetnacl_deno/src/validate", "https://deno.land/x/tweetnacl_deno/src/convert", "https://deno.land/x/tweetnacl_deno/src/verify", "https://deno.land/x/tweetnacl_deno/src/random", "https://deno.land/x/tweetnacl_deno/src/scalarmult", "https://deno.land/x/tweetnacl_deno/src/secretbox", "https://deno.land/x/tweetnacl_deno/src/box", "https://deno.land/x/tweetnacl_deno/src/sign", "https://deno.land/x/tweetnacl_deno/src/hash", "https://deno.land/x/tweetnacl_deno/src/auth", "https://deno.land/x/tweetnacl_deno/src/blake2s", "https://deno.land/x/tweetnacl_deno/src/blake2b", "https://deno.land/x/tweetnacl_deno/src/sealedbox"], function (exports_25, context_25) {
    "use strict";
    var __moduleName = context_25 && context_25.id;
    function exportStar_2(m) {
        var exports = {};
        for (var n in m) {
            if (n !== "default") exports[n] = m[n];
        }
        exports_25(exports);
    }
    return {
        setters: [
            function (array_ts_15_1) {
                exportStar_2(array_ts_15_1);
            },
            function (validate_ts_2_1) {
                exportStar_2(validate_ts_2_1);
            },
            function (convert_ts_2_1) {
                exportStar_2(convert_ts_2_1);
            },
            function (verify_ts_4_1) {
                exportStar_2(verify_ts_4_1);
            },
            function (random_ts_3_1) {
                exportStar_2(random_ts_3_1);
            },
            function (scalarmult_ts_2_1) {
                exportStar_2(scalarmult_ts_2_1);
            },
            function (secretbox_ts_2_1) {
                exportStar_2(secretbox_ts_2_1);
            },
            function (box_ts_2_1) {
                exportStar_2(box_ts_2_1);
            },
            function (sign_ts_1_1) {
                exportStar_2(sign_ts_1_1);
            },
            function (hash_ts_3_1) {
                exportStar_2(hash_ts_3_1);
            },
            function (auth_ts_1_1) {
                exportStar_2(auth_ts_1_1);
            },
            function (blake2s_ts_1_1) {
                exportStar_2(blake2s_ts_1_1);
            },
            function (blake2b_ts_2_1) {
                exportStar_2(blake2b_ts_2_1);
            },
            function (sealedbox_ts_1_1) {
                exportStar_2(sealedbox_ts_1_1);
            }
        ],
        execute: function () {
        }
    };
});
System.register("file:///Users/synadia/Dropbox/code/src/github.com/aricart/nkeys.js/modules/esm/deps", ["https://deno.land/x/tweetnacl_deno/src/nacl"], function (exports_26, context_26) {
    "use strict";
    var nacl_ts_1, denoHelper;
    var __moduleName = context_26 && context_26.id;
    return {
        setters: [
            function (nacl_ts_1_1) {
                nacl_ts_1 = nacl_ts_1_1;
            }
        ],
        execute: function () {
            exports_26("denoHelper", denoHelper = {
                fromSeed: nacl_ts_1.sign_keyPair_fromSeed,
                sign: nacl_ts_1.sign_detached,
                verify: nacl_ts_1.sign_detached_verify,
                randomBytes: nacl_ts_1.randomBytes,
            });
        }
    };
});
System.register("file:///Users/synadia/Dropbox/code/src/github.com/aricart/nkeys.js/src/crc16", [], function (exports_27, context_27) {
    "use strict";
    var crc16tab, crc16;
    var __moduleName = context_27 && context_27.id;
    return {
        setters: [],
        execute: function () {
            crc16tab = new Uint16Array([
                0x0000,
                0x1021,
                0x2042,
                0x3063,
                0x4084,
                0x50a5,
                0x60c6,
                0x70e7,
                0x8108,
                0x9129,
                0xa14a,
                0xb16b,
                0xc18c,
                0xd1ad,
                0xe1ce,
                0xf1ef,
                0x1231,
                0x0210,
                0x3273,
                0x2252,
                0x52b5,
                0x4294,
                0x72f7,
                0x62d6,
                0x9339,
                0x8318,
                0xb37b,
                0xa35a,
                0xd3bd,
                0xc39c,
                0xf3ff,
                0xe3de,
                0x2462,
                0x3443,
                0x0420,
                0x1401,
                0x64e6,
                0x74c7,
                0x44a4,
                0x5485,
                0xa56a,
                0xb54b,
                0x8528,
                0x9509,
                0xe5ee,
                0xf5cf,
                0xc5ac,
                0xd58d,
                0x3653,
                0x2672,
                0x1611,
                0x0630,
                0x76d7,
                0x66f6,
                0x5695,
                0x46b4,
                0xb75b,
                0xa77a,
                0x9719,
                0x8738,
                0xf7df,
                0xe7fe,
                0xd79d,
                0xc7bc,
                0x48c4,
                0x58e5,
                0x6886,
                0x78a7,
                0x0840,
                0x1861,
                0x2802,
                0x3823,
                0xc9cc,
                0xd9ed,
                0xe98e,
                0xf9af,
                0x8948,
                0x9969,
                0xa90a,
                0xb92b,
                0x5af5,
                0x4ad4,
                0x7ab7,
                0x6a96,
                0x1a71,
                0x0a50,
                0x3a33,
                0x2a12,
                0xdbfd,
                0xcbdc,
                0xfbbf,
                0xeb9e,
                0x9b79,
                0x8b58,
                0xbb3b,
                0xab1a,
                0x6ca6,
                0x7c87,
                0x4ce4,
                0x5cc5,
                0x2c22,
                0x3c03,
                0x0c60,
                0x1c41,
                0xedae,
                0xfd8f,
                0xcdec,
                0xddcd,
                0xad2a,
                0xbd0b,
                0x8d68,
                0x9d49,
                0x7e97,
                0x6eb6,
                0x5ed5,
                0x4ef4,
                0x3e13,
                0x2e32,
                0x1e51,
                0x0e70,
                0xff9f,
                0xefbe,
                0xdfdd,
                0xcffc,
                0xbf1b,
                0xaf3a,
                0x9f59,
                0x8f78,
                0x9188,
                0x81a9,
                0xb1ca,
                0xa1eb,
                0xd10c,
                0xc12d,
                0xf14e,
                0xe16f,
                0x1080,
                0x00a1,
                0x30c2,
                0x20e3,
                0x5004,
                0x4025,
                0x7046,
                0x6067,
                0x83b9,
                0x9398,
                0xa3fb,
                0xb3da,
                0xc33d,
                0xd31c,
                0xe37f,
                0xf35e,
                0x02b1,
                0x1290,
                0x22f3,
                0x32d2,
                0x4235,
                0x5214,
                0x6277,
                0x7256,
                0xb5ea,
                0xa5cb,
                0x95a8,
                0x8589,
                0xf56e,
                0xe54f,
                0xd52c,
                0xc50d,
                0x34e2,
                0x24c3,
                0x14a0,
                0x0481,
                0x7466,
                0x6447,
                0x5424,
                0x4405,
                0xa7db,
                0xb7fa,
                0x8799,
                0x97b8,
                0xe75f,
                0xf77e,
                0xc71d,
                0xd73c,
                0x26d3,
                0x36f2,
                0x0691,
                0x16b0,
                0x6657,
                0x7676,
                0x4615,
                0x5634,
                0xd94c,
                0xc96d,
                0xf90e,
                0xe92f,
                0x99c8,
                0x89e9,
                0xb98a,
                0xa9ab,
                0x5844,
                0x4865,
                0x7806,
                0x6827,
                0x18c0,
                0x08e1,
                0x3882,
                0x28a3,
                0xcb7d,
                0xdb5c,
                0xeb3f,
                0xfb1e,
                0x8bf9,
                0x9bd8,
                0xabbb,
                0xbb9a,
                0x4a75,
                0x5a54,
                0x6a37,
                0x7a16,
                0x0af1,
                0x1ad0,
                0x2ab3,
                0x3a92,
                0xfd2e,
                0xed0f,
                0xdd6c,
                0xcd4d,
                0xbdaa,
                0xad8b,
                0x9de8,
                0x8dc9,
                0x7c26,
                0x6c07,
                0x5c64,
                0x4c45,
                0x3ca2,
                0x2c83,
                0x1ce0,
                0x0cc1,
                0xef1f,
                0xff3e,
                0xcf5d,
                0xdf7c,
                0xaf9b,
                0xbfba,
                0x8fd9,
                0x9ff8,
                0x6e17,
                0x7e36,
                0x4e55,
                0x5e74,
                0x2e93,
                0x3eb2,
                0x0ed1,
                0x1ef0,
            ]);
            crc16 = class crc16 {
                static checksum(data) {
                    let crc = 0;
                    for (let i = 0; i < data.byteLength; i++) {
                        let b = data[i];
                        crc = ((crc << 8) & 0xffff) ^ crc16tab[((crc >> 8) ^ (b)) & 0x00FF];
                    }
                    return crc;
                }
                static validate(data, expected) {
                    let ba = crc16.checksum(data);
                    return ba == expected;
                }
            };
            exports_27("crc16", crc16);
        }
    };
});
System.register("file:///Users/synadia/Dropbox/code/src/github.com/aricart/nkeys.js/src/base32", [], function (exports_28, context_28) {
    "use strict";
    var base32;
    var __moduleName = context_28 && context_28.id;
    return {
        setters: [],
        execute: function () {
            base32 = (() => {
                class base32 {
                    static encode(src) {
                        let bits = 0;
                        let value = 0;
                        let a = new Uint8Array(src);
                        let buf = new Uint8Array(src.byteLength * 2);
                        let j = 0;
                        for (let i = 0; i < a.byteLength; i++) {
                            value = (value << 8) | a[i];
                            bits += 8;
                            while (bits >= 5) {
                                let index = (value >>> (bits - 5)) & 31;
                                buf[j++] = base32.alphabet.charAt(index).charCodeAt(0);
                                bits -= 5;
                            }
                        }
                        if (bits > 0) {
                            let index = (value << (5 - bits)) & 31;
                            buf[j++] = base32.alphabet.charAt(index).charCodeAt(0);
                        }
                        return buf.slice(0, j);
                    }
                    static decode(src) {
                        let bits = 0;
                        let byte = 0;
                        let j = 0;
                        let a = new Uint8Array(src);
                        let out = new Uint8Array(a.byteLength * 5 / 8 | 0);
                        for (let i = 0; i < a.byteLength; i++) {
                            let v = String.fromCharCode(a[i]);
                            let vv = base32.alphabet.indexOf(v);
                            if (vv === -1) {
                                throw new Error("Illegal Base32 character: " + a[i]);
                            }
                            byte = (byte << 5) | vv;
                            bits += 5;
                            if (bits >= 8) {
                                out[j++] = (byte >>> (bits - 8)) & 255;
                                bits -= 8;
                            }
                        }
                        return out.slice(0, j);
                    }
                }
                base32.alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
                return base32;
            })();
            exports_28("base32", base32);
        }
    };
});
System.register("file:///Users/synadia/Dropbox/code/src/github.com/aricart/nkeys.js/src/codec", ["file:///Users/synadia/Dropbox/code/src/github.com/aricart/nkeys.js/src/crc16", "file:///Users/synadia/Dropbox/code/src/github.com/aricart/nkeys.js/src/nkeys", "file:///Users/synadia/Dropbox/code/src/github.com/aricart/nkeys.js/src/base32"], function (exports_29, context_29) {
    "use strict";
    var crc16_ts_1, nkeys_ts_1, base32_ts_1, Codec;
    var __moduleName = context_29 && context_29.id;
    return {
        setters: [
            function (crc16_ts_1_1) {
                crc16_ts_1 = crc16_ts_1_1;
            },
            function (nkeys_ts_1_1) {
                nkeys_ts_1 = nkeys_ts_1_1;
            },
            function (base32_ts_1_1) {
                base32_ts_1 = base32_ts_1_1;
            }
        ],
        execute: function () {
            Codec = class Codec {
                static encode(prefix, src) {
                    if (!src || !(src instanceof Uint8Array)) {
                        throw new nkeys_ts_1.NKeysError(nkeys_ts_1.NKeysErrorCode.SerializationError);
                    }
                    if (!nkeys_ts_1.Prefixes.isValidPrefix(prefix)) {
                        throw new nkeys_ts_1.NKeysError(nkeys_ts_1.NKeysErrorCode.InvalidPrefixByte);
                    }
                    return Codec._encode(false, prefix, src);
                }
                static encodeSeed(role, src) {
                    if (!src) {
                        throw new nkeys_ts_1.NKeysError(nkeys_ts_1.NKeysErrorCode.ApiError);
                    }
                    if (!nkeys_ts_1.Prefixes.isValidPublicPrefix(role)) {
                        throw new nkeys_ts_1.NKeysError(nkeys_ts_1.NKeysErrorCode.InvalidPrefixByte);
                    }
                    if (src.byteLength !== 32) {
                        throw new nkeys_ts_1.NKeysError(nkeys_ts_1.NKeysErrorCode.InvalidSeedLen);
                    }
                    return Codec._encode(true, role, src);
                }
                static decode(expected, src) {
                    if (!nkeys_ts_1.Prefixes.isValidPrefix(expected)) {
                        throw new nkeys_ts_1.NKeysError(nkeys_ts_1.NKeysErrorCode.InvalidPrefixByte);
                    }
                    const raw = Codec._decode(src);
                    if (raw[0] !== expected) {
                        throw new nkeys_ts_1.NKeysError(nkeys_ts_1.NKeysErrorCode.InvalidPrefixByte);
                    }
                    return raw.slice(1);
                }
                static decodeSeed(src) {
                    const raw = Codec._decode(src);
                    const prefix = Codec._decodePrefix(raw);
                    if (prefix[0] != nkeys_ts_1.Prefix.Seed) {
                        throw new nkeys_ts_1.NKeysError(nkeys_ts_1.NKeysErrorCode.InvalidSeed);
                    }
                    if (!nkeys_ts_1.Prefixes.isValidPublicPrefix(prefix[1])) {
                        throw new nkeys_ts_1.NKeysError(nkeys_ts_1.NKeysErrorCode.InvalidPrefixByte);
                    }
                    return ({ buf: raw.slice(2), prefix: prefix[1] });
                }
                static _encode(seed, role, payload) {
                    const payloadOffset = seed ? 2 : 1;
                    const payloadLen = payload.byteLength;
                    const checkLen = 2;
                    const cap = payloadOffset + payloadLen + checkLen;
                    const checkOffset = payloadOffset + payloadLen;
                    const raw = new Uint8Array(cap);
                    if (seed) {
                        const encodedPrefix = Codec._encodePrefix(nkeys_ts_1.Prefix.Seed, role);
                        raw.set(encodedPrefix);
                    }
                    else {
                        raw[0] = role;
                    }
                    raw.set(payload, payloadOffset);
                    const checksum = crc16_ts_1.crc16.checksum(raw.slice(0, checkOffset));
                    const dv = new DataView(raw.buffer);
                    dv.setUint16(checkOffset, checksum, true);
                    return base32_ts_1.base32.encode(raw);
                }
                static _decode(src) {
                    if (src.byteLength < 4) {
                        throw new nkeys_ts_1.NKeysError(nkeys_ts_1.NKeysErrorCode.InvalidEncoding);
                    }
                    let raw;
                    try {
                        raw = base32_ts_1.base32.decode(src);
                    }
                    catch (ex) {
                        throw new nkeys_ts_1.NKeysError(nkeys_ts_1.NKeysErrorCode.InvalidEncoding, ex);
                    }
                    const checkOffset = raw.byteLength - 2;
                    const dv = new DataView(raw.buffer);
                    const checksum = dv.getUint16(checkOffset, true);
                    const payload = raw.slice(0, checkOffset);
                    if (!crc16_ts_1.crc16.validate(payload, checksum)) {
                        throw new nkeys_ts_1.NKeysError(nkeys_ts_1.NKeysErrorCode.InvalidChecksum);
                    }
                    return payload;
                }
                static _encodePrefix(kind, role) {
                    const b1 = kind | (role >> 5);
                    const b2 = (role & 31) << 3;
                    return new Uint8Array([b1, b2]);
                }
                static _decodePrefix(raw) {
                    const b1 = raw[0] & 248;
                    const b2 = (raw[0] & 7) << 5 | ((raw[1] & 248) >> 3);
                    return new Uint8Array([b1, b2]);
                }
            };
            exports_29("Codec", Codec);
        }
    };
});
System.register("file:///Users/synadia/Dropbox/code/src/github.com/aricart/nkeys.js/src/kp", ["file:///Users/synadia/Dropbox/code/src/github.com/aricart/nkeys.js/src/codec", "file:///Users/synadia/Dropbox/code/src/github.com/aricart/nkeys.js/src/nkeys", "file:///Users/synadia/Dropbox/code/src/github.com/aricart/nkeys.js/src/helper"], function (exports_30, context_30) {
    "use strict";
    var codec_ts_1, nkeys_ts_2, helper_ts_1, KP;
    var __moduleName = context_30 && context_30.id;
    return {
        setters: [
            function (codec_ts_1_1) {
                codec_ts_1 = codec_ts_1_1;
            },
            function (nkeys_ts_2_1) {
                nkeys_ts_2 = nkeys_ts_2_1;
            },
            function (helper_ts_1_1) {
                helper_ts_1 = helper_ts_1_1;
            }
        ],
        execute: function () {
            KP = class KP {
                constructor(seed) {
                    this.seed = seed;
                }
                getRawSeed() {
                    if (!this.seed) {
                        throw new nkeys_ts_2.NKeysError(nkeys_ts_2.NKeysErrorCode.ClearedPair);
                    }
                    let sd = codec_ts_1.Codec.decodeSeed(this.seed);
                    return sd.buf;
                }
                getSeed() {
                    if (!this.seed) {
                        throw new nkeys_ts_2.NKeysError(nkeys_ts_2.NKeysErrorCode.ClearedPair);
                    }
                    return this.seed;
                }
                getPublicKey() {
                    if (!this.seed) {
                        throw new nkeys_ts_2.NKeysError(nkeys_ts_2.NKeysErrorCode.ClearedPair);
                    }
                    const sd = codec_ts_1.Codec.decodeSeed(this.seed);
                    const kp = helper_ts_1.getEd25519Helper().fromSeed(this.getRawSeed());
                    const buf = codec_ts_1.Codec.encode(sd.prefix, kp.publicKey);
                    return new TextDecoder().decode(buf);
                }
                getPrivateKey() {
                    if (!this.seed) {
                        throw new nkeys_ts_2.NKeysError(nkeys_ts_2.NKeysErrorCode.ClearedPair);
                    }
                    const kp = helper_ts_1.getEd25519Helper().fromSeed(this.getRawSeed());
                    return codec_ts_1.Codec.encode(nkeys_ts_2.Prefix.Private, kp.secretKey);
                }
                sign(input) {
                    if (!this.seed) {
                        throw new nkeys_ts_2.NKeysError(nkeys_ts_2.NKeysErrorCode.ClearedPair);
                    }
                    const kp = helper_ts_1.getEd25519Helper().fromSeed(this.getRawSeed());
                    return helper_ts_1.getEd25519Helper().sign(input, kp.secretKey);
                }
                verify(input, sig) {
                    if (!this.seed) {
                        throw new nkeys_ts_2.NKeysError(nkeys_ts_2.NKeysErrorCode.ClearedPair);
                    }
                    const kp = helper_ts_1.getEd25519Helper().fromSeed(this.getRawSeed());
                    return helper_ts_1.getEd25519Helper().verify(input, sig, kp.publicKey);
                }
                clear() {
                    if (!this.seed) {
                        return;
                    }
                    this.seed.fill(0);
                    this.seed = undefined;
                }
            };
            exports_30("KP", KP);
        }
    };
});
System.register("file:///Users/synadia/Dropbox/code/src/github.com/aricart/nkeys.js/src/public", ["file:///Users/synadia/Dropbox/code/src/github.com/aricart/nkeys.js/src/codec", "file:///Users/synadia/Dropbox/code/src/github.com/aricart/nkeys.js/src/nkeys", "file:///Users/synadia/Dropbox/code/src/github.com/aricart/nkeys.js/src/helper"], function (exports_31, context_31) {
    "use strict";
    var codec_ts_2, nkeys_ts_3, helper_ts_2, PublicKey;
    var __moduleName = context_31 && context_31.id;
    return {
        setters: [
            function (codec_ts_2_1) {
                codec_ts_2 = codec_ts_2_1;
            },
            function (nkeys_ts_3_1) {
                nkeys_ts_3 = nkeys_ts_3_1;
            },
            function (helper_ts_2_1) {
                helper_ts_2 = helper_ts_2_1;
            }
        ],
        execute: function () {
            PublicKey = class PublicKey {
                constructor(publicKey) {
                    this.publicKey = publicKey;
                }
                getPublicKey() {
                    if (!this.publicKey) {
                        throw new nkeys_ts_3.NKeysError(nkeys_ts_3.NKeysErrorCode.ClearedPair);
                    }
                    return new TextDecoder().decode(this.publicKey);
                }
                getPrivateKey() {
                    if (!this.publicKey) {
                        throw new nkeys_ts_3.NKeysError(nkeys_ts_3.NKeysErrorCode.ClearedPair);
                    }
                    throw new nkeys_ts_3.NKeysError(nkeys_ts_3.NKeysErrorCode.PublicKeyOnly);
                }
                getSeed() {
                    if (!this.publicKey) {
                        throw new nkeys_ts_3.NKeysError(nkeys_ts_3.NKeysErrorCode.ClearedPair);
                    }
                    throw new nkeys_ts_3.NKeysError(nkeys_ts_3.NKeysErrorCode.PublicKeyOnly);
                }
                sign(_) {
                    if (!this.publicKey) {
                        throw new nkeys_ts_3.NKeysError(nkeys_ts_3.NKeysErrorCode.ClearedPair);
                    }
                    throw new nkeys_ts_3.NKeysError(nkeys_ts_3.NKeysErrorCode.CannotSign);
                }
                verify(input, sig) {
                    if (!this.publicKey) {
                        throw new nkeys_ts_3.NKeysError(nkeys_ts_3.NKeysErrorCode.ClearedPair);
                    }
                    let buf = codec_ts_2.Codec._decode(this.publicKey);
                    return helper_ts_2.getEd25519Helper().verify(input, sig, buf.slice(1));
                }
                clear() {
                    if (!this.publicKey) {
                        return;
                    }
                    this.publicKey.fill(0);
                    this.publicKey = undefined;
                }
            };
            exports_31("PublicKey", PublicKey);
        }
    };
});
System.register("file:///Users/synadia/Dropbox/code/src/github.com/aricart/nkeys.js/src/nkeys", ["file:///Users/synadia/Dropbox/code/src/github.com/aricart/nkeys.js/src/kp", "file:///Users/synadia/Dropbox/code/src/github.com/aricart/nkeys.js/src/public", "file:///Users/synadia/Dropbox/code/src/github.com/aricart/nkeys.js/src/codec", "file:///Users/synadia/Dropbox/code/src/github.com/aricart/nkeys.js/src/helper"], function (exports_32, context_32) {
    "use strict";
    var kp_ts_1, public_ts_1, codec_ts_3, helper_ts_3, Prefix, Prefixes, NKeysErrorCode, NKeysError;
    var __moduleName = context_32 && context_32.id;
    function createPair(prefix) {
        const rawSeed = helper_ts_3.getEd25519Helper().randomBytes(32);
        let str = codec_ts_3.Codec.encodeSeed(prefix, new Uint8Array(rawSeed));
        return new kp_ts_1.KP(str);
    }
    exports_32("createPair", createPair);
    function createOperator() {
        return createPair(Prefix.Operator);
    }
    exports_32("createOperator", createOperator);
    function createAccount() {
        return createPair(Prefix.Account);
    }
    exports_32("createAccount", createAccount);
    function createUser() {
        return createPair(Prefix.User);
    }
    exports_32("createUser", createUser);
    function createCluster() {
        return createPair(Prefix.Cluster);
    }
    exports_32("createCluster", createCluster);
    function createServer() {
        return createPair(Prefix.Server);
    }
    exports_32("createServer", createServer);
    function fromPublic(src) {
        const ba = new TextEncoder().encode(src);
        const raw = codec_ts_3.Codec._decode(ba);
        const prefix = Prefixes.parsePrefix(raw[0]);
        if (Prefixes.isValidPublicPrefix(prefix)) {
            return new public_ts_1.PublicKey(ba);
        }
        throw new NKeysError(NKeysErrorCode.InvalidPublicKey);
    }
    exports_32("fromPublic", fromPublic);
    function fromSeed(src) {
        codec_ts_3.Codec.decodeSeed(src);
        return new kp_ts_1.KP(src);
    }
    exports_32("fromSeed", fromSeed);
    return {
        setters: [
            function (kp_ts_1_1) {
                kp_ts_1 = kp_ts_1_1;
            },
            function (public_ts_1_1) {
                public_ts_1 = public_ts_1_1;
            },
            function (codec_ts_3_1) {
                codec_ts_3 = codec_ts_3_1;
            },
            function (helper_ts_3_1) {
                helper_ts_3 = helper_ts_3_1;
            }
        ],
        execute: function () {
            (function (Prefix) {
                Prefix[Prefix["Seed"] = 144] = "Seed";
                Prefix[Prefix["Private"] = 120] = "Private";
                Prefix[Prefix["Operator"] = 112] = "Operator";
                Prefix[Prefix["Server"] = 104] = "Server";
                Prefix[Prefix["Cluster"] = 16] = "Cluster";
                Prefix[Prefix["Account"] = 0] = "Account";
                Prefix[Prefix["User"] = 160] = "User";
            })(Prefix || (Prefix = {}));
            exports_32("Prefix", Prefix);
            Prefixes = class Prefixes {
                static isValidPublicPrefix(prefix) {
                    return prefix == Prefix.Server ||
                        prefix == Prefix.Operator ||
                        prefix == Prefix.Cluster ||
                        prefix == Prefix.Account ||
                        prefix == Prefix.User;
                }
                static startsWithValidPrefix(s) {
                    let c = s[0];
                    return c == "S" || c == "P" || c == "O" || c == "N" || c == "C" ||
                        c == "A" || c == "U";
                }
                static isValidPrefix(prefix) {
                    let v = this.parsePrefix(prefix);
                    return v != -1;
                }
                static parsePrefix(v) {
                    switch (v) {
                        case Prefix.Seed:
                            return Prefix.Seed;
                        case Prefix.Private:
                            return Prefix.Private;
                        case Prefix.Operator:
                            return Prefix.Operator;
                        case Prefix.Server:
                            return Prefix.Server;
                        case Prefix.Cluster:
                            return Prefix.Cluster;
                        case Prefix.Account:
                            return Prefix.Account;
                        case Prefix.User:
                            return Prefix.User;
                        default:
                            return -1;
                    }
                }
            };
            exports_32("Prefixes", Prefixes);
            (function (NKeysErrorCode) {
                NKeysErrorCode["InvalidPrefixByte"] = "nkeys: invalid prefix byte";
                NKeysErrorCode["InvalidKey"] = "nkeys: invalid key";
                NKeysErrorCode["InvalidPublicKey"] = "nkeys: invalid public key";
                NKeysErrorCode["InvalidSeedLen"] = "nkeys: invalid seed length";
                NKeysErrorCode["InvalidSeed"] = "nkeys: invalid seed";
                NKeysErrorCode["InvalidEncoding"] = "nkeys: invalid encoded key";
                NKeysErrorCode["InvalidSignature"] = "nkeys: signature verification failed";
                NKeysErrorCode["CannotSign"] = "nkeys: cannot sign, no private key available";
                NKeysErrorCode["PublicKeyOnly"] = "nkeys: no seed or private key available";
                NKeysErrorCode["InvalidChecksum"] = "nkeys: invalid checksum";
                NKeysErrorCode["SerializationError"] = "nkeys: serialization error";
                NKeysErrorCode["ApiError"] = "nkeys: api error";
                NKeysErrorCode["ClearedPair"] = "nkeys: pair is cleared";
            })(NKeysErrorCode || (NKeysErrorCode = {}));
            exports_32("NKeysErrorCode", NKeysErrorCode);
            NKeysError = class NKeysError extends Error {
                constructor(code, chainedError) {
                    super(code);
                    this.name = "NKeysError";
                    this.code = code;
                    this.chainedError = chainedError;
                }
            };
            exports_32("NKeysError", NKeysError);
        }
    };
});
System.register("file:///Users/synadia/Dropbox/code/src/github.com/aricart/nkeys.js/src/util", [], function (exports_33, context_33) {
    "use strict";
    var __moduleName = context_33 && context_33.id;
    function encode(bytes) {
        return btoa(String.fromCharCode(...bytes));
    }
    exports_33("encode", encode);
    function decode(b64str) {
        b64str = b64str.split("_").join("/");
        b64str = b64str.split("-").join("+");
        const bin = atob(b64str);
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) {
            bytes[i] = bin.charCodeAt(i);
        }
        return bytes;
    }
    exports_33("decode", decode);
    function dump(buf, msg) {
        if (msg) {
            console.log(msg);
        }
        let a = [];
        for (let i = 0; i < buf.byteLength; i++) {
            if (i % 8 === 0) {
                a.push("\n");
            }
            let v = buf[i].toString(16);
            if (v.length === 1) {
                v = "0" + v;
            }
            a.push(v);
        }
        console.log(a.join("  "));
    }
    exports_33("dump", dump);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("file:///Users/synadia/Dropbox/code/src/github.com/aricart/nkeys.js/src/mod", ["file:///Users/synadia/Dropbox/code/src/github.com/aricart/nkeys.js/src/nkeys", "file:///Users/synadia/Dropbox/code/src/github.com/aricart/nkeys.js/src/util"], function (exports_34, context_34) {
    "use strict";
    var __moduleName = context_34 && context_34.id;
    return {
        setters: [
            function (nkeys_ts_4_1) {
                exports_34({
                    "createPair": nkeys_ts_4_1["createPair"],
                    "createAccount": nkeys_ts_4_1["createAccount"],
                    "createUser": nkeys_ts_4_1["createUser"],
                    "createOperator": nkeys_ts_4_1["createOperator"],
                    "fromPublic": nkeys_ts_4_1["fromPublic"],
                    "fromSeed": nkeys_ts_4_1["fromSeed"],
                    "NKeysError": nkeys_ts_4_1["NKeysError"],
                    "NKeysErrorCode": nkeys_ts_4_1["NKeysErrorCode"]
                });
            },
            function (util_ts_1_1) {
                exports_34({
                    "encode": util_ts_1_1["encode"],
                    "decode": util_ts_1_1["decode"]
                });
            }
        ],
        execute: function () {
        }
    };
});
System.register("file:///Users/synadia/Dropbox/code/src/github.com/aricart/nkeys.js/modules/esm/mod", ["file:///Users/synadia/Dropbox/code/src/github.com/aricart/nkeys.js/modules/esm/deps", "file:///Users/synadia/Dropbox/code/src/github.com/aricart/nkeys.js/src/helper", "file:///Users/synadia/Dropbox/code/src/github.com/aricart/nkeys.js/src/mod"], function (exports_35, context_35) {
    "use strict";
    var deps_ts_1, helper_ts_4;
    var __moduleName = context_35 && context_35.id;
    function exportStar_3(m) {
        var exports = {};
        for (var n in m) {
            if (n !== "default") exports[n] = m[n];
        }
        exports_35(exports);
    }
    return {
        setters: [
            function (deps_ts_1_1) {
                deps_ts_1 = deps_ts_1_1;
            },
            function (helper_ts_4_1) {
                helper_ts_4 = helper_ts_4_1;
            },
            function (mod_ts_1_1) {
                exportStar_3(mod_ts_1_1);
            }
        ],
        execute: function () {
            helper_ts_4.setEd25519Helper(deps_ts_1.denoHelper);
        }
    };
});

const __exp = __instantiate("file:///Users/synadia/Dropbox/code/src/github.com/aricart/nkeys.js/modules/esm/mod", false);
export const createPair = __exp["createPair"];
export const createAccount = __exp["createAccount"];
export const createUser = __exp["createUser"];
export const createOperator = __exp["createOperator"];
export const fromPublic = __exp["fromPublic"];
export const fromSeed = __exp["fromSeed"];
export const KeyPair = __exp["KeyPair"];
export const NKeysError = __exp["NKeysError"];
export const NKeysErrorCode = __exp["NKeysErrorCode"];
export const encode = __exp["encode"];
export const decode = __exp["decode"];
