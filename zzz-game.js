// ZZZ TCG Arena automation
// Runs once per player's new turn. Scripts may only modify the current player's cards.
async function zzzStartOfTurn() {
  if (!game?.turn?.isMyTurn) return

  // The normal 2-card Main Deck draw is handled by gameplay.newTurn.
  // This script handles the separate Polychrome draw.
  const polyDeck = cards?.Polychrome
  if (polyDeck && polyDeck.length > 0) {
    await functions.drawFromExtraDeck("Polychrome", 1, false, "Wallet")
  }

  // TCG Arena normally untaps cards automatically at turn change.
  // We explicitly ensure our playable zones are ready as well.
  const untap = [
    ...(cards?.Lead_Zone ?? []),
    ...(cards?.Reserve_Zone_1 ?? []),
    ...(cards?.Reserve_Zone_2 ?? []),
    ...(cards?.Bangboo ?? []),
    ...(cards?.Wallet ?? [])
  ].filter(card => card?.isTapped)

  if (untap.length) await functions.updateCards(untap, { isTapped: false })
}
