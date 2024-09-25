'use strict'

var gElCanvas
var gCtx
var gFillColor = '#6d6c6c'
var gStrokeColor = '#000000'
var gTextInput = 'Text'

function onInit() {
    console.log('start')
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')
    // resizeCanvas()
    addListeners()
    renderMeme()
}

function renderMeme() {
    drawImg()
}

function drawTextInRow(text, rowNumber) {
    const totalRows = 5
    const rowHeight = gElCanvas.height / totalRows

    const y = rowHeight * (rowNumber - 1) + rowHeight / 2

    drawText(text, gElCanvas.width / 2, y)
}

// function onDraw(ev) {
//     const offsetX = ev.offsetX
//     const offsetY = ev.offsetY

//     drawText(gTextInput, offsetX, offsetY)
// }

function drawText(text, x, y) {
    gCtx.lineWidth = 1
    gCtx.strokeStyle = gStrokeColor
    gCtx.fillStyle = gFillColor
    gCtx.font = '40px Arial'
    gCtx.textAlign = 'center'
    gCtx.textBaseline = 'middle'
    gCtx.fillText(text, x, y)
    gCtx.strokeText(text, x, y)
}

function drawImg(src = 'img/1.jpg') {
    const elImg = new Image()
    elImg.src = src
    elImg.onload = () => {
        console.log('on load')
        gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height)
        drawTextInRow(gTextInput, 1)
    }
}

function onClearCanvas() {
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
}

// function resizeCanvas() {
//     const elContainer = document.querySelector('.canvas-container')
//     gElCanvas.width = elContainer.clientWidth - 40 //Subtracting 20px padding from each side
// }

function onSetColor() {
    gFillColor = document.querySelector('#fillColor').value
    gStrokeColor = document.querySelector('#strokeColor').value
}

function onSetText() {
    gTextInput = document.querySelector('#text').value
}

//* Handle the listeners
function addListeners() {
    addMouseListeners()
    //* Listen for resize ev
    // window.addEventListener('resize', () => {
    //     resizeCanvas()
    // })
    document.querySelector('#fillColor').addEventListener('input', onSetColor)
    document.querySelector('#strokeColor').addEventListener('input', onSetColor)
    document.querySelector('#text').addEventListener('input', onSetText)
}

function addMouseListeners() {
    // gElCanvas.addEventListener('click', onDraw)
}
