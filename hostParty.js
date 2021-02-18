const backendURL = 'http://localhost:9000/'

const $partyDate = document.querySelector('.party-date')
const $partyLocation = document.querySelector('.party-location')
const $partyTime = document.querySelector('.party-time')
const $partyHost = document.querySelector('.party-host')
const $rateWines = document.querySelector('.rate-wines')
const $addWine = document.querySelector('.add-wine')
const $addErrors = document.querySelector('.add-errors')
const $rateErrors = document.querySelector('.rate-wine-errors')
const $partyId = document.querySelector('.party-id')
const $userPageButton = document.querySelector('.user-page')
const $statusButton = document.querySelector('.party-status')
const $seeResultsButton = document.querySelector('.see-results')
const $totalScoresButton = document.querySelector('.total-scores')

const searchParams = new URLSearchParams(window.location.search)
const userId = searchParams.get('user_id')
const partyId = searchParams.get('party_id')
const host = searchParams.get('host')


addWineToParty()

fetch(`${backendURL}partydeets`, {
    method: "POST",
    headers: {
        "Authorization": `Bearer ${localStorage.token}`,
        "Accept": "application/json",
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        id: partyId,
        user_id: userId
    }) 
})
    .then(response => response.json())
    .then(partyData => {
        if (partyData.message) {
            window.location.replace(`/`)
        } else {
            partyStatusAction(partyData)
            hostMode(partyData)
        }
    })

function checkPartyStatus(partyData){
    if (partyData.party.party_open == true) {
        displayTastingsHost(partyData)
    } else {
        const $closedMessage = document.createElement('p')
        $closedMessage.textContent = "This Party is Closed for Rating"
        $rateWines.append($closedMessage)
        $addWine.parentNode.classList.add('hidden')
    }
}

function displayPartyDeets(partyData) {
    $partyDate.textContent = partyData.party.date
    $partyLocation.textContent = partyData.party.location
    $partyTime.textContent = partyData.party.time
}

function hostMode(partyData) {
    displayPartyDeets(partyData)
    $partyHost.textContent = "You're hosting!"
    checkPartyStatus(partyData)
    $partyId.textContent = `Party ID: ${partyId}`
}

function addWineToParty() {
    $addWine.addEventListener('submit', (event) => {
        event.preventDefault()
    
        const formData = new FormData(event.target)
        const name = formData.get('name').toLowerCase()
        const brand = formData.get('brand').toLowerCase()
        const year = formData.get('year').toLowerCase()
        const variety = formData.get('variety').toLowerCase()
        const wine_type = formData.get('wine_type').toLowerCase()
    
        fetch(`${backendURL}wines`, {
            method: "POST",
            headers: {
            "Authorization": `Bearer ${localStorage.token}`,
            "Accept": "application/json",
            "Content-Type": "application/json"
            }, 
            body: JSON.stringify({
                wine: {
                    name,
                    brand,
                    year,
                    variety,
                    wine_type,
                    user_id: userId,
                    party_id: partyId
                }
            })
        })
        .then(response => response.json())
        .then(tasting => {
            if (tasting.errors){
                $addErrors.textContent = tasting.errors[0]
            } else {
                event.target.reset()
                appendTastingHost(tasting)
            }
        })
    })
}

function displayTastingsHost(partyData) {
    partyData.tastings.forEach((tasting) => {
        appendTastingHost(tasting)
    })

}

