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

  
const moveDirection = {
  'move-right': [0, 1],
  'move-bottom': [1, 0],
  'move-left': [0, -1],
  'move-top': [-1, 0],
}
 
const cellWidth = 60;

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

  const setRandomPositionForCharacter = (matrix, size) => {
    const x = Math.floor(Math.random() * size);
    const y = Math.floor(Math.random() * size);
    if (matrix[x][y] == characters.freeCell) {
      matrix[x][y] = characterStorage.shift();;
    } else {
      return setRandomPositionForCharacter(matrix, size);
    }
  }

  const setCharacters = (size) => {
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
  let rabbitWin = false;
  const generateCurrentIdNumber = () => Math.floor(Math.random() * 100000);
  const currentIdNumber = generateCurrentIdNumber();
  const currentMatrix = createCurrentMatrix(size);
  const currentBoard = makeBoard(size, currentIdNumber);
  const currentPlayfield = makePlayfield(size, currentMatrix, currentBoard);

  const rabbitMoveOnPlayfield = (size, rabbitMoveDirection) => {
    moveDirection[rabbitMoveDirection];
    currentRabbitMove(size, rabbitMoveDirection);
  }

  const rabbitMove = (e) => {
    let rabbitMoveDirection = e.target.id;
    characterCurrentCoordinate(currentMatrix, characters.rabbitCell);
    rabbitMoveOnPlayfield(size, rabbitMoveDirection);
      if(rabbitCanMove(rabbitNewPositionX, rabbitNewPositionY)){
        moveCharacter(characters.rabbitCell, rabbitNewPositionX, rabbitNewPositionY);
      }
    updateWolvesPositions(currentMatrix);
    makePlayfield(size, currentMatrix, currentBoard);
  }

  document.getElementById(`side-buttons${currentIdNumber}`).addEventListener('click', rabbitMove);

  const currentRabbitMove = (size, direction) => {
    if(posX === 0 && direction == 'move-top'){
      return rabbitNewPositionX = (size - 1), rabbitNewPositionY = posY;
    }
    if(posY === 0 && direction == 'move-left'){
      return rabbitNewPositionX = posX, rabbitNewPositionY = (size - 1);
    }
    if(posX === (size - 1) && direction == 'move-bottom'){
      return rabbitNewPositionX = 0, rabbitNewPositionY = posY;
    }
    if(posY === (size - 1) && direction == 'move-right'){
      return rabbitNewPositionX = posX, rabbitNewPositionY = 0;
    }
    return rabbitNewPositionX = posX + moveDirection[direction][0], 
           rabbitNewPositionY = posY + moveDirection[direction][1];
  }

  function rabbitCanMove(characterPositionX, characterPositionY){
    let rabbitNextPosition = currentMatrix[characterPositionX][characterPositionY];
    if(rabbitNextPosition == characters.fenceCell){
      return false;
    }
    if(rabbitNextPosition == characters.wolfCell){
      currentBoard.innerHTML = `<h1 id='wolvesWin'>Wolves Win !</h1>`;
    }
    if(rabbitNextPosition == characters.houseCell){
      currentBoard.innerHTML = `<h1 id='rabbitWin'>Rabbit Win !</h1>`;
      rabbitWin = true;
    }
    return true;
  }

  function moveCharacter(character, characterPositionX, characterPositionY){
    currentMatrix[posX].splice(posY, 1, characters.freeCell);
    currentMatrix[characterPositionX].splice(characterPositionY, 1, character);
  }

  function updateWolvesPositions(matrix, winnerCharacter) {
    const wolvesCharacterCoordinateStorage = characterCurrentCoordinate(matrix, characters.wolfCell);
    while(wolvesCharacterCoordinateStorage.length !== 0){
      for(let m = 0; m < wolvesCharacterCoordinateStorage.length; m++){
        posX = wolvesCharacterCoordinateStorage[0][0];
        posY = wolvesCharacterCoordinateStorage[0][1];
        wolvesCharacterCoordinateStorage.shift();
          determineClosestDistance(posX, posY);
          if(wolfCanMove(wolfNewPositionX, wolfNewPositionY, winnerCharacter)){
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

  function wolfCanMove(characterPositionX, characterPositionY){
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
