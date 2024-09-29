'use strict'

//^ Meme Controller

//* Variables
var gElCanvas
var gCtx

//* Initialization
// Initializes the canvas, listeners, and renders the initial state (gallery and memes)
function onInit() {
    console.log('start')
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')
    resizeCanvas()
    addListeners()
    renderAll()
    onShowGallery()

    // clearFromStorage('memes')
}

//* Render functions
// Renders all necessary components like the gallery, meme, and saved memes
function renderAll() {
    renderGallerySection()
    renderMeme()
    renderSavedMemes()
}

// Renders the selected meme on the canvas
function renderMeme() {
    const meme = getMeme()
    drawImg(meme)
}

// Renders saved memes from local storage
function renderSavedMemes() {
    const savedMemes = _loadSavedMemes()
    if (!savedMemes || !savedMemes.length) return

    const strHTMLs = savedMemes.map((meme, idx) => {
        return `
        <div class="meme-item" onclick="onEditSavedMeme(${idx})">
            <img src="${meme.img}" alt="meme image" />
        </div>`
    })

    document.querySelector('.saved-memes-container').innerHTML = strHTMLs.join('')
}

// Renders a specific line of text on the canvas
function renderLine(line, idx) {
    const colIdx = clacCol(line.rowIdx)
    const x = gElCanvas.width / 2
    const y = colIdx
    updateLinePos(line, x, y, line.size)
    drawText(idx)
}

//* Drawing functions
// Calculates the Y position for the text based on row index
function clacCol(rowIdx) {
    const totalRows = 5
    const rowHeight = gElCanvas.height / totalRows

    return rowHeight * rowIdx + rowHeight / 2
}

// Draws the text for the selected line on the canvas
function drawText(idx) {
    const meme = getMeme()
    const line = meme.lines[idx]

    gCtx.lineWidth = 1
    gCtx.strokeStyle = line.strokeColor
    gCtx.fillStyle = line.fillColor
    gCtx.font = line.size + 'px ' + line.font

    let x = 0
    switch (line.align) {
        case 'left':
            x = 10
            break
        case 'right':
            x = gElCanvas.width - 10
            break
        case 'center':
            x = gElCanvas.width / 2
            break
    }

    const y = clacCol(line.rowIdx)
    updateLinePos(line, x, y, line.size)

    gCtx.textAlign = line.align || 'center'
    gCtx.textBaseline = 'middle'
    gCtx.fillText(line.txt, x, y)
    gCtx.strokeText(line.txt, x, y)

    if (idx === meme.selectedLineIdx) drawTextFrame(line)
}

// Draws a border around the selected text line
function drawTextFrame(line) {
    const { x, y, width, height } = line.pos
    gCtx.strokeStyle = '#ff6f00'
    gCtx.lineWidth = 2

    switch (line.align) {
        case 'left':
            gCtx.strokeRect(x - 5, y - height / 2, width + 10, height)
            break
        case 'right':
            gCtx.strokeRect(x - width - 5, y - height / 2, width + 10, height)
            break
        case 'center':
            gCtx.strokeRect(x - width / 2 - 10, y - height / 2, width + 20, height)
            break
    }
}

// Loads the image onto the canvas and draws it
function drawImg(meme) {
    if (!meme) return
    const elImg = new Image()

    const imgObj = setImg(meme.selectedImgId)

    elImg.src = imgObj.url

    elImg.onload = () => {
        console.log('on load')
        const imgRatio = elImg.width / elImg.height
        const canvasHeight = gElCanvas.width / imgRatio

        gElCanvas.height = canvasHeight

        gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height)
        meme.lines.forEach((line, idx) => renderLine(line, idx))
    }
}

// Clears the entire canvas
function onClearCanvas() {
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
}

// Resizes the canvas to fit the container's dimensions
function resizeCanvas(width, height) {
    const elContainer = document.querySelector('.canvas-container')
    gElCanvas.width = elContainer.clientWidth - 40 //Subtracting 20px padding from each side
    gElCanvas.height = elContainer.clientHeight
    renderMeme()
}

