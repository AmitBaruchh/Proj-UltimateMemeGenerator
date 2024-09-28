'use strict'

//^ Storage Service

function saveToStorage(key, value) {
    const strValue = JSON.stringify(value)
    localStorage.setItem(key, strValue)
}

function loadFromStorage(key) {
    const strValue = localStorage.getItem(key)
    return JSON.parse(strValue)
}

function clearFromStorage(key) {
    localStorage.removeItem(key)
}
