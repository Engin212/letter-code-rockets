# Changelog

All notable changes to **Letter Code Rockets** are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project aims to follow [Semantic Versioning](https://semver.org/).

## [0.2.0] - 2026-04-23

### Gentler pacing
- Round duration extended from **90s to 100s** for a more relaxed experience.
- Rocket speeds and spawn intervals eased across **all five levels** (~20–25% gentler overall).
- Smoother level progression: **22 seconds per level** (up from 18s).

### Friendlier star system
Star thresholds now reward effort rather than perfection:

| Stars | Escaped rockets | Wrong key presses |
|------:|:---------------:|:-----------------:|
| ⭐⭐⭐ | up to 8         | up to 20          |
| ⭐⭐  | up to 20        | up to 35          |
| ⭐   | for finishing the round | —         |

### Why
Making the game easier to pick up for early readers and new typists, while keeping it fun to replay for everyone else.

## [0.1.0] - 2026-04-20

### Added
- Initial public release of Letter Code Rockets — a free, open-source typing game for kids with zero data collection.
- Turkish, English, and Spanish keyboard layouts.
- Adaptive letter bag that rebalances across top / home / bottom rows and gently repeats letters the player struggles with.
- Per-round learning summary highlighting strongest letters and letters to practice more.
- Web Audio API sound effects with a mute toggle.
- Runs entirely in the browser, offline-friendly — no tracking, ads, accounts, or cookies.
