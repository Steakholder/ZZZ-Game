// ZZZ TCG Arena automation
// Currency is deckbuilt as one combined 20-card category, then split into
// separate Polychrome and Monochrome extra decks for gameplay.

async function zzzSplitCurrencyDeck() {
  // A custom deckbuilding category is placed on its matching board section
  // when listed in categoriesAlreadyOnBoard. Move those cards into the two
  // gameplay decks based on their face type.
  const source = cards?.Currency ?? []
  if (!source.length) return false

  const polychromes = []
  const monochromes = []

  for (const card of source) {
    const data = functions.getCardData(card)
    if (data?.type === 'Polychrome') polychromes.push(card)
    else if (data?.type === 'Monochrome') monochromes.push(card)
  }

  if (polychromes.length) await functions.moveCards(polychromes, 'Polychrome', { noLogs: true })
  if (monochromes.length) await functions.moveCards(monochromes, 'Monochrome', { noLogs: true })
  return true
}

async function zzzPrepareCurrency() {
  // onPlayersMulligan fires after the initial board setup, so both currency
  // decks exist before we attempt to draw the starting Wallet cards.
  await zzzSplitCurrencyDeck()

  const wallet = cards?.Wallet ?? []
  const needed = Math.max(0, 2 - wallet.length)
  if (needed > 0) {
    await functions.drawFromExtraDeck('Polychrome', needed, false, 'Wallet')
  }
}

async function zzzStartOfTurn() {
  if (!game?.turn?.isMyTurn) return

  // Untap every card currently owned by the active player.
  const allMyCards = Object.values(cards ?? {}).flat().filter(Boolean)
  if (allMyCards.length) {
    await functions.updateCards(allMyCards, { isTapped: false })
  }

  // Every turn, including the first player's first turn, adds one Polychrome.
  await functions.drawFromExtraDeck('Polychrome', 1, false, 'Wallet')
}
