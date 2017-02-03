import Move from './move';

class Pokemon {
  constructor(data = {}) {
    this.name = data.name;
    this.moves = data.moves.map(moveData => {
      return new Move(moveData, this);
    });
    this.wheelSize = data.moves.reduce((totalSize, move) => {
      return totalSize + move.wheelSize;
    }, 0);
  }

  getMoveProbability(move) {
    if (this.moves.indexOf(move) < 0) {
      throw new Error(`Pokemon ${this.name} does not have move ${move}`);
    }

    return move.wheelSize / this.wheelSize;
  }
}

export default Pokemon;
