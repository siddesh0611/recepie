const express = require('express');
const router = express.Router();

const userController = require('../controllers/userControllers');
const authentication = require('../authentication/authentication');
const upload = require('../controllers/upload');
const { route } = require('./recipesRoutes');

//routes
router.post('/uploadRecipes', authentication, upload.single('img'), userController.uploadRecipes);
router.get('/profile', authentication, userController.getProfile);
router.post('/save', authentication, userController.saveRecipe);
router.get('/:collectionName', authentication, userController.getsavedRcipes);


module.exports = router;