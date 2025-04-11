export const tricksInRound = (totalRounds: number, round: number): number => {
  if (round > totalRounds) {
    throw new Error(
      `Invalid round number "${round}" for ${totalRounds} rounds`
    );
  }
  const halfRounds = Math.ceil((totalRounds + 1) / 2);

  return round <= halfRounds ? halfRounds - round + 1 : round - halfRounds + 1;
};
