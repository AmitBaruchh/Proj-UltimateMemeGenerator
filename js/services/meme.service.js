'use strict'

//^ Meme Service

var gMeme
var gImgs = [
    { id: 0, url: 'img/1.jpg', keywords: ['trump', 'speech', 'president', 'politics'] },
    { id: 1, url: 'img/2.jpg', keywords: ['dogs', 'puppies', 'love', 'friendship', 'animals'] },
    { id: 2, url: 'img/3.jpg', keywords: ['babies', 'baby', 'dog', 'cute', 'puppy', 'sleep', 'animal'] },
    { id: 3, url: 'img/4.jpg', keywords: ['cat', 'sleep', 'computer', 'pet', 'animal'] },
    { id: 4, url: 'img/5.jpg', keywords: ['baby', 'fist', 'success', 'funny', 'determination'] },
    { id: 5, url: 'img/6.jpg', keywords: ['aliens', 'theory', 'conspiracy', 'movie', 'hair'] },
    { id: 6, url: 'img/7.jpg', keywords: ['baby', 'shock', 'surprise', 'amazed'] },
    { id: 7, url: 'img/8.jpg', keywords: ['willy wonka', 'sarcastic', 'chocolate', 'movie'] },
    { id: 8, url: 'img/9.jpg', keywords: ['baby', 'scheming', 'happy', 'plotting'] },
    { id: 9, url: 'img/10.jpg', keywords: ['obama', 'laughing', 'president', 'politics', 'joy'] },
    { id: 10, url: 'img/11.jpg', keywords: ['boxing', 'sports', 'fight', 'kiss', 'funny'] },
    { id: 11, url: 'img/12.jpg', keywords: ['pointing', 'man', 'serious', 'what would you do', 'tv show'] },
    { id: 12, url: 'img/13.jpg', keywords: ['leonardo dicaprio', 'cheers', 'gatsby', 'movie', 'celebration'] },
    { id: 13, url: 'img/14.jpg', keywords: ['morpheus', 'matrix', 'movie', 'sunglasses'] },
    { id: 14, url: 'img/15.jpg', keywords: ['sean bean', 'boromir', 'one does not simply', 'movie'] },
    { id: 15, url: 'img/16.jpg', keywords: ['picard', 'facepalm', 'star trek', 'movie'] },
    { id: 16, url: 'img/17.jpg', keywords: ['putin', 'russia', 'president', 'laughing', 'politics'] },
    { id: 17, url: 'img/18.jpg', keywords: ['buzz lightyear', 'woody', 'toy story', 'movie'] },
]
var gKeywordSearchCountMap = { funny: 12, movie: 16, baby: 2 }

const MEMES_KEY = 'memes'
const KEYWORDS_KEY = 'key-words'

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
    var numOfLines = gMeme.lines.length
    var rowIdx
    if (numOfLines == 0) {
        rowIdx = 0
    } else if (numOfLines === 1) {
        rowIdx = 4
    } else {
        rowIdx = 2
    }

    if (!gMeme) return

    const newLine = {
        txt: ' ',
        size: 40,
        fillColor: '#ffffff',
        strokeColor: '#000000',
        rowIdx,
        font: 'Impact',
        align: 'center',
    }
    gMeme.lines.push(newLine)
    gMeme.selectedLineIdx = rowIdx
    return newLine
}

function switchLine() {
    if (!gMeme || gMeme.lines.length === 0) return
    gMeme.selectedLineIdx = (gMeme.selectedLineIdx + 1) % gMeme.lines.length
}

function updateLinePos(line, x, y, size) {
    const textWidth = line.txt.length * size * 0.5
    line.pos = {
        x,
        y,
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

function deleteLine() {
    if (!gMeme.lines.length) return
    gMeme.lines.splice(gMeme.selectedLineIdx, 1)
    if (gMeme.lines.length > 0) {
        gMeme.selectedLineIdx = 0
    }
}

function updateRowIdx(diff) {
    const line = gMeme.lines[gMeme.selectedLineIdx]
    const maxRows = 5
    if (line.rowIdx + diff >= 0 && line.rowIdx + diff < maxRows) {
        line.rowIdx += diff
    }
}

function _saveMemes(imgContent) {
    gMeme.img = imgContent
    let savedMemes = _loadSavedMemes()

    savedMemes.push(gMeme)
    saveToStorage(MEMES_KEY, savedMemes)
}

function _loadSavedMemes() {
    return loadFromStorage(MEMES_KEY) || []
}

function updateGMeme(meme) {
    gMeme = meme
    gMeme.selectedLineIdx = meme.selectedLineIdx !== undefined ? meme.selectedLineIdx : 0
}

function updateKeywordSearchCount(keyword) {
    if (!gKeywordSearchCountMap[keyword]) {
        gKeywordSearchCountMap[keyword] = 1
    } else {
        gKeywordSearchCountMap[keyword]++
    }
    _saveKeyWords()
}

function updateGKeywordSearchCountMap() {
    gKeywordSearchCountMap = loadFromStorage(KEYWORDS_KEY)
}

function getKeywordSearchCountMap() {
    return gKeywordSearchCountMap
}

function _saveKeyWords() {
    saveToStorage(KEYWORDS_KEY, gKeywordSearchCountMap)
}
