import MOVE_TYPES from '../constants/move-types';
import Move from './move';
import cloneDeep from 'lodash/cloneDeep';

class Pokemon {
  constructor(data = {}) {
    this.id = data.id;
    this.name = data.name;
    this.extraPower = 0;
    this._chances = 1;

    this.isClone = data.isClone;

    const moves = [];

    data.moves.forEach(moveData => {
      const sameMoveNameCount = moves.filter(existingMove => existingMove.name === moveData.name).length;

      if (sameMoveNameCount) {
        const moveClone = cloneDeep(moveData);
        moveClone.displayName = `${moveClone.name} #${sameMoveNameCount + 1}`;
        moves.push(new Move(moveClone, this));
      } else {
        moves.push(new Move(moveData, this));
      }
    });

    this.moves = moves;
  }

  get wheelSize() {
    return 96;
  }

  set power(newPower) {
    newPower = parseInt(newPower) || 0;

    this.extraPower = newPower;
  }

  addExtraPower(amount = 10) {
    this.extraPower += amount;
  }

  subtractExtraPower(amount = 10) {
    if (this.extraPower > 0) {
      this.extraPower -= amount;
    }
  }

  get chances() {
    return this._chances;
  }

  set chances(newChances) {
    newChances = parseInt(newChances) || 1;

    if (newChances < 1) {
      newChances = 1;
    }

    this._chances = newChances;
  }

  addExtraChances(amount = 1) {
    console.log(amount);
    this.chances += amount;
  }

  subtractExtraChances(amount = 1) {
    this.chances -= amount;
  }

  fitSizes() {
    // Loop through moves, get total extraSize outside misses
    const extraSize = this.moves.reduce((totalSize, move) => {
      if (move.type !== MOVE_TYPES.MISS) {
        return totalSize + move.extraSize;
      } else {
        return totalSize;
      }
    }, 0);

    // Subtract that from the first Miss move
    const firstMiss = this.moves.find(move => move.type === MOVE_TYPES.MISS);
    firstMiss.extraSize = Math.max(-extraSize, -firstMiss.baseWheelSize);
  }

  getMoveProbability(move) {
    if (this.moves.indexOf(move) < 0) {
      throw new Error(`Pokemon ${this.name} does not have move ${move}`);
    }

    return move.wheelSize / this.wheelSize;
  }
}

export default Pokemon;
