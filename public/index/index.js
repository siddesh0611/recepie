const recipeContainer = document.getElementById('recipesContainer');
const pagination = document.getElementById('pagination');
const token = localStorage.getItem('token');
const searchBar = document.getElementById('searchBar');
const filterForm = document.getElementById('filterForm');
let currentPage = 1;

document.addEventListener('DOMContentLoaded', () => {
    getRecipes(currentPage);

    searchBar.addEventListener('keyup', () => {
        const searchTerm = searchBar.value.trim().toLowerCase();
        getRecipes(currentPage, searchTerm);
    });

    filterForm.addEventListener('submit', event => {
        event.preventDefault();
        const formData = new FormData(filterForm);
        const filters = {
            veg: formData.get('veg'),
            cuisine: formData.get('cuisine'),
            recipesType: formData.get('recipesType')
        };
        getRecipes(currentPage, '', filters);
    });
});

async function getRecipes(page, searchTerm = '', filters = {}) {
    try {
        const response = await axios.get(`http://16.16.68.225:3000/home/recipes`, {
            headers: { "Authorization": token },
            params: {
                page,
                search: searchTerm,
                ...filters
            }
        });

        if (response) {
            // console.log(response.data.logedInUser);
            const { recipes, loggedInUser } = response.data;
            displayRecipes(recipes, loggedInUser);
            showPagination(response.data.totalPages, response.data.currentPage);
        }
    } catch (err) {
        console.log(err);
    }
}

function displayRecipes(recipes, loggedInUser) {
    recipeContainer.innerHTML = '';
    recipes.forEach(recipe => {
        console.log(recipe);
        const recipediv = document.createElement('div');
        recipediv.className = 'recipes';
        recipediv.innerHTML = `
            <h2>${recipe.recipesName}</h2>
            <img src="${recipe.imgUrl}" alt="${recipe.recipesName}" style="width: 150px; height:auto">
            <p>Uploaded by: ${recipe.User.name}</p>
            `;
        // console.log(loggedInUser, recipe.UserId);

        recipediv.addEventListener('click', () => {
            window.location.href = `./recipeDetail.html?id=${recipe.id}`;
        });
        recipeContainer.appendChild(recipediv);
    });
}

function showPagination(totalPages, currentPage) {
    pagination.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.innerHTML = i;
        button.className = currentPage === i ? 'active' : '';
        button.addEventListener('click', () => {
            getRecipes(i);
        });
        pagination.appendChild(button);
    }
}
