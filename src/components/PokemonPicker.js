require('../vendor/awesomplete.css');

import React from 'react';
import Awesomplete from '../vendor/awesomplete.js';
import POKEMON_DATA from '../data/pokemon-data';

let dataArray = [];
for (let data of POKEMON_DATA.values()) {
  dataArray.push(`${data.id} - ${data.name}`);
}

class PokemonPicker extends React.Component {
  handleChange(event) {
    if (this.props.onChange) {
      this.props.onChange(event.target.value);
    }
  }

  render() {
    return (
      <input className="pokemon-picker-input" type="text" onChange={this.handleChange.bind(this)} ref={input => this.textInput = input} />
    );
  }

  componentDidMount() {
    this.awesomplete = new Awesomplete(this.textInput, {
      list: dataArray,
      autoFirst: true
    });

    this.textInput.addEventListener('awesomplete-selectcomplete', () => {
      this.props.onChange(this.textInput.value);
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
