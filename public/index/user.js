document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');

    try {
        const userResponse = await axios.get('http://localhost:3000/user/profile', {
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
                <img src="${recipe.imgUrl}" alt="${recipe.recipesName}" style="width: 150px; height:auto">
                <h3>${recipe.recipesName}</h3>
                <div class="buttons">
                    <button onclick="editRecipe(${recipe.id})">Edit</button>
                    <button class="delete-button" onclick="deleteRecipe(${recipe.id})">Delete</button>
                </div>
            `;
            recipesContainer.appendChild(recipeCard);
        });
    } catch (err) {
        console.error('Error fetching profile data:', err);
    }
});

async function editRecipe(recipeId) {
    localStorage.setItem('recipeIdToEdit', recipeId);
    window.location.href = './recipesForm.html';

}

async function deleteRecipe(recipeId) {
    const token = localStorage.getItem('token');
    try {
        await axios.delete(`http://localhost:3000/home/${recipeId}`, {
            headers: { "Authorization": token }
        });
        document.location.reload();
    } catch (err) {
        console.error('Error deleting recipe:', err);
    }
}


async function loadFavorites(collectionName) {
    const token = localStorage.getItem('token');
    try {
        const favoritesResponse = await axios.get(`http://localhost:3000/user/${collectionName}`, {
            headers: { "Authorization": token }
        });

        const favorites = favoritesResponse.data.favorites;
        const favoritesContainer = document.getElementById('favoritesContainer');
        favoritesContainer.innerHTML = '';
        console.log(favorites);

        favorites.forEach(favorite => {
            console.log(favorite.Recipe.recipesName);
            const favoriteCard = document.createElement('div');
            favoriteCard.className = 'favorite-card';
            favoriteCard.innerHTML = `
                <img src="${favorite.Recipe.imgUrl}" alt="${favorite.Recipe.recipesName}" style="width: 150px; height:auto">
                <h3>${favorite.Recipe.recipesName}</h3>
            `;
            favoritesContainer.appendChild(favoriteCard);
        });
    } catch (err) {
        console.error('Error fetching favorites:', err);
    }
}