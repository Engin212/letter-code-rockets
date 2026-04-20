# Privacy Statement

**Letter Code Rockets does not collect, transmit, sell, or share any information about the people who play it.**

This statement describes, in plain language, everything the game does and does not do with data. If you find anything inaccurate in the source code, please open an issue — this document must match the code.

## What we do not do

The game does **not**:

- Use cookies.
- Use Google Analytics, Mixpanel, Segment, Amplitude, Hotjar, Sentry, Firebase, Supabase, or any other analytics / tracking / telemetry service.
- Load scripts, fonts, or assets from external CDNs at runtime.
- Make any network requests (`fetch`, `XMLHttpRequest`, `WebSocket`, `sendBeacon`, etc.) once the page is loaded.
- Show advertisements.
- Require or offer any kind of account, sign-up, or login.
- Record keystrokes, mouse movement, session replays, or gameplay footage.
- Use fingerprinting (canvas, WebGL, audio, font enumeration, etc.).
- Transmit anything — scores, settings, device info, IP address, or otherwise — to any server.

This has been verified by source-code audit. You can verify it yourself by searching the repository for the keywords above.

## What we do locally (on the player's own device)

The game uses the browser's `localStorage` to remember **one thing**:

| Key | Value | Purpose |
| --- | --- | --- |
| `spaceTypingLanguageV4` | `"tr"`, `"en"`, or `"es"` | Remember the player's chosen language so they don't have to re-select it every visit. |

This value **stays on the player's own device**. It is never sent anywhere. It is not accessible to us, any third party, or any other website. Any user can clear it by using their browser's "Clear site data" function.

No gameplay statistics (score, accuracy, letters struggled with, etc.) are persisted between sessions. When the game ends, the learning summary is shown for that session only and then discarded.

## Sounds

All in-game sounds are generated in real time using the browser's built-in Web Audio API (oscillators). **No audio files are downloaded**.

## Hosting

This project is a static website. When deployed to a host (e.g., GitHub Pages, Netlify, Vercel, Cloudflare Pages), that host will naturally see visitor HTTP requests and may log them per its own policies — this is outside the control of the game's source code. If you self-host or deploy it yourself, you choose the host and its privacy behavior.

## Dependencies

Runtime dependencies (shipped to the browser): `react`, `react-dom`, `tailwindcss`, `lucide-react`. None of these phone home at runtime in the configuration used here.

## Changes

If any future change to the code introduces data collection, network calls, or tracking of any kind, this file must be updated in the same pull request, and the change should be explicitly explained in the release notes. Silent additions of data collection are considered a bug and should be reported.

## Contact

For privacy questions or concerns, open an issue on the repository.
