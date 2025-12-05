// jest.polyfills.js
// Polyfills complets et compatibles Next.js 15/16 + Jest 30 + Node.js 18/20/22

// 1. TextEncoder / TextDecoder / ReadableStream (nécessaires à Next.js)
import { TextEncoder, TextDecoder } from 'util';
import { ReadableStream } from 'stream/web';

Object.defineProperties(globalThis, {
  TextEncoder: { value: TextEncoder, writable: true },
  TextDecoder: { value: TextDecoder, writable: true },
  ReadableStream: { value: ReadableStream, writable: true },
});

// 2. structuredClone (Next.js 15+ l’utilise partout)
globalThis.structuredClone ??= (value) => {
  // Solution simple et robuste (suffisante pour les tests)
  return JSON.parse(JSON.stringify(value));
};

// 3. fetch (whatwg-fetch ou polyfill natif)
import 'whatwg-fetch';

// Optionnel : si tu veux un fetch mocké propre
// globalThis.fetch = jest.fn();

// 4. Autres globals parfois manquants
globalThis.Request ??= class Request {};
globalThis.Response ??= class Response {};
globalThis.Headers ??= class Headers {};
globalThis.URL ??= class URL {};