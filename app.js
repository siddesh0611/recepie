const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// Importing DB
const sequelize = require('./util/database');
const User = require('./models/user');
const Recipe = require('./models/recipes');
const Follow = require('./models/follow');
const Save = require('./models/save');

// Routes
const accountRoute = require('./routes/accountRoutes');
const userRoute = require('./routes/userRoutes');
const recipeRoute = require('./routes/recipesRoutes');
const ratingRoute = require('./routes/ratingRoutes');
const adminRoute = require('./routes/adminRoutes');

const app = express();

app.use(cors({
    origin: '*'
}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Connecting routes
app.use('/admin', adminRoute);
app.use('/rate', ratingRoute);
app.use('/home', recipeRoute);
app.use('/user', userRoute);
app.use('/account', accountRoute);

// DB relations
User.hasMany(Recipe);
Recipe.belongsTo(User);

User.hasMany(Save, { foreignKey: 'userId' });
Save.belongsTo(User, { foreignKey: 'userId' });

Recipe.hasMany(Save, { foreignKey: 'recipeId' });
Save.belongsTo(Recipe, { foreignKey: 'recipeId' });


// sequelize.sync({ force: true })
sequelize.sync()
    .then(response => {
        app.listen(3000);
    })
    .catch(err => console.log(err));
