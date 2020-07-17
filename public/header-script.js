const pageLocation = location.pathname
const pageHeader = document.querySelector('header')
const userMenu = document.querySelector('.header .user')
const adminMenu = document.querySelector('.header .admin')
const adminItem = pageLocation.includes('admin')
const searchBox = document.querySelector('.search-box')

if (adminItem) {
    pageHeader.classList.add('active')
    adminMenu.classList.add('active')
    userMenu.classList.remove('active')
    searchBox.classList.remove('active')
} else {
    pageHeader.classList.remove('active')
    userMenu.classList.add('active')
    adminMenu.classList.remove('active')
    searchBox.classList.add('active')
}