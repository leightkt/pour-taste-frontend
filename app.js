const $backendURL = 'http://localhost:9000/'
const $loginForm = document.querySelector(".login-form")
const $newUserButton = document.querySelector(".new-user")
const $createUserForm = document.querySelector(".create-user")
const $loginErrors = document.querySelector(".login-errors")
const $signupErrors = document.querySelector(".signup-errors")
const $backToLoginButton = document.querySelector(".back-login")

$loginForm.addEventListener('submit', (event) => {
    event.preventDefault()

    const formData = new FormData(event.target)
    const username = formData.get('username')
    const password = formData.get('password')

    login(username, password)
})

$newUserButton.addEventListener('click', (_) => {
    toggleHidden([$loginForm, $createUserForm.parentNode, $newUserButton])
})

$createUserForm.addEventListener('submit', (event) => {
    event.preventDefault()

    const formData = new FormData(event.target)
    const name = formData.get('name')
    const email = formData.get('email')
    const username = formData.get('username')
    const password = formData.get('password')

    fetch(`${$backendURL}users`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            user: {
                name, 
                email,
                username, 
                password
            }
        })
    })
        .then(response => response.json())
        .then(result => {
            if (result.errors){
                $signupErrors.textContent = result.errors[0]
            } else {
                login(username, password)
            }
        })
})

function toggleHidden(array) {
    array.forEach(element => element.classList.toggle("hidden"))
}

function login(username, password) {
    fetch(`${$backendURL}login`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            user: {
                username, 
                password
            }
        })
    })
        .then(response => response.json())
        .then (result => {
            if (result.errors){
                $loginErrors.textContent = result.errors
            } else {
                console.log(result)
                const token = result.token
                localStorage.setItem('token', token)
                $loginForm.reset()
                window.location.replace(`/user.html?user_id=${result.user_id}`)
            }
        })
}

$backToLoginButton.addEventListener('click', (_) => {
    toggleHidden([$loginForm, $createUserForm.parentNode, $newUserButton])
})