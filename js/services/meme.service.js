'use strict'

//^ Meme Service

//* Variables
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
const IMGS_KEY = 'imgs'

//* Functions for setting and getting the meme state

// Get the current meme object
function getMeme() {
    return gMeme
}

// Set the fill and stroke colors of the current line
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

// Set the text of the selected line
function setLineTxt(txt) {
    if (!gMeme) return
    gMeme.lines[gMeme.selectedLineIdx].txt = txt
}

// Create a new meme object with a selected image ID
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

//* Functions for handling image data

// Get the list of all available images
function getImgs() {
    gImgs = loadFromStorage(IMGS_KEY) || gImgs
    return gImgs
}

// Set the image by ID for the meme
function setImg(memeId) {
    return getImgs().find(img => img.id === memeId)
}

//* Functions for manipulating text and lines

// Update the font size of the selected line
function updateFontSize(diff) {
    if (!gMeme) return
    gMeme.lines[gMeme.selectedLineIdx].size += diff
}

// Add a new line to the meme
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

// Switch to the next line
function switchLine() {
    if (!gMeme || gMeme.lines.length === 0) return
    gMeme.selectedLineIdx = (gMeme.selectedLineIdx + 1) % gMeme.lines.length
}

// Update the position of the current line
function updateLinePos(line, x, y, size) {
    const textWidth = line.txt.length * size * 0.5
    line.pos = {
        x,
        y,
        width: textWidth,
        height: size,
    }
}

// Update the selected line by its index
function updateSelectedLine(clickedLineIdx) {
    gMeme.selectedLineIdx = clickedLineIdx
}

// Set the font family for the selected line
function setFontFamily(fontFamily) {
    gMeme.lines[gMeme.selectedLineIdx].font = fontFamily
}

// Set the text alignment for the selected line
function setTextAlign(align) {
    gMeme.lines[gMeme.selectedLineIdx].align = align
}

// Delete the currently selected line
function deleteLine() {
    if (!gMeme.lines.length) return
    gMeme.lines.splice(gMeme.selectedLineIdx, 1)
    if (gMeme.lines.length > 0) {
        gMeme.selectedLineIdx = 0
    }
}

// Update the row index (vertical position) of the selected line
function updateRowIdx(diff) {
    const line = gMeme.lines[gMeme.selectedLineIdx]
    const maxRows = 5
    if (line.rowIdx + diff >= 0 && line.rowIdx + diff < maxRows) {
        line.rowIdx += diff
    }
}

//*Functions for handling keyword search count
// Update the search count for a keyword
function updateKeywordSearchCount(keyword) {
    if (!gKeywordSearchCountMap[keyword]) {
        gKeywordSearchCountMap[keyword] = 1
    } else {
        gKeywordSearchCountMap[keyword]++
    }
    _saveKeyWords()
}

// Load keyword search count map from local storage
function updateGKeywordSearchCountMap() {
    gKeywordSearchCountMap = loadFromStorage(KEYWORDS_KEY)
}

// Get the keyword search count map
function getKeywordSearchCountMap() {
    return gKeywordSearchCountMap
}

// Save the keyword search count map to local storage
function _saveKeyWords() {
    saveToStorage(KEYWORDS_KEY, gKeywordSearchCountMap)
}

//*Functions for saving and loading memes
// Save the current meme to local storage
function _saveMemes(imgContent) {
    gMeme.img = imgContent
    let savedMemes = _loadSavedMemes()

    savedMemes.push(gMeme)
    saveToStorage(MEMES_KEY, savedMemes)
}

// Load saved memes from local storage
function _loadSavedMemes() {
    return loadFromStorage(MEMES_KEY) || []
}

// Update the global meme object with a saved meme
function updateGMeme(meme) {
    gMeme = meme
    gMeme.selectedLineIdx = meme.selectedLineIdx !== undefined ? meme.selectedLineIdx : 0
}

//Add upload image
function addImg(img) {
    gImgs.unshift({ id: gImgs.length, url: img })
    _saveimgs()
}

function _saveimgs() {
    saveToStorage(IMGS_KEY, gImgs)
}

function _loadImgs() {
    return loadFromStorage(IMGS_KEY)
}
