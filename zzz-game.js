// Zenless Zone Zero TCG - game initialization and turn automation
//
// The engine runs these functions for the local player only.
// All card movement uses documented TCG Arena functions.

async function zzzInitializeGame() {
  // Prevent accidental duplicate initialization if the ready event is evaluated again.
  if (game.data?.ZZZ_GameInitialized?.done) return

  if (!game.data.ZZZ_GameInitialized) {
    game.data.ZZZ_GameInitialized = { done: false }
  }

  // Move custom-category cards out of the sideboard into their dedicated extra decks.
  // Custom categories are placed in Sideboard by beforeGameStart.boardCategoriesInSideboard.
  const sideboard = cards?.Sideboard ?? []

  const polychromes = sideboard.filter(card => functions.getCardData(card)?.type === "Polychrome")
  const monochromes = sideboard.filter(card => functions.getCardData(card)?.type === "Monochrome")
  const bangboos = sideboard.filter(card => functions.getCardData(card)?.type === "Bangboo")

  if (polychromes.length) {
    await functions.moveCards(polychromes, "Polychromes_Deck", { noLogs: true })
    await functions.shuffleSection("Polychromes_Deck")
  }

  if (monochromes.length) {
    await functions.moveCards(monochromes, "Monochromes_Deck", { noLogs: true })
    await functions.shuffleSection("Monochromes_Deck")
  }

  // If the board-card selection has not already placed the selected Bangboo,
  // place the remaining selected Bangboo in the Bangboo Zone.
  const currentBangboo = cards?.Bangboo_Zone ?? []
  if (currentBangboo.length === 0 && bangboos.length) {
    await functions.moveCard(bangboos[0], "Bangboo_Zone", { noLogs: true })
  }

  // Six cards from the Main Deck become the Life Pool.
  await functions.draw(6, false, "Life_Pool")

  // The Life Pool is face-down to everyone because its section is hidden.
  // Draw two Polychromes face-up into the Wallet.
  await functions.drawFromExtraDeck("Polychromes_Deck", 2, false, "Wallet")

  game.data.ZZZ_GameInitialized.done = true
}

async function zzzStartOfTurn() {
  if (!game?.turn?.isMyTurn) return

  // The native newTurn configuration handles the 2-card Main Deck draw.
  // drawOnStart:false suppresses the first player's first-turn draw.
  // This script supplies the additional 1 Polychrome draw.
  await functions.drawFromExtraDeck("Polychromes_Deck", 1, false, "Wallet")
}
