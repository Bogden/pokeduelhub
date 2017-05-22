import MOVE_TYPES from '../constants/move-types';
import Move from '../classes/move';
import cloneDeep from 'lodash/cloneDeep';
import clone from 'lodash/clone';

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
  } else if (moveA.notes) {
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
      if (moveB.power === 0) {
        return MOVE_RESULTS.TIE;
      } else {
        return MOVE_RESULTS.MOVE_B;
      }
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
      if (moveA.power === 0) {
        return MOVE_RESULTS.TIE;
      } else {
        return MOVE_RESULTS.MOVE_A;
      }
    case MOVE_TYPES.GOLD:
      return getMoveOutcomeWithPower(moveA, moveB);
    case MOVE_TYPES.WHITE:
      return getMoveOutcomeWithPower(moveA, moveB);
    case MOVE_TYPES.MISS:
      if (moveA.power === 0) {
        return MOVE_RESULTS.TIE;
      } else {
        return MOVE_RESULTS.MOVE_A;
      }
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
      if (moveA.power === 0) {
        return MOVE_RESULTS.TIE;
      } else {
        return MOVE_RESULTS.MOVE_A;
      }
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
    case MOVE_TYPES.GOLD:
    case MOVE_TYPES.WHITE:
      if (moveB.power === 0) {
        return MOVE_RESULTS.TIE;
      } else {
        return MOVE_RESULTS.MOVE_B;
      }
    default:
      return MOVE_RESULTS.MOVE_B;
  }
}

const SPECIAL_OUTCOMES_WITH_POWER = ['Counter', 'Hyper Sonic']

function shouldGetSpecialOutcomeWithPower(move) {
  return SPECIAL_OUTCOMES_WITH_POWER.includes(move.name);
}

function getSpecialOutcomeWithPower(options = {}) {
  const moveA = options.moveA;
  const moveB = options.moveB;
  const specialMove = options.specialMove;

  switch (specialMove.name) {
    case 'Counter':
      return getCounterOutcome(options);
    case 'Hyper Sonic':
      return getHyperSonicOutcome(options);
  }

  ga('send', {
    hitType: 'event',
    eventCategory: 'Error',
    eventAction: 'getSpecialOutcomeWithPower',
    eventLabel: `did not find outcome for ${specialMove && specialMove.name}`
  });

  return getPlainMoveOutcomeWithPower(moveA, moveB);
}

function getCounterOutcome(options = {}) {
  const {moveA, moveB, specialMove} = options;
  const moveAPower = moveA.power;
  const moveBPower = moveB.power;

  if (moveAPower === moveBPower) {
    return MOVE_RESULTS.TIE;
  } else if (moveAPower > moveBPower) {
    if (specialMove === moveB && moveAPower > 20) {
      return MOVE_RESULTS.MOVE_B;
    } else {
      return MOVE_RESULTS.MOVE_A;
    }
  } else {
    if (specialMove === moveA && moveBPower > 20) {
      return MOVE_RESULTS.MOVE_A;
    } else {
      return MOVE_RESULTS.MOVE_B;
    }
  }
}

function getHyperSonicOutcome(options = {}) {
  const {moveA, moveB, specialMove} = options;
  const moveAPower = moveA.power;
  const moveBPower = moveB.power;

  if (moveAPower === moveBPower) {
    return MOVE_RESULTS.TIE;
  } else if (moveAPower > moveBPower) {
    if (specialMove === moveB && moveAPower >= 100) {
      return MOVE_RESULTS.TIE;
    } else {
      return MOVE_RESULTS.MOVE_A;
    }
  } else {
    if (specialMove === moveA && moveBPower >= 100) {
      return MOVE_RESULTS.TIE;
    } else {
      return MOVE_RESULTS.MOVE_B;
    }
  }
}

