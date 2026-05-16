# Smash City — Arcade Edition

Smash City is a small browser-based arcade game where you pilot a jet, dodge falling hazards, and try to travel as far as possible. Built with HTML, CSS, and JavaScript (jQuery).

## Objective

- Survive as long as possible and maximize your distance (displayed as `D: Xm`).
- Avoid regular falling stars (they damage your fuel). Collecting a rare "super star" refills your fuel.
- The game ends when your fuel is depleted.

## Controls

- Desktop: Use the Left and Right arrow keys to move the jet.
- Mobile / Touch: Tap the on-screen LEFT and RIGHT buttons to move.
- Press the "LAUNCH GAME" button to start.
- On the Game Over screen you can `RESTART` or `SAVE CARD` to download a PNG score card.

## HUD / UI

- Distance: Shown as `D: 0m` and increments over time.
- Fuel: A percentage and segmented fuel bar show remaining fuel; fuel decreases when you hit hazards.
- Super alert: When a super star spawns, a power-up alert appears.

## Files

- `index.html` — Main game page and UI.
- `gameScript.js` — Game logic (spawning hazards, collision, controls, HUD updates).
- `style.css` — Styling and layout.
- `v0.html` — Alternate/versioned HTML (if provided).

## Libraries

- jQuery (loaded from CDN)
- html2canvas (used to capture/save the score card)

## How to run

- Easiest: open `index.html` in your browser.
- Recommended (serving via local server to avoid any asset/CSP issues):

```bash
# Python 3
python -m http.server 8000
# Then open http://localhost:8000/ in your browser
```

## Tips & Notes

- The game attempts full-screen on mobile when you press Start (may require user permission).
- Super stars (rare) reset your hit counter and refill fuel — try to catch them.
- If the screen flashes red, you took damage; the fuel bar will update accordingly.

## Credits

- Game developed by K. Phani Kumar (linked in the in-game credits).

---

Enjoy Smash City! If you want, I can also:

- Add a `package.json` and a tiny dev server script.
- Add a high-score saving mechanism (localStorage).
- Polish the README with screenshots or an example score image.
