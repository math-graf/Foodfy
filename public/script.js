const recipes = document.querySelectorAll('.recipe')

for (let recipe of recipes) {
    recipe.querySelector('img').addEventListener('click', function() {
        const recipeId = recipe.getAttribute('id')

        window.location.href = `/recipes/${recipeId}`
    })
}

function paginate(currentPage, totalPages) {
    let allPages = [],
        oldPage

    for (let page = 1; page <= totalPages; page++) {
        const pagesBetween = page <= currentPage + 2 && page >= currentPage - 2
        const firstAndLastPages = page == 1 || page == totalPages

        if (firstAndLastPages || pagesBetween) {
            if (oldPage && page - oldPage > 2 ) {
                allPages.push('...')
            }
            if (oldPage && page - oldPage == 2) {
                allPages.push(page - 1)
            }
            allPages.push(page)
            oldPage = page
        }
    }
    return allPages
}

function createPagination(pagination) {
    const filter = pagination.dataset.filter
    const page = +pagination.dataset.page
    const total = +pagination.dataset.total
    const pages = paginate(page, total)

    let elements = ''

    for (let page of pages) {
        if (String(page).includes('...')) {
            elements += `<span>${page}</span>`
        } else {
            if (filter) {
                elements += `<a href="?page=${page}&filter=${filter}">${page}</a>`
            } else {
                elements += `<a href="?page=${page}">${page}</a>`
            }
        }
    }
    pagination.innerHTML = elements
}

const pagination = document.querySelector('.pagination')

if (pagination) {
    createPagination(pagination)
}

function selectPhoto(photo) {
    const mainPhoto = document.querySelector('.selected-photo')
    const selectedPhoto = photo.children[0]
    const allPhotos = document.querySelectorAll('.photo-button')

    for (item of allPhotos) {
        if (item.classList.contains('selected')) {
            item.classList.remove('selected')
        }
    }

    photo.classList.add('selected')
    mainPhoto.src = `${selectedPhoto.src}`
}