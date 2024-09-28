'use strict'

//^ Gallery Controller

function renderGallerySection() {
    renderGalleryImgs()
    updateGKeywordSearchCountMap()
    renderKeywordTags()
}

function renderGalleryImgs(imgs = getImgs()) {
    const strHTMLs = imgs.map(img => {
        return `
         <img src="${img.url}" alt="meme image"  onclick="onSelectImg(${img.id})"/>
        `
    })
    document.querySelector('.gallery-container').innerHTML = strHTMLs.join('')
}

function onSelectImg(imgId) {
    showMemeEditor()
    createMeme(imgId)
    renderMeme()
}

function showMemeEditor() {
    document.querySelector('.image-gallery').classList.add('hide')
    document.querySelector('.saved-memes').classList.add('hide')
    document.querySelector('.meme-editor').classList.remove('hide')
}

function onShowGallery() {
    document.querySelector('.image-gallery').classList.remove('hide')
    document.querySelector('.saved-memes').classList.add('hide')
    document.querySelector('.meme-editor').classList.add('hide')
}

function onFilterImages() {
    const filterValue = document.querySelector('#img-filter').value.toLowerCase()
    const imgs = getImgs()

    const filteredImgs = imgs.filter(img => img.keywords.some(keyword => keyword.includes(filterValue)))

    renderGalleryImgs(filteredImgs)
}

function onKeywordClick(keyword) {
    document.querySelector('#img-filter').value = keyword
    updateKeywordSearchCount(keyword)

    onFilterImages()
    renderKeywordTags()
}

function renderKeywordTags() {
    const elKeywordContainer = document.querySelector('.keyword-tags-container')
    const keywords = getKeywordSearchCountMap()
    let strHTMLs = ''

    for (let keyword in keywords) {
        const fontSize = 14 + keywords[keyword] * 2
        strHTMLs += `
            <span style="font-size: ${fontSize}px;" onclick="onKeywordClick('${keyword}')">${keyword}</span>
        `
    }

    elKeywordContainer.innerHTML = strHTMLs
}

function onUpdateKeyWord() {
    const filterValue = document.querySelector('#img-filter').value.toLowerCase()

    if (filterValue) {
        updateKeywordSearchCount(filterValue)
    }
    renderKeywordTags()
}
