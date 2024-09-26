'use strict'

//^ Meme Service

var gMeme
var gImgs = [
    { id: 0, url: 'img/1.jpg', keywords: ['trump', 'speech', 'president'] },
    { id: 1, url: 'img/2.jpg', keywords: ['dogs', 'puppies', 'love'] },
    { id: 2, url: 'img/3.jpg', keywords: ['babies', 'dog', 'cute'] },
    { id: 3, url: 'img/4.jpg', keywords: ['cat', 'sleep', 'computer'] },
    { id: 4, url: 'img/5.jpg', keywords: ['baby', 'fist', 'success'] },
    { id: 5, url: 'img/6.jpg', keywords: ['aliens', 'theory', 'conspiracy', 'movie'] },
    { id: 6, url: 'img/7.jpg', keywords: ['baby', 'shock', 'surprise'] },
    { id: 7, url: 'img/8.jpg', keywords: ['willy wonka', 'sarcastic', 'chocolate', 'movie'] },
    { id: 8, url: 'img/9.jpg', keywords: ['baby', 'scheming', 'happy'] },
    { id: 9, url: 'img/10.jpg', keywords: ['obama', 'laughing', 'president'] },
    { id: 10, url: 'img/11.jpg', keywords: ['boxing', 'sports', 'fight', 'kiss'] },
    { id: 11, url: 'img/12.jpg', keywords: ['pointing', 'man', 'serious', 'what would you do'] },
    { id: 12, url: 'img/13.jpg', keywords: ['leonardo dicaprio', 'cheers', 'gatsby', 'movie'] },
    { id: 13, url: 'img/14.jpg', keywords: ['morpheus', 'matrix', 'movie'] },
    { id: 14, url: 'img/15.jpg', keywords: ['sean bean', 'boromir', 'one does not simply', 'movie'] },
    { id: 15, url: 'img/16.jpg', keywords: ['picard', 'facepalm', 'star trek', 'movie'] },
    { id: 16, url: 'img/17.jpg', keywords: ['putin', 'russia', 'president', 'laughing'] },
    { id: 17, url: 'img/18.jpg', keywords: ['buzz lightyear', 'woody', 'toy story', 'movie'] },
]

function getMeme() {
    return gMeme
}

function setColors(fillColor, strokeColor) {
    if (!gMeme) return
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
    if (!gMeme) return
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
                fillColor: '#ffffff',
                strokeColor: '#000000',
                rowIdx: 0,
                font: 'Impact',
                align: 'center',
            },
        ],
    }
}

function updateFontSize(diff) {
    if (!gMeme) return
    gMeme.lines[gMeme.selectedLineIdx].size += diff
}

function addLine() {
    // second line
    if (!gMeme) return

    const newLine = {
        txt: 'Text',
        size: 40,
        fillColor: '#ffffff',
        strokeColor: '#000000',
        rowIdx: 4,
        font: 'Impact',
        align: 'center',
    }
    gMeme.lines.push(newLine)
    gMeme.selectedLineIdx = 4
}

function switchLine() {
    if (!gMeme || gMeme.lines.length === 0) return
    gMeme.selectedLineIdx = (gMeme.selectedLineIdx + 1) % gMeme.lines.length
}

function updateLinePos(line, x, y, size) {
    const textWidth = line.txt.length * size * 0.5
    line.pos = {
        x: x - textWidth / 2,
        y: y - size / 2,
        width: textWidth,
        height: size,
    }
}

function updateSelectedLine(clickedLineIdx) {
    gMeme.selectedLineIdx = clickedLineIdx
}

function setFontFamily(fontFamily) {
    gMeme.lines[gMeme.selectedLineIdx].font = fontFamily
}

function setTextAlign(align) {
    gMeme.lines[gMeme.selectedLineIdx].align = align
}
