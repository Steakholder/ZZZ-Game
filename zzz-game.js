// ZZZ TCG Arena automation
// Currency is one combined deckbuilding category, then split into separate
// Polychrome and Monochrome extra decks for gameplay.

function getCurrencyCards() {
  const staged = cards?.Currency ?? []
  if (staged.length) return staged

  // Fallback: locate any cards whose deckbuilding type is Currency.
  // This avoids relying on the staging section name if the engine exposes
  // the custom category under a different internal section during setup.
  const found = []
  for (const [sectionName, sectionCards] of Object.entries(cards ?? {})) {
    if (sectionName === 'Polychrome' || sectionName === 'Monochrome') continue
    for (const card of (sectionCards ?? [])) {
      const data = functions.getCardData(card)
      if (data?.type === 'Currency') found.push(card)
    }
  }
  return found
}

async function zzzSplitCurrencyDeck() {
  const source = getCurrencyCards()
  if (!source.length) return false

  const polychromes = []
  const monochromes = []

  for (const card of source) {
    const data = functions.getCardData(card)
    if (data?.type === 'Currency') {
      if (data?.currencyType === 'Polychrome') polychromes.push(card)
      else if (data?.currencyType === 'Monochrome') monochromes.push(card)
    } else if (data?.face?.front?.type === 'Polychrome') {
      polychromes.push(card)
    } else if (data?.face?.front?.type === 'Monochrome') {
      monochromes.push(card)
    }
  }

  if (polychromes.length) await functions.moveCards(polychromes, 'Polychrome', { noLogs: true })
  if (monochromes.length) await functions.moveCards(monochromes, 'Monochrome', { noLogs: true })
  return polychromes.length + monochromes.length > 0
}

async function zzzPrepareCurrency() {
  if (game?.data?.ZZZ_Script?.currencyPrepared) return

  const split = await zzzSplitCurrencyDeck()
  if (!split) return

  const wallet = cards?.Wallet ?? []
  const needed = Math.max(0, 2 - wallet.length)
  if (needed > 0 && (cards?.Polychrome ?? []).length >= needed) {
    await functions.drawFromExtraDeck('Polychrome', needed, false, 'Wallet')
  }

  game.data.ZZZ_Script.currencyPrepared = true
}

async function zzzStartOfTurn() {
  if (!game?.turn?.isMyTurn) return

  const allMyCards = Object.values(cards ?? {}).flat().filter(Boolean)
  if (allMyCards.length) {
    await functions.updateCards(allMyCards, { isTapped: false })
  }

  if ((cards?.Polychrome ?? []).length > 0) {
    await functions.drawFromExtraDeck('Polychrome', 1, false, 'Wallet')
  }
}
