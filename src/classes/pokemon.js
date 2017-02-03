import MOVE_TYPES from '../constants/move-types';
import Move from './move';
import cloneDeep from 'lodash/cloneDeep';

class Pokemon {
  constructor(data = {}) {
    this.name = data.name;
    this.wheelSize = data.moves.reduce((totalSize, move) => {
      return totalSize + move.wheelSize;
    }, 0);

    const moves = [];
    data.moves.forEach(moveData => {
      if (moveData.power && moveData.power.toString().indexOf('+') === 0) {
        // Respin boost move
        data.moves.forEach(innerMoveData => {
          if (innerMoveData !== moveData) {
            const moveClone = cloneDeep(innerMoveData);
            const sameMoveNameCount = moves.filter(existingMove => existingMove.name === moveClone.name).length;

            if (sameMoveNameCount) {
              moveClone.name += ` #${sameMoveNameCount + 1}`;
            }

            moveClone.name += ` (${moveData.name})`;
            moveClone.wheelSize = moveClone.wheelSize * moveData.wheelSize / (this.wheelSize - moveData.wheelSize);
            // Clone wheel size =
            // percent of wheel minus respin move
            // times size of respin move

            if (moveClone.type === MOVE_TYPES.WHITE || moveClone.type === MOVE_TYPES.GOLD) {
              moveClone.power += 20;
            }

            moves.push(new Move(moveClone, this));
          }
        });
      } else {
        const sameMoveNameCount = moves.filter(existingMove => existingMove.name === moveData.name).length;

        if (sameMoveNameCount) {
          const moveClone = cloneDeep(moveData);
          moveClone.name += ` #${sameMoveNameCount + 1}`;
          moves.push(new Move(moveClone, this));
        } else {
          moves.push(new Move(moveData, this));
        }
      }
    });

    this.moves = moves;
  }

  getMoveProbability(move) {
    if (this.moves.indexOf(move) < 0) {
      throw new Error(`Pokemon ${this.name} does not have move ${move}`);
    }

    return move.wheelSize / this.wheelSize;
  }
}

export default Pokemon;