function appendTastingHost(tasting) {
    const $wineForm = document.createElement("form")

    const $wineLabel = document.createElement('label')
    const $notesLabel = document.createElement('label')

    $notesLabel.for = "notes"
    const $notes = document.createElement('textarea')
    $notes.id = "notes"
    $notes.name = "notes"

    let tasting_id = null

    const $submitRatingButton = document.createElement('input')
    $submitRatingButton.type = "submit"
    $submitRatingButton.value = "Submit"
    $submitRatingButton.classList.add('.submit-rating')
    
    const $deleteWineButton = document.createElement('button')
    $deleteWineButton.classList.add('delete-wine')
    $deleteWineButton.innerText = "Remove From Party"

    const $wineRatingInput = addWineRatingInput()

    if (tasting.letter) {
        $wineLabel.for = tasting.wine.brand
        $wineLabel.textContent = `${tasting.wine.brand}: ${tasting.wine.year} [${tasting.letter}]`
        tasting_id = tasting.id
        let notes = tasting.notes
        checkForRating($wineForm, tasting.rating, $notes, notes, $wineRatingInput, $submitRatingButton)
    } else {
        $wineLabel.for = tasting.wine.brand
        $wineLabel.textContent = `${tasting.wine.brand}: ${tasting.wine.year} [${tasting.tasting.letter}]`
        tasting_id = tasting.tasting.id
        let notes = tasting.tasting.notes
        checkForRating($wineForm, tasting.tasting.rating, $notes, notes, $wineRatingInput, $submitRatingButton)
    }

    

    
    addSubmitRatingAction($wineForm, tasting_id)
    addDeleteWineAction($deleteWineButton, tasting_id)
    $wineForm.append($wineLabel, $wineRatingInput, $notesLabel, $notes, $submitRatingButton)
    $rateWines.append($wineForm, $deleteWineButton)

}

function addWineRatingInput() {
    const $wineRatingInput = document.createElement('select')
    setOptions($wineRatingInput)
    $wineRatingInput.name = "rating"
    return $wineRatingInput
}

function setOptions($wineRatingInput) {
    for (i = 1; i < 11; i++){
        const $option = document.createElement('option')
        $option.innerText = i
        $wineRatingInput.append($option)
    }
}

function addSubmitRatingAction($wineForm, tasting_id) {
    $wineForm.addEventListener('submit', (event) => {
        event.preventDefault()

        const formData = new FormData($wineForm)
        const rating = formData.get('rating')
        const notes = formData.get('notes')

        fetch(`${backendURL}tastings/${tasting_id}`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${localStorage.token}`,
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: tasting_id,
                rating: rating,
                notes: notes
            }) 
        })
        .then(response => response.json())
        .then(tasting => {
            if (tasting.errors){
                $rateErrors.textContent = tasting.errors[0]
            } else {
                const $submitButton = $wineForm.querySelector('input[type="submit"]')
                $wineForm.classList.add('green')
                $submitButton.value = "Update"
            }
        })
    })
}

function checkForRating($wineForm, rating, $notes, notes, $wineRatingInput, $submitRatingButton) {
    if (rating){
        $wineForm.classList.add('green')
        $notes.innerText = notes
        $wineRatingInput.value = rating
        $submitRatingButton.value = "Update"
    }
}

function addDeleteWineAction($deleteWineButton, tasting_id) {
    $deleteWineButton.addEventListener('click', (event) => {
        event.stopImmediatePropagation()

        fetch(`${backendURL}deletetasting?id=${tasting_id}`, {
            method: "DELETE",
            headers: {
            "Authorization": `Bearer ${localStorage.token}`,
            "Accept": "application/json",
            "Content-Type": "application/json"
            }
        })
            .then(response => response.json())
            .then(result => {
                $deleteWineButton.previousElementSibling.remove()
                $deleteWineButton.remove()
            })
    })
}

function partyStatusAction(partyData) {
    let open_party = null
    if (partyData.party.party_open === true){
        $statusButton.textContent = "Close Party"
        open_party = false
    } else {
        $statusButton.textContent = "Open Party"
        open_party = true
    }
    $statusButton.addEventListener('click', (_) => {
        
        fetch(`${backendURL}/parties/${partyId}`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${localStorage.token}`,
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                party_open: open_party
            }) 
        })
        .then(response => response.json())
        .then(result => {
            window.location.replace(`/hostParty.html?user_id=${userId}&party_id=${partyId}`)
        })
    })
}

$seeResultsButton.addEventListener('click', (_) => {
    window.location.replace(`partyResults.html?user_id=${userId}&party_id=${partyId}`)
})

$totalScoresButton.addEventListener('click', (_) => {
    fetch(`${backendURL}/parties/${partyId}`, {
        method: "PATCH",
        headers: {
            "Authorization": `Bearer ${localStorage.token}`,
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            party_open: false
        }) 
    })
    .then(response => response.json())
    .then(result => {
        window.location.replace(`partyResults.html?user_id=${userId}&party_id=${partyId}`)
    })
})

$userPageButton.addEventListener('click', (_) => {
    window.location.replace(`/user.html?user_id=${userId}`)
})