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
    renderAll()
    onShowGallery()

    // clearFromStorage('memes')
}

function renderAll() {
    renderGallerySection()
    renderMeme()
    renderSavedMemes()
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

function renderLine(line, idx) {
    const colIdx = clacCol(line.rowIdx)
    const x = gElCanvas.width / 2
    const y = colIdx
    updateLinePos(line, x, y, line.size)
    drawText(idx)
}

function onClearCanvas() {
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
}

function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container')
    gElCanvas.width = elContainer.clientWidth - 40 //Subtracting 20px padding from each side
    gElCanvas.height = elContainer.clientHeight
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
    // window.addEventListener('resize', () => {
    //     resizeCanvas()
    // })
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
    const line = addLine()
    updateLinePos(line, gElCanvas.width / 2, clacCol(line.rowIdx), line.size)
    const meme = getMeme()
    updateSelectedLine(meme.lines.length - 1)
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

function onSetFontFamily(fontFamily) {
    setFontFamily(fontFamily)
    renderMeme()
}

function onSetTextAlign(align) {
    setTextAlign(align)
    renderMeme()
}

function onDeleteLine() {
    deleteLine()
    renderMeme()
}

function clearInput(el) {
    el.value = ''
}

function onMoveLineUp() {
    updateRowIdx(-1)
    renderMeme()
}

function onMoveLineDown() {
    updateRowIdx(1)
    renderMeme()
}

function onSaveMeme() {
    removeTextFrame()

    const elImg = new Image()
    elImg.src = gElCanvas.toDataURL()

    elImg.onload = () => {
        const imgContent = gElCanvas.toDataURL()
        _saveMemes(imgContent)
    }
}

function removeTextFrame() {
    updateSelectedLine(-1)
    renderMeme()
}

function onSavedMemesGallery() {
    renderSavedMemes()
    document.querySelector('.saved-memes').classList.remove('hide')
    document.querySelector('.image-gallery').classList.add('hide')
    document.querySelector('.meme-editor').classList.add('hide')
}

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

function onEditSavedMeme(memeIdx) {
    const savedMemes = _loadSavedMemes()
    const meme = savedMemes[memeIdx]

    updateGMeme(meme)

    document.querySelector('.meme-editor').classList.remove('hide')
    document.querySelector('.saved-memes').classList.add('hide')

    renderMeme()
}

function toggleMenu() {
    document.body.classList.toggle('menu-open')
}
