const backendURL = 'http://localhost:9000/'

const $displayTastings = document.querySelector('.display-tastings')
const $searchTastings = document.querySelector('.search-tastings')
const $searchRatings = document.querySelector('.search-by-rating')
const $searchTypes = document.querySelector('.search-by-type')

const $backbutton = document.querySelector('.back-button')

const searchParams = new URLSearchParams(window.location.search)
const userId = parseInt(searchParams.get('user_id'))

fetch(`${backendURL}viewtastings?id=${userId}`, {
    method: "GET",
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
    }
})
    .then(response => response.json())
    .then(user => {
        console.log(user)
        user.tastings.forEach(tasting => displayTasting(tasting))
        addRatingSearch(user.tastings)
        addTypeSearch(user.tastings)
    })

function displayTasting(tasting) {
    $tastydiv = document.createElement('div')
    $innerdiv = document.createElement('div')
    $frontdiv = document.createElement('div')
    $backdiv = document.createElement('div')

    $brand = document.createElement('h3')
    $variety = document.createElement('p')
    $name = document.createElement('p')
    $wineType = document.createElement('h3')
    $rating = document.createElement('p')
    $date = document.createElement('p')

    $tastydiv.classList.add('tasting-card')
    $innerdiv.classList.add('inner')
    $frontdiv.classList.add('front')
    $backdiv.classList.add('back')

    $brand.classList.add('brand')
    $variety.classList.add('variety')
    $name.classList.add('name')
    $wineType.classList.add('wineType')
    $date.classList.add('date')
    $date.classList.add('rating')

    $brand.textContent = tasting.wine.brand
    $rating.textContent = tasting.rating
    $frontdiv.append($brand, $rating)
    checkforName(tasting, $name, $backdiv)
    checkforVariety(tasting, $variety, $backdiv)
    $date.textContent = tasting.party.date
    $wineType.textContent = tasting.wine.wine_type
    $backdiv.append($date)
    $backdiv.prepend($wineType)

    $innerdiv.append($frontdiv, $backdiv)
    $tastydiv.append($innerdiv)
    $displayTastings.append($tastydiv)
}

function checkforName(tasting, $name, $backdiv){
    if (tasting.wine.name){
        $name.textContent = tasting.wine.name
        $backdiv.append($name)
    }
}

function checkforVariety(tasting, $variety, $backdiv){
    if (tasting.wine.variety){
        $variety.textContent = tasting.wine.variety
        $backdiv.append($variety)
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

function searchAttributes(div, $filter){
    let $brandElement = div.querySelector('.brand')
    let $brand = $brandElement.textContent
    if ($brand.toUpperCase().indexOf($filter) > -1){
        $brandElement.parentNode.style.display = ""
    } else {
        $brandElement.parentNode.style.display = "none"
    }
}

function addRatingSearch(tastings){
    $searchRatings.addEventListener('submit', (event) => {
        event.preventDefault()
        $displayTastings.innerHTML = ""
        const formData = new FormData(event.target)
        const rating = formData.get('rating')

        const filteredTastings = tastings.filter((tasting) => tasting.rating >= rating)
        filteredTastings.forEach(tasting => displayTasting(tasting))
    })
}

function addTypeSearch(tastings){
    $searchTypes.addEventListener('submit', (event) => {
        event.preventDefault()
        $displayTastings.innerHTML = ""
        const formData = new FormData(event.target)
        const type = formData.get('type')
        if (type === "All"){
            tastings.forEach(tasting => displayTasting(tasting))
        } else {
            const filteredTastings = tastings.filter((tasting) => tasting.wine.wine_type === type)
            filteredTastings.forEach(tasting => displayTasting(tasting))
        }
        
    })
}

$backbutton.addEventListener('click', (_) => {
    window.location.replace(`/user.html?user_id=${userId}`)
})