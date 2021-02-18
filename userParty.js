const backendURL = 'http://localhost:9000/'

const $partyDate = document.querySelector('.party-date')
const $partyLocation = document.querySelector('.party-location')
const $partyTime = document.querySelector('.party-time')
const $partyHost = document.querySelector('.party-host')
const $rateWines = document.querySelector('.rate-wines')
const $rateErrors = document.querySelector('.rate-wine-errors')
const $userPageButton = document.querySelector('.user-page')
const $seeResultsButton = document.querySelector('.see-results')

const searchParams = new URLSearchParams(window.location.search)
const userId = searchParams.get('user_id')
const partyId = searchParams.get('party_id')
const host = searchParams.get('host')


fetch(`${backendURL}userpartydeets`, {
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
        attendeeMode(partyData)
        
    })

function checkPartyStatus(partyData) {
    if (partyData.party.party_open == true) {
        displayTastingsUser(partyData)
    } else {
        const $closedMessage = document.createElement('p')
        $closedMessage.textContent = "This Party is Closed for Rating"
        $rateWines.append($closedMessage)
    }
}

function displayPartyDeets(partyData) {
    $partyDate.textContent = partyData.party.date
    $partyLocation.textContent = partyData.party.location
    $partyTime.textContent = partyData.party.time
}

function attendeeMode(partyData) {
    displayPartyDeets(partyData)
    $partyHost.textContent = `Hosted by: ${partyData.host.host_name}`
    checkPartyStatus(partyData)
}


function displayTastingsUser(partyData) {
    partyData.tastings.forEach((tasting) => {
        appendTastingUser(tasting)
    })
}

function appendTastingUser(tasting) {
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
    
    const $wineRatingInput = addWineRatingInput()

    $wineLabel.for = tasting.tasting.letter
    $wineLabel.textContent = `[${tasting.tasting.letter}]`
    tasting_id = tasting.tasting.id
    let notes = tasting.tasting.notes
    checkForRating($wineForm, tasting.tasting.rating, $notes, notes, $wineRatingInput, $submitRatingButton)
    
    addSubmitRatingAction($wineForm, tasting_id)
    $wineForm.append($wineLabel, $wineRatingInput, $notesLabel, $notes, $submitRatingButton)
    $rateWines.append($wineForm)

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

$seeResultsButton.addEventListener('click', (_) => {
    window.location.replace(`partyResults.html?user_id=${userId}&party_id=${partyId}`)
})

$userPageButton.addEventListener('click', (_) => {
    window.location.replace(`/user.html?user_id=${userId}`)
})