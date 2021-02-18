const backendURL = 'http://localhost:9000/'

const $userPageButton = document.querySelector('.user-page')
const $partyHost = document.querySelector('.party-host')
const $partyDate = document.querySelector('.party-date')
const $results = document.querySelector('.results')
const $backButton = document.querySelector('.back-to-party')

const searchParams = new URLSearchParams(window.location.search)
const userId = searchParams.get('user_id')
const partyId = searchParams.get('party_id')



fetch(`${backendURL}parties/${partyId}`, {
    method: "GET",
    headers: {
        "Authorization": `Bearer ${localStorage.token}`,
        "Accept": "application/json",
        "Content-Type": "application/json"
    }
})
    .then(response => response.json())
    .then(partyData => {
        if (partyData.message) {
            window.location.replace(`/`)
        } else {
            displayPartyDeets(partyData)
            checkDate(partyData)
            addBack(partyData)
        }
        
    })

$userPageButton.addEventListener('click', (_) => {
    window.location.replace(`/user.html?user_id=${userId}`)
})


function addBack(partyData) {
    $backButton.addEventListener('click', (_) => {
        let site = null
        if (partyData.host.host_id == userId){
            site = 'hostparty.html'
        } else {
            site = 'userParty.html'
        }
        window.location.replace(`${site}?user_id=${userId}&party_id=${partyId}`)
    })
}

function displayPartyDeets(partyData) {
    $partyDate.textContent = partyData.party.date
    $partyHost.textContent = `Hosted by: ${partyData.host.host_name}`
    
}

function checkDate(partyData) {
    const $closedMessage = document.createElement('p')
    const date = new Date()
    const partydate = new Date(partyData.party.date)
    // checkPartyStatus(partyData, $closedMessage)
    if (partydate.getTime() > date.getTime()){
        $closedMessage.textContent = `Time: ${partyData.party.time} Location: ${partyData.party.location}`
        $results.append($closedMessage)
    } else {
        checkPartyStatus(partyData, $closedMessage)
    }
}

function checkPartyStatus(partyData, $closedMessage) {
    if (partyData.party.party_open == true) {
        $closedMessage.textContent = "Check back soon for the results!"
        $results.append($closedMessage)
    } else {
        displayResults(partyData)
    }   
}

function displayResults(partyData) {
    displayWinner(partyData)
    partyData.scores.forEach(scoreData => {
        const $wineScoreCard = document.createElement('div')
        const $wineBrand = document.createElement('h4')
        const $wineScore = document.createElement('h4')
        const $wineName = document.createElement('h5')
        const $wineVariety = document.createElement('p')
        const $wineYear = document.createElement('p')

        $wineBrand.textContent = scoreData.wine.brand
        $wineScore.textContent = scoreData.score
        $wineName.textContent = scoreData.wine.name
        $wineVariety.textContent = scoreData.wine.variety
        $wineYear.textContent = scoreData.wine.year

        $wineScoreCard.append($wineBrand, $wineScore, $wineName, $wineVariety, $wineYear)
        $results.append($wineScoreCard)
    })
}

function displayWinner(partyData) {
    const $winnerCard = document.createElement('div')
    const $winnerHeading = document.createElement('h2')
    const $winner = document.createElement('h3')
    const $winningScore = document.createElement('h3')
    $winnerHeading.textContent = "Winner!"
    $winner.textContent = partyData.winner.wine.brand
    $winningScore.textContent = partyData.winner.score
    $winnerCard.append($winnerHeading, $winner, $winningScore)
    $results.append($winnerCard)
}