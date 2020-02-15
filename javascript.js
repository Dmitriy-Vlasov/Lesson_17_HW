'use strict'

const stickerBoardElement = document.querySelector('#stickerBoard');
const stickerBoardFormElement = document.querySelector('#stickerBoardForm');
const inputNotesElement = document.querySelector('#inputNotes');
const inputIDElement = document.querySelector('#id');
const clearAllButtonElement = document.querySelector('#clearAllButton');

const stickerTemplate = document.querySelector('#stickerTemplate').innerHTML;

stickerBoardFormElement.addEventListener('submit', stickerBoardFormSubmit);
clearAllButtonElement.addEventListener('click', onClearAllButtonClick);
stickerBoardElement.addEventListener('click', onStickerBoardClick)

let notesList;

init();

function init () {
    notesList = validInit() ? validInit() : [];
    getData();
    renderSticker();
};

function onClearAllButtonClick() {
    localStorage.removeItem('notesList');
    notesList = [];
    renderSticker();
};

function onStickerBoardClick(e) {
    switch (true) {
        case e.target.classList.contains('delete'):
            removeSticker(e.target.parentNode.parentNode.dataset.id)
            break;
        case e.target.classList.contains('edit'):
            addNoteToInput(e.target.parentNode.parentNode.dataset.id);
    }
};

function addNoteToInput(elID) {
    let note = notesList.find(note => note.id == elID);
    inputIDElement.value = note.id;
    inputNotesElement.value = note.title; 
}

function removeSticker(elID) {
    notesList = notesList.filter(sticker => sticker.id != elID);
    localStorage.setItem('notesList', JSON.stringify(notesList));
    renderSticker();
};

function validInit() {
    return JSON.parse(localStorage.getItem('notesList'));
};

function stickerBoardFormSubmit(e) {
    e.preventDefault();

    if(inputIDElement.value.trim() === '') {
        addSticker();
        clear();
    } 
    else {
        if (inputNotesElement.value.trim() !== '') {
            editSticker();
            renderSticker();
            clear();
        }
    }
};

function editSticker() {
    let note = notesList.find(note => note.id == inputIDElement.value);
    note.title = inputNotesElement.value;
    localStorage.setItem('notesList', JSON.stringify(notesList));
}

function addSticker() {
    if (inputNotes.value.trim() !== '') {
        const noteData = {};
        createNewNoteItem(noteData);
    };
};

function createNewNoteItem(noteData) {
    setData(noteData);
    renderSticker(noteData);
};

function setData(noteData) {
    const color = getColor();
    noteData.rotate = (Math.random() * (0.4 - (-0.4)) + (-0.4))*10;
    console.log(noteData.rotate)
    noteData.color = color;
    noteData.id = Date.now();
    noteData.title = inputNotes.value;
    notesList.push(noteData);
    localStorage.setItem('notesList', JSON.stringify(notesList));
};

function getColor() {
    const color = ['rose', 'blue', 'yellow', 'green', 'red']
    const randColor = Math.floor(Math.random() * color.length);
    return(color[randColor]);
};

function renderSticker() {
    let data = getData();
    stickerBoardElement.innerHTML = data.map(stickerBoardtoHTML).join('\n');
};

function getData() {
    let data = localStorage.getItem('notesList');
    return data = data ? JSON.parse(data) : [];
};

function stickerBoardtoHTML(data) {
    
    return stickerTemplate
        .replace('{{id}}', data.id)
        .replace('{{titile}}', data.title)
        .replace('{{color}}', data.color)
        .replace('{{rotate}}', data.rotate) 
        // не уверен на счет того, насколько правильно делать это через инлайновые стили, но мне очень захотелось)
};

function clear() {
    inputNotesElement.value = '';
    inputIDElement.value = '';
};