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

function drawText(text, x, y, size, fillColor, strokeColor, selectedIdx) {
    gCtx.lineWidth = 1
    gCtx.strokeStyle = strokeColor
    gCtx.fillStyle = fillColor
    gCtx.font = size + 'px Arial'
    gCtx.textAlign = 'center'
    gCtx.textBaseline = 'middle'
    gCtx.fillText(text, x, y)
    gCtx.strokeText(text, x, y)
    if (selectedIdx === gMeme.selectedLineIdx) {
        console.log('check')
        const textWidth = text.length * size * 0.5
        gCtx.strokeStyle = 'black'
        gCtx.lineWidth = 2
        gCtx.strokeRect(x - textWidth / 2 - 10, y - 2 - size / 2, textWidth + 20, size)
    }
}

function drawImg(meme) {
    if (!meme) return
    const elImg = new Image()

    const imgObj = setImg(meme.selectedImgId)

    elImg.src = imgObj.url
    elImg.onload = () => {
        console.log('on load')
        gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height)
        meme.lines.forEach((line, idx) => renderLine(line, idx))
    }
}

function renderLine(line, idx) {
    const colIdx = clacCol(line.rowIdx)
    drawText(line.txt, gElCanvas.width / 2, colIdx, line.size, line.fillColor, line.strokeColor, idx)
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

function onIncreaseFont() {
    updateFontSize(2)
    renderMeme()
}

function onDecreaseFont() {
    updateFontSize(-2)
    renderMeme()
}

function onAddLine() {
    addLine()
    renderMeme()
}

function onSwitchLine() {
    switchLine()
    updateInputs()
    renderMeme()
}

function updateInputs() {
    const currLine = gMeme.lines[gMeme.selectedLineIdx]
    document.querySelector('#text').value = currLine.txt
    document.querySelector('#fillColor').value = currLine.fillColor
    document.querySelector('#strokeColor').value = currLine.strokeColor
}
