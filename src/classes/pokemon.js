import MOVE_TYPES from '../constants/move-types';
import Move from './move';
import cloneDeep from 'lodash/cloneDeep';

class Pokemon {
  constructor(data = {}) {
    this.id = data.id;
    this.name = data.name;
    this.extraPower = 0;

    const moves = [];

    data.moves.forEach(moveData => {
      if (moveData.power && moveData.power.toString().indexOf('x') === 0) {
        // Respin boost move
        data.moves.forEach(innerMoveData => {
          if (innerMoveData !== moveData) {
            const moveClone = cloneDeep(innerMoveData);
            moveClone.hidden = true;
            const sameMoveNameCount = moves.filter(existingMove => existingMove.name === moveClone.name).length;

            if (sameMoveNameCount) {
              moveClone.displayName = `${moveClone.name} #${sameMoveNameCount + 1}`;
            }

            moveClone.name += ` (${moveData.name})`;
            const totalSize = data.moves.reduce((totalSize, move) => {
              return totalSize + move.wheelSize;
            }, 0);
            moveClone.wheelSize = moveClone.wheelSize * moveData.wheelSize / (totalSize - moveData.wheelSize);
            // Clone wheel size =
            // percent of wheel minus respin move
            // times size of respin move

            if (moveClone.type === MOVE_TYPES.WHITE || moveClone.type === MOVE_TYPES.GOLD) {
              moveClone.power *= parseInt(moveData.power);
            }

            moves.push(new Move(moveClone, this));
          }
        });
      } else {
        const sameMoveNameCount = moves.filter(existingMove => existingMove.name === moveData.name).length;

        if (sameMoveNameCount) {
          const moveClone = cloneDeep(moveData);
          moveClone.displayName = `${moveClone.name} #${sameMoveNameCount + 1}`;
          moves.push(new Move(moveClone, this));
        } else {
          moves.push(new Move(moveData, this));
        }
      }
    });

    this.moves = moves;
  }

  get wheelSize() {
    return this.moves.reduce((totalSize, move) => {
      return totalSize + move.wheelSize;
    }, 0);
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
