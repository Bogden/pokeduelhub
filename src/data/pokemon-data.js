import data from './data.json';
const POKEMON_DATA = new Map();

const map = new Map();
data.forEach(pokemonData => {
  map.set(pokemonData.id, pokemonData);
});

export default map;

function generateMove(moveType, options = {}) {
  switch (moveType) {
    case 'blue':
      return generateBlue(options);
    case 'purple':
      return generatePurple(options);
    case 'gold':
      return generateGold(options);
    case 'white':
      return generateWhite(options);
    case 'miss':
      return generateMiss(options);
  }
}

function generateBlue(options = {}) {
  if (typeof options === 'number') {
    options = {
      wheelSize: options
    }
  }

  return {
    name: options.name || 'Dodge',
    type: 'blue',
    wheelSize: options.wheelSize,
    notes: options.notes,
    action: options.action || 'dodges'
  }
}

function generatePurple(options = {}) {
  return {
    name: options.name,
    type: 'purple',
    wheelSize: options.wheelSize,
    notes: options.notes,
    action: options.action,
    power: options.power
  }
}

function generateGold(options = {}) {
  return {
    name: options.name,
    type: 'gold',
    wheelSize: options.wheelSize,
    notes: options.notes,
    action: options.action || 'knocks out',
    power: options.power
  }
}

function generateWhite(options = {}) {
  return {
    name: options.name,
    type: 'white',
    wheelSize: options.wheelSize,
    notes: options.notes,
    action: options.action || 'knocks out',
    power: options.power
  }
}

function generateMiss(options = {}) {
  if (typeof options === 'number') {
    options = {
      wheelSize: options
    }
  }

  return {
    name: 'Miss',
    type: 'miss',
    wheelSize: options.wheelSize,
    notes: options.notes,
    action: 'misses'
  }
}

POKEMON_DATA.set(234, {
  id: 234,
  name: 'Latios',
  moves: [
    generateBlue(12),
    generateWhite({
      name: 'Luster Purge',
      wheelSize: 20,
      power: 120
    }), generateWhite({
      name: 'Dragon Breath',
      wheelSize: 32,
      power: 70
    }),
    generateBlue(12),
    generateMiss(4),
    generateWhite({
      name: 'Psychic',
      wheelSize: 16,
      power: 60
    })
  ]
});

POKEMON_DATA.set(57, {
  id: 57,
  name: 'Eevee',
  moves: [
    generateBlue(8),
    generateWhite({
      name: 'Tackle',
      wheelSize: 24,
      power: 30
    }),
    generateWhite({
      name: 'Focus Energy',
      wheelSize: 28,
      power: '+20',
      action: 'focuses against'
    }),
    generateWhite({
      name: 'Tackle',
      wheelSize: 16,
      power: 20
    }),
    generateBlue(12),
    generateMiss(8)
  ]
});

POKEMON_DATA.set(251, {
  id: 251,
  name: 'Shuppet',
  moves: [{
    name: 'Miss',
    type: 'miss',
    wheelSize: 12
  }, {
    name: 'Will-o-Wisp',
    type: 'purple',
    power: 1,
    wheelSize: 28,
    action: 'burns'
  }, {
    name: 'Night Shade',
    type: 'white',
    power: 10,
    wheelSize: 56,
    action: 'knocks out'
  }]
});

POKEMON_DATA.set(90, {
  id: 90,
  name: 'Weedle',
  moves: [{
    name: 'Poison Sting',
    type: 'purple',
    power: 1,
    wheelSize: 60,
    action: 'poisons'
  }, {
    name: 'Tackle',
    type: 'white',
    power: 10,
    wheelSize: 32,
    action: 'knocks out'
  }, {
    name: 'Miss',
    type: 'miss',
    wheelSize: 4
  }]
});

POKEMON_DATA.set(28, {
  id: 28,
  name: 'Tyrogue',
  moves: [{
    name: 'High Jump Kick',
    type: 'white',
    power: 50,
    wheelSize: 20,
    action: 'knocks out'
  }, {
    name: 'Tackle',
    type: 'white',
    power: 30,
    wheelSize: 72,
    action: 'knocks out'
  }, {
    name: 'Miss',
    type: 'miss',
    wheelSize: 4
  }]
});

POKEMON_DATA.set(170, {
  id: 170,
  name: 'Greninja',
  moves: [{
    name: 'Miss',
    type: 'miss',
    wheelSize: 4
  }, {
    name: 'Dodge',
    type: 'blue',
    wheelSize: 28,
    action: 'dodges'
  }, {
    name: 'Hydro Pump',
    type: 'white',
    power: 60,
    wheelSize: 20,
    action: 'knocks out'
  }, {
    name: 'Miss',
    type: 'miss',
    wheelSize: 4
  }, {
    name: 'Water Shuriken',
    type: 'gold',
    power: 20,
    powerSuffix: 'x',
    wheelSize: 40,
    action: 'knocks out'
    // Need indicator for 20x
  }]
});

POKEMON_DATA.set(179, {
  id: 179,
  name: 'Leafeon',
  moves: [{
    name: 'Miss',
    type: 'miss',
    wheelSize: 8
  }, {
    name: 'Dodge',
    type: 'blue',
    wheelSize: 20,
    action: 'dodges'
  }, {
    name: 'Leaf Blade',
    type: 'white',
    power: 40,
    wheelSize: 40,
    action: 'knocks out'
  }, {
    name: 'Grass Whistle',
    type: 'purple',
    power: 1,
    wheelSize: 28,
    action: 'inflicts sleep on'
  }]
});

POKEMON_DATA.set(188, {
  id: 188,
  name: 'Jolteon',
  moves: [{
    name: 'Miss',
    type: 'miss',
    wheelSize: 8
  }, {
    name: 'Dodge',
    type: 'blue',
    wheelSize: 20,
    action: 'dodges'
  }, {
    name: 'Thunder Jolt',
    type: 'white',
    power: 40,
    wheelSize: 40,
    action: 'knocks out'
  }, {
    name: 'Quick Attack',
    type: 'gold',
    power: 30,
    wheelSize: 28,
    action: 'knocks out'
  }]
});

POKEMON_DATA.set(104, {
  id: 104,
  name: 'Pikachu (R)',
  moves: [{
    name: 'Miss',
    type: 'miss',
    wheelSize: 4
  }, {
    name: 'Quick Attack',
    type: 'gold',
    power: 50,
    wheelSize: 20,
    action: 'knocks out'
  }, {
    name: 'Thunder',
    type: 'white',
    power: 100,
    wheelSize: 12,
    action: 'knocks out'
  }, {
    name: 'Thunder Wave',
    type: 'purple',
    power: 2,
    wheelSize: 20,
    action: 'paralyzes'
  }, {
    name: 'Thunder Shock',
    type: 'white',
    power: 30,
    wheelSize: 40,
    action: 'knocks out'
  }]
});

// export default POKEMON_DATA;
