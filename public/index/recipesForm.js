
const token = localStorage.getItem('token');
async function uploadRecipes(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    formData.set('ingredients', formData.get('ingredients').split(',').map(i => i.trim()));
    formData.set('method', formData.get('method').split(',').map(m => m.trim()));
    // console.log(formData);
    // const recipesName = formData.get('recipesName');
    // const cuisine = formData.get('cuisine');
    // const veg = formData.get('veg');
    // const recipesType = formData.get('recipesType');
    // const ingredients = formData.get('ingredients');
    // const method = formData.get('method');
    // const cookingTime = formData.get('cookingTime');
    // console.log(recipesName, cuisine, veg, recipesType, ingredients, method, cookingTime);
    try {
        const response = await axios.post('http://13.51.198.219:3000/user/uploadRecipes', formData, {
            headers: {
                'Authorization': token,
                'Content-Type': 'multipart/form-data'
            }
        })
        if (response.status === 200) {
            alert('Recipe uploaded succesfully');
            localStorage.removeItem('recipeIdToEdit');
            event.target.reset();
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
        const response = await axios.get(`http://13.51.198.219:3000/home/recipes/${recipeId}`, {
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
        console.error('Error fetching recipe details:', err);
    }
}

async function deleteRecipe(recipeId) {
    try {
        console.log('i am ready to delete');
        console.log(recipeId);
        await axios.delete(`http://13.51.198.219:3000/home/${recipeId}`, {
            headers: { "Authorization": token }
        });
        // document.location.reload();
    } catch (err) {
        console.error('Error deleting recipe:', err);
    }
}


