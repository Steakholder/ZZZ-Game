// ZZZ TCG Arena automation
// Polychrome and Monochrome are independent deckbuilding categories and
// therefore enter their own extra-deck sections directly.

async function zzzStartOfTurn() {
  if (!game?.turn?.isMyTurn) return

  // Untap every card currently owned by the active player.
  const allMyCards = Object.values(cards ?? {}).flat().filter(Boolean)
  if (allMyCards.length) {
    await functions.updateCards(allMyCards, { isTapped: false })
  }

  // The first player also receives their Polychrome on turn 1; only the
  // normal two-card Main Deck draw is suppressed on the first turn.
  await functions.drawFromExtraDeck('Polychrome', 1, false, 'Wallet')
}