function getPlainMoveOutcomeWithPower(moveA, moveB) {
  const moveAPower = moveA.power;
  const moveBPower = moveB.power;

  if (moveAPower === moveBPower) {
    return MOVE_RESULTS.TIE;
  } else {
    return moveAPower > moveBPower ? MOVE_RESULTS.MOVE_A : MOVE_RESULTS.MOVE_B;
  }
}

function getMoveOutcomeWithPower(moveA, moveB) {
  if (shouldGetSpecialOutcomeWithPower(moveA)) {
    return getSpecialOutcomeWithPower({
      moveA,
      moveB,
      specialMove: moveA
    });
  } else if (shouldGetSpecialOutcomeWithPower(moveB)) {
    return getSpecialOutcomeWithPower({
      moveA,
      moveB,
      specialMove: moveB
    });
  } else {
    return getPlainMoveOutcomeWithPower(moveA, moveB);
  }
}

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

function isStackingMove(move = {}) {
  return move.power && move.powerType && move.powerType === 'stacking';
}

function shouldCompareDamage(moveA, moveB) {
  return (moveA.type === MOVE_TYPES.WHITE || moveA.type === MOVE_TYPES.GOLD) &&
    (moveB.type === MOVE_TYPES.WHITE || moveB.type === MOVE_TYPES.GOLD);
}

