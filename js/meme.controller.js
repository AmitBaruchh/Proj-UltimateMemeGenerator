'use strict'

//^ Meme Controller

var gElCanvas
var gCtx

function onInit() {
    console.log('start')
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')
    resizeCanvas()
    addListeners()
    renderMeme()
    renderGallery()
}

function renderMeme() {
    const meme = getMeme()
    drawImg(meme)
}

function clacCol(rowIdx) {
    const totalRows = 5
    const rowHeight = gElCanvas.height / totalRows

    return rowHeight * rowIdx + rowHeight / 2
}

function drawText(text, x, y, size, fillColor, strokeColor) {
    gCtx.lineWidth = 1
    gCtx.strokeStyle = strokeColor
    gCtx.fillStyle = fillColor
    gCtx.font = size + 'px Arial'
    gCtx.textAlign = 'center'
    gCtx.textBaseline = 'middle'
    gCtx.fillText(text, x, y)
    gCtx.strokeText(text, x, y)
}

function drawImg(meme) {
    if (!meme) return
    const elImg = new Image()

    const imgObj = setImg(meme.selectedImgId)

    elImg.src = imgObj.url
    elImg.onload = () => {
        console.log('on load')
        gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height)
        meme.lines.forEach(line => {
            const rowIdx = meme.selectedLineIdx
            const colIdx = clacCol(rowIdx)
            drawText(line.txt, gElCanvas.width / 2, colIdx, line.size, line.fillColor, line.strokeColor)
        })
    }
}

function onClearCanvas() {
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
}

function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container')
    gElCanvas.width = elContainer.clientWidth - 40 //Subtracting 20px padding from each side
    renderMeme()
}

function onSetColor() {
    const fillColor = document.querySelector('#fillColor').value
    const strokeColor = document.querySelector('#strokeColor').value
    setColors(fillColor, strokeColor)
    renderMeme()
}

function onSetText() {
    setLineTxt(document.querySelector('#text').value)
    renderMeme()
}

//* Handle the listeners
function addListeners() {
    // Listen for resize ev
    window.addEventListener('resize', () => {
        resizeCanvas()
    })
    document.querySelector('#fillColor').addEventListener('input', onSetColor)
    document.querySelector('#strokeColor').addEventListener('input', onSetColor)
    document.querySelector('#text').addEventListener('input', onSetText)
}

function downloadMeme(elLink) {
    console.log(elLink)
    var imgContent = gElCanvas.toDataURL()
    elLink.href = imgContent
}
