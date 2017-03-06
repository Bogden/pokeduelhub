import React from 'react';
import Incrementer from '../Incrementer';

require('styles/pokemonPicker/SubMenu.css');

class SubMenuComponent extends React.Component {
  constructor() {
    super();
    this.handleShowAdvanced = this.handleShowAdvanced.bind(this);
    this.handleStatusChange = this.handleStatusChange.bind(this);
    this.handlePlateChange = this.handlePlateChange.bind(this);
    this.updateModifiers = this.updateModifiers.bind(this);
    this.state = {
      showAdvancedOptions: false,
      statusValue: 'none',
      plateValue: 'none'
    }
  }

  updateModifiers() {
    let damageModifier = 0;
    let chances = 1;
    if (this.state.statusValue === 'poisoned') {
      damageModifier -= 20;
    } else if (this.state.statusValue === 'noxious') {
      damageModifier -= 40;
    }

    if (this.state.plateValue === 'x-attack') {
      damageModifier += 30;
    } else if (this.state.plateValue === 'double-chance') {
      // Set own spin modifier
      chances += 1;
    }

    // Set own damage modifier
    this.props.pokemon.extraPower = damageModifier;
    this.props.pokemon.chances = chances;

    this.props.notifyPokemonUpdate();
  }

  handleStatusChange(event) {
    const value = event.target.value;

    ga('send', {
      hitType: 'event',
      eventCategory: 'Options',
      eventAction: 'handleStatusChange',
      eventLabel: !!value
    });

    if (value === 'custom') {
      this.setState({
        plateValue: value,
        statusValue: value
      }, this.updateModifiers);
    } else if (this.state.plateValue === 'custom') {
      this.setState({statusValue: value, plateValue: 'none'}, this.updateModifiers);
    } else {
      this.setState({statusValue: value}, this.updateModifiers);
    }
  }

  handlePlateChange(event) {
    const value = event.target.value;

    ga('send', {
      hitType: 'event',
      eventCategory: 'Options',
      eventAction: 'handlePlateChange',
      eventLabel: !!value
    });

    if (value === 'custom') {
      this.setState({
        plateValue: value,
        statusValue: value
      }, this.updateModifiers);
    } else if (this.state.statusValue === 'custom') {
      this.setState({plateValue: value, statusValue: 'none'}, this.updateModifiers);
    } else {
      this.setState({plateValue: value}, this.updateModifiers);
    }
  }

  handleShowAdvanced(event) {
    this.setState({
      showAdvancedOptions: event.target.checked
    })
  }

  render() {
    let subMenuContents;

    if (this.props.pokemon && this.props.pokemon.name) {
      let extraOptions;

      // Basic:
      // Status Effect:
      // Paralyzed
      // Frozen
      // Burned (-10 dmg)
      // Poisoned (-20 dmg)
      // Noxious (-40 dmg)

      // Plate Effect:
      // X Attack (+30 dmg)
      // Type Power (+20 dmg)
      // Double Chance
      // Bright Powder

      // Advanced:
      // Bonus Damage
      // Extra Spins
      // Disabled Move

      if (this.state.statusValue === 'custom' || this.state.plateValue === 'custom') {
        extraOptions = (
          <div className="pokemon-picker-extra-options">
            <div className="extra-option">
              <span className="extra-option-label">Bonus Damage</span>
              <Incrementer type="power" target={this.props.pokemon} notifyPokemonUpdate={this.props.notifyPokemonUpdate} value={this.props.pokemon.extraPower || '00'} />
            </div>
            <div className="extra-option">
              <span className="extra-option-label has-tooltip" data-tooltip="Select rows to calculate total chances">Extra Spins (?)</span>
              <Incrementer type="chances" target={this.props.pokemon} notifyPokemonUpdate={this.props.notifyPokemonUpdate} value={this.props.pokemon.chances - 1} />
            </div>

          </div>
        );
      }

      subMenuContents = (
        <div className="pokemon-picker-sub-menu-contents">
          <table>
            <thead>
              <tr className="sub-menu-headers">
                <td>Size</td>
                <td>Dmg</td>
                <td>Move</td>
              </tr>
            </thead>
            <tbody>
              {this.props.pokemon.moves && this.props.pokemon.moves.map(move => {
                const className = `sub-menu-move-name type-${move.type}`
                if (move.hidden) {
                  return '';
                }
                return (
                  <tr key={move.displayName} >
                    <td><Incrementer type="size" target={move} notifyPokemonUpdate={this.props.notifyPokemonUpdate} value={move.wheelSize} /></td>
                    <td><Incrementer type="power" target={move} notifyPokemonUpdate={this.props.notifyPokemonUpdate} value={move.powerString || ''} /></td>
                    <td className={className}>{move.displayName}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <hr className="pokemon-picker-sub-menu-rule" />
          <div className="pokemon-picker-extra-options">
            <div className="extra-option">
              <span className="extra-option-label">Status</span>
              <select className="extra-option-dropdown" value={this.state.statusValue} onChange={this.handleStatusChange}>
                <option className="extra-option-dropdown-option" value="none">None</option>
                <option className="extra-option-dropdown-option" value="poisoned">Poisoned</option>
                <option className="extra-option-dropdown-option" value="noxious">Noxious</option>
                <option className="extra-option-dropdown-option" value="custom">Custom</option>
                {/* <option className="extra-option-dropdown-option" value="thing">Burned</option>
                <option className="extra-option-dropdown-option" value="thing">Paralyzed</option>
                <option className="extra-option-dropdown-option" value="thing">Frozen</option> */}
              </select>
            </div>
            <div className="extra-option">
              <span className="extra-option-label">Plate</span>
              <select className="extra-option-dropdown" value={this.state.plateValue} onChange={this.handlePlateChange}>
                <option className="extra-option-dropdown-option" value="none">None</option>
                <option className="extra-option-dropdown-option" value="x-attack">X Attack</option>
                <option className="extra-option-dropdown-option" value="double-chance">Double Chance</option>
                <option className="extra-option-dropdown-option" value="custom">Custom</option>
              </select>
            </div>
          </div>
          {extraOptions}
        </div>
      );
    } else {
      subMenuContents = (
        <div className="pokemon-picker-sub-menu-contents">
          Pick a pokemon!
        </div>
      );
    }

    return (
      <div className="pokemon-picker-sub-menu">
        {subMenuContents}
      </div>
    );
  }
}

SubMenuComponent.displayName = 'PokemonPickerSubMenuComponent';

// Uncomment properties you need
// SubMenuComponent.propTypes = {};
// SubMenuComponent.defaultProps = {};

export default SubMenuComponent;
