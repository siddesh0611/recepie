const Rating = require('../models/rating');

exports.rateRecipe = async (req, res) => {
    const { userId, recipeId, rating } = req.body;

    try {
        await Rating.create({ userId, recipeId, rating });
        res.status(200).json({ message: 'Rating submitted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error submitting rating', error: err.message });
    }
};

exports.getRecipeRating = async (req, res) => {
    const recipeId = req.params.recipeId;
    // console.log(recipeId);
    try {
        const ratings = await Rating.findAll({ where: { recipeId } });
        const averageRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
        console.log(averageRating);
        res.status(200).json({ averageRating });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching rating', error: err.message });
    }
};
