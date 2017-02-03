import React from 'react';
import PokemonPicker from './PokemonPicker';

class SimplifiedOutcomeRow extends React.Component {
  render() {
    if (this.props.useTeams) {
      return (
        <div className="configuration team-configuration">
          <div className="team-picker">
            <h3>Team 1</h3>
            <div className="pokemon-picker">
              <span>Pokemon 1</span>
              <PokemonPicker onChange={this.props.pickPokemon1} />
            </div>

            <div className="pokemon-picker">
              <span>Pokemon 2</span>
              <PokemonPicker onChange={this.props.pickPokemon1} />
            </div>

            <div className="pokemon-picker">
              <span>Pokemon 3</span>
              <PokemonPicker onChange={this.props.pickPokemon1} />
            </div>

            <div className="pokemon-picker">
              <span>Pokemon 4</span>
              <PokemonPicker onChange={this.props.pickPokemon1} />
            </div>

            <div className="pokemon-picker">
              <span>Pokemon 5</span>
              <PokemonPicker onChange={this.props.pickPokemon1} />
            </div>

            <div className="pokemon-picker">
              <span>Pokemon 6</span>
              <PokemonPicker onChange={this.props.pickPokemon1} />
            </div>
          </div>

          <div className="team-picker">
            <h3>Team 2</h3>
            <div className="pokemon-picker">
              <span>Pokemon 1</span>
              <PokemonPicker onChange={this.props.pickPokemon2} />
            </div>

            <div className="pokemon-picker">
              <span>Pokemon 2</span>
              <PokemonPicker onChange={this.props.pickPokemon2} />
            </div>

            <div className="pokemon-picker">
              <span>Pokemon 3</span>
              <PokemonPicker onChange={this.props.pickPokemon2} />
            </div>

            <div className="pokemon-picker">
              <span>Pokemon 4</span>
              <PokemonPicker onChange={this.props.pickPokemon2} />
            </div>

            <div className="pokemon-picker">
              <span>Pokemon 5</span>
              <PokemonPicker onChange={this.props.pickPokemon2} />
            </div>

            <div className="pokemon-picker">
              <span>Pokemon 6</span>
              <PokemonPicker onChange={this.props.pickPokemon2} />
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="configuration">
          <div className="pokemon-picker">
            <span>Pokemon 1</span>
            <PokemonPicker onChange={this.props.pickPokemon1} />
          </div>
          <div className="pokemon-picker">
            <span>Pokemon 2</span>
            <PokemonPicker onChange={this.props.pickPokemon2} />
          </div>
        </div>
      );
    }
  }
}

SimplifiedOutcomeRow.defaultProps = {
};

export default SimplifiedOutcomeRow;
