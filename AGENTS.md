# AGENTS

## Project Context

This repository contains automation rules for Wiren Board.

Rules are authored in TypeScript and then compiled to ES5 JavaScript for execution in the `wb-rules` runtime.

Source files are located in `src/`.
Compiled output is located in `dist/es5/`.

## Guidance For AI Agents

When working with rules in this repository:

- Treat `src/wb-rules/**/*.ts` and `src/wb-rules-modules/**/*.ts` as the source of truth.
- Do not manually edit files in `dist/es5/`. They are compiled artifacts and should only change as a result of the build process.
- Keep compatibility with ES5/Duktape in mind. Do not rely on modern runtime features unless they are transpiled safely and supported in the target environment.
- If you add helper functions or change rule logic, verify that the generated JavaScript in `dist/es5/` remains compatible with the Wiren Board runtime.
- When you need documentation for writing or maintaining Wiren Board rules, use the official `wb-rules` repository: https://github.com/wirenboard/wb-rules

## Practical Notes

- Runtime scripts executed on the controller are JavaScript, not TypeScript.
- TypeScript in this project is a development convenience layer; deployment target is ES5 JavaScript.
- Prefer implementation patterns that are simple, explicit, and safe for the `wb-rules` engine.
