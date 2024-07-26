const messageDiv = document.getElementById('message');
messageDiv.textContent = '';

async function handleLogin(event) {
    event.preventDefault();

    try {
        const emailId = event.target.emailId.value;
        const password = event.target.password.value;

        const userDetails = { emailId, password };


        await axios.post('http://localhost:3000/account/login', userDetails)
            .then(response => {
                console.log('Logged in successfully');
                event.target.reset();
                localStorage.setItem('token', response.data.token);
                window.location.href = '../index/index.html';
                // window.location.href = '../index/recipesForm.html';
            })
            .catch(err => {
                if (err.response && err.response.data && err.response.data.message) {
                    console.log(err.response.data.message);
                    messageDiv.textContent = err.response.data.message;
                } else {
                    console.log(err);
                }
            });
    } catch (err) {
        console.log(err);
    }
}
