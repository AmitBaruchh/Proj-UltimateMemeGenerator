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
    createMeme(imgId)
    renderMeme()
}
