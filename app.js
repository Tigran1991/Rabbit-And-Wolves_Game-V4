const newBoardBtn = document.querySelector('.new-board-btn');
const container = document.getElementById('container');
const boardField = document.querySelector('.board-field');
const reloadBtn = document.querySelector(".reload-btn");

const characters = {
  freeCell: 0,
  rabbitCell: 1,
  wolfCell: 2,
  houseCell: 3,
  fenceCell: 4,
};

const characterItems = {
  0: "freeCell",
  1: "rabbitCell",
  2: "wolfCell",
  3: "houseCell",
  4: "fenceCell",
};

const cellWidth = 60;
let rabbitWin;

newBoardBtn.addEventListener("click", function () {
  const getPlayfieldSize = () => parseInt(document.getElementById("select-size").value);
  const playfieldSize = getPlayfieldSize();
  makeGame(playfieldSize);
});

reloadBtn.addEventListener('click', function (){
  location.reload();
})

const makeCharacterStorage = (count, characterStorageField) => {
  characterStorageField.push(characters.rabbitCell);
  characterStorageField.push(characters.houseCell);
  for (let i = 0; i < count; i++) {
    characterStorageField.push(characters.wolfCell);
    characterStorageField.push(characters.fenceCell);
  }
  return characterStorageField;
}

const createCurrentMatrix = (size) => {
  
  const numberOfCharacters = (size * 40) / 100;
  const characterStorage = new Array(0);

  const createInitialMatrix = (size) => {
    emptyMatrix = new Array(size)
      .fill(0)
      .map(() => new Array(size).fill(0));
    return emptyMatrix;
  }

  const initialMatrix = createInitialMatrix(size);

  const storage = makeCharacterStorage(numberOfCharacters, characterStorage);

  function setRandomPositionForCharacter(matrix, size){
    const x = Math.floor(Math.random() * size);
    const y = Math.floor(Math.random() * size);
    if (matrix[x][y] == characters.freeCell) {
      matrix[x][y] = characterStorage.shift();;
    } else {
      return setRandomPositionForCharacter(matrix, size);
    }
  }

  function setCharacters(size) {
    const characterStorageLength = characterStorage.length;
    let k = 0;
    do {
      setRandomPositionForCharacter(initialMatrix, size);
      k++;
    } while (k < characterStorageLength);
  }

  setCharacters(size);

  return initialMatrix; 
}

const makeGameFields = (fieldName, fieldClassName, fieldsIdName) => {
  fieldName.setAttribute('class', fieldClassName);
  fieldName.setAttribute('id', fieldsIdName);
  return fieldName;
}

const makeBoard = (size, fieldsIdName) => {
  const board = document.createElement('div');
  makeGameFields(board, 'board', `board${fieldsIdName}`);
  board.style.width = `${(size + 1) * cellWidth}px`;
  board.style.height = `${((size  + 1) * cellWidth) + (cellWidth / 2)}px`;
  boardField.appendChild(board);
  const moveButtonsDiv = document.createElement('div');
  makeGameFields(moveButtonsDiv, 'side-buttons', `side-buttons${fieldsIdName}`)
  moveButtonsDiv.style.top = `${size * cellWidth + (cellWidth / 2)}px`;
  moveButtonsDiv.innerHTML = `
    <button id='move-right'></button>
    <button id='move-bottom'></button>
    <button id='move-left'></button>
    <button id='move-top'></button> `;
  board.appendChild(moveButtonsDiv);
  return board;
}

const makePlayfield = (size, matrix, board) =>{
  let playfield = document.createElement('div');
  playfield.setAttribute('class', 'playfield');
  playfield.style.width = `${size * cellWidth}px`;
  playfield.style.height = `${size * cellWidth}px`;
  board.appendChild(playfield);

  matrix.forEach((arr) => {
    arr.forEach((arrayItem) => {
      addCharacters(arrayItem);
    });
  });

  function createItem(itemName, className) {
    itemName = document.createElement('div');
    itemName.classList.add(className);
    playfield.appendChild(itemName);
  }
  
  function addCharacters(arrayItem) {
    createItem(characterItems[arrayItem], characterItems[arrayItem]);
  }
}

const characterCurrentCoordinate = (matrix, character) => {
  let characterCoordinateStorage = new Array(0);
  for (let i = 0; i < matrix.length; i++) {
    if (matrix[i].includes(character)) {  
      for(let j = 0; j < matrix[i].length; j++){
        if(matrix[i][j] === character){
          posX = i;
          posY = j;
          characterCoordinateStorage.push([posX, posY]);
        }
      }
    }   
  }
  return characterCoordinateStorage;
}

