document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');

    try {
        const userResponse = await axios.get('http://13.60.52.85:3000/user/profile', {
            headers: { "Authorization": token }
        });

        const { user, recipes } = userResponse.data;
        document.getElementById('username').innerText = user.name;
        document.getElementById('emailId').innerText = user.emailId;

        const recipesContainer = document.getElementById('recipesContainer');

        recipes.forEach(recipe => {
            const recipeCard = document.createElement('div');
            recipeCard.className = 'recipe-card';
            recipeCard.innerHTML = `
                <div id="myRecipes">
                    <h3>${recipe.recipesName}</h3>
                    <img src="${recipe.imgUrl}" alt="${recipe.recipesName}" >
                    <div class="buttons">
                        <button onclick="editRecipe(${recipe.id})">Edit</button>
                        <button class="delete-button" onclick="deleteRecipe(${recipe.id})">Delete</button>
                    </div>
                </div>
            `;
            recipesContainer.appendChild(recipeCard);
        });
    } catch (err) {
        console.log('Error fetching profile data:', err);
    }
});

async function editRecipe(recipeId) {
    localStorage.setItem('recipeIdToEdit', recipeId);
    window.location.href = './recipesForm.html';

}

async function deleteRecipe(recipeId) {
    const token = localStorage.getItem('token');
    try {
        await axios.delete(`http://13.60.52.85:3000/home/${recipeId}`, {
            headers: { "Authorization": token }
        });
        document.location.reload();
    } catch (err) {
        console.log('Error deleting recipe:', err);
    }
}


async function loadFavorites(collectionName) {
    const token = localStorage.getItem('token');
    try {
        const favoritesResponse = await axios.get(`http://13.60.52.85:3000/user/${collectionName}`, {
            headers: { "Authorization": token }
        });

        const favorites = favoritesResponse.data.favorites;
        const favoritesContainer = document.getElementById('favoritesContainer');
        favoritesContainer.innerHTML = '';
        // console.log(favorites);
        // console.log('----------');

        favorites.forEach(favorite => {
            console.log(favorite);
            const favoriteCard = document.createElement('div');
            favoriteCard.className = 'favorite-card';
            favoriteCard.innerHTML = `
                <div id="myFavRecipes">
                    <h3>${favorite.Recipe.recipesName}</h3>
                    <img src="${favorite.Recipe.imgUrl}" alt="${favorite.Recipe.recipesName}" style="width: 150px; height:auto">  
                </div>            
                `;
            favoriteCard.addEventListener('click', () => {
                window.location.href = `./recipeDetail.html?id=${favorite.Recipe.id}`;
            });
            favoritesContainer.appendChild(favoriteCard);
        });
    } catch (err) {
        console.log('Error fetching favorites:', err);
    }
}