const mongoose = require('mongoose');
const Schema   = mongoose.Schema;


const pokemonSchema = new Schema({
  name: {
    type: String
  },
  theId: {
    type: Number
  },
  image: {
    type: String
  },
  // when creating an array of objects, it's usually good to set the type to [] rather than Array. it is the same as setting it to type: Any: Array. 
  flavorText: {
    type: []
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});



const PokemonModel = mongoose.model('Pokemon', pokemonSchema);
module.exports = PokemonModel;
