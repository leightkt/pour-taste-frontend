const backendURL = 'localhost:9000/'

const $displayTastings = document.querySelector('.display-tastings')

const searchParams = new URLSearchParams(window.location.search)
const userId = parseInt(searchParams.get('user_id'))

