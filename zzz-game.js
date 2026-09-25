// ZZZ TCG Arena game script
// Start-of-turn automation:
// - Only the active player acts.
// - The native newTurn.drawPerTurn handles the 2-card Main Deck draw.
// - This script supplies the 1 Polychrome draw.
// - Cards in normal sections automatically untap at the start of a new turn
// unless keepTappedNewTurn is explicitly enabled.

async function zzzStartOfTurn() {
  if (!game?.turn?.isMyTurn) return
  await functions.drawFromExtraDeck("Polychromes_Deck", 1, false, "Wallet")
}
