const express = require('express');
const router = express.Router();

const ratingController = require('../controllers/ratingController');
const authentication = require('../authentication/authentication');

//routes
router.get('/rating/:recipeId', authentication, ratingController.getRecipeRating)
router.post('/rate', authentication, ratingController.rateRecipe);

module.exports = router;