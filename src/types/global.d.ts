/// <reference types="bun-types" />

declare global {
  // Bun já tem console e process globalmente disponíveis
  // Este arquivo garante que o TypeScript reconheça essas APIs
  var console: Console;
  var process: NodeJS.Process;
}

export {};

