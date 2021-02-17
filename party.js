const backendURL = 'http://localhost:9000/'

const $partyDate = document.querySelector('.party-date')
const $partyLocation = document.querySelector('.party-location')
const $partyTime = document.querySelector('.party-time')
const $partyHost = document.querySelector('.party-host')
const $rateWines = document.querySelector('rate-wines')
const $addWine = document.querySelector('.add-wine')
const $addErrors = document.querySelector('.add-errors')

const searchParams = new URLSearchParams(window.location.search)
const userId = searchParams.get('user_id')
const partyId = searchParams.get('party_id')
const host = searchParams.get('host')

fetch(`${backendURL}/parties/${partyId}`, {
    method: "GET",
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
    }
})
    .then(response => response.json())
    .then(partyData => {
        console.log(partyData)
        checkHostStatus(partyData)
        addWineToParty(partyData)
        partyData.wines.forEach(wine => displayWine(wine))
    })


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
}

function attendeeMode(partyData) {
    console.log("your an attendee")
    displayPartyDeets(partyData)
    $partyHost.textContent = `Hosted by: ${partyData.host.host_name}`
}

function addWineToParty(partyData) {
    $addWine.addEventListener('submit', (event) => {
        event.preventDefault()
    
        const formData = new FormData(event.target)
        const name = formData.get('name').toLowerCase()
        const brand = formData.get('brand').toLowerCase()
        const year = formData.get('year').toLowerCase()
        const variety = formData.get('variety').toLowerCase()
        const wine_type = formData.get('wine_type').toLowerCase()
        console.log(name)
        console.log(brand)
        console.log(year)
        console.log(variety)
        console.log(wine_type)
    
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
                    party_id: partyData.party.id
                }
            })
        })
        .then(response => response.json())
        .then(result => {
            console.log(result)
            if (result.errors){
                $addErrors.textContent = result.errors[0]
            } else {
                console.log(result)
                event.target.reset()
                $addErrors.textContent = ""
                
            }
        })
    })
}

function displayTasting(tasting){
    console.log(tasting)

}

function displayWineList(){
    
}