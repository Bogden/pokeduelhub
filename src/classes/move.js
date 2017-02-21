import MOVE_TYPES from '../constants/move-types';
import {getMoveOutcome} from '../calculator/fight';

class Move {
  constructor(options = {}, owningPokemon) {
    this.data = options;
    this.name = options.name;
    this.type = options.type;
    this.basePower = options.power;
    this.baseWheelSize = options.wheelSize;
    this.powerSuffix = options.powerSuffix;
    this.action = options.action;
    this.notes = options.notes;
    this.powerType = options.powerType;
    this._displayName = options.displayName;
    this.pokemon = owningPokemon;
    this.extraPower = 0;
    this.extraSize = 0;

    this.addExtraPower = this.addExtraPower.bind(this);
    this.subtractExtraPower = this.subtractExtraPower.bind(this);
    this.addExtraSize = this.addExtraSize.bind(this);
    this.subtractExtraSize = this.subtractExtraSize.bind(this);
  }

  get displayName() {
    return this._displayName || this.name;
  }

  set displayName(displayName) {
    return this._displayName = displayName;
  }

  get wheelSize() {
    return this.baseWheelSize + this.extraSize;
  }

  set wheelSize(newSize) {
    newSize = parseFloat(newSize) || 0;

    this.extraSize = newSize - this.baseWheelSize;
    this.pokemon.fitSizes();
  }

  get powerString() {
    const displayPower = this.basePower + this.extraPower;

    if (this.powerType === 'stacking') {
      return displayPower + 'x';
    } else if (this.powerType === 'multiplier') {
      return 'x' + displayPower;
    } else {
      return displayPower;
    }
  }

  get power() {
    let power = this.basePower + this.extraPower;

    if (this.type === MOVE_TYPES.WHITE || this.type === MOVE_TYPES.GOLD) {
      power += this.pokemon.extraPower;
    }

    return power;
  }

  set power(newPower) {
    // TODO: Clarify difference between power with pokemon bonus and without
    // This currently assumes the newPower does not include pokemon bonus
    newPower = parseFloat(newPower) || 0;

    this.extraPower = newPower - this.basePower;
  }

  compareAgainst(otherMove) {
    return getMoveOutcome(this, otherMove);
  }

  getProbability() {
    return this.wheelSize / 96;
  }

  addExtraPower(amount = 1) {
    this.extraPower += amount;
  }

  subtractExtraPower(amount = 1) {
    if (this.extraPower > 0) {
      this.extraPower -= amount;
    }
  }

  addExtraSize(amount = 1) {
    this.extraSize += amount;
    this.pokemon.fitSizes();
  }

  subtractExtraSize(amount = 1) {
    if (this.extraSize > 0 || (this.type === MOVE_TYPES.MISS && this.wheelSize > 0)) {
      this.extraSize -= amount;
      this.pokemon.fitSizes();
    }
  }
}

export default Move;
