const backendURL = 'http://localhost:9000/'

const $displayTastings = document.querySelector('.display-tastings')
const $searchTastings = document.querySelector('.search-tastings')
const $searchRatings = document.querySelector('.search-by-rating')
const $searchSelect = document.querySelector('#rating')
const $typeSelect = document.querySelector('#type')
const $searchTypes = document.querySelector('.search-by-type')
const $userPageButton = document.querySelector('.user-page')

const searchParams = new URLSearchParams(window.location.search)
const userId = parseInt(searchParams.get('user_id'))

fetch(`${backendURL}viewtastings?id=${userId}`, {
    method: "GET",
    headers: {
        "Authorization": `Bearer ${localStorage.token}`,
        "Accept": "application/json",
        "Content-Type": "application/json"
    }
})
    .then(response => response.json())
    .then(tastings => {
        if (tastings.message) {
            window.location.replace(`/`)
        } else {
            tastings.forEach(tasting => displayTasting(tasting))
            addRatingSearch(tastings)
            addTypeSearch(tastings)
        }
    })

function displayTasting(tasting) {
    $tastydiv = document.createElement('div')

    $brand = document.createElement('h3')
    $variety = document.createElement('p')
    $name = document.createElement('p')
    $wineType = document.createElement('h3')
    $rating = document.createElement('p')
    $date = document.createElement('p')

    $tastydiv.classList.add('tasting-card')


    $brand.classList.add('brand')
    $variety.classList.add('variety')
    $name.classList.add('name')
    $wineType.classList.add('wineType')
    $date.classList.add('date')
    $date.classList.add('rating')

    $brand.textContent = capitalizeWord(tasting.wine.brand)
    $rating.textContent = tasting.tasting.rating
    $tastydiv.append($brand, $rating)
    checkforName(tasting, $name, $tastydiv)
    checkforVariety(tasting, $variety, $tastydiv)
    $date.textContent = reverseDate(tasting.date)
    $wineType.textContent = capitalizeWord(tasting.wine.wine_type)
    $tastydiv.append($wineType, $date)

    checkforNotes(tasting, $tastydiv)

    $displayTastings.append($tastydiv)
}

function checkforName(tasting, $name, $tastydiv) {
    if (tasting.wine.name){
        $name.textContent = capitalizeWord(tasting.wine.name)
        $tastydiv.append($name)
    }
}

function checkforVariety(tasting, $variety, $tastydiv) {
    if (tasting.wine.variety){
        $variety.textContent = capitalizeWord(tasting.wine.variety)
        $tastydiv.append($variety)
    }
}

function checkforNotes(tasting, $tastydiv){
    if (tasting.tasting.notes) {
        $notes = document.createElement('p')
        $notes.classList.add('notes')
        $notes.textContent = tasting.tasting.notes
        $tastydiv.append($notes)
    }
}

$searchTastings.addEventListener('keyup', (_) => {
    searchFilter()
})

function searchFilter(){
    let $input = document.querySelector("#search")
    let $filter = $input.value.toUpperCase()
    let $cardDivs = document.querySelectorAll(".tasting-card")
    $cardDivs.forEach(div => {
        searchAttributes(div, $filter)
    })
}

function searchAttributes(div, $filter) {
    let $brandElement = div.querySelector('.brand')
    let $brand = $brandElement.textContent
    if ($brand.toUpperCase().indexOf($filter) > -1){
        $brandElement.parentNode.style.display = ""
    } else {
        $brandElement.parentNode.style.display = "none"
    }
}

function addRatingSearch(tastings) {
    $searchSelect.addEventListener('change', (event) => {
        $displayTastings.innerHTML = ""
        const formData = new FormData($searchRatings)
        const rating = formData.get('rating')
        if (rating == "All") {
            tastings.forEach(tasting => displayTasting(tasting))
        } else {
            const filteredTastings = tastings.filter((tasting) => tasting.tasting.rating >= rating)
            filteredTastings.forEach(tasting => displayTasting(tasting))
        }
        
    })
}

function addTypeSearch(tastings) {
    $typeSelect.addEventListener('change', (event) => {
        $displayTastings.innerHTML = ""
        const formData = new FormData($searchTypes)
        const type = formData.get('type')
        if (type === "All"){
            tastings.forEach(tasting => displayTasting(tasting))
        } else {
            const filteredTastings = tastings.filter((tasting) => tasting.wine.wine_type === type.toLowerCase())
            filteredTastings.forEach(tasting => displayTasting(tasting))
        }
        
    })
}

$userPageButton.addEventListener('click', (_) => {
    window.location.replace(`/user.html?user_id=${userId}`)
})

function reverseDate(date){
    let dateArray = date.split('-')
    return [...dateArray.slice(1, 3), ...dateArray.slice(0, 1)].join('-')
}

function capitalizeWord(string){
    return string.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())))
}