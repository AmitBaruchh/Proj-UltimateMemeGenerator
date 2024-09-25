'use strict'

var gElCanvas
var gCtx
var gFillColor = '#6d6c6c'
var gStrokeColor = '#000000'

function onInit() {
    console.log('start')
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')
    resizeCanvas()
    addListeners()
}

function onDraw(ev) {
    const offsetX = ev.offsetX
    const offsetY = ev.offsetY

    const text = 'Hi'
    drawText(text, offsetX, offsetY)
}

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

function onClearCanvas() {
    gCtx.clearRect(0, 0, gElCanvas.width / 2, gElCanvas.height / 2)
}

function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container')
    gElCanvas.width = elContainer.clientWidth - 40 //Subtracting 20px padding from each side
}

function onSetColor() {
    gFillColor = document.querySelector('#fillColor').value
    gStrokeColor = document.querySelector('#strokeColor').value
}

//* Handle the listeners
function addListeners() {
    addMouseListeners()
    //* Listen for resize ev
    window.addEventListener('resize', () => {
        resizeCanvas()
    })
    document.querySelector('#fillColor').addEventListener('input', onSetColor)
    document.querySelector('#strokeColor').addEventListener('input', onSetColor)
}

function addMouseListeners() {
    gElCanvas.addEventListener('click', onDraw)
}
