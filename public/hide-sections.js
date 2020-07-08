const hideContentButtons = document.querySelectorAll('.title span')

for (let i = 0; i < hideContentButtons.length; i++) {
    hideContentButtons[i].addEventListener('click', function() {
        const contentBox = document.querySelector(`.${hideContentButtons[i].id}`)
        if (contentBox.classList.contains('active')) {
            contentBox.classList.remove('active')
            hideContentButtons[i].innerHTML = 'Esconder'
        } else {
            contentBox.classList.add('active')
            hideContentButtons[i].innerHTML = 'Mostrar'
        }
    })
}

// usando for...of não adianta por causa do hoisting