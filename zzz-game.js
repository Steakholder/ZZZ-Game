// ZZZ TCG Arena automation
// Currency is deckbuilt as one combined 20-card category, then split into
// separate Polychrome and Monochrome extra decks for gameplay.

async function zzzSplitCurrencyDeck() {
  const source = cards?.Currency ?? []
  if (!source.length) return

  const polychromes = []
  const monochromes = []

  for (const card of source) {
    const data = functions.getCardData(card)
    if (data?.type === 'Polychrome') polychromes.push(card)
    else if (data?.type === 'Monochrome') monochromes.push(card)
  }

  if (polychromes.length) await functions.moveCards(polychromes, 'Polychrome', { noLogs: true })
  if (monochromes.length) await functions.moveCards(monochromes, 'Monochrome', { noLogs: true })
}

async function zzzStartOfTurn() {
  if (!game?.turn?.isMyTurn) return

  // Untap every card currently owned by the active player.
  const allMyCards = Object.values(cards ?? {}).flat().filter(Boolean)
  if (allMyCards.length) {
    await functions.updateCards(allMyCards, { isTapped: false })
  }

  // The first player still receives their Polychrome on turn 1; only the
  // normal two-card Main Deck draw is suppressed on the first turn.
  await functions.drawFromExtraDeck('Polychrome', 1, false, 'Wallet')
}
