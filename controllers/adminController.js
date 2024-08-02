const User = require('../models/user');
const Recipe = require('../models/recipes');

exports.getUsers = async (req, res) => {
    try {
        const userId = req.user.id;
        const adminStatus = await isAdmin(userId);
        if (!adminStatus) {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
};

exports.getRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.findAll();
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching recipes' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const adminId = req.user.id;
        const userId = req.params.id;

        const isAdminUser = await isAdmin(adminId);
        if (!isAdminUser) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const userToDelete = await User.findOne({ where: { id: userId } });
        if (userToDelete.isAdmin) {
            return res.status(403).json({ error: 'Cannot delete admin user' });
        }

        await User.destroy({ where: { id: userId } });
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting user' });
    }
};

exports.deleteRecipe = async (req, res) => {
    try {
        const adminId = req.user.id;
        const isAdminUser = await isAdmin(adminId);
        if (!isAdminUser) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const recipeId = req.params.id;
        await Recipe.destroy({ where: { id: recipeId } });
        res.status(200).json({ message: 'Recipe removed successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error removing recipe' });
    }
};

async function isAdmin(userId) {
    try {
        const user = await User.findOne({ where: { id: userId } });
        if (!user) {
            throw new Error('User not found');
        }
        return user.isAdmin;
    } catch (err) {
        console.log(err);
        throw err;
    }
}
