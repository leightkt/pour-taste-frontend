const backendURL = 'http://localhost:9000/'
const $createPartyForm = document.querySelector(".create-party-form")
const $createPartyErrors = document.querySelector(".create-party-errors")
const $displayParties = document.querySelector(".display-parties")
const $upcomingParties = document.querySelector(".upcoming")
const $pastParties = document.querySelector(".past")
const $createPartyButton = document.querySelector(".create-new-party")
const $joinPartyButton = document.querySelector(".join-party")
const $backButton = document.querySelector(".back-button")
const searchParams = new URLSearchParams(window.location.search)
const userId = parseInt(searchParams.get('user_id'))

fetch(`${backendURL}users/${userId}`, {
    method: "GET",
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
    }
})
    .then(response => response.json())
    .then(result => {
        console.log(result)
        result.parties.forEach(party => displayParty(party))

    })

$createPartyButton.addEventListener('click', (_) => {
    toggleHidden([$displayParties, $createPartyForm.parentNode, $createPartyButton.parentNode])
})

$backButton.addEventListener('click', (_) => {
    toggleHidden([$displayParties, $createPartyForm.parentNode, $createPartyButton.parentNode])
})

$createPartyForm.addEventListener('submit', (event) => {
    event.preventDefault()

    const formData = new FormData(event.target)
    const date = new Date(formData.get('date'))
    const time = formData.get('time')
    const location = formData.get('location')
    
    fetch(`${backendURL}parties`, {
        method: "POST",
        headers: {
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
        .then(result => {
            if (result.errors){
                $createPartyErrors.textContent = result.errors
            } else {
                event.target.reset()
                console.log(result)
                // window.location.replace(`/user.html?user_id=${userId}`)
            }
        })
})

function toggleHidden(array) {
    array.forEach(element => element.classList.toggle("hidden"))
}

function displayParty(party){
    const $date = document.createElement('h3')
    const $location = document.createElement('h3')
    const $host = setHost(party)

    $date.textContent = party.date
    $location.textContent = party.location
    appendParty(party, $date, $host, $location)
}

function setHost(party){
    const $host = document.createElement('h3')
    if (userId === party.user_id) {
        $host.innerText = "You're Hosting!"
    } else {
        $host.innerText = party.user.name
    }
    return $host
}

function appendParty(party, $date, $host, $location){
    const date = new Date()
    const partydate = new Date(party.date)
    if (partydate.getTime() < date.getTime()){
        const $deleteButton = addDeleteButton(party)
        $upcomingParties.append($date, $location, $host, $deleteButton)
    } else {
        $pastParties.append($date, $location, $host)
    }
}

function addDeleteButton(party){
    const $deleteButton = document.createElement('button')
    $deleteButton.innerText = "Delete"
    $deleteButton.addEventListener('click', (event) => {
        $deleteButton.parentNode.remove()

        fetch(`${backendURL}parties/${party.id}`, {
            method: "DELETE",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        })
            .then(response => response.json())
            .then(result => console.log(result))

    })
    return $deleteButton
}