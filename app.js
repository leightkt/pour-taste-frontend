const $backendURL = 'http://localhost:9000/'
const $loginForm = document.querySelector(".login-form")
const $createUserForm = document.querySelector(".create-user")
const $loginErrors = document.querySelector(".login-errors")
const $signupErrors = document.querySelector(".signup-errors")
const $homeSection = document.querySelector('.home')
const $loginSection = document.querySelector('.login')
const $createUserSection = document.querySelector('.create-user-section')
const $aboutSection = document.querySelector('.about-section')
const $h1 = document.querySelector('h1')

const $newUserButtons = Array.from(document.querySelectorAll(".new-user"))
const $aboutButtons = Array.from(document.querySelectorAll('.about'))
const $loginButtons = Array.from(document.querySelectorAll('.log-in'))
const $homeButtons = Array.from(document.querySelectorAll('.home-button'))
const $nav = document.querySelector('nav')


$homeButtons.forEach($button => {
    $button.addEventListener('click', (_) => {
        console.log('home button')
        showElements([$nav])
    })
})

$newUserButtons.forEach($button => {
    $button.addEventListener('click', (_) => {
        hideElements([$homeSection, $loginSection, $aboutSection])
        showElements([$createUserSection])
    })
})

$loginButtons.forEach($button => {
    $button.addEventListener('click', (_) => {
        hideElements([$homeSection, $createUserSection, $aboutSection])
        showElements([$loginSection])
    })
})

$aboutButtons.forEach($button => {
    $button.addEventListener('click', (_) => {
    hideElements([$homeSection, $loginSection, $createUserSection])
    showElements([$aboutSection])
    })
})

$h1.addEventListener('click', (_) => {
    hideElements([$aboutSection, $loginSection, $createUserSection, $nav])
    showElements([$homeSection])
})

$loginForm.addEventListener('submit', (event) => {
    event.preventDefault()

    const formData = new FormData(event.target)
    const username = formData.get('username')
    const password = formData.get('password')

    login(username, password)
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
                const token = result.token
                localStorage.setItem('token', token)
                $loginForm.reset()
                window.location.replace(`/user.html?user_id=${result.user_id}`)
            }
        })
}

function hideElements(array){
    array.forEach(element => element.classList.add('hidden'))
}

function showElements(array){
    array.forEach(element => element.classList.remove('hidden'))
}