//* Handle the listeners
function addListeners() {
    addMouseListeners()
    // Listen for resize ev
    // window.addEventListener('resize', () => {
    //     resizeCanvas()
    // })
    document.querySelector('#fillColor').addEventListener('input', onSetColor)
    document.querySelector('#strokeColor').addEventListener('input', onSetColor)
    document.querySelector('#text').addEventListener('input', onSetText)
}

// Adds mouse listeners for interaction with the canvas
function addMouseListeners() {
    gElCanvas.addEventListener('mousedown', onDown)
}

//* Event handlers
// Handles the mousedown event for selecting text on the canvas
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

// Gets the position of the mouse click relative to the canvas
function getEvPos(ev) {
    var pos = {
        x: ev.offsetX,
        y: ev.offsetY,
    }
    return pos
}

// Clears the input field when focused
function clearInput(el) {
    el.value = ''
}

// Downloads the meme as an image
function downloadMeme(elLink) {
    var imgContent = gElCanvas.toDataURL()
    elLink.href = imgContent
}

//* Text setting
// Updates the colors of the fill and stroke for the selected text line
function onSetColor() {
    const fillColor = document.querySelector('#fillColor').value
    const strokeColor = document.querySelector('#strokeColor').value
    setColors(fillColor, strokeColor)
    renderMeme()
}

// Sets the text for the selected line
function onSetText() {
    setLineTxt(document.querySelector('#text').value)
    renderMeme()
}

// Increases the font size of the selected text line
function onIncreaseFont() {
    updateFontSize(2)
    renderMeme()
}

// Decreases the font size of the selected text line
function onDecreaseFont() {
    updateFontSize(-2)
    renderMeme()
}

// Adds a new line to the meme
function onAddLine() {
    const line = addLine()
    updateLinePos(line, gElCanvas.width / 2, clacCol(line.rowIdx), line.size)
    const meme = getMeme()
    updateSelectedLine(meme.lines.length - 1)
    renderMeme()
}

// Switches between lines in the meme
function onSwitchLine() {
    switchLine()
    updateInputs()
    renderMeme()
}

function updateInputs() {
    const meme = getMeme()
    const currLine = meme.lines[meme.selectedLineIdx]
    document.querySelector('#text').value = currLine.txt
}

// Checks if the clicked position is within the bounds of a text line
function isTextClick(clickX, clickY, line) {
    return (
        clickX >= line.pos.x &&
        clickX <= line.pos.x + line.pos.width &&
        clickY >= line.pos.y &&
        clickY <= line.pos.y + line.pos.height
    )
}

// Sets the font family for the selected line
function onSetFontFamily(fontFamily) {
    setFontFamily(fontFamily)
    renderMeme()
}

// Sets the text alignment for the selected line
function onSetTextAlign(align) {
    setTextAlign(align)
    renderMeme()
}

// Deletes the selected line from the meme
function onDeleteLine() {
    deleteLine()
    renderMeme()
}

// Moves the selected line up in the canvas
function onMoveLineUp() {
    updateRowIdx(-1)
    renderMeme()
}

// Moves the selected line down in the canvas
function onMoveLineDown() {
    updateRowIdx(1)
    renderMeme()
}

// Saves the current meme and removes the text frame
function onSaveMeme() {
    removeTextFrame()

    const elImg = new Image()
    elImg.src = gElCanvas.toDataURL()

    elImg.onload = () => {
        const imgContent = gElCanvas.toDataURL()
        _saveMemes(imgContent)
    }
}

// Removes the text frame from the selected line before saving the meme
function removeTextFrame() {
    updateSelectedLine(-1)
    renderMeme()
}

// Loads the saved meme and switches to the editor for editing
function onEditSavedMeme(memeIdx) {
    const savedMemes = _loadSavedMemes()
    const meme = savedMemes[memeIdx]

    updateGMeme(meme)

    showMemeEditor()

    renderMeme()
}

// Toggles the menu visibility (for mobile or small screens)
function toggleMenu() {
    document.body.classList.toggle('menu-open')
}
