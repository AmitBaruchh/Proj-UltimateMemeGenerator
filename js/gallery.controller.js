'use strict'

//^ Gallery Controller

//* Render functions
// Renders the entire gallery section
function renderGallerySection() {
    renderGalleryImgs()
    updateGKeywordSearchCountMap()
    renderKeywordTags()
}

// Renders the images for the gallery, either all images or filtered ones
function renderGalleryImgs(imgs = getImgs()) {
    const strHTMLs = imgs.map(img => {
        return `
         <img src="${img.url}" alt="meme image"  onclick="onSelectImg(${img.id})"/>
        `
    })
    document.querySelector('.gallery-container').innerHTML = strHTMLs.join('')
}

// Renders the keyword tags with dynamic font sizes based on their search count
function renderKeywordTags() {
    const elKeywordContainer = document.querySelector('.keyword-tags-container')
    const keywords = getKeywordSearchCountMap()
    let strHTMLs = ''

    for (let keyword in keywords) {
        const fontSizePX = 10 + keywords[keyword] * 2
        const fontSizeEM = fontSizePX / 16

        strHTMLs += `
            <span style="font-size: ${fontSizeEM}em;" onclick="onKeywordClick('${keyword}')">${keyword}</span>
        `
    }

    elKeywordContainer.innerHTML = strHTMLs
}

//* Selection functions
// Handles the image selection and shows the meme editor
function onSelectImg(imgId) {
    showMemeEditor()
    createMeme(imgId)
    renderMeme()
}

// Filters images in the gallery based on keywords entered in the search bar
function onFilterImages() {
    const filterValue = document.querySelector('#img-filter').value.toLowerCase()
    const imgs = getImgs()

    const filteredImgs = imgs.filter(img => img.keywords.some(keyword => keyword.includes(filterValue)))

    renderGalleryImgs(filteredImgs)
}

// Handles the click on a keyword and filters images based on that keyword
function onKeywordClick(keyword) {
    document.querySelector('#img-filter').value = keyword
    updateKeywordSearchCount(keyword)

    onFilterImages()
    renderKeywordTags()
}

// Updates the keyword search count when a new keyword is added and re-renders the tags
function onUpdateKeyword() {
    const filterValue = document.querySelector('#img-filter').value.toLowerCase()

    if (filterValue) {
        updateKeywordSearchCount(filterValue)
    }
    renderKeywordTags()
}

//* Display functions
// Displays the meme editor and hides the gallery and saved memes sections
function showMemeEditor() {
    document.querySelector('.image-gallery').classList.add('hide')
    document.querySelector('.saved-memes').classList.add('hide')
    document.querySelector('.meme-editor').classList.remove('hide')
}

// Displays the meme editor and hides the gallery and saved memes sections
function onShowGallery() {
    document.querySelector('.image-gallery').classList.remove('hide')
    document.querySelector('.saved-memes').classList.add('hide')
    document.querySelector('.meme-editor').classList.add('hide')
}

// Displays the saved memes and hides the gallery and meme editor sections
function onSavedMemesGallery() {
    renderSavedMemes()
    document.querySelector('.saved-memes').classList.remove('hide')
    document.querySelector('.image-gallery').classList.add('hide')
    document.querySelector('.meme-editor').classList.add('hide')
}

//Upload image to gallery
function onImgInput(ev) {
    loadImageFromInput(ev, addImgToGallery)
}

function loadImageFromInput(ev, onImageReady) {
    const reader = new FileReader()

    reader.onload = event => {
        const img = new Image()
        img.src = event.target.result

        img.onload = () => {
            onImageReady(img)
        }
    }

    reader.readAsDataURL(ev.target.files[0])
}

function addImgToGallery(img) {
    addImg(img.src)
    renderGalleryImgs()
}

//Share on facebook
function onUploadToFB(url) {
    // console.log('url:', url)
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&t=${url}`)
}

function onUploadImg(ev) {
    ev.preventDefault()
    const canvasData = gElCanvas.toDataURL('image/jpeg')

    // After a successful upload, allow the user to share on Facebook
    function onSuccess(uploadedImgUrl) {
        // console.log('uploadedImgUrl:', uploadedImgUrl)
        const encodedUploadedImgUrl = encodeURIComponent(uploadedImgUrl)
        document.querySelector('.share-container').innerHTML = `
            <a href="${uploadedImgUrl}">Image Url</a>
                   
            <button class="btn-facebook action-button " target="_blank" onclick="onUploadToFB('${encodedUploadedImgUrl}')">
                Share on Facebook  
            </button>
        `
    }

    uploadImg(canvasData, onSuccess)
}
