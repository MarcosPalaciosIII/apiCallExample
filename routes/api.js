const express = require('express');
const router  = express.Router();
const axios = require('axios');
const Pokemon = require('../models/Pokemon');



router.get('/', (req, res, next) => {
  axios.get('https://pokeapi.co/api/v2/pokemon?limit=1000')
  .then(apiInfo => {
    // console.log("info from API ======== ", apiInfo.data);

    // if your only padding one variable to view page then you can pass object directly
                      //              |
    res.render('api/home', {pokes: apiInfo.data});
  })
  .catch(err => {
    next(err);
  });
});



router.get('/details/:pokeNumber', (req, res, next) => {
  // in order to check whether you have saved the info from api to your DB, make a conditional and check your DB.
  //                                                                        |
  Pokemon.findOne({theId: Number(req.params.pokeNumber)+1}) //  <-----------|
  //                        |                                               |
  // since pokemon start with id 1 and the info is a string we              |
  // must first convert the id to an integer before we can                  |
  // use any math operators on it                                           |
  .then(pokeFromDb => {                                        //         |
    // console.log("info from DB ++++++++++++++++++++ ", pokeFromDb);       |
    if(pokeFromDb) { //  <--------------------------------------------------

      data = {
        // make sure to pass as many of the same key's in the data object so that you don't have to modify your view page too much.
        poke: pokeFromDb,

        // sometimes if will be necessary to make additional keys from that of the api data keys in order to have information displayed as you would like.
        speciesFlavorText: pokeFromDb.flavorText[Math.floor(Math.random() * pokeFromDb.flavorText.length)],
        pokeInDb: true
      };
      //          |
      // when passing multiple variables to the view page, you should make a data object and pass that in order to keep things organized
      //                          |
      res.render('api/details', data);
    } else {
      // if you DB does not have the saved data from your api, then run your normal api call to get and display the information
      axios.get(`https://pokeapi.co/api/v2/pokemon/${Number(req.params.pokeNumber) + 1}`)
      .then(pokeDetails => {
        axios.get(`${pokeDetails.data.species.url}`)
        .then(speciesResults => {
          // remember to console log often when getting info from an api in order to see the information your receiving.

          // console.log("species info from api --------- ", speciesResults.data.flavor_text_entries[0].language);
          // console.log("deatils for pokemon ============= ", pokeDetails.data);

          // you may sometimes need to set temp variables to hold the info you want to pass to the view page
          let speciesArray = [];

          speciesResults.data.flavor_text_entries.forEach(oneEntry => {
            if(oneEntry.language.name === 'en') {
              speciesArray.push(oneEntry);
            }
          });

          data = {
            poke: pokeDetails.data,
            species: speciesArray[Math.floor(Math.random() * speciesArray.length)],
            flavorText: speciesArray
          };

          res.render('api/details', data);
        })
        .catch(err => {
          next(err);
        });
      })
      .catch(err => {
        next(err);
      });
    }
  })
  .catch(err => {
    next(err);
  });
});


router.post('/save', (req, res, next) => {
  // console.log("the req.body >>>>>>>>>>>>>>>>>>>>>>>>>>>> ", req.body);

  // if you have all the same name in your input tags that match your Model, this is how you set your info to your DB prior to saving it
      //                                          |
  const newPoke = new Pokemon(req.body);  // <----

  // if you did not make the name on the input tag the same as your Model, you will have to set it manually
  //                                        |
  newPoke.name = req.body.theName;  //  <---

  // after setting variable with the info from your form, you must then save it.
  newPoke.save()
  .then(newSavedPoke => {
    // console.log("newly created poke =============] ", newSavedPoke);
    res.redirect('/api');
  })
  .catch(err => {
    next(err);
  });
});




module.exports = router;
