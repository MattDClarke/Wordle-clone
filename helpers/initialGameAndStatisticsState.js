export const gameStateInitial = {
  boardState: [],
  evaluations: [],
  solution: '',
  lastSolutionFetchDate: null,
  lastWonTs: null,
};

export const statisticsStateInitial = {
  averageGuesses: 0,
  gamesPlayed: 0,
  gamesWon: 0,
  guesses: {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    fail: 0,
  },
  currentStreak: 0,
  maxStreak: 0,
  lastPlayedTs: null,
};
