# Contributing to Letter Code Rockets

Thanks for wanting to help! This project is built for children worldwide, and every improvement — whether it's a new language, a bug report from a classroom, or a pixel-perfect UI fix — is appreciated.

## Ways to contribute

You don't have to write code to help:

- **Try it with a kid and tell us what happened.** Open an issue describing the child's age, language, and what worked or didn't. This kind of feedback is gold.
- **Report bugs.** Include browser, OS, and a short description. A screenshot or short video helps a lot.
- **Suggest improvements.** New game modes, accessibility tweaks, visual ideas — open an issue and describe it.
- **Translate the UI** into a new language (see below).
- **Write code** to fix bugs or add features.

## Guiding principles

Before proposing a change, please make sure it fits these principles:

1. **Safety first.** No code, dependency, or feature that collects user data, shows ads, or makes network calls may be added. This is not negotiable. See [PRIVACY.md](PRIVACY.md).
2. **Child-friendly.** No punishing mechanics, no harsh sounds, no time pressure beyond the round timer. The game should feel warm and forgiving.
3. **Keep it simple.** This is a single-page React app with no backend. Resist the urge to add frameworks, state libraries, or build complexity unless there's a real reason.
4. **No account, no login, no sign-up.** Ever.

## Reporting issues

Use GitHub Issues. A good issue includes:

- What you expected to happen
- What actually happened
- Steps to reproduce (if it's a bug)
- Browser / OS / device

## Submitting a pull request

1. Fork the repository.
2. Create a branch: `git checkout -b my-change`.
3. Make your change. Keep the diff small and focused on one thing.
4. Run the game locally and confirm nothing is broken: `npm install && npm run dev`.
5. Run the linter: `npm run lint`.
6. Commit with a clear message describing the "why", not just the "what".
7. Push and open a pull request. Describe what changed and why, and link any related issue.

If your PR adds new user-visible strings, please add them to all three language tables (`tr`, `en`, `es`) in `src/App.jsx`. If you don't speak one of those languages, add an English placeholder and mention it in the PR — someone else can translate.

## Adding a new language

1. Add a new key to `KEYBOARD_ROWS` in `src/App.jsx` with the `top`, `home`, and `bottom` row letters for that language's standard keyboard layout.
2. Add a matching key to `TEXT` with all the UI strings translated.
3. Add a button for the language in the sidebar (the list where `tr`, `en`, `es` buttons are rendered).
4. Test by switching to your new language and playing a round.
5. Open a PR.

## Code style

- The project uses ESLint; keep `npm run lint` clean.
- Prefer small, obvious changes over clever refactors.
- Avoid adding runtime dependencies unless absolutely necessary.
- Don't add comments that just restate the code; add a comment only when the "why" is non-obvious.

## License

By contributing, you agree that your contributions will be licensed under the project's [MIT License](LICENSE).
