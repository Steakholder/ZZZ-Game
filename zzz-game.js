// ZZZ TCG Arena automation
// Currency uses one combined deckbuilding category, then is split into
// separate Polychrome and Monochrome extra decks for gameplay.

function getCurrencyCards() {
  const staged = cards?.Currency ?? []
  if (staged.length) return staged

  const found = []
  for (const [sectionName, sectionCards] of Object.entries(cards ?? {})) {
    if (sectionName === "Polychrome" || sectionName === "Monochrome") continue
    for (const card of (sectionCards ?? [])) {
      const data = functions.getCardData(card)
      if (data?.type === "Currency" || data?.currencyType === "Polychrome" || data?.currencyType === "Monochrome") {
        found.push(card)
      }
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
    const type = data?.currencyType ?? data?.face?.front?.type ?? data?.type
    if (type === "Polychrome") polychromes.push(card)
    else if (type === "Monochrome") monochromes.push(card)
  }

  if (polychromes.length) await functions.moveCards(polychromes, "Polychrome", { noLogs: true })
  if (monochromes.length) await functions.moveCards(monochromes, "Monochrome", { noLogs: true })
  return polychromes.length + monochromes.length > 0
}

async function zzzPrepareLifePool() {
  if ((cards?.Life_Pool ?? []).length >= 6) return true

  const deck = await functions.getDeck()
  const needed = 6 - (cards?.Life_Pool ?? []).length
  if (deck.length < needed) return false

  // getDeck() is bottom-to-top; the last entries are the top cards.
  const topCards = deck.slice(-needed)
  if (topCards.length) {
    await functions.moveCards(topCards, "Life_Pool", { noLogs: true })
    return true
  }
  return false
}

async function zzzSetupPreGame() {
  await zzzPrepareLifePool()
  await zzzSplitCurrencyDeck()
}

async function zzzPrepareCurrency() {
  const split = await zzzSplitCurrencyDeck()
  if (!split && (cards?.Polychrome ?? []).length === 0 && (cards?.Monochrome ?? []).length === 0) return

  if (game?.data?.ZZZ_Script?.currencyPrepared) return

  const wallet = cards?.Wallet ?? []
  const needed = Math.max(0, 2 - wallet.length)
  if (needed > 0 && (cards?.Polychrome ?? []).length >= needed) {
    await functions.drawFromExtraDeck("Polychrome", needed, false, "Wallet")
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
    await functions.drawFromExtraDeck("Polychrome", 1, false, "Wallet")
  }
}
