const recipeDetailContainer = document.getElementById('recipeDetailContainer');
const urlParams = new URLSearchParams(window.location.search);
const recipeId = urlParams.get('id');
const token = localStorage.getItem('token');


document.addEventListener('DOMContentLoaded', async () => {
    await getRecipeDetail(recipeId);
    setupEventListeners();
});

async function getRecipeDetail(id) {
    try {
        const response = await axios.get(`http://localhost:3000/home/recipes/${id}`, {
            headers: { "Authorization": token }
        });
        if (response) {
            console.log(response.data.isFollowing);
            const { recipe, isFollowing, loggedInUserId } = response.data
            displayRecipeDetail(recipe, isFollowing, loggedInUserId);
        }
    } catch (err) {
        console.error(err);
    }
}

function displayRecipeDetail(recipe, isFollowing, loggedInUserId) {
    console.log(recipe);
    recipeDetailContainer.innerHTML = `
        <h2>${recipe.recipesName}</h2>
        <img src="${recipe.imgUrl}" alt="${recipe.recipesName}" style="width: 300px; height:auto">
        <p>Cuisine: ${recipe.cuisine}</p>
        <p>Type: ${recipe.recipesType}</p>
        <p>Ingredients:</p>
        <p>${recipe.ingredients}</p>
        <p>Method:</p>
        <p>${recipe.method}</p>
        <p>Cooking Time: ${recipe.cookingTime} minutes</p>
        <p>Uploaded by: ${recipe.User.name}</p>
        <p>Average Rating: <span id="averageRating">Loading...</span></p>
        <div id="ratingSection" style="display: ${recipe.UserId === loggedInUserId ? 'none' : 'block'};">
            <label for="rating">Rate this recipe:</label>
            <select id="rating" name="rating">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
            </select>
            <button id="submitRating">Submit Rating</button>
        </div>
        <button id="followButton-${recipe.UserId}" style="display:none;">Follow</button>
        <button id="unfollowButton-${recipe.UserId}" style="display:none;">Unfollow</button>
    `;

    const followButton = document.querySelector(`#followButton-${recipe.UserId}`);
    const unfollowButton = document.querySelector(`#unfollowButton-${recipe.UserId}`);

    if (recipe.UserId != loggedInUserId) {
        if (isFollowing) {
            unfollowButton.style.display = 'block';
        } else {
            followButton.style.display = 'block';
        }
    }

    getRecipeRating(recipe.id);

    document.getElementById('submitRating').addEventListener('click', () => {
        const rating = document.getElementById('rating').value;
        rateRecipe(recipe.id, loggedInUserId, rating);
    });

    followButton.addEventListener('click', () => followUser(recipe.UserId));
    unfollowButton.addEventListener('click', () => unfollowUser(recipe.UserId));
}

async function getRecipeRating(recipeId) {
    try {
        const response = await axios.get(`http://localhost:3000/rate/rating/${recipeId}`, {
            headers: { "Authorization": token }
        });
        console.log(response.data.averageRating);
        document.getElementById('averageRating').innerText = response.data.averageRating.toFixed(1);
    } catch (err) {
        console.log('Error fetching rating:', err);
    }
}

async function rateRecipe(recipeId, userId, rating) {
    try {
        await axios.post('http://localhost:3000/rate/rate', { userId, recipeId, rating }, {
            headers: { "Authorization": token }
        });
        alert('Rating submitted successfully');
        getRecipeRating(recipeId);
    } catch (err) {
        console.error('Error submitting rating:', err);
    }
}


async function followUser(userId) {
    try {
        console.log(userId);
        const response = await axios.post(`http://localhost:3000/home/follow/${userId}`, {}, {
            headers: { "Authorization": `${token}` }
        });
        console.log(response.data.message);

        document.querySelector(`#followButton-${userId}`).style.display = 'none';
        document.querySelector(`#unfollowButton-${userId}`).style.display = 'block';
    } catch (err) {
        console.log(err);
    }
}

async function unfollowUser(userId) {
    try {
        const response = await axios.post(`http://localhost:3000/home/unfollow/${userId}`, {}, {
            headers: { "Authorization": `${token}` }
        });
        console.log(response.data.message);

        document.querySelector(`#followButton-${userId}`).style.display = 'block';
        document.querySelector(`#unfollowButton-${userId}`).style.display = 'none';
    } catch (err) {
        console.log(err);
    }
}

function setupEventListeners() {
    document.getElementById('saveToFavorites').addEventListener('click', showCollectionOptions);
    document.getElementById('confirmSave').addEventListener('click', saveToCollection);
}

function showCollectionOptions() {
    document.getElementById('collectionSelect').style.display = 'block';
    document.getElementById('confirmSave').style.display = 'block';
}

async function saveToCollection() {
    const selectedCollection = document.getElementById('collectionSelect').value;
    try {
        await axios.post(`http://localhost:3000/user/save`, { recipeId, collection: selectedCollection }, {
            headers: { "Authorization": token }
        });
        alert(`Recipe saved to ${selectedCollection}`);
        document.getElementById('collectionSelect').style.display = 'none';
        document.getElementById('confirmSave').style.display = 'none';
    } catch (err) {
        console.error('Error saving to collection:', err);
    }
}