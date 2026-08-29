import { register } from "node:module";

// Entry point for `node --import`. Registers the "@/" resolver in the loader
// thread so test files can import the app's own modules.
register(new URL("./alias-hooks.mjs", import.meta.url));
