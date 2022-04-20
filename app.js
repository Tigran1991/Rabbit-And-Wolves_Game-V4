const newBoardBtn = document.querySelector('.new-board-btn');
const container = document.getElementById('container');
const boardField = document.querySelector('.board-field');

const characters = {
  freeCell: 0,
  rabbitCell: 1,
  wolfCell: 2,
  houseCell: 3,
  fenceCell: 4,
  carrotCell: 5,
};

const characterItems = {
  0: "freeCell",
  1: "rabbitCell",
  2: "wolfCell",
  3: "houseCell",
  4: "fenceCell",
  5: "carrotCell",
};

const cellWidth = 60;
let playfieldSize;
let serialNumber = 0;

newBoardBtn.addEventListener("click", function () {
  const currentMatrix = createCurrentMatrix(playfieldSize);
  const currentBoard = makeBoard();
  const playfield = makePlayfield(currentMatrix, currentBoard);
  makeGame(currentMatrix, playfield, currentBoard);
});

const createCurrentMatrix = () => {
  playfieldSize = parseInt(document.getElementById("select-size").value);
  const numberOfCharacters = (playfieldSize * 40) / 100;
  const characterStorage = new Array(0);

  const createInitialMatrix = (size) => {
    emptyMatrix = new Array(size)
      .fill(0)
      .map(() => new Array(size).fill(0));
    return emptyMatrix;
  }

  const initialMatrix = createInitialMatrix(playfieldSize);

  const makeCharacterStorage = (count) => {
    characterStorage.push(characters.rabbitCell);
    characterStorage.push(characters.houseCell);
    for (let i = 0; i < count; i++) {
      characterStorage.push(characters.wolfCell);
      characterStorage.push(characters.fenceCell);
      characterStorage.push(characters.carrotCell);
    }
    return characterStorage;
  }

  const storage = makeCharacterStorage(numberOfCharacters);

  function setRandomPositionForCharacter(matrix, size){
    const x = Math.floor(Math.random() * size);
    const y = Math.floor(Math.random() * size);
    if (matrix[x][y] == characters.freeCell) {
      matrix[x][y] = characterStorage.shift();;
    } else {
      return setRandomPositionForCharacter(matrix, size);
    }
  }

  function setCharacters() {
    const characterStorageLength = characterStorage.length;
    let k = 0;
    do {
      setRandomPositionForCharacter(initialMatrix, playfieldSize);
      k++;
    } while (k < characterStorageLength);
  }

  setCharacters();

  return initialMatrix; 
}

const makeBoard = () => {
  serialNumber++;
  const board = document.createElement('div');
  board.setAttribute('class', 'board');
  board.setAttribute('id', `board${serialNumber}`);
  board.style.width = `${(playfieldSize + 1) * cellWidth}px`;
  board.style.height = `${((playfieldSize  + 1) * cellWidth) + (cellWidth / 2)}px`;
  boardField.appendChild(board);
  const moveButtonsDiv = document.createElement('div');
  moveButtonsDiv.setAttribute('class', 'side-buttons');
  moveButtonsDiv.setAttribute('id', `side-buttons${serialNumber}`);
  moveButtonsDiv.style.height = `${cellWidth}px`;
  moveButtonsDiv.style.top = `${playfieldSize * cellWidth + (cellWidth / 2)}px`;
  moveButtonsDiv.innerHTML = `
    <button id='move-right'></button>
    <button id='move-bottom'></button>
    <button id='move-left'></button>
    <button id='move-top'></button> `;
  
  board.appendChild(moveButtonsDiv);
  return board;
}

