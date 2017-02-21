require('../../vendor/awesomplete.css');

import React from 'react';
import Awesomplete from '../../vendor/awesomplete';
import POKEMON_DATA from '../../data/pokemon-data';
import PokemonPickerSubMenu from './SubMenuComponent';

let dataArray = [];
for (let data of POKEMON_DATA.values()) {
  dataArray.push(`${data.id} - ${data.name}`);
}

// Status Effects:
// Burned
// Paralyzed
// Poisoned
// Noxious
// Asleep
// Confused
// Frozen
// Cursed
// Wait

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
    const subMenuWrapperClass = `pokemon-picker-sub-menu-wrapper ${this.props.subMenuOpen ? '' : 'hidden'}`;

    return (
      <div className={`pokemon-picker ${this.props.selected ? 'selected' : ''}`} onClick={this.handleClick}>
        <div className={subMenuWrapperClass}>
          <PokemonPickerSubMenu notifyPokemonUpdate={this.props.notifyPokemonUpdate} pokemon={this.props.pokemon} />
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
