const token = localStorage.getItem('token');

// document.addEventListener('DOMContentLoaded', () => {

// });

async function fetchUsers() {
    try {
        const response = await axios.get('http://localhost:3000/admin/getUsers', {
            headers: { "Authorization": `${token}` }
        });
        console.log(response);
        const usersTableBody = document.querySelector('#usersTable tbody');
        usersTableBody.innerHTML = '';

        response.data.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.emailId}</td>
                <td>
                    ${!user.isAdmin ?
                    `<button class="btn-danger" onclick="deleteUser(${user.id})">Delete</button>` :
                    'Cannot delete admin'
                }
                </td>
            `;
            usersTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

async function fetchRecipes() {
    try {
        const response = await axios.get('http://localhost:3000/admin/getRecipes', {
            headers: { "Authorization": `${token}` }
        });
        const recipesTableBody = document.querySelector('#recipesTable tbody');
        recipesTableBody.innerHTML = '';
        console.log(response);

        response.data.forEach(recipe => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${recipe.id}</td>
                <td><img src="${recipe.imgUrl}" alt="${recipe.recipesName}" style="width: 150px; height:auto"></td>
                <td>${recipe.recipesName}</td>
                <td>
                    <button class="btn-danger" onclick="removeRecipe(${recipe.id})">Remove</button>
                </td>
            `;
            recipesTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading recipes:', error);
    }
}

async function deleteUser(userId) {
    try {
        await axios.delete(`http://localhost:3000/admin/users/${userId}`, {
            headers: { "Authorization": `${token}` }
        });
        fetchUsers();

    } catch (error) {
        console.error('Error deleting user:', error);
    }
}

async function removeRecipe(recipeId) {
    try {
        await axios.delete(`http://localhost:3000/admin/recipes/${recipeId}`, {
            headers: { "Authorization": `${token}` }
        });
        fetchRecipes();
    } catch (error) {
        console.error('Error removing recipe:', error);
    }
}
