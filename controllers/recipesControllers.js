const Recipes = require("../models/recipes");
const User = require('../models/user');
const Follow = require('../models/follow');
const { Op } = require('sequelize');

exports.getRecipes = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const offset = (page - 1) * limit;
        const searchText = req.query.search || '';
        // console.log(searchText);
        const veg = req.query.veg ? (req.query.veg === 'true') : null;
        const cuisine = req.query.cuisine || '';
        const recipesType = req.query.recipesType || '';
        const loggedInUser = req.user.id;

        let whereCondition = {
            [Op.or]: [
                { recipesName: { [Op.like]: `%${searchText}%` } },
                { '$User.name$': { [Op.like]: `%${searchText}%` } }
            ]
        };

        if (veg !== null) {
            whereCondition.veg = veg;
        }

        if (cuisine !== '') {
            whereCondition.cuisine = cuisine;
        }

        if (recipesType !== '') {
            whereCondition.recipesType = recipesType;
        }

        const { count, rows: recipes } = await Recipes.findAndCountAll({
            limit,
            offset,
            include: [
                {
                    model: User,
                    attributes: ['name']
                },

            ],
            where: whereCondition
        });

        const totalPages = Math.ceil(count / limit);

        res.json({ recipes, totalPages, currentPage: page, loggedInUser });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error in getRecipes', error: err.message });
    }
};

exports.getRecipeById = async (req, res) => {
    const recipeId = req.params.id;
    const loggedInUserId = req.user.id;
    try {
        const recipe = await Recipes.findOne({
            where: { id: recipeId },
            include: [{ model: User, attributes: ['name'] }]
        });

        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        // console.log(recipe.UserId)
        const isFollowing = await Follow.findOne({
            where: {
                followerId: loggedInUserId,
                followedId: recipe.UserId
            }
        });

        res.json({ recipe, isFollowing: !!isFollowing, loggedInUserId });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to fetch recipe', error: err.message });
    }
};


exports.followUser = async (req, res) => {
    const followerId = req.user.id;
    const followedId = req.params.userId;

    try {
        await Follow.create({ followerId, followedId });
        res.json({ message: 'User followed successfully' });
    } catch (error) {
        console.log('Error following user:', error);
        res.status(500).json({ message: 'Failed to follow user', error: error.message });
    }
};

exports.unfollowUser = async (req, res) => {
    const followerId = req.user.id;
    const followedId = req.params.userId;

    try {
        await Follow.destroy({
            where: { followerId, followedId }
        });
        res.json({ message: 'User unfollowed successfully' });
    } catch (error) {
        console.log('Error unfollowing user:', error);
        res.status(500).json({ message: 'Failed to unfollow user', error: error.message });
    }
};


exports.deleteRecipe = async (req, res) => {
    const recipeId = req.params.id;
    const userId = req.user.id;
    console.log('--------------------------------------');
    console.log(recipeId, userId);
    console.log('--------------------------------------');

    try {
        const recipe = await Recipes.findOne({ where: { id: recipeId, UserId: userId } });

        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found or you do not have permission to delete this recipe' });
        }

        await recipe.destroy();
        res.json({ message: 'Recipe deleted successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to delete recipe', error: err.message });
    }
};
