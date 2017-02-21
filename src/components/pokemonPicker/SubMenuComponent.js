import React from 'react';
import Incrementer from '../Incrementer';

require('styles/pokemonPicker/SubMenu.css');

class SubMenuComponent extends React.Component {
  constructor() {
    super();
    this.handleShowAdvanced = this.handleShowAdvanced.bind(this);3
    this.state = {
      showAdvancedOptions: false
    }
  }

  handleShowAdvanced(event) {
    ga('send', {
      hitType: 'event',
      eventCategory: 'Options',
      eventAction: 'showAdvancedPicker',
      eventLabel: !!event.target.checked
    });

    this.setState({
      showAdvancedOptions: event.target.checked
    })
  }

  render() {
    let subMenuContents;

    if (this.props.pokemon.name) {
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
      if (this.state.showAdvancedOptions) {
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
      } else {
        extraOptions = (
          <div className="pokemon-picker-extra-options">
            <div className="extra-option">
              <span className="extra-option-label">Status</span>
              <select className="extra-option-dropdown" name="" id="">
                <option className="extra-option-dropdown-option" value="thing">None</option>
                <option className="extra-option-dropdown-option" value="thing">Poisoned</option>
                <option className="extra-option-dropdown-option" value="thing">Noxious</option>
                {/* <option className="extra-option-dropdown-option" value="thing">Burned</option>
                <option className="extra-option-dropdown-option" value="thing">Paralyzed</option>
                <option className="extra-option-dropdown-option" value="thing">Frozen</option> */}
              </select>
            </div>
            <div className="extra-option">
              <span className="extra-option-label">Plate</span>
              <select className="extra-option-dropdown" name="" id="">
                <option className="extra-option-dropdown-option" value="thing">None</option>
                <option className="extra-option-dropdown-option" value="thing">X Attack</option>
                <option className="extra-option-dropdown-option" value="thing">Double Chance</option>
                <option className="extra-option-dropdown-option" value="thing">Bright Powder</option>
              </select>
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
              {this.props.pokemon.moves && this.props.pokemon.moves.map((move, index) => {
                const className = `sub-menu-move-name type-${move.type}`
                if (move.hidden) {
                  return '';
                }
                return (
                  <tr key={index} >
                    <td><Incrementer type="size" target={move} notifyPokemonUpdate={this.props.notifyPokemonUpdate} value={move.wheelSize} /></td>
                    <td><Incrementer type="power" target={move} notifyPokemonUpdate={this.props.notifyPokemonUpdate} value={move.powerString || ''} /></td>
                    <td className={className}>{move.displayName}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <hr className="pokemon-picker-sub-menu-rule" />
          {extraOptions}
          {/* TODO: Better ID to handle same pokemon case */}
          <input id={`pokemon-picker-advanced-${this.props.pokemon.name}`} className="styled-checkbox" type="checkbox"  onChange={this.handleShowAdvanced} />
          <label htmlFor={`pokemon-picker-advanced-${this.props.pokemon.name}`} className="pokemon-picker-show-advanced" >Show Advanced</label>
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
