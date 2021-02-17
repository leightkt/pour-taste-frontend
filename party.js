const backendURL = 'http://localhost:9000/'

const $partyDate = document.querySelector('.party-date')
const $partyLocation = document.querySelector('.party-location')
const $partyTime = document.querySelector('.party-time')
const $partyHost = document.querySelector('.party-host')
const $rateWines = document.querySelector('.rate-wines')
const $addWine = document.querySelector('.add-wine')
const $addErrors = document.querySelector('.add-errors')
const $rateErrors = document.querySelector('.rate-wine-errors')

const searchParams = new URLSearchParams(window.location.search)
const userId = searchParams.get('user_id')
const partyId = searchParams.get('party_id')
const host = searchParams.get('host')
console.log(userId)
console.log(partyId)

fetch(`${backendURL}partydeets`, {
    method: "POST",
    headers: {
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
        console.log(partyData)
        checkHostStatus(partyData)
        
    })

addWineToParty()

function displayPartyDeets(partyData){
    $partyDate.textContent = partyData.party.date
    $partyLocation.textContent = partyData.party.location
    $partyTime.textContent = partyData.party.time
}

function checkHostStatus(partyData){
    if (partyData.host.host_id == userId){
        hostMode(partyData)
    } else {
        attendeeMode()
    }
}

function hostMode(partyData){
    console.log("You're the host!")
    displayPartyDeets(partyData)
    $partyHost.textContent = "You're hosting!"
    displayTastingsHost(partyData)
}

function attendeeMode(partyData) {
    console.log("your an attendee")
    displayPartyDeets(partyData)
    $partyHost.textContent = `Hosted by: ${partyData.host.host_name}`
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
                console.log(tasting)
                event.target.reset()
                appendTastingHost(tasting)
            }
        })
    })
}

function displayTastingsHost(partyData){
    partyData.tastings.forEach((tasting) => {
        appendTastingHost(tasting)
    })

}

function appendTastingHost(tasting){
    const $wineForm = document.createElement("form")

    const $wineLabel = document.createElement('label')
    const $notesLabel = document.createElement('label')

    $notesLabel.for = "notes"
    const $notes = document.createElement('textarea')
    $notes.id = "notes"
    $notes.name = "notes"

    let tasting_id = null

    const $submitRatingButton = document.createElement('button')
    $submitRatingButton.classList.add('.submit-rating')
    $submitRatingButton.innerText = "Submit Rating"

    const $wineRatingInput = addWineRatingInput()

    if (tasting.letter) {
        $wineLabel.for = tasting.wine.brand
        $wineLabel.textContent = `${tasting.wine.brand}: ${tasting.wine.wine_type} [${tasting.letter}]`
        tasting_id = tasting.id
        let notes = tasting.notes
        checkForRating($wineForm, tasting.rating, $notes, notes, $wineRatingInput)
    } else {
        $wineLabel.for = tasting.wine.brand
        $wineLabel.textContent = `${tasting.wine.brand}: ${tasting.wine.wine_type} [${tasting.tasting.letter}]`
        tasting_id = tasting.tasting.id
        let notes = tasting.tasting.notes
        checkForRating($wineForm, tasting.tasting.rating, $notes, notes, $wineRatingInput)
    }

    

    
    addSubmitRatingAction($wineForm, tasting_id)
    $wineForm.append($wineLabel, $wineRatingInput, $notesLabel, $notes, $submitRatingButton)
    $rateWines.append($wineForm)

}

function addWineRatingInput(){
    const $wineRatingInput = document.createElement('select')
    setOptions($wineRatingInput)
    $wineRatingInput.name = "rating"
    return $wineRatingInput
}

function setOptions($wineRatingInput){
    for (i = 1; i < 11; i++){
        const $option = document.createElement('option')
        $option.innerText = i
        $option.classList.add(`${i}`)
        $wineRatingInput.append($option)
    }
}

function addSubmitRatingAction($wineForm, tasting_id){
    $wineForm.addEventListener('submit', (event) => {
        event.preventDefault()

        const formData = new FormData($wineForm)
        const rating = formData.get('rating')
        const notes = formData.get('notes')

        fetch(`${backendURL}tastings/${tasting_id}`, {
            method: "PATCH",
            headers: {
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
                console.log(tasting)
                $wineForm.classList.add('green')
            }
        })
    })
}

function checkForRating($wineForm, rating, $notes, notes, $wineRatingInput){
    console.log(rating)
    if (rating){
        $wineForm.classList.add('green')
        $notes.innerText = notes
        $wineRatingInput.value = rating
    }
}
