const backendURL = 'http://localhost:9000/'

const $createPartyForm = document.querySelector(".create-party-form")
const $createPartyErrors = document.querySelector(".create-party-errors")
const $displayParties = document.querySelector(".display-parties")
const $upcomingParties = document.querySelector(".upcoming")
const $pastParties = document.querySelector(".past")
const $createPartyButton = document.querySelector(".create-new-party")
const $joinPartyButton = document.querySelector(".join-party")
const $backButton = document.querySelector(".back-button")
const $joinPartySection = document.querySelector('.join-party-section')
const $joinPartyForm = document.querySelector('.join-party-form')
const $joinErrors = document.querySelector('.join-errors')
const $backFromJoinButton = document.querySelector('.back-from-join')
const $viewTastingsButton = document.querySelector('.view-tastings')
const $logOutButton = document.querySelector('.log-out-button')

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
            window.location.replace(`/`)
        } else {
            result.invitations.forEach(invite => displayParty(invite))
        }

    })

$createPartyButton.addEventListener('click', (_) => {
    toggleHidden([$displayParties, $createPartyForm.parentNode])
})

$backButton.addEventListener('click', (_) => {
    toggleHidden([$displayParties, $createPartyForm.parentNode])
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
            if (invite.errors){
                $createPartyErrors.textContent = invite.errors
            } else {
                event.target.reset()
                displayParty(invite)
                toggleHidden([$displayParties, $createPartyForm.parentNode])
            }
        })
})

function toggleHidden(array) {
    array.forEach(element => element.classList.toggle("hidden"))
}

function displayParty(invite){
    const $partydiv = document.createElement('div')
    const $date = document.createElement('h3')
    const $location = document.createElement('h3')
    const $host = setHost(invite)

    $date.textContent = invite.party.date
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
    const date = new Date()
    const partydate = new Date(invite.party.date)
    if (partydate.getTime() > date.getTime()){
        const $deleteButton = addDeleteButton(invite)
        const $viewDeetsButton = addViewButton(invite)
        $partydiv.append($deleteButton, $viewDeetsButton)
        $upcomingParties.append($partydiv)
    } else {
        $host.innerText = "You hosted!"
        $pastParties.append($partydiv)
    }
}

function addDeleteButton(invite){
    const $deleteButton = document.createElement('button')
    $deleteButton.innerText = "Delete"
    $deleteButton.addEventListener('click', (event) => {
        $deleteButton.parentNode.remove()

        fetch(`${backendURL}invitations/${invite.id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${localStorage.token}`,
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user_id: userId,
                host: invite.host
            })
        })

    })
    return $deleteButton
}

function addViewButton(invite){
    const $viewDeetsButton= document.createElement('button')
    $viewDeetsButton.innerText = "View Details"
    $viewDeetsButton.addEventListener('click', (_) => {
        if (invite.host == true) {
            window.location.replace(`/hostParty.html?user_id=${userId}&party_id=${invite.party_id}`)
        } else {
            window.location.replace(`/userParty.html?user_id=${userId}&party_id=${invite.party_id}`)
        }
    })
    return $viewDeetsButton
}

$joinPartyButton.addEventListener('click', (_) => {
    toggleHidden([$displayParties, $joinPartySection])
})

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
            $joinErrors.textContent = invite.errors
        } else {
            event.target.reset()
            displayParty(invite)
            toggleHidden([$displayParties, $joinPartySection])
        }
    })
})

$backFromJoinButton.addEventListener('click', (_) => {
    toggleHidden([$displayParties, $joinPartySection])
})

$viewTastingsButton.addEventListener('click', (_) => {
    window.location.replace(`/tastings.html?user_id=${userId}`)
})

$logOutButton.addEventListener('click', (_) => {
    localStorage.removeItem('token')
    window.location.replace(`/`)
})