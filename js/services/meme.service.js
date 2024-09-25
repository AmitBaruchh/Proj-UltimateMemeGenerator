'use strict'

//^ Meme Service

var gMeme
var gImgs = [
    { id: 0, url: 'img/1.jpg', keywords: ['trump', 'speech'] },
    { id: 1, url: 'img/2.jpg', keywords: ['dogs', 'love'] },
]

function getMeme() {
    return gMeme
}

function setColors(fillColor, strokeColor) {
    setFillColor(fillColor)
    setStrokeColor(strokeColor)
}

function setFillColor(fillColor) {
    gMeme.lines[gMeme.selectedLineIdx].fillColor = fillColor
}

function setStrokeColor(strokeColor) {
    gMeme.lines[gMeme.selectedLineIdx].strokeColor = strokeColor
}

function setLineTxt(txt) {
    gMeme.lines[gMeme.selectedLineIdx].txt = txt
}

function getImgs() {
    return gImgs
}

function setImg(memeId) {
    return getImgs().find(img => img.id === memeId)
}

function createMeme(imgId) {
    gMeme = {
        selectedImgId: imgId,
        selectedLineIdx: 0,
        lines: [
            {
                txt: 'Text',
                size: 40,
                fillColor: 'white',
                strokeColor: 'black',
            },
        ],
    }
}

function updateFontSize(diff) {
    if (!gMeme) return
    gMeme.lines[gMeme.selectedLineIdx].size += diff
}
