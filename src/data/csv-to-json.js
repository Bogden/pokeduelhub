var csvFilePath = './src/data/data.csv';
var csv = require('csvtojson');
var fs = require('fs');

var basicJson = [];

csv()
.fromFile(csvFilePath)
.on('json', jsonObj => {
  basicJson.push(jsonObj);
})
.on('done', error => {
  console.log('Done with basic json', error);

  var renameProperty = function (object, oldName, newName) {
       // Do nothing if the names are the same
       if (oldName == newName) {
           return object;
       }
      // Check for the old property name to avoid a ReferenceError in strict mode.
      if (object.hasOwnProperty(oldName)) {
          object[newName] = object[oldName];
          delete object[oldName];
      }
      return object;
  };

  var newData = [];

  basicJson.forEach(move => {
    renameProperty(move, 'ID', 'id');
    renameProperty(move, 'Name', 'name');
    renameProperty(move, 'Move Number', 'moveNumber');
    renameProperty(move, 'Move Name', 'moveName');
    renameProperty(move, 'Move Type', 'type');
    renameProperty(move, 'Wheel Size', 'wheelSize');
    renameProperty(move, 'Power', 'power');
    renameProperty(move, 'Action phrase', 'action');
    renameProperty(move, 'Additional Rules', 'notes');
    move.type = move.type.toLowerCase();
  });

  basicJson.forEach(move => {
    var pokemon = newData.find(pokemon => pokemon.id === move.id);
    if (!pokemon) {
      pokemon = {
        id: move.id,
        name: move.name,
        moves: [move]
      }
      newData.push(pokemon);
    } else {
      pokemon.moves.push(move);
    }
  });

  newData.forEach(pokemon => {
    pokemon.id = parseInt(pokemon.id);

    pokemon.moves.forEach(move => {
      renameProperty(move, 'moveNumber', 'id');
      renameProperty(move, 'moveName', 'name');
      move.id = parseInt(move.id);
      move.wheelSize = parseInt(move.wheelSize);

      if (move.power) {
        if (move.power.indexOf('x') === 0) {
          move.powerType = 'multiplier';
        } else if (move.power.indexOf('+') === 0) {
          move.powerType = 'addition';
        } else if (move.power.indexOf('x') > 0) {
          move.powerType = 'stacking';
        }
        move.power = parseInt(move.power.replace(/\D/g,''));
      }
    });
  });

  fs.writeFile('./src/data/data.json', JSON.stringify(newData), err => {
    if (err) throw err;
    console.log('all saved!');
  });
});


// var template = {
//   id: 1,
//   name: 'Greninja',
//   moves: [{
//     name: 'Miss',
//     type: 'miss',
//     wheelSize: 4
//     power: 12,
//     powerSuffix: 'x'
//     action: 'dodges',
//     notes: 'some notes',
//   }]
// }
