require('normalize.css/normalize.css');
require('styles/App.styl');

import React from 'react';
import POKEMON_DATA from '../data/pokemon-data';
import {generateBattleOutcomes} from '../calculator/fight';
import {getUserId} from '../calculator/user';
import Pokemon from '../classes/pokemon';

import OutcomeTables from './OutcomeTables';
import Configuration from './Configuration';
import DonateButton from './DonateButton';
import PatchNotes from './PatchNotes';
import Tip from './Tip';

// const blah = {
//   team1: [{
//     pokemon: 'a pokemon object here'
//   }, {
//     pokemon: 'another pokemon object here'
//   }],
//   team2: [{
//     pokemon: 'a pokemon object here'
//   }, {
//     pokemon: 'another pokemon object here'
//   }]
// }

class AppComponent extends React.Component {
  constructor() {
    super();
    this.pickPokemon = this.pickPokemon.bind(this);
    this.handleNotifyPokemonUpdate = this.handleNotifyPokemonUpdate.bind(this);
    this.state = {
      // Empty object represents no pokemon
      team1: [{}, {}, {}, {}, {}, {}],
      team2: [{}, {}, {}, {}, {}, {}]
    };
    this.userId = getUserId();
  }

  getPokemonFromPickText(pickText) {
    if (!pickText) {
      return;
    }

    const id = parseInt(pickText.substring(0, pickText.indexOf('-') - 1));

    if (!id) {
      return;
    }

    const pokemonData = POKEMON_DATA.get(id);

    if (!pokemonData) {
      return;
    }

    return new Pokemon(pokemonData);
  }

  pickPokemon(teamNumber, index, pickText) {
    let pokemon = this.getPokemonFromPickText(pickText);
    const teamPropertyName = `team${teamNumber}`;

    if (!pokemon) {
      const newState = {}
      newState[teamPropertyName] = this.state[teamPropertyName];
      newState[teamPropertyName][index] = {};
      newState[`pokemon${teamNumber}`] = {};
      this.setState(newState);
      return;
    }

    const oldPokemon = this.state[teamPropertyName][index];

    if (oldPokemon.name === pokemon.name) {
      pokemon = oldPokemon;
    }

    const newState = {}
    newState[teamPropertyName] = this.state[teamPropertyName];
    newState[teamPropertyName][index] = pokemon;
    newState[`pokemon${teamNumber}`] = pokemon;
    this.setState(newState, this.comparePokemon);
  }

  comparePokemon() {
    const pokemon1 = this.state.pokemon1;
    const pokemon2 = this.state.pokemon2;

    if (!pokemon1 || !pokemon2) {
      return;
    }

    this.setState({
      outcomes: generateBattleOutcomes(pokemon1, pokemon2)
    });
  }

  handleUseTeams(event) {
    ga('send', {
      hitType: 'event',
      eventCategory: 'Options',
      eventAction: 'useTeams',
      eventLabel: !!event.target.checked
    });

    this.setState({
      useTeams: event.target.checked
    });
  }

  handleNotifyPokemonUpdate(teamNumber, index, pokemon) {
    const teamPropertyName = `team${teamNumber}`;

    const newState = {}
    newState[teamPropertyName] = this.state[teamPropertyName];
    newState[teamPropertyName][index] = pokemon;
    this.setState(newState, this.comparePokemon);
  }

  render() {
    return (
      <div className="index">
        <PatchNotes />
        <div className="body">
          <div className="main-display">
            <DonateButton />

            <h1><span>Pokémon Duel</span> <span>Battle Calculator</span></h1>

            <Configuration
              useTeams={this.state.useTeams}
              team1={this.state.team1}
              team2={this.state.team2}
              pickPokemon={this.pickPokemon}
              notifyPokemonUpdate={this.handleNotifyPokemonUpdate}
            />
            <input id="use-teams" className="styled-checkbox" type="checkbox" onChange={this.handleUseTeams.bind(this)} />
            <label htmlFor="use-teams">Use teams</label>

            <OutcomeTables
              className="outcome-tables"
              outcomes={this.state.outcomes}
              pokemon1={this.state.pokemon1}
              pokemon2={this.state.pokemon2}
            />
          </div>
          
          <Tip />
        </div>
        <div className="footer">Copyright © 2017 <a href="mailto:pokeduelhub@gmail.com">Bogden</a> - All Rights Reserved.</div>
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
