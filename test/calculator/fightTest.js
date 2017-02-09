/*eslint-env node, mocha */
/*global expect */
/*eslint no-console: 0*/
'use strict';

// Uncomment the following lines to use the react test utilities
// import React from 'react/addons';
// const TestUtils = React.addons.TestUtils;

import {generateBattleOutcomes, simplifyOutcomes} from 'calculator/fight';
import POKEMON_DATA from 'data/pokemon-data';
import Pokemon from 'classes/pokemon';

function getPercent(probability) {
  return Math.round(probability * 10000) / 100
}

describe('#generateBattleOutcomes', function () {
  it('should handle standard battles', function () {
    const bidoof = new Pokemon(POKEMON_DATA.get(20));
    const tyrogue = new Pokemon(POKEMON_DATA.get(28));

    const outcomes = generateBattleOutcomes(bidoof, tyrogue);
    const simpleOutcomes = simplifyOutcomes(outcomes);
    expect(getPercent(simpleOutcomes[0].probability)).to.equal(51.91);
    expect(getPercent(simpleOutcomes[1].probability)).to.equal(38.37);
    expect(getPercent(simpleOutcomes[2].probability)).to.equal(9.72);
  });

  it('should handle stacking vs regular', function () {
    const greninja = new Pokemon(POKEMON_DATA.get(170));
    const tyrogue = new Pokemon(POKEMON_DATA.get(28));

    const outcomes = generateBattleOutcomes(greninja, tyrogue);
    const simpleOutcomes = simplifyOutcomes(outcomes);
    expect(getPercent(simpleOutcomes[0].probability)).to.equal(37.1);
    expect(getPercent(simpleOutcomes[1].probability)).to.equal(33.39);
    expect(getPercent(simpleOutcomes[2].probability)).to.equal(29.51);
  });

  it('should handle multiplier vs regular', function () {
    const eevee = new Pokemon(POKEMON_DATA.get(57));
    const tyrogue = new Pokemon(POKEMON_DATA.get(28));

    const outcomes = generateBattleOutcomes(eevee, tyrogue);
    const simpleOutcomes = simplifyOutcomes(outcomes);
    expect(getPercent(simpleOutcomes[0].probability)).to.equal(48.65);
    expect(getPercent(simpleOutcomes[1].probability)).to.equal(33.88);
    expect(getPercent(simpleOutcomes[2].probability)).to.equal(17.46);
  });

  it('should handle multiplier with added size vs regular', function () {
    const eevee = new Pokemon(POKEMON_DATA.get(57));
    const tyrogue = new Pokemon(POKEMON_DATA.get(28));

    eevee.moves.find(move => move.name === 'Focus Energy').addExtraSize(4);

    const outcomes = generateBattleOutcomes(eevee, tyrogue);
    const simpleOutcomes = simplifyOutcomes(outcomes);
    expect(getPercent(simpleOutcomes[0].probability)).to.equal(50.26);
    expect(getPercent(simpleOutcomes[1].probability)).to.equal(28.91);
    expect(getPercent(simpleOutcomes[2].probability)).to.equal(20.83);
  });
});
