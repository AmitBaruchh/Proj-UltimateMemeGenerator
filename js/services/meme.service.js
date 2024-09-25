'use strict'

var gImgs = [{ id: 1, url: 'img/1.jpg', keywords: ['trump', 'speech'] }]
var gMeme = {
    selectedImgId: 1,
    selectedLineIdx: 0,
    lines: [
        {
            txt: 'I sometimes eat Falafel',
            size: 40,
            fillColor: 'red',
            strokeColor: 'blue',
        },
    ],
}

function getMeme() {
    return gMeme
}

function setColors(fillColor, strokeColor) {
    gMeme.lines[gMeme.selectedLineIdx].fillColor = fillColor
    gMeme.lines[gMeme.selectedLineIdx].strokeColor = strokeColor
}

function setLineTxt(txt) {
    gMeme.lines[gMeme.selectedLineIdx].txt = txt
}