const makePlayfield = (matrix, board) => {
  if (document.getElementById('.playfield') !== null) {
    document.getElementById('.playfield').remove();
  }

  let playfield = document.createElement('div');
  playfield.setAttribute('class', 'playfield');
  playfield.setAttribute('id', `playfield${serialNumber}`);
  playfield.style.width = `${playfieldSize * cellWidth}px`;
  playfield.style.height = `${playfieldSize * cellWidth}px`;
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

const makeGame = (matrix, field, board) => {
  
  const rabbitMove = (e) => {
    let rabbitMoveDirection = e.target.id;
    characterCurrentCoordinate(characters.rabbitCell);
    switch(rabbitMoveDirection){
    case 'move-right':
      rabbitMoveRight();
      break;
    case 'move-bottom':
      rabbitMoveBottom();
      break;
    case 'move-left':
      rabbitMoveLeft();
      break;
    case 'move-top':
      rabbitMoveTop();
      break;
    }
    if(rabbitCanMove(rabbitNewPositionX, rabbitNewPositionY)){
      moveCharacter(characters.rabbitCell, rabbitNewPositionX, rabbitNewPositionY);
    }
    updateWolvesPositions();
    makePlayfield(matrix, board);
  }

  document.getElementById(`side-buttons${serialNumber}`).addEventListener('click', rabbitMove);

  const characterCurrentCoordinate = character => {
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

  function rabbitMoveRight(){
    if(posY === (playfieldSize - 1)){
      return rabbitNewPositionX = posX, rabbitNewPositionY = 0;
    }else{
      return rabbitNewPositionX = posX, rabbitNewPositionY = (posY + 1);
    }
  }
  
  function rabbitMoveBottom(){
    if(posX === (playfieldSize - 1)){
      return rabbitNewPositionX = 0, rabbitNewPositionY = posY;
    }
    else{
      return rabbitNewPositionX = (posX + 1), rabbitNewPositionY = posY;
    }
  }
  
  function rabbitMoveLeft(){
    if(posY === 0){
      return rabbitNewPositionX = posX, rabbitNewPositionY = (playfieldSize - 1);
    }else{
      return rabbitNewPositionX = posX, rabbitNewPositionY = (posY - 1);
    }
  }
  
  function rabbitMoveTop(){
    if(posX === 0){
      return rabbitNewPositionX = (playfieldSize - 1), rabbitNewPositionY = posY;
    }else{
      return rabbitNewPositionX = (posX - 1), rabbitNewPositionY = posY;
    }
  }

  function rabbitCanMove(characterPositionX, characterPositionY){
    let rabbitNextPosition = matrix[characterPositionX][characterPositionY];
    if(rabbitNextPosition == characters.fenceCell){
      return false;
    }
    if(rabbitNextPosition == characters.wolfCell){
      console.log('Wolves Win');
      return false;
    }
    if(rabbitNextPosition == characters.houseCell){
      console.log('Rabbit Win');
      return false;
    }
    return true;
  }

  function moveCharacter(character, characterPositionX, characterPositionY){
    matrix[posX].splice(posY, 1, characters.freeCell);
    matrix[characterPositionX].splice(characterPositionY, 1, character);
  }

  function updateWolvesPositions() {
    const wolvesCharacterCoordinateStorage = characterCurrentCoordinate(characters.wolfCell);
    while(wolvesCharacterCoordinateStorage.length !== 0){
      for(let m = 0; m < wolvesCharacterCoordinateStorage.length; m++){
        posX = wolvesCharacterCoordinateStorage[0][0];
        posY = wolvesCharacterCoordinateStorage[0][1];
        wolvesCharacterCoordinateStorage.shift();
          posX, posY;
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
    }else{
      wolfNewPositionX = posX; wolfNewPositionY = posY;
    }
  }

  function wolfCanMove(characterPositionX, characterPositionY){
    let wolfNextPosition = matrix[characterPositionX][characterPositionY];
    if(wolfNextPosition == characters.fenceCell
      || wolfNextPosition == characters.wolfCell
      || wolfNextPosition == characters.houseCell
      || wolfNextPosition == undefined){
      return false;
    }
    if(wolfNextPosition == characters.rabbitCell){
      console.log('Wolves Win');
      return false;
    }
    return true;
  }
}
