const recipes = document.querySelectorAll('.recipe')

for (let recipe of recipes) {
    recipe.querySelector('img').addEventListener('click', function() {
        const recipeId = recipe.getAttribute('id')

        window.location.href = `/recipes/${recipeId}`
    })
}