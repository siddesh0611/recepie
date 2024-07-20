const url = 'http://localhost:3000';
const messageDiv = document.getElementById('message');

//signup
async function signup(event) {
    event.preventDefault();
    try {
        const name = event.target.name.value;
        const emailId = event.target.emailId.value;
        const password = event.target.password.value;
        console.log(name, emailId, password);

        const user = {
            name: name,
            emailId: emailId,
            password: password,
        }

        const response = await axios.post(`${url}/account/signup`, user);
        console.log(response);
        if (response) {
            event.target.reset();
            window.location.href = ('../login/login.html');
        }
        // else {
        //     console.log(response.data.message);
        //     console.log('user already exists');
        //     
        // }

    } catch (err) {
        messageDiv.textContent = '';
        messageDiv.textContent = err.response.data.message;
        console.log(err);
    }
}