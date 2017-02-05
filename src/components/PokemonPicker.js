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
    this.handleClick = this.handleClick.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.pickPokemon = this.pickPokemon.bind(this);
    this.state = {
      selected: false
    }
  }

  pickPokemon() {
    if (this.props.pickPokemon) {
      this.props.pickPokemon(this.textInput.value);
    }
  }

  handleClick() {
    if (this.props.selectPicker) {
      this.props.selectPicker();
      this.pickPokemon();
    }
  }

  handleInputChange(event) {
    this.setState({inputValue: event.target.value});
  }

  render() {
    return (
      <div className={`pokemon-picker ${this.props.selected ? 'selected' : ''}`} onClick={this.handleClick}>
        <div className="pokemon-picker-main">
          <button className="pokeball-options-button"></button>
          <input className="pokemon-picker-input"
            type="text"
            onChange={this.handleInputChange}
            ref={input => this.textInput = input}
            placeholder={`Pokemon ${parseInt(this.props.index) + 1}`}
          />
        </div>
        <div className="pokemon-picker-sub-menu">
          <table>
            <tr className="sub-menu-headers">
              <td>Size</td>
              <td>Dmg</td>
              <td>Move</td>
            </tr>
            <tr>
              <td><Incrementer /></td>
              <td><Incrementer /></td>
              <td className="sub-menu-move-name type-white">Tackle</td>
            </tr>
            <tr>
              <td><Incrementer /></td>
              <td><Incrementer /></td>
              <td className="sub-menu-move-name type-gold">Quick Attack</td>
            </tr>
            <tr>
              <td><Incrementer /></td>
              <td><Incrementer /></td>
              <td className="sub-menu-move-name type-purple">Thunder Wave</td>
            </tr>
          </table>
        </div>
      </div>
    );
  }

          // <input id="asdf" className="styled-checkbox" type="checkbox" />
          // <label htmlFor="asdf">Option</label>
  componentDidMount() {
    console.log('DID MOUNT', this.props.pokemon);
    if (this.props.pokemon.id) {
      this.textInput.value = `${this.props.pokemon.id} - ${this.props.pokemon.name}`
    }

    this.awesomplete = new Awesomplete(this.textInput, {
      list: dataArray,
      autoFirst: true
    });

    this.textInput.addEventListener('awesomplete-selectcomplete', () => {
      this.pickPokemon();
    });
  }

  componentWillUnmount() {
    console.log('WILL UNMOUNT');
    this.awesomplete.container.parentNode.appendChild(this.textInput);
    this.awesomplete.container.remove();
  }
}

PokemonPicker.defaultProps = {
};

export default PokemonPicker;
