function addIngredient(box) {
    const inputs = document.querySelectorAll(box + ' input')
    const inputsBox = document.querySelector(box)

    const clonedInput = inputs[inputs.length - 1].cloneNode(true)

    if (clonedInput.value == '') return false

    clonedInput.value = ''

    inputsBox.appendChild(clonedInput)
}

document.querySelector('#add-ingredient').addEventListener('click', function() { addIngredient('.input-box-ingredients') })
document.querySelector('#add-step').addEventListener('click', function() { addIngredient('.input-box-steps') })