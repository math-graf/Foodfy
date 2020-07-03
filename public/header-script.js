const pageLocation = location.pathname
const pageHeader = document.querySelector('header')
const adminItem = pageLocation.includes('admin')

if (adminItem) {
    pageHeader.classList.add('active')
}