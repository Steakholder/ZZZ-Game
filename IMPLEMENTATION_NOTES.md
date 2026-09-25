# Zenless Zone Zero TCG — Initial TCGA Files

Files:
- `gamefile.json` — main TCG Arena game configuration.
- `cards.json` — card database, with raw GitHub image URLs.
- `zzz-game.js` — start-of-turn Polychrome automation.

Repositories:
- Card images/backs: https://raw.githubusercontent.com/Steakholder/ZZZ/main/
- Game files: https://raw.githubusercontent.com/Steakholder/ZZZ-Game/main/

Card backs:
- Polychrome -> 0_back.webp
- Monochrome -> 1_back.webp
- Bangboo -> 2_back.webp
- All other cards -> 3_back.webp

Important:
TCG Arena's documented declarative deck rules support a total main-deck min/max and
per-category min/max, but do not document a cross-category arithmetic rule such as
`Polychrome + Monochrome = 20`. The configuration therefore permits 0–20 of each
currency category; the intended combined total of 20 is documented in the game help
and should be enforced by a future deck-validation mechanism if/when the engine exposes
one.

Costs in cards.json are currently 0 because no gameplay cost values were specified.
They can be filled in later without changing the card IDs or image URLs.
