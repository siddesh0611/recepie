const express = require('express');
const router = express.Router();

const recipesController = require('../controllers/recipesControllers');
const authentication = require('../authentication/authentication');

//routes
router.get('/recipes', authentication, recipesController.getRecipes);
router.get('/recipes/:id', authentication, recipesController.getRecipeById);
router.post('/follow/:userId', authentication, recipesController.followUser);
router.post('/unfollow/:userId', authentication, recipesController.unfollowUser);
router.delete('/:id', authentication, recipesController.deleteRecipe);

module.exports = router;