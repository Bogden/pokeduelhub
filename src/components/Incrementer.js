import React from 'react';
import MOVE_TYPES from '../constants/move-types';

class OutcomeRow extends React.Component {
  constructor() {
    super();
    this.wrapMoveMethod = this.wrapMoveMethod.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {};
  }

  shouldDisableInput() {
    return (this.props.type === 'power' && !this.shouldShowPower()) ||
    (this.props.type === 'size' && !this.shouldShowSize());
  }

  shouldShowPower() {
    const move = this.props.move;
    return move.type === MOVE_TYPES.WHITE || move.type === MOVE_TYPES.GOLD || move.type === MOVE_TYPES.PURPLE
  }

  shouldShowSize() {
    return this.props.move.type !== MOVE_TYPES.MISS;
    // return move.extraSize > 0 || (move.type === MOVE_TYPES.MISS && move.wheelSize > 0)
  }

  wrapMoveMethod(changeType) {
    if (this.props.move) {
      const typeWord = this.props.type.charAt(0).toUpperCase() + this.props.type.slice(1);
      return () => {
        this.props.move[`${changeType}Extra${typeWord}`]();

        // // The "react"-y way to do this would be to pass all of these methods up to the root
        // // and then setState with the new move data on the pokemon
        // this.updateValue();
        this.props.notifyPokemonUpdate();
      }
    }
  }

  // Get diff between basePower and current value, set extraPower
  handleChange(event) {
    const newValue = event.target.value;
    const move = this.props.move;

    if (this.props.type === 'size') {
      move.wheelSize = newValue;
    } else {
      move.power = newValue;
    }

    this.props.notifyPokemonUpdate();
  }

  componentWillMount() {
    this.setState({
      disabled: this.shouldDisableInput()
    });
  }

  render() {
    const className = `incrementer ${this.state.disabled ? 'disabled' : ''}`;

    return (
      <div className={className}>
        <button className="incrementer-minus" onClick={this.wrapMoveMethod('subtract')} disabled={this.state.disabled} >-</button>
        <input className="sub-menu-input" onChange={this.handleChange} type="text" value={this.props.value} disabled={this.state.disabled} />
        <button className="incrementer-plus" onClick={this.wrapMoveMethod('add')} disabled={this.state.disabled} >+</button>
      </div>
    );
  }
}

OutcomeRow.defaultProps = {
};

export default OutcomeRow;
