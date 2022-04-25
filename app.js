const newBoardBtn = document.querySelector('.new-board-btn');
const container = document.getElementById('container');
const boardField = document.querySelector('.board-field');
const reloadBtn = document.querySelector(".reload-btn");

const characters = {
  'freeCell': 0,
  'rabbitCell': 1,
  'wolfCell': 2,
  'houseCell': 3,
  'fenceCell': 4,
};

const moveDirection = {
  'move-right': [0, 1],
  'move-bottom': [1, 0],
  'move-left': [0, -1],
  'move-top': [-1, 0],
}

const charactersNameKeys = Object.keys(characters);
const moveDirectionValues = Object.values(moveDirection);
 
const cellWidth = 60;

newBoardBtn.addEventListener("click", function () {
  const getPlayfieldSize = () => parseInt(document.getElementById("select-size").value);
  const playfieldSize = getPlayfieldSize();
  makeGame(playfieldSize);
});

reloadBtn.addEventListener('click', function (){
  location.reload();
})

const makeCharacterStorage = (count) => {
  const storage = new Array(0);
  storage.push(characters.rabbitCell);
  storage.push(characters.houseCell);
  for (let i = 0; i < count; i++) {
    storage.push(characters.wolfCell);
    storage.push(characters.fenceCell);
  }
  return storage;
}

const createCurrentMatrix = (size) => {
  
  const numberOfCharacters = (size * 40) / 100;
  
  const createInitialMatrix = (size) => {
    emptyMatrix = new Array(size)
      .fill(0)
      .map(() => new Array(size).fill(0));
    return emptyMatrix;
  }

  const initialMatrix = createInitialMatrix(size);

  const characterStorage = makeCharacterStorage(numberOfCharacters);

  const setRandomPositionForCharacter = (matrix, size, characterStorageField) => {
    const x = Math.floor(Math.random() * size);
    const y = Math.floor(Math.random() * size);
    if (matrix[x][y] == characters.freeCell) {
      matrix[x][y] = characterStorageField.shift();
    } else {
      return setRandomPositionForCharacter(matrix, size, characterStorage);
    }
  }

  const setCharacters = (size, storageField) => {
    const characterStorageLength = storageField.length;
    let k = 0;
    do {
      setRandomPositionForCharacter(initialMatrix, size, characterStorage);
      k++;
    } while (k < characterStorageLength);
  }

  setCharacters(size, characterStorage);

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
    createItem(charactersNameKeys[arrayItem], charactersNameKeys[arrayItem]);
  }
}

const characterCurrentCoordinate = (matrix, character) => {
  let characterCoordinateStorage = new Array(0);
  matrix.forEach(arr => {
    for(let i = 0; i < arr.length; i++){
      if(arr[i] == character){
        posX = matrix.indexOf(arr);
        posY = i;
        characterCoordinateStorage.push([posX, posY]);
      }
    }
  })
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
    let [moveOnX, moveOnY] = moveDirection[direction];
    if(posX === 0 && direction == 'move-top'){
      return rabbitNewPositionX = (size + moveOnX), rabbitNewPositionY = (posY + moveOnY);
    }
    if(posY === 0 && direction == 'move-left'){
      return rabbitNewPositionX = (posX + moveOnX), rabbitNewPositionY = (size + moveOnY);
    }
    if(posX === (size - 1) && direction == 'move-bottom'){
      return rabbitNewPositionX = 0, rabbitNewPositionY = posY;
    }
    if(posY === (size - 1) && direction == 'move-right'){
      return rabbitNewPositionX = posX, rabbitNewPositionY = 0;
    }
    return rabbitNewPositionX = posX + moveOnX, rabbitNewPositionY = posY + moveOnY;
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
    let [...currentWolvesPositions] = characterCurrentCoordinate(matrix, characters.wolfCell);
    let i = 0;
    while(i < currentWolvesPositions.length){
    [posX, posY] = currentWolvesPositions[i];
      determineClosestDistance(posX, posY);
      if(wolfCanMove(wolfNewPositionX, wolfNewPositionY, winnerCharacter)){
        moveCharacter(characters.wolfCell, wolfNewPositionX, wolfNewPositionY);
      }
      i++;
    }
  }
  
  const determineClosestDistance = (posX, posY) => {
  let closestDistanceStorage = new Array(0);
    for(let i = 0; i < moveDirectionValues.length; i++){
      distanceByX = Math.abs((posX + moveDirectionValues[i][0]) - rabbitNewPositionX);
      distanceByY = Math.abs((posY + moveDirectionValues[i][1]) - rabbitNewPositionY);
      calculateDistance(closestDistanceStorage);
    }
  setWolfNewPositionCoordinates(posX, posY, closestDistanceStorage);
  }
  
  function calculateDistance(distanceStorage){
    let distance = Math.floor(Math.sqrt(Math.pow(distanceByX, 2) + Math.pow(distanceByY, 2)));
    return distanceStorage.push(distance);
  }
  
  function setWolfNewPositionCoordinates(posX, posY, storage){
    if(storage.length !== 0){
      let minDistance = Math.min(...storage);
      for(let j = 0; j < storage.length; j++){
        if(minDistance === storage[j]){
          wolfNewPositionX = posX + moveDirectionValues[j][0], wolfNewPositionY = posY + moveDirectionValues[j][1];
        }
      }
    }
  }

  function wolfCanMove(characterPositionX, characterPositionY){
    let wolfNextPosition = currentMatrix[characterPositionX][characterPositionY];
    if(wolfNextPosition == characters.fenceCell
      || wolfNextPosition == characters.wolfCell
      || wolfNextPosition == characters.houseCell
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
