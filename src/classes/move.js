// import MOVE_TYPES from '../constants/move-types';

import {getMoveOutcome} from '../calculator/fight';

class Move {
  constructor(options = {}, owningPokemon) {
    this.name = options.name;
    this.type = options.type;
    this.power = options.power;
    this.wheelSize = options.wheelSize;
    this.action = options.action;
    this.notes = options.notes;
    this.pokemon = owningPokemon;
  }

  compareAgainst(otherMove) {
    return getMoveOutcome(this, otherMove);
  }

  getProbability() {
    if (this.pokemon) {
      return this.pokemon.getMoveProbability(this);
    }
  }
}

export default Move;
