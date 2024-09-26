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
    const meme = getMeme()
    gCtx.lineWidth = 1
    gCtx.strokeStyle = strokeColor
    gCtx.fillStyle = fillColor
    gCtx.font = size + 'px Arial'
    gCtx.textAlign = 'center'
    gCtx.textBaseline = 'middle'
    gCtx.fillText(text, x, y)
    gCtx.strokeText(text, x, y)

    const textWidth = text.length * size * 0.5

    if (selectedIdx === meme.selectedLineIdx) {
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
    const x = gElCanvas.width / 2
    const y = colIdx
    updateLinePos(line, x, y, line.size)
    drawText(line.txt, x, y, line.size, line.fillColor, line.strokeColor, idx)
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
    addMouseListeners()
    // Listen for resize ev
    window.addEventListener('resize', () => {
        resizeCanvas()
    })
    document.querySelector('#fillColor').addEventListener('input', onSetColor)
    document.querySelector('#strokeColor').addEventListener('input', onSetColor)
    document.querySelector('#text').addEventListener('input', onSetText)
}

function addMouseListeners() {
    gElCanvas.addEventListener('mousedown', onDown)
}

function onDown(ev) {
    const pos = getEvPos(ev)
    const meme = getMeme()

    const clickedLineIdx = meme.lines.findIndex(line => isTextClick(pos.x, pos.y, line))
    if (clickedLineIdx !== -1) {
        updateSelectedLine(clickedLineIdx)
        updateInputs()
        renderMeme()
    }
    document.body.style.cursor = 'pointer'
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
    const meme = getMeme()
    const currLine = meme.lines[meme.selectedLineIdx]
    document.querySelector('#text').value = currLine.txt

    document.querySelector('#fillColor').value = currLine.fillColor
    document.querySelector('#strokeColor').value = currLine.strokeColor
}

function isTextClick(clickX, clickY, line) {
    return (
        clickX >= line.pos.x &&
        clickX <= line.pos.x + line.pos.width &&
        clickY >= line.pos.y &&
        clickY <= line.pos.y + line.pos.height
    )
}

function getEvPos(ev) {
    var pos = {
        x: ev.offsetX,
        y: ev.offsetY,
    }
    return pos
}
