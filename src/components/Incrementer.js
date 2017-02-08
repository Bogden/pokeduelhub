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
    const move = this.props.target;
    // Always show if pokenon
    return !move.type || move.type === MOVE_TYPES.WHITE || move.type === MOVE_TYPES.GOLD || move.type === MOVE_TYPES.PURPLE
  }

  shouldShowSize() {
    return this.props.target.type !== MOVE_TYPES.MISS;
    // return move.extraSize > 0 || (move.type === MOVE_TYPES.MISS && move.wheelSize > 0)
  }

  wrapMoveMethod(changeType) {
    if (this.props.target) {
      const typeWord = this.props.type.charAt(0).toUpperCase() + this.props.type.slice(1);
      // addExtraPower
      // subtractExtraSize
      return () => {
        ga('send', {
          hitType: 'event',
          eventCategory: 'Incrementer',
          eventAction: this.props.target.name,
          eventLabel: changeType
        });

        this.props.target[`${changeType}Extra${typeWord}`]();
        this.props.notifyPokemonUpdate();
      }
    }
  }

  // Get diff between basePower and current value, set extraPower
  handleChange(event) {
    const newValue = event.target.value;
    const move = this.props.target;

    if (this.props.type === 'size') {
      move.wheelSize = newValue;
    } else if (this.props.type === 'power') {
      move.power = newValue;
    }

    this.props.notifyPokemonUpdate();
  }

  shouldDisableMinus() {
    if (this.props.type === 'size') {
      return this.props.target.wheelSize <= 0 || this.props.target.extraSize <= 0 || this.props.target.type === MOVE_TYPES.MISS;
    } else if (this.props.type === 'power') {
      return this.props.target.extraPower <= 0;
    }
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
        <button className="incrementer-minus" onClick={this.wrapMoveMethod('subtract')} disabled={this.shouldDisableMinus()} >-</button>
        <input className="sub-menu-input" onChange={this.handleChange} type="text" value={this.props.value} disabled={this.state.disabled} />
        <button className="incrementer-plus" onClick={this.wrapMoveMethod('add')} disabled={this.state.disabled} >+</button>
      </div>
    );
  }
}

OutcomeRow.defaultProps = {
};

export default OutcomeRow;