const makeGame = (size) => {

  const generateCurrentIdNumber = () => Math.floor(Math.random() * 100000);
  const currentIdNumber = generateCurrentIdNumber();
  const currentMatrix = createCurrentMatrix(size);
  const currentBoard = makeBoard(size, currentIdNumber);
  const currentPlayfield = makePlayfield(size, currentMatrix, currentBoard);

  const rabbitMove = (e) => {
    let rabbitMoveDirection = e.target.id;
    characterCurrentCoordinate(currentMatrix, characters.rabbitCell);
    switch(rabbitMoveDirection){
    case 'move-right':
      rabbitMoveRight(size);
      break;
    case 'move-bottom':
      rabbitMoveBottom(size);
      break;
    case 'move-left':
      rabbitMoveLeft(size);
      break;
    case 'move-top':
      rabbitMoveTop(size);
      break;
    }
    if(rabbitCanMove(rabbitNewPositionX, rabbitNewPositionY, currentBoard)){
      moveCharacter(characters.rabbitCell, rabbitNewPositionX, rabbitNewPositionY);
    }
    updateWolvesPositions(currentMatrix, currentBoard);
    makePlayfield(size, currentMatrix, currentBoard);
  }

  document.getElementById(`side-buttons${currentIdNumber}`).addEventListener('click', rabbitMove);
  
  const rabbitMoveRight = (size) =>{
    if(posY === (size - 1)){
      return rabbitNewPositionX = posX, rabbitNewPositionY = 0;
    }else{
      return rabbitNewPositionX = posX, rabbitNewPositionY = (posY + 1);
    }
  }
  
  const rabbitMoveBottom = (size) =>{
    if(posX === (size - 1)){
      return rabbitNewPositionX = 0, rabbitNewPositionY = posY;
    }else{
      return rabbitNewPositionX = (posX + 1), rabbitNewPositionY = posY;
    }
  }
  
  const rabbitMoveLeft = (size) =>{
    if(posY === 0){
      return rabbitNewPositionX = posX, rabbitNewPositionY = (size - 1);
    }else{
      return rabbitNewPositionX = posX, rabbitNewPositionY = (posY - 1);
    }
  }
  
  const rabbitMoveTop = (size) =>{
    if(posX === 0){
      return rabbitNewPositionX = (size - 1), rabbitNewPositionY = posY;
    }else{
      return rabbitNewPositionX = (posX - 1), rabbitNewPositionY = posY;
    }
  }

  function rabbitCanMove(characterPositionX, characterPositionY, board){
    let rabbitNextPosition = currentMatrix[characterPositionX][characterPositionY];
    if(rabbitNextPosition == characters.fenceCell){
      return false;
    }
    if(rabbitNextPosition == characters.wolfCell){
      currentBoard.innerHTML = `<h1 id='wolvesWin'>Wolves Win !</h1>`;
    }
    if(rabbitNextPosition == characters.houseCell){
      currentBoard.innerHTML = `<h1 id='rabbitWin'>Rabbit Win !</h1>`;
      return rabbitWin = true;
    }
    return true;
  }

  function moveCharacter(character, characterPositionX, characterPositionY){
    currentMatrix[posX].splice(posY, 1, characters.freeCell);
    currentMatrix[characterPositionX].splice(characterPositionY, 1, character);
  }

  function updateWolvesPositions(matrix) {
    const wolvesCharacterCoordinateStorage = characterCurrentCoordinate(matrix, characters.wolfCell);
    while(wolvesCharacterCoordinateStorage.length !== 0){
      for(let m = 0; m < wolvesCharacterCoordinateStorage.length; m++){
        posX = wolvesCharacterCoordinateStorage[0][0];
        posY = wolvesCharacterCoordinateStorage[0][1];
        wolvesCharacterCoordinateStorage.shift();
          determineClosestDistance(posX, posY);
          if(wolfCanMove(wolfNewPositionX, wolfNewPositionY)){
            moveCharacter(characters.wolfCell, wolfNewPositionX, wolfNewPositionY);
          } 
      }
    }
  }
  
  function determineClosestDistance(posX, posY){
  let closestDistanceStorage = new Array(0);
  if(wolfProbablePositionY = posY + 1){
    distanceByX = Math.abs(posX - rabbitNewPositionX);
    distanceByY = Math.abs(wolfProbablePositionY - rabbitNewPositionY);
    calculateDistance(closestDistanceStorage);
  }
  if(wolfProbablePositionX = posX + 1){
    distanceByX = Math.abs(wolfProbablePositionX - rabbitNewPositionX);
    distanceByY = Math.abs(posY - rabbitNewPositionY);
    calculateDistance(closestDistanceStorage);
  }
  if(wolfProbablePositionY = posY - 1){
    distanceByX = Math.abs(posX - rabbitNewPositionX);
    distanceByY = Math.abs(wolfProbablePositionY - rabbitNewPositionY);
    calculateDistance(closestDistanceStorage);
  }
  if(wolfProbablePositionX = posX - 1){
    distanceByX = Math.abs(wolfProbablePositionX - rabbitNewPositionX);
    distanceByY = Math.abs(posY - rabbitNewPositionY);
    calculateDistance(closestDistanceStorage);
  }
  setWolfNewPositionCoordinates(closestDistanceStorage);
  }
  
  function calculateDistance(distanceStorage){
    let distance = Math.floor(Math.sqrt(Math.pow(distanceByX, 2) + Math.pow(distanceByY, 2)));
    return distanceStorage.push(distance);
  }
  
  function setWolfNewPositionCoordinates(storage){
    if(storage.length !== 0){
      let minDistance = Math.min(...storage);
      if(minDistance === storage[0]){
        wolfNewPositionX = posX, wolfNewPositionY = posY + 1;
      }
      if(minDistance === storage[1]){
        wolfNewPositionX = posX + 1, wolfNewPositionY = posY;
      }
      if(minDistance === storage[2]){
        wolfNewPositionX = posX, wolfNewPositionY = posY - 1;
      }
      if(minDistance === storage[3]){
        wolfNewPositionX = posX - 1, wolfNewPositionY = posY;
      }
    }
  }

  function wolfCanMove(characterPositionX, characterPositionY, board){
    let wolfNextPosition = currentMatrix[characterPositionX][characterPositionY];
    if(wolfNextPosition == characters.fenceCell
      || wolfNextPosition == characters.wolfCell
      || wolfNextPosition == characters.houseCell
      || wolfNextPosition == characters.rabbitWinGameCell
      || wolfNextPosition == undefined){
      return false;
    }
    if(wolfNextPosition == characters.rabbitCell && rabbitWin){
      return false;
    }
    if(wolfNextPosition == characters.rabbitCell){
      currentBoard.innerHTML = `<h1 id='wolvesWin'>Wolves Win !</h1>`;
    }
    return true;
  }
}
