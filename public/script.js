const recipes = document.querySelectorAll('.recipe')

for (let recipe of recipes) {
    recipe.querySelector('img').addEventListener('click', function() {
        const recipeId = recipe.getAttribute('id')

        window.location.href = `/recipes/${recipeId}`
    })
}

function addIngredient(box) {
    const inputs = document.querySelectorAll(box + ' input')
    const inputsBox = document.querySelector(box)

    const clonedInput = inputs[inputs.length - 1].cloneNode(true)

    if (clonedInput.children[0].value == '') return false

    clonedInput.children[0].value = ''

    inputsBox.appendChild(clonedInput)
}

function addNextInput(box, name) {
    const inputs = document.querySelectorAll(box + ' input')

    const newInput = document.createElement('input')
    newInput.setAttribute('type', 'text')
    newInput.setAttribute('name', `${name}-${inputs.length + 1}`)
    
    document.querySelector(box).appendChild(newInput)
}


document.querySelector('#add-ingredient').addEventListener('click', function() { addIngredient('.input-box-ingredients') })
document.querySelector('#add-step').addEventListener('click', function() { addIngredient('.input-box-steps') })