const backendURL = 'https://pour-taste.herokuapp.com/'

const $createPartyForm = document.querySelector(".create-party-form")
const $createPartyErrors = document.querySelector(".create-party-errors")
const $displayParties = document.querySelector(".display-parties")
const $upcomingParties = document.querySelector(".upcoming")
const $pastParties = document.querySelector(".past")
const $joinPartySection = document.querySelector('.join-party-section')
const $joinPartyForm = document.querySelector('.join-party-form')
const $joinErrors = document.querySelector('.join-errors')
const $accountSection = document.querySelector('.account-section')
const $updateAccountForm = document.querySelector('.update-account-form')
const $updateErrors = document.querySelector('.update-account-errors')


const $viewTastingsButton = document.querySelector('.view-tastings')
const $logOutButton = document.querySelector('.log-out-button')
const $accountButton = document.querySelector('.account')
const $createPartyButton = document.querySelector(".create-new-party")
const $joinPartyButton = document.querySelector(".join-party")
const $pastPartiesButton = document.querySelector(".past-parties")
const $currentPartiesButton = document.querySelector(".current-parties")
const $profileButton = document.querySelector('.edit-account')
const $deleteAccountButton = document.querySelector('.delete-account-button')

const searchParams = new URLSearchParams(window.location.search)
const userId = parseInt(searchParams.get('user_id'))

fetch(`${backendURL}users/${userId}`, {
    method: "GET",
    headers: {
        "Authorization": `Bearer ${localStorage.token}`,
        "Accept": "application/json",
        "Content-Type": "application/json"
    }
})
    .then(response => response.json())
    .then(result => {
        if (result.message) {
            window.location.replace(`https://pour-taste.web.app/`)
        } else {
            result.invitations.forEach(invite => displayParty(invite))
            displayUserInfo(result)
        }

    })

function hideElements(array){
    array.forEach(element => element.classList.add('hidden'))
}

function showElements(array){
    array.forEach(element => element.classList.remove('hidden'))
}

$createPartyButton.addEventListener('click', (_) => {
    hideElements([$displayParties, $joinPartySection])
    showElements([$createPartyForm.parentNode])
})

$accountButton.addEventListener('click', (_) => {
    hideElements([$createPartyForm.parentNode, $joinPartySection])
    showElements([$displayParties])
})

$joinPartyButton.addEventListener('click', (_) => {
    hideElements([$createPartyForm.parentNode, $displayParties])
    showElements([$joinPartySection])
})

$viewTastingsButton.addEventListener('click', (_) => {
    window.location.replace(`/tastings.html?user_id=${userId}`)
})

$logOutButton.addEventListener('click', (_) => {
    localStorage.removeItem('token')
    window.location.replace(`/`)
})

$pastPartiesButton.addEventListener('click', (_) => {
    hideElements([$upcomingParties])
    showElements([$pastParties])
})

$currentPartiesButton.addEventListener('click', (_) => {
    hideElements([$pastParties])
    showElements([$upcomingParties])
})

$profileButton.addEventListener('click', (_) => {
    hideElements([$joinPartySection, $createPartyForm.parentNode, $displayParties])
    showElements([$accountSection])
})

$createPartyForm.addEventListener('submit', (event) => {
    event.preventDefault()

    const formData = new FormData(event.target)
    const date = formData.get('date').toString()
    const time = formData.get('time').toString()
    const location = formData.get('location')
    
    fetch(`${backendURL}parties`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${localStorage.token}`,
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            party: {
                date,
                time,
                location,
                user_id: userId
            }
        })
    })
        .then(response => response.json())
        .then(invite => {
            console.log(invite)
            if (invite.errors){
                $createPartyErrors.textContent = invite.errors[0]
            } else {
                event.target.reset()
                hideElements([$createPartyForm.parentNode, $joinPartySection])
                showElements([$displayParties])
            }
        })
})

function displayParty(invite){
    const $partydiv = document.createElement('div')
    $partydiv.classList.add('party-card')
    const $date = document.createElement('h3')
    const $location = document.createElement('h3')
    const $host = setHost(invite)

    $date.textContent = reverseDate(invite.party.date)
    $location.textContent = invite.party.location
    $partydiv.append($date, $location, $host)
    appendParty(invite, $partydiv, $host)
}

function setHost(invite){
    const $host = document.createElement('h3')
    if (invite.host === true) {
        $host.innerText = "You're Hosting!"
    } else {
        $host.innerText = ""
    }
    return $host
}

function appendParty(invite, $partydiv, $host){
    const today = new Date()
    let yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const partydate = new Date(invite.party.date)
    if (partydate.getTime() >= yesterday.getTime()){
        const $viewDeetsButton = addViewButton(invite)
        $partydiv.append($viewDeetsButton)
        $upcomingParties.prepend($partydiv)
    } else {
        $host.innerText = "You hosted!"
        $pastParties.prepend($partydiv)
    }
}

function addViewButton(invite){
    const $viewDeetsButton= document.createElement('button')
    $viewDeetsButton.innerText = "VIEW DETAILS"
    $viewDeetsButton.addEventListener('click', (_) => {
        if (invite.host == true) {
            window.location.replace(`https://pour-taste.web.app/hostParty.html?user_id=${userId}&party_id=${invite.party_id}`)
        } else {
            window.location.replace(`https://pour-taste.web.app/userParty.html?user_id=${userId}&party_id=${invite.party_id}`)
        }
    })
    return $viewDeetsButton
}

$joinPartyForm.addEventListener('submit', (event) => {
    event.preventDefault()

    const formData = new FormData(event.target)
    const party_id = formData.get('party_id')

    fetch(`${backendURL}invitations`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${localStorage.token}`,
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            invitation: {
                party_id: party_id,
                host: false,
                user_id: userId
            }
        })
    })
    .then(response => response.json())
    .then(invite => {
        if (invite.errors){
            $joinErrors.textContent = invite.errors[0]
        } else {
            event.target.reset()
            displayParty(invite)
            hideElements([$createPartyForm.parentNode, $joinPartySection])
            showElements([$displayParties])
        }
    })
})

function reverseDate(date) {
    let dateArray = date.split('-')
    return [...dateArray.slice(1, 3), ...dateArray.slice(0, 1)].join('-')
}

function displayUserInfo(result) {
    const $accountName = document.querySelector('#account-name')
    const $accountUsername = document.querySelector('#account-username')
    const $accountEmail = document.querySelector('#account-email')
    const $accountPassword = document.querySelector('#account-password')

    $accountName.value = result.name
    $accountUsername.value = result.username
    $accountEmail.value = result.email
}

$updateAccountForm.addEventListener('submit', (event) => {
    event.preventDefault()

    const formData = new FormData(event.target)
    const name = formData.get('name')
    const username = formData.get('username')
    const email = formData.get('email')
    const password = formData.get('password')
    let user = {}

    if (password === "") {
        console.log('true')
        user = {
            name,
            username,
            email,
        }
    } else {
        user = {
            name,
            username,
            email,
            password
        }
    }

    fetch(`${backendURL}users/${userId}`, {
        method: "PATCH",
        headers: {
            "Authorization": `Bearer ${localStorage.token}`,
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            user
        })
    })
    .then(response => response.json())
    .then(result => { 
        if (result.errors){
            $updateErrors.textContent = result.errors[0]
        } else {
            $updateErrors.innerHTML = ""
            $updateAccountForm.reset()
            displayUserInfo(result)
        }
    })
})

$deleteAccountButton.addEventListener('click', (event) => {
    event.stopImmediatePropagation()
    $updateErrors.textContent = "Are you sure you want to delete your account?"
    const $yesButton = document.createElement('button')
    const $noButton = document.createElement('button')

    $yesButton.textContent = "YES"
    $noButton.textContent = "NO"
    $updateErrors.append($yesButton, $noButton)

    $yesButton.addEventListener('click', (_) => {

        fetch(`${backendURL}users/${userId}`, {
            method: "DELETE",
            headers: {
            "Authorization": `Bearer ${localStorage.token}`,
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
        })
        .then(window.location.replace('https://pour-taste.web.app/'))
    })

    $noButton.addEventListener('click', (_) => {
        $updateErrors.innerHTML = ""
    })
})