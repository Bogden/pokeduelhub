import MOVE_TYPES from '../constants/move-types';
import cloneDeep from 'lodash/cloneDeep';

// Greninja beats Pikachu in Physical Combat. Pickachu is Knocked Out.
// Weedle beats Snorlax in Special Combat. Snorlax is Poisoned.
// It's a tie, nothing happens.

const OUTCOMES = {
  PHYSICAL_COMBAT: 'Physical combat',
  TIE: 'Tie'
}

const STATUSES = {
  KNOCKS_OUT: 'Knocked out',
  POISONS: 'Poisoned',
}

const MOVE_MATCHUP_OUTCOMES = {
  MOVE_A: -1,
  TIE: 0,
  MOVE_B: 1
}

const MOVE_ACTIONS = {
  KNOCKS_OUT: 'knocks out',
  POISONS: 'poisons',
  PARALYZES: 'paralyzes',
  FREEZES: 'freezes',
  PUTS_TO_SLEEP: 'puts to sleep',
  BURNS: 'burns'
}

const MOVE_RESULTS = {
  MOVE_A: -1,
  TIE: 0,
  MOVE_B: 1
}

function simulateFight(pokemonA, pokemonB) {

  let result;

  result = {
    winner: pokemonA,
    loser: pokemonB,
    status: STATUSES.KNOCKED_OUT
  }

  return result;
}

function getMoveOutcomeVsBlue(moveA, moveB) {
  if (moveB.type === MOVE_TYPES.BLUE) {
    return MOVE_RESULTS.TIE;
  } else {
    return MOVE_RESULTS.MOVE_A;
  }
}

function getMoveOutcomeVsPurple(moveA, moveB) {
  // loses to stronger purple
  // loses to gold
  // ties to blue
  // ties to same purple
  switch (moveB.type) {
    case MOVE_TYPES.BLUE:
      return MOVE_RESULTS.MOVE_B;
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
      return MOVE_RESULTS.MOVE_B;
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
      return MOVE_RESULTS.MOVE_B;
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
      return MOVE_RESULTS.MOVE_B;
    case MOVE_TYPES.MISS:
      return MOVE_RESULTS.TIE;
    default:
      return MOVE_RESULTS.MOVE_B;
  }
}

function getMoveOutcomeWithPower(moveA, moveB) {


  if (moveA.power === moveB.power) {
    return MOVE_RESULTS.TIE;
  } else {
    return moveA.power > moveB.power ? MOVE_RESULTS.MOVE_A : MOVE_RESULTS.MOVE_B
  }
}

// TODO: 0 power white vs miss = tie
function getMoveOutcome(moveA, moveB) {
  // -1 = moveA wins
  // 0 = tie
  // 1 = moveB wins
  let result = MOVE_RESULTS.TIE;
  let winningMove;
  let losingMove;

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
    winningMove = moveA;
    losingMove = moveB;
  } else if (result === MOVE_RESULTS.MOVE_B) {
    winningMove = moveB;
    losingMove = moveA;
  }

  return {
    moveA,
    moveB,
    winningMove,
    losingMove,
    probability: moveA.getProbability() * moveB.getProbability()
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
  return multiplierMove.power.substring(0, multiplierMove.power.indexOf('x'));
}

function getMultiplierOutcomes(moveA, moveB) {
  const isMoveBMultiplier = isMultiplierMove(moveB);
  const isMoveAMultiplier = isMultiplierMove(moveA);

  if (isMoveAMultiplier && !isMoveBMultiplier) {
    if (isMoveAMultiplier && moveB.power > getBasePower(moveA)) {
      
    }
  } else if (!isMoveAMultiplier && isMoveBMultiplier) {
    // One is multiplier, other is not
    if (moveB.power > getBasePower(moveA)) {
      // Always wins

    }
  } else if (isMoveAMultiplier && isMoveBMultiplier) {
    // Both are multipliers
  }
}

function generateBattleOutcomes(pokemonA, pokemonB) {
  const outcomes = [];

  pokemonA.moves.forEach(moveA => {
    pokemonB.moves.forEach(moveB => {
      if (shouldCompareDamage(moveA, moveB)) {
        const isMoveBMultiplier = isMultiplierMove(moveB);
        const isMoveAMultiplier = isMultiplierMove(moveA);
        
        if (isMoveAMultiplier || isMoveBMultiplier) {
          // const multiplierOutcomes = getMultiplierOutcomes(moveA, moveB);
          // outcomes.concat(multiplierOutcomes);
          // return;
        }
      }

      let outcome = getMoveOutcome(moveA, moveB);

      outcomes.push(outcome);
    });
  });

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
