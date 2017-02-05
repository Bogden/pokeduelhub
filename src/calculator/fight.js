import MOVE_TYPES from '../constants/move-types';
import cloneDeep from 'lodash/cloneDeep';

// Greninja beats Pikachu in Physical Combat. Pickachu is Knocked Out.
// Weedle beats Snorlax in Special Combat. Snorlax is Poisoned.
// It's a tie, nothing happens.

const MOVE_RESULTS = {
  MOVE_A: -1,
  TIE: 0,
  MOVE_B: 1
}

function getMoveOutcomeVsBlue(moveA, moveB) {
  if (moveB.type === MOVE_TYPES.BLUE) {
    return MOVE_RESULTS.TIE;
  } else if (moveB.notes) {
    return MOVE_RESULTS.MOVE_A;
  } else {
    // Treat blue as a tie unless it has notes
    return MOVE_RESULTS.TIE;
  }
}

function getMoveOutcomeVsPurple(moveA, moveB) {
  // loses to stronger purple
  // loses to gold
  // ties to blue
  // ties to same purple
  switch (moveB.type) {
    case MOVE_TYPES.BLUE:
      // Treat blue as a tie unless it has notes
      if (moveB.notes) {
        return MOVE_RESULTS.MOVE_B;
      } else {
        return MOVE_RESULTS.TIE;
      }
    case MOVE_TYPES.PURPLE:
      return getMoveOutcomeWithPower(moveA, moveB);
    case MOVE_TYPES.GOLD:
      return MOVE_RESULTS.MOVE_B;
    case MOVE_TYPES.WHITE:
      return MOVE_RESULTS.MOVE_A;
    case MOVE_TYPES.MISS:
      return MOVE_RESULTS.MOVE_A;
  }
}

function getMoveOutcomeVsGold(moveA, moveB) {
  // loses to stronger white
  // loses to stronger gold
  // ties to blue
  // ties to same white
  // ties to same gold
  switch (moveB.type) {
    case MOVE_TYPES.BLUE:
      // Treat blue as a tie unless it has notes
      if (moveB.notes) {
        return MOVE_RESULTS.MOVE_B;
      } else {
        return MOVE_RESULTS.TIE;
      }
    case MOVE_TYPES.PURPLE:
      return MOVE_RESULTS.MOVE_A;
    case MOVE_TYPES.GOLD:
      return getMoveOutcomeWithPower(moveA, moveB);
    case MOVE_TYPES.WHITE:
      return getMoveOutcomeWithPower(moveA, moveB);
    case MOVE_TYPES.MISS:
      return MOVE_RESULTS.MOVE_A;
  }
}

function getMoveOutcomeVsWhite(moveA, moveB) {
  // loses to purple
  // loses to stronger white
  // loses to stronger gold
  // ties to blue
  // ties to same white
  // ties to same gold
  switch (moveB.type) {
    case MOVE_TYPES.BLUE:
      // Treat blue as a tie unless it has notes
      if (moveB.notes) {
        return MOVE_RESULTS.MOVE_B;
      } else {
        return MOVE_RESULTS.TIE;
      }
    case MOVE_TYPES.PURPLE:
      return MOVE_RESULTS.MOVE_B;
    case MOVE_TYPES.GOLD:
      return getMoveOutcomeWithPower(moveA, moveB);
    case MOVE_TYPES.WHITE:
      return getMoveOutcomeWithPower(moveA, moveB);
    case MOVE_TYPES.MISS:
      return MOVE_RESULTS.MOVE_A;
  }
}

function getMoveOutcomeVsMiss(moveA, moveB) {
  // ties to blue
  // ties to miss
  // loses to all else
  switch (moveB.type) {
    case MOVE_TYPES.BLUE:
      // Treat blue as a tie unless it has notes
      if (moveB.notes) {
        return MOVE_RESULTS.MOVE_B;
      } else {
        return MOVE_RESULTS.TIE;
      }
    case MOVE_TYPES.MISS:
      return MOVE_RESULTS.TIE;
    default:
      return MOVE_RESULTS.MOVE_B;
  }
}

function getMoveOutcomeWithPower(moveA, moveB) {
  let moveAPower = moveA.power;
  let moveBPower = moveB.power;

  if (moveA.type === MOVE_TYPES.WHITE || moveA.type === MOVE_TYPES.GOLD) {
    // Factor in extra damage
    moveAPower += moveA.pokemon.extraPower;
    moveBPower += moveB.pokemon.extraPower;
  }

  if (moveAPower === moveBPower) {
    return MOVE_RESULTS.TIE;
  } else {
    return moveAPower > moveBPower ? MOVE_RESULTS.MOVE_A : MOVE_RESULTS.MOVE_B;
  }
}

// TODO: 0 power white vs miss = tie
function getMoveOutcome(moveA, moveB) {
  // -1 = moveA wins
  // 0 = tie
  // 1 = moveB wins
  let result = MOVE_RESULTS.TIE;

  switch (moveA.type) {
    case MOVE_TYPES.BLUE:
      result = getMoveOutcomeVsBlue(moveA, moveB);
      break;
    case MOVE_TYPES.PURPLE:
      result = getMoveOutcomeVsPurple(moveA, moveB);
      break;
    case MOVE_TYPES.GOLD:
      result = getMoveOutcomeVsGold(moveA, moveB);
      break;
    case MOVE_TYPES.WHITE:
      result = getMoveOutcomeVsWhite(moveA, moveB);
      break;
    case MOVE_TYPES.MISS:
      result = getMoveOutcomeVsMiss(moveA, moveB);
      break;
  }

  if (result === MOVE_RESULTS.MOVE_A) {
    return createMoveAWinningOutcome(moveA, moveB);
  } else if (result === MOVE_RESULTS.MOVE_B) {
    return createMoveBWinningOutcome(moveA, moveB);
  } else {
    return createTieOutcome(moveA, moveB);
  }
}

function createMoveAWinningOutcome(moveA, moveB, probability) {
  return {
    moveA,
    moveB,
    winningMove: moveA,
    losingMove: moveB,
    probability: probability || moveA.getProbability() * moveB.getProbability()
  }
}

function createMoveBWinningOutcome(moveA, moveB, probability) {
  return {
    moveA,
    moveB,
    winningMove: moveB,
    losingMove: moveA,
    probability: probability || moveA.getProbability() * moveB.getProbability()
  }
}

function createTieOutcome(moveA, moveB, probability) {
  return {
    moveA,
    moveB,
    probability: probability || moveA.getProbability() * moveB.getProbability()
  }
}

function isMultiplierMove(move = {}) {
  return move.power && move.power.toString().indexOf('x') > -1;
}

function shouldCompareDamage(moveA, moveB) {
  return (moveA.type === MOVE_TYPES.WHITE || moveA.type === MOVE_TYPES.GOLD) &&
    (moveB.type === MOVE_TYPES.WHITE || moveB.type === MOVE_TYPES.GOLD);
}

function getBasePower(multiplierMove = {}) {
  return multiplierMove.power.substring(0,  multiplierMove.power.indexOf('x'));
}

function getMultiplierOutcomes(moveA, moveB) {
  const isMoveAMultiplier = isMultiplierMove(moveA);
  const isMoveBMultiplier = isMultiplierMove(moveB);

  const multiplierOutcomes = [];
  
  if (isMoveAMultiplier && isMoveBMultiplier) {
    // TODO: Account for double multipliers
  } else {
    let multiplierMove;
    let staticMove;

    if (isMoveAMultiplier) {
      multiplierMove = moveA;
      staticMove = moveB;
    } else {
      multiplierMove = moveB;
      staticMove = moveA;
    }

    const multiplierMovePower = getBasePower(multiplierMove);
    if (multiplierMovePower > staticMove.power) {
      multiplierOutcomes.push(createMoveBWinningOutcome(staticMove, multiplierMove));
    } else {
      // Including the initial spin
      const requiredSpinsToWin = Math.floor(staticMove.power / multiplierMovePower);
      
      const baseProbability = staticMove.getProbability() * multiplierMove.getProbability();

      let canTie = ((staticMove.power / multiplierMovePower) === requiredSpinsToWin);
      let multiplierWinProbability = Math.pow(multiplierMove.getProbability(), requiredSpinsToWin);
      let multiplierLoseProbability = 1 - multiplierWinProbability;

      if (canTie) {
        const tieProbability = multiplierWinProbability / multiplierMove.getProbability() - multiplierWinProbability;
        multiplierLoseProbability -= tieProbability;
        
        multiplierOutcomes.push(createTieOutcome(moveA, moveB, baseProbability * tieProbability));
      }

      if (isMoveAMultiplier) {
        multiplierOutcomes.push(createMoveAWinningOutcome(moveA, moveB, baseProbability * multiplierWinProbability));
        
        if (multiplierLoseProbability > 0) {
          multiplierOutcomes.push(createMoveBWinningOutcome(moveA, moveB, baseProbability * multiplierLoseProbability));
        }
      } else {
        if (multiplierLoseProbability > 0) {
          multiplierOutcomes.push(createMoveAWinningOutcome(moveA, moveB, baseProbability * multiplierLoseProbability));
        }
        multiplierOutcomes.push(createMoveBWinningOutcome(moveA, moveB, baseProbability * multiplierWinProbability));
      }
    }
  }

  return multiplierOutcomes;
}

function generateBattleOutcomes(pokemonA, pokemonB) {
  let outcomes = [];

  pokemonA.moves.forEach(moveA => {
    pokemonB.moves.forEach(moveB => {
      if (shouldCompareDamage(moveA, moveB)) {
        const isMoveBMultiplier = isMultiplierMove(moveB);
        const isMoveAMultiplier = isMultiplierMove(moveA);
        
        if (isMoveAMultiplier || isMoveBMultiplier) {
          const multiplierOutcomes = getMultiplierOutcomes(moveA, moveB);

          outcomes = outcomes.concat(multiplierOutcomes);
          return;
        }
      }

      let outcome = getMoveOutcome(moveA, moveB);

      outcomes.push(outcome);
    });
  });

  // TODO: Add initial simplification that combines identical outcomes

  return outcomes.sort((a, b) => b.probability - a.probability);
}

function simplifyOutcomes(outcomesSource) {
  const outcomes = cloneDeep(outcomesSource);
  for (let i = 0; i < outcomes.length; ++i) {
    const baseOutcome = outcomes[i];
    for (let j = i+1; j < outcomes.length; ++j) {
      const compareOutcome = outcomes[j];
      if ((!baseOutcome.winningMove && !compareOutcome.winningMove) ||
        baseOutcome.winningMove &&
        compareOutcome.winningMove &&
        baseOutcome.winningMove.pokemon === compareOutcome.winningMove.pokemon &&
        baseOutcome.losingMove.pokemon === compareOutcome.losingMove.pokemon &&
        baseOutcome.winningMove.action === compareOutcome.winningMove.action) {
        baseOutcome.probability += compareOutcome.probability;
        outcomes.splice(j--, 1);
      }
    }
  }

  return outcomes.sort((a, b) => b.probability - a.probability);
}

export {generateBattleOutcomes as generateBattleOutcomes,
  simplifyOutcomes as simplifyOutcomes};

// testOutcomes = [{
//   winner: 'a',
//   loser: 'b',
//   move: 1,
//   probability: 0.5
// }, {
//   winner: 'a',
//   loser: 'b',
//   move: 1,
//   probability: 0.1
// },{
//   winner: 'b',
//   loser: 'a',
//   move: 1,
//   probability: 0.2
// }, {
//   winner: 'b',
//   loser: 'a',
//   move: 1,
//   probability: 0.1
// },{
//   winner: 'b',
//   loser: 'a',
//   move: 2,
//   probability: 0.1
// }]

// simplifyOutcomes(testOutcomes);

/*



class PokemonBattleOutcome {
  constructor(options = {}) {
    this.probability = options.probability;
  }
}


Weedle
60% 1 purple
32% 10 white
4% miss

vs

Tyrogue
20% 50 white
72% 30 white
4% miss



60% 1 purple
  20% win
  72% win
  4% win
  = 100% poison 0% loss
  == 60% poison
32% 10 white
  20% loss
  72% loss
  4% win
  = 4% knock out 96% loss
  == 1.28% knock out 30.72% loss
4% miss
  20% loss
  72% loss
  4% tie
  = 4% tie 96% loss
  == 0.16% tie 3.84% loss

=== 60% poison, 34.56% loss, 1.28% knock out, 0.16% tie

Start with pokemon A.
For each move of pokemon A
  For each move of pokemon B, generate a raw battle outcome.
    move A1 vs move B1 -> winner: pokemonA, loser: pokemonB, move: move A1, probability: move A1 prob * move B1 prob
    move A1 vs move B2
    move A1 vs move B3



outcome/probability

generateBattleOutcomes
-> [{
  winner: pokemonA,
  loser: pokemonB,
  move: moveA1,
  probability: 0.6
}]

move.action = 'poisons'


Weedle vs Tyrogue
//////////////////////////////////////////
// Chance // Result                     //
//////////////////////////////////////////
// 60%    // Weedle poisons Tyrogue     //
// 34.56% // Tyrogue knocks out Weedle  //
// 1.28%  // Weedle knocks out Tyrogue  //
// 0.16%  // Nothing happens            //
//////////////////////////////////////////


{winner} {action phrase} {loser}

*/
