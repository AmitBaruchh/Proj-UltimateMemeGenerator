'use strict'

//^ Gallery Controller

function renderGallery() {
    const imgs = getImgs()
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
