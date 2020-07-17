const formDelete = document.querySelector('#form-delete')
formDelete.addEventListener('click', function(event) {
    const confirmation = confirm('Deseja deletar?')
    const totalRecipes = document.querySelector('.total-recipes')

    if(!confirmation) {
        event.preventDefault()
    } else if (totalRecipes.value != 0) {
        window.alert('Chef não pode ser deletado com receitas cadastradas.')
        event.preventDefault()
    }
})