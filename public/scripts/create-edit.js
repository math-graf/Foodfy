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

const uploadPhotos = {
    files: [],
    handleInputFiles(event) {
        const { files: fileList } = event.target

        if (uploadPhotos.hasLimit(event)) return

        Array.from(fileList).forEach(file => {
            
            uploadPhotos.files.push(file)

            const reader = new FileReader()
            
            reader.onload = () => {
                const image = new Image()
                image.src = String(reader.result)

                uploadPhotos.getImageContainer(image)  
            }

            reader.readAsDataURL(file)
        })
        event.target.files = uploadPhotos.getAllInputFiles()
    },
    hasLimit(event) {
        const { files: fileList } = event.target

        if (fileList.length > 5) {
            alert('Selecione no máximo 5 imagens.')
            event.preventDefault()
            return true
        }

        const photosContainer = document.querySelector('#photos-container')
        const photosArray = []
        Array.from(photosContainer.children).forEach(item => {
            if (item.classList && item.classList.value.includes('photo')) {
                photosArray.push(item)
            }
        })

        const totalPhotos = fileList.length + photosArray.length
        if (totalPhotos > 6) {
            alert('Envie no máximo 5 imagens.')
            event.preventDefault()
            return true
        }

        return false
    },
    getAllInputFiles() {
        const dataTransfer = new ClipboardEvent('').clipboardData || new DataTransfer()

        uploadPhotos.files.forEach(file => dataTransfer.items.add(file))

        return dataTransfer.files
    },
    getImageContainer(image) {
        const photosContainerItems = document.querySelector('#photos-container').children
        const addButton = document.querySelector('#photos-container .add-photo')
        const imageContainer = document.createElement('div')
        imageContainer.classList.add('photo')
        
        imageContainer.onclick = uploadPhotos.removePhoto
        
        imageContainer.appendChild(image)
        imageContainer.appendChild(uploadPhotos.getRemoveButton())

        document.querySelector('#photos-container').insertBefore(imageContainer, 
            document.querySelector('.add-photo')
        )
        if (photosContainerItems.length >= 6) {
            addButton.style.display = 'none'
        }
    },
    getRemoveButton() {
        const button = document.createElement('span')
        button.classList.add('material-icons')
        button.innerHTML = 'delete'
        
        return button
    },
    removePhoto(event) {
        const photosContainerItems = document.querySelector('#photos-container').children
        const addButton = document.querySelector('#photos-container .add-photo')
        const photo = event.target.parentNode
        const photoContainer = document.querySelector('#photos-container').children
        const photosArray = Array.from(photoContainer)
        
        const photosInput = document.querySelector('#photos-input')
        const index = photosArray.indexOf(photo)

        uploadPhotos.files.splice(index, 1)
        photosInput.files = uploadPhotos.getAllInputFiles()

        photo.remove()
        
        if (photosContainerItems.length < 6) {
            addButton.style.display = 'block'
        }
    },
    removeOldPhoto(event) {
        const photoContainer = event.target.parentNode

        if (photoContainer.id) {
            const removedFiles = document.querySelector('input[name="removed_files"')
            if (removedFiles) {
                removedFiles.value += `${photoContainer.id},`
            }
        }

        photoContainer.remove()
    }
}