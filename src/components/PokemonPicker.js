require('../vendor/awesomplete.css');

import React from 'react';
import Awesomplete from '../vendor/awesomplete';
import POKEMON_DATA from '../data/pokemon-data';
import Incrementer from './Incrementer';

let dataArray = [];
for (let data of POKEMON_DATA.values()) {
  dataArray.push(`${data.id} - ${data.name}`);
}

class PokemonPicker extends React.Component {
  constructor() {
    super();
    this.pickPokemon = this.pickPokemon.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  pickPokemon() {
    if (this.props.pickPokemon) {
      this.props.pickPokemon(this.textInput.value);
    }
  }

  handleClick() {
    this.textInput.setSelectionRange(0, this.textInput.value.length);

    if (this.props.selectPicker) {
      this.props.selectPicker();
      this.pickPokemon();
    }

    if (!this.props.pokemon.name && this.awesomplete) {
      this.awesomplete.evaluate();
      this.awesomplete.open();
    }
  }

  handleInputChange(event) {
    this.setState({inputValue: event.target.value}, this.props.pickPokemon);
  }

  render() {
    const subMenuWrapperClass = `pokemon-picker-sub-menu-wrapper ${this.props.subMenuOpen ? '' : 'hidden'}`

    let subMenuContents;

    if (this.props.pokemon.name) {
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
          <div className="extra-damage">
            <Incrementer type="size" type="power" target={this.props.pokemon} notifyPokemonUpdate={this.props.notifyPokemonUpdate} value={this.props.pokemon.extraPower || '00'} />
            <span className="extra-damage-text">Bonus Damage</span>
          </div>
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
      <div className={`pokemon-picker ${this.props.selected ? 'selected' : ''}`} onClick={this.handleClick}>
        <div className={subMenuWrapperClass}>
          <div className="pokemon-picker-sub-menu">
            {subMenuContents}
          </div>
        </div>
        <div className="pokemon-picker-main">
          <button className="pokeball-options-button" onClick={this.props.toggleSubMenu}></button>
          <input className="pokemon-picker-input"
            type="text"
            onChange={this.handleInputChange}
            ref={input => this.textInput = input}
            placeholder={`Pokemon ${parseInt(this.props.index) + 1}`}
          />
        </div>
      </div>
    );
  }

  componentDidMount() {
    if (this.props.pokemon.id) {
      this.textInput.value = `${this.props.pokemon.id} - ${this.props.pokemon.name}`
    }

    this.awesomplete = new Awesomplete(this.textInput, {
      list: dataArray,
      autoFirst: true,
      minChars: 0,
      maxItems: 999,
      sort: (a, b) => parseInt(a.value) - parseInt(b.value)
    });

    this.textInput.addEventListener('awesomplete-selectcomplete', () => {
      this.pickPokemon();
    });
  }

  componentWillUnmount() {
    this.awesomplete.container.parentNode.appendChild(this.textInput);
    this.awesomplete.container.remove();
  }
}

PokemonPicker.defaultProps = {
};

export default PokemonPicker;
