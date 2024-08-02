const AWS = require('aws-sdk');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
require('dotenv').config();
const User = require('../models/user');
const Recipe = require('../models/recipes');
const Save = require('../models/save');
const { Json } = require('sequelize/lib/utils');

exports.uploadRecipes = async (req, res) => {
    try {
        const { userId, recipesName, cuisine, veg, recipesType, ingredients, method, cookingTime } = req.body;
        const file = req.file;
        // console.log(req.body.veg);
        console.log(veg);
        if (!file) {
            return res.status(400).json({ message: 'Image file is required' });
        }

        const filename = `recipes/${Date.now()}_${file.originalname}`;
        const imgURL = await uploadTOS3(file.buffer, filename);
        // console.log(imgURL);

        const ingredientsArray = Array.isArray(ingredients) ? ingredients : [ingredients];
        const methodArray = Array.isArray(method) ? method : [method];

        const user = req.user;
        // console.log(user);
        // console.log(Object.getOwnPropertyNames(User.prototype));

        const newRecipe = await user.createRecipe({
            recipesName,
            cuisine,
            veg: veg === 'veg',
            recipesType,
            imgUrl: imgURL,
            ingredients: ingredientsArray,
            method: methodArray,
            cookingTime
        });

        res.status(201).json({
            message: 'Recipe uploaded successfully',
            recipe: newRecipe
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to upload recipe',
            error: err.message
        });
    }
};

async function uploadTOS3(data, filename) {
    const BUCKET_NAME = process.env.BUCKET_NAME;

    const s3Client = new S3Client({
        region: process.env.REGION,
        credentials: {
            accessKeyId: process.env.IAM_USER_KEY,
            secretAccessKey: process.env.IAM_USER_SECRET,
        },
    });

    const params = {
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: data,
        ACL: 'public-read',
    };

    try {
        const command = new PutObjectCommand(params);
        const response = await s3Client.send(command);
        return `https://${BUCKET_NAME}.s3.amazonaws.com/${filename}`;
    } catch (err) {
        console.log('Error uploading to S3:', err);
        throw err;
    }
}

exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findByPk(userId, {
            attributes: ['name', 'emailId'],
            include: {
                model: Recipe,
                attributes: ['id', 'recipesName', 'imgUrl']
            }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ user, recipes: user.Recipes });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to fetch profile data' });
    }
};

exports.saveRecipe = async (req, res) => {
    try {
        const userId = req.user.id;
        const { recipeId, collection } = req.body;
        await Save.create({ userId, recipeId, collection });
        res.status(200).json({ message: 'Recipe saved sucessfully' });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'error in saving recipe' })
    }
}

exports.getsavedRcipes = async (req, res) => {
    try {
        const collectionName = req.params.collectionName;
        console.log(collectionName);
        const userId = req.user.id;
        const favorites = await Save.findAll({
            where: { userId, collection: collectionName },
            include: {
                model: Recipe,
                attributes: ['id', 'recipesName', 'imgUrl']
            }
        });
        res.status(200).json({ favorites });
    } catch (err) {
        console.log('Error fetching favorites:', err);
    }
};