function getStackingOutcomes(moveA, moveB) {
  // TODO: Account for maximum stacks like double slap capping at 2
  const isMoveAStacking = isStackingMove(moveA);
  const isMoveBStacking = isStackingMove(moveB);

  const multiplierOutcomes = [];
  
  if (isMoveAStacking && isMoveBStacking) {
    return getDoubleStackingOutcomes(moveA, moveB);
  } else {
    let multiplierMove;
    let staticMove;

    if (isMoveAStacking) {
      multiplierMove = moveA;
      staticMove = moveB;
    } else {
      multiplierMove = moveB;
      staticMove = moveA;
    }

    if (multiplierMove.power > staticMove.power) {
      multiplierOutcomes.push(createMoveBWinningOutcome(staticMove, multiplierMove));
    } else {
      // Including the initial spin
      const requiredSpinsToWin = Math.floor(staticMove.power / multiplierMove.power);
      
      const baseProbability = staticMove.getProbability() * multiplierMove.getProbability();

      let canTie = ((staticMove.power / multiplierMove.power) === requiredSpinsToWin);
      let multiplierWinProbability = Math.pow(multiplierMove.getRealProbability(), requiredSpinsToWin);
      let multiplierLoseProbability = 1 - multiplierWinProbability;

      if (canTie) {
        const tieProbability = multiplierWinProbability / multiplierMove.getRealProbability() - multiplierWinProbability;
        multiplierLoseProbability -= tieProbability;
        
        multiplierOutcomes.push(createTieOutcome(moveA, moveB, baseProbability * tieProbability));
      }

      if (isMoveAStacking) {
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

function getDoubleStackingOutcomes(moveA, moveB) {
  // TODO: Really account for double stacking
  // For now just simulate it
  let moveAWins = 0;
  let ties = 0;
  let moveBWins = 0;
  const cycles = 100000;

  for (let i = 0; i < cycles; i++) {
    let moveAValue = moveA.power;
    while (Math.random() < moveA.getProbability()) {
      moveAValue += moveA.power;
    }

    let moveBValue = moveB.power;
    while (Math.random() < moveB.getProbability()) {
      moveBValue += moveB.power;
    }

    if (moveAValue > moveBValue) {
      moveAWins++;
    } else if (moveAValue === moveBValue) {
      ties++;
    } else {
      moveBWins++;
    }
  }

  const baseProbability = moveA.getProbability() * moveB.getProbability();

  return [
    createMoveAWinningOutcome(moveA, moveB, moveAWins / cycles * baseProbability),
    createTieOutcome(moveA, moveB, ties / cycles * baseProbability),
    createMoveBWinningOutcome(moveA, moveB, moveBWins / cycles * baseProbability)
  ]
}

function isMultiplierMove(move = {}) {
  return move.power && move.powerType && move.powerType === 'multiplier';
}

function isAdditionMove(move = {}) {
  return move.power && move.powerType && move.powerType === 'addition';
}

function shouldGenerateSubMoves(move = {}) {
  return isMultiplierMove(move) || isAdditionMove(move);
}

function generateSubMoves(move) {
  if (!shouldGenerateSubMoves(move)) {
    return [];
  }

  const subMoves = [];
  const pokemonMoves = move.pokemon.moves;

  pokemonMoves.forEach(innerMove => {
    if (innerMove !== move) {
      const moveClone = cloneDeep(innerMove.data);
      moveClone.hidden = true;

      moveClone.displayName = innerMove.displayName;
      moveClone.displayName += ` (${move.name})`;
      moveClone.wheelSize = innerMove.realWheelSize * move.wheelSize / (move.pokemon.wheelSize - move.wheelSize);
      // Clone wheel size =
      // percent of wheel minus respin move
      // times size of respin move

      if (moveClone.type === MOVE_TYPES.WHITE || moveClone.type === MOVE_TYPES.GOLD) {
        if (isMultiplierMove(move)) {
          moveClone.power *= parseInt(move.power);
        } else if (isAdditionMove(move)) {
          moveClone.power += parseInt(move.power);
        }
      }

      subMoves.push(new Move(moveClone, move.pokemon));
    }
  });

  return subMoves;
}

// Return pokemon's moves including any submoves from swords dance or focus energy
function getPokemonOutcomeMoves(pokemon) {
  const moves = [];

  const pokemonMoves = pokemon.moves;

  // Account for confusion or vs poliwhirl
  let moveOffset = pokemon.moveOffset;

  if (pokemon.opponent.name === 'Poliwhirl') {
    moveOffset += 2;
  }

  if (moveOffset) {
    // Replace each move's wheel size with the size of the one next to it
    for(let i = 0; i < pokemonMoves.length; i++) {
      pokemonMoves[i].shiftedWheelSize = pokemonMoves[(i + moveOffset) % (pokemonMoves.length)].realWheelSize;
    }
  }

  pokemonMoves.forEach(move => {
    if (shouldGenerateSubMoves(move)) {
      generateSubMoves(move).forEach(subMove => moves.push(subMove));
    } else {
      moves.push(move);
    }
  });

  return moves;
}

function getMultiChanceOutcomeProbability(options = {}) {
  let {multiChancePokemon, enemyPokemon, desiredOutcomes, shouldCombine} = options;
  
  multiChancePokemon = cloneDeep(multiChancePokemon);
  enemyPokemon = cloneDeep(enemyPokemon);

  multiChancePokemon.opponent = enemyPokemon;
  enemyPokemon.opponent = multiChancePokemon;

  const multiChancePokemonMoves = getPokemonOutcomeMoves(multiChancePokemon);
  const enemyPokemonMoves = getPokemonOutcomeMoves(enemyPokemon);

  let outcomeIsDesired;
  if (shouldCombine) {
    outcomeIsDesired = areOutcomesCombinable;
  } else {
    outcomeIsDesired = (a, b) => a === b;
  }

  return enemyPokemonMoves.reduce((total, enemyMove) => {
    let outcomes = [];
    multiChancePokemonMoves.forEach(multiChanceMove => {
      if (shouldCompareDamage(enemyMove, multiChanceMove)) {
        const isMultiChanceMoveStacking = isStackingMove(multiChanceMove);
        const isEnemyMoveStacking = isStackingMove(enemyMove);
        
        if (isEnemyMoveStacking || isMultiChanceMoveStacking) {
          const stackingOutcomes = getStackingOutcomes(enemyMove, multiChanceMove);

          outcomes = outcomes.concat(stackingOutcomes);
          return;
        }
      }

      let outcome = getMoveOutcome(enemyMove, multiChanceMove);

      outcomes.push(outcome);
    });

    const baseDesiredProbability = outcomes.reduce((total, outcome) => {
      if (desiredOutcomes.some(desiredOutcome => outcomeIsDesired(desiredOutcome, outcome))) {
        return total + outcome.probability;
      } else {
        return total;
      }
    }, 0) / enemyMove.getProbability();

    if (Number.isNaN(baseDesiredProbability)) {
      debugger;
    }

    const baseUndesiredProbability = 1 - baseDesiredProbability;
    const totalDesiredProbability = 1 - Math.pow(baseUndesiredProbability, multiChancePokemon.chances);

    return total + totalDesiredProbability * enemyMove.getProbability();
  }, 0);
}

function generateBattleOutcomes(pokemonA, pokemonB) {
  if (!pokemonA || !pokemonB) {
    return;

    ga('send', {
      hitType: 'event',
      eventCategory: 'Error',
      eventAction: 'compare',
      eventLabel: 'Missing pokemon for compare call'
    });
  }

  ga('send', {
    hitType: 'event',
    eventCategory: 'Pokemon',
    eventAction: 'compare',
    eventLabel: `${pokemonA.name}/${pokemonB.name}`
  });

  pokemonA = cloneDeep(pokemonA);
  pokemonB = cloneDeep(pokemonB);

  pokemonA.opponent = pokemonB;
  pokemonB.opponent = pokemonA;

  let outcomes = [];

  // Split out multiplier moves
  const pokemonAMoves = getPokemonOutcomeMoves(pokemonA);
  const pokemonBMoves = getPokemonOutcomeMoves(pokemonB);

  // Calculate regular outcomes
  pokemonAMoves.forEach(moveA => {
    pokemonBMoves.forEach(moveB => {
      if (shouldCompareDamage(moveA, moveB)) {
        const isMoveBStacking = isStackingMove(moveB);
        const isMoveAStacking = isStackingMove(moveA);
        
        if (isMoveAStacking || isMoveBStacking) {
          const stackingOutcomes = getStackingOutcomes(moveA, moveB);

          outcomes = outcomes.concat(stackingOutcomes);
          return;
        }
      }

      let outcome = getMoveOutcome(moveA, moveB);

      outcomes.push(outcome);
    });
  });

  if (pokemonA.name === pokemonB.name) {
    pokemonB.name += ' #2';
  }

  // TODO: Add initial simplification that combines identical outcomes

  return outcomes.sort((a, b) => b.probability - a.probability);
}

function areOutcomesCombinable(outcomeA, outcomeB) {
  // If neither has a winner, they are the same
  if (!outcomeA.winningMove && !outcomeB.winningMove) {
    return true;
  }

  // the winning pokemon match AND
  // the losing pokemon match AND
  // the winning moves' actions match
  return outcomeA.winningMove && outcomeB.winningMove &&
         outcomeA.winningMove.pokemon === outcomeB.winningMove.pokemon &&
         outcomeA.losingMove.pokemon === outcomeB.losingMove.pokemon &&
         outcomeA.winningMove.action === outcomeB.winningMove.action
}

function simplifyOutcomes(outcomesSource) {
  const outcomes = [];

  outcomesSource.forEach(sourceOutcome => {
    outcomes.push(clone(sourceOutcome));
  });

  for (let i = 0; i < outcomes.length; ++i) {
    const baseOutcome = outcomes[i];
    for (let j = i+1; j < outcomes.length; ++j) {
      const compareOutcome = outcomes[j];
      if (areOutcomesCombinable(baseOutcome, compareOutcome)) {
        baseOutcome.probability += compareOutcome.probability;
        outcomes.splice(j--, 1);
      }
    }
  }

  return outcomes.sort((a, b) => b.probability - a.probability);
}

export {generateBattleOutcomes as generateBattleOutcomes,
  simplifyOutcomes as simplifyOutcomes,
  getMultiChanceOutcomeProbability as getMultiChanceOutcomeProbability};

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
