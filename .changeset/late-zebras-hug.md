---
'react-hook-action': patch
---

Fixed an issue where the `dist` directory was missing from the published package by adding `pnpm build` to the `prepublishOnly` script.
