const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');
const authentication = require('../authentication/authentication');

//routes
router.get('/getUsers', authentication, adminController.getUsers);
router.get('/getRecipes', authentication, adminController.getRecipes);
router.delete('/users/:id', authentication, adminController.deleteUser);
router.delete('/recipes/:id', authentication, adminController.deleteRecipe);

module.exports = router;