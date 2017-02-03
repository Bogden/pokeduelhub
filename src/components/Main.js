require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import POKEMON_DATA from '../data/pokemon-data';
import {generateBattleOutcomes} from '../calculator/fight';
import Pokemon from '../classes/pokemon';

import PokemonPicker from './PokemonPicker';
import OutcomeTables from './OutcomeTables';

class AppComponent extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  pickPokemon1(pickText) {
    this.setState({
      pickText1: pickText
    });
  }

  pickPokemon2(pickText) {
    this.setState({
      pickText2: pickText
    });
  }

  comparePokemon() {
    const pickText1 = this.state.pickText1;
    const pickText2 = this.state.pickText2;

    if (!pickText1 || !pickText2) {
      return;
    }

    const id1 = parseInt(pickText1.substring(0, pickText1.indexOf('-') - 1));
    const id2 = parseInt(pickText2.substring(0, pickText1.indexOf('-') - 1));

    if (!id1 || !id2) {
      return;
    }

    const pokemonData1 = POKEMON_DATA.get(id1);
    const pokemonData2 = POKEMON_DATA.get(id2);

    if (!pokemonData1 || !pokemonData2) {
      return;
    }

    const pokemon1 = new Pokemon(pokemonData1);
    const pokemon2 = new Pokemon(pokemonData2);

    this.setState({
      outcomes: generateBattleOutcomes(pokemon1, pokemon2)
    });
  }

  render() {
    return (
      <div className="index">
        <h1>Pokemon Duel Battle Calculator</h1>

        <div className="configuration">
          <div className="pokemon-picker">
            <span>Pokemon 1</span>
            <PokemonPicker onChange={this.pickPokemon1.bind(this)} />
          </div>

          <div className="pokemon-picker">
            <span>Pokemon 2</span>
            <PokemonPicker onChange={this.pickPokemon2.bind(this)} />
          </div>
        </div>

        <button className="compare-button" onClick={this.comparePokemon.bind(this)}>Compare!</button>

        <OutcomeTables className="outcome-tables" outcomes={this.state.outcomes} />
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
