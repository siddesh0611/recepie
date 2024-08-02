
const token = localStorage.getItem('token');
async function uploadRecipes(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    try {
        const response = await axios.post('http://13.60.52.85:3000/user/uploadRecipes', formData, {
            headers: {
                'Authorization': token,
                'Content-Type': 'multipart/form-data'
            }
        })
        if (response) {
            alert('Recipe uploaded succesfully');
            event.target.reset();
            localStorage.removeItem('recipeIdToEdit');
        }
    } catch (err) {
        console.log(err);
        alert('error uploading recipe');
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const recipeIdToEdit = localStorage.getItem('recipeIdToEdit');
    localStorage.removeItem('recipeIdToEdit');
    // console.log(recipeIdToEdit);
    if (recipeIdToEdit) {
        await populateFormFields(recipeIdToEdit);
    }
});

async function populateFormFields(recipeId) {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get(`http://13.60.52.85:3000/home/recipes/${recipeId}`, {
            headers: { "Authorization": token }
        });

        const recipe = response.data.recipe;

        document.getElementById('recipesName').value = recipe.recipesName;
        document.getElementById('cuisine').value = recipe.cuisine;
        document.getElementById('recipesType').value = recipe.recipesType;
        document.getElementById(recipe.veg ? 'veg' : 'nonVeg').checked = true;
        document.getElementById('ingredients').value = recipe.ingredients;
        document.getElementById('method').value = recipe.method;
        document.getElementById('cookingTime').value = recipe.cookingTime;


        await deleteRecipe(recipeId);

    } catch (err) {
        console.log('Error fetching recipe details:', err);
    }
}

async function deleteRecipe(recipeId) {
    try {
        console.log('i am ready to delete');
        console.log(recipeId);
        await axios.delete(`http://13.60.52.85:3000/home/${recipeId}`, {
            headers: { "Authorization": token }
        });
        // document.location.reload();
    } catch (err) {
        console.log('Error deleting recipe:', err);
    }
}

function addIngredient() {
    const ingredientsContainer = document.getElementById('ingredientsContainer');
    const textarea = document.createElement('textarea');
    textarea.name = 'ingredients';
    textarea.rows = 2;
    ingredientsContainer.appendChild(textarea);
}

function addStep() {
    const methodContainer = document.getElementById('methodContainer');
    const textarea = document.createElement('textarea');
    textarea.name = 'method';
    textarea.rows = 2;
    methodContainer.appendChild(textarea);
}


