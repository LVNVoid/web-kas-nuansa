import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";
import { webcrypto } from "crypto";

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;
Object.defineProperty(global, "crypto", {
  value: webcrypto,
  writable: true,
});

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const undici = require("undici");
  global.Request = undici.Request;
  global.Response = undici.Response;
  global.Headers = undici.Headers;
  global.fetch = undici.fetch;
} catch {
  // Ignore if undici is not found
}
