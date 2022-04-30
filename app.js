const FREE_CELL = 0;
const RABBIT_CELL = 1;
const WOLF_CELL = 2;
const HOUSE_CELL = 3;
const FENCE_CELL = 4;

const X = 0, Y = 1;

const moveDirections = {
  'move-right': [0, 1],
  'move-bottom': [1, 0],
  'move-left': [0, -1],
  'move-top': [-1, 0]
}
 
const cellWidth = 60;

const moveDirectionsValues = Object.values(moveDirections);

const makeGame = (mainField) => {

  const getPlayfieldSize = () => parseInt(document.getElementById('select-size').value);
  const playfieldSize = getPlayfieldSize();

  const characters = {
    'freeCell': 0,
    'rabbitCell': {
      code: 1,
      characterCount : 1,
      canMove: [FREE_CELL, WOLF_CELL, HOUSE_CELL],
    },
    'wolfCell': {
      code: 2,
      characterCount : (playfieldSize * 40) / 100,
      canMove: [FREE_CELL, RABBIT_CELL],
    },
    'houseCell': {
      code: 3,
      characterCount : 1,
    },
    'fenceCell': {
      code: 4,
      characterCount : (playfieldSize * 40) / 100,
    },
  };

  const charactersNameKeys = Object.keys(characters);

  const compose = (...funcs) => {
    if (funcs.length === 0) {
        return arg => arg;
    }
    if (funcs.length === 1) {
        return funcs[0];
    }
    const lastFn = funcs[funcs.length - 1];
    const withoutLastFn = funcs.slice(0, funcs.length - 1);
    return (...args) => compose(...withoutLastFn)(lastFn(...args));
  }

  const createInitialMatrix = (size) => {
    matrix = new Array(size)
      .fill(0)
      .map(() => new Array(size).fill(0));
    return matrix;
  }
  
  const getRandomPositionsForCharacter = (matrix) => {
    const x = Math.floor(Math.random() * playfieldSize);
    const y = Math.floor(Math.random() * playfieldSize);
    if (matrix[x][y] == FREE_CELL) {
      return [x, y];
    } else {
      return getRandomPositionsForCharacter(matrix);
    }
  }
  
  const setCharacterOnPlayfield = (matrix) => {
    for(let character in characters){
      for(let i = 0; i < characters[character].characterCount; i++){
        [m, n] = getRandomPositionsForCharacter(matrix);
        matrix[m][n] = characters[character].code;
      }
    }
    return matrix;
  }
  
  const currentMatrix = compose(setCharacterOnPlayfield(createInitialMatrix(playfieldSize)));

  const generateCurrentIdNumber = () => Math.floor(Math.random() * 100000);
  const currentIdNumber = generateCurrentIdNumber();

  const makeGameFields = (fieldName, fieldClassName, fieldsIdName) => {
    fieldName.setAttribute('class', fieldClassName);
    fieldName.setAttribute('id', fieldsIdName);
    return fieldName;
  }
  
  const makeBoard = (fieldsIdName, mainField) => {

    const board = document.createElement('div');
    makeGameFields(board, 'board', `board${fieldsIdName}`);
    board.style.width = `${(playfieldSize + 1) * cellWidth}px`;
    board.style.height = `${((playfieldSize  + 1) * cellWidth) + (cellWidth / 2)}px`;
    mainField.appendChild(board);

    const moveButtonsDiv = document.createElement('div');
    makeGameFields(moveButtonsDiv, 'side-buttons', `side-buttons${fieldsIdName}`)
    moveButtonsDiv.style.top = `${playfieldSize * cellWidth + (cellWidth / 2)}px`;
    moveButtonsDiv.innerHTML = `
      <button id='move-right'></button>
      <button id='move-bottom'></button>
      <button id='move-left'></button>
      <button id='move-top'></button> `;
    board.appendChild(moveButtonsDiv);

    return board;
  }
  
  const makePlayfield = () =>{
    const playfield = document.createElement('div');
    playfield.setAttribute('class', 'playfield');
    playfield.style.width = `${playfieldSize * cellWidth}px`;
    currentBoard.appendChild(playfield);

    const createItem = (itemName, className) => {
      itemName = document.createElement('div');
      itemName.classList.add(className);
      playfield.appendChild(itemName);
    }
    
    const addCharacters = (arrayItem) => {
      createItem(charactersNameKeys[arrayItem], charactersNameKeys[arrayItem]);
    }
  
    currentMatrix.forEach((arr) => {
      arr.forEach((arrayItem) => {
        addCharacters(arrayItem);
      });
    });
  }
  
  const currentBoard = makeBoard(currentIdNumber, mainField);
  const currentPlayfield = makePlayfield(currentMatrix, currentBoard);

  const characterCurrentCoordinates = (character) => {
    let characterCoordinateStorage = new Array(0);
    currentMatrix.forEach(arr => {
      for(let i = 0; i < arr.length; i++){
        if(arr[i] == character){
          posX = currentMatrix.indexOf(arr);
          posY = i;
          characterCoordinateStorage.push([posX, posY]);
        }
      }
    })
    return characterCoordinateStorage;
  }

  const moveRabbit = (character, characterPositions) => {
    currentMatrix[characterPositions.rabbitCurrentCoordinates[X]]
      .splice(characterPositions.rabbitCurrentCoordinates[Y], 1, characters.freeCell);
    currentMatrix[characterPositions.rabbitNewCoordinates.rabbitNewX]
      .splice(characterPositions.rabbitNewCoordinates.rabbitNewY, 1, character);
  }

  const moveWolves = (character, characterPositions) => {
    characterPositions.forEach(positions => {
      currentMatrix[positions.wolfCurrentPosition[X]]
        .splice(positions.wolfCurrentPosition[Y], 1, characters.freeCell);
      currentMatrix[positions.wolfNewPositions[X][X]]
        .splice(positions.wolfNewPositions[X][Y], 1, character);
    })
  }

  getClosestDistancesPositionFromRabbit = ({distanceFromRabbit, coordinates}) => coordinates[distanceFromRabbit.indexOf(Math.min(...distanceFromRabbit))];

  const getClosestDistance = (distancesCollection, positionsCollection) => {
    const distancesAndPositions = calculateDistanceAndCoordinates(distancesCollection, positionsCollection);
    const closestDistance = getClosestDistancesPositionFromRabbit(distancesAndPositions);
    return closestDistance;
  }

  const calculateDistance = (a, b) => Math.sqrt((a[X] - b[X])**2 + (a[Y] - b[Y])**2);

  const rabbitCanMove = (newCoordinates) => {
    const rabbitNextPosition = currentMatrix[newCoordinates.rabbitNewX][newCoordinates.rabbitNewY];
    if(characters.rabbitCell.canMove.includes(rabbitNextPosition)){
      return true;
    }
  }

  const updateRabbitPosition = (e) => {
    const rabbitMoveDirections = e.target.id;
    const rabbitCoordinates = characterCurrentCoordinates(RABBIT_CELL);
    const rabbitCurrentCoordinates = rabbitCoordinates[X];

    const currentRabbitMove = (currentPosition, direction) => {
      const rabbitStepOnX = currentPosition[X] + moveDirections[direction][X];
      const rabbitStepOnY = currentPosition[Y] + moveDirections[direction][Y];
      const rabbitNewX = (playfieldSize + rabbitStepOnX) % playfieldSize;
      const rabbitNewY = (playfieldSize + rabbitStepOnY) % playfieldSize;
      return {
        rabbitNewX,
        rabbitNewY
      }
    }
    
    const rabbitNewCoordinates = currentRabbitMove(rabbitCurrentCoordinates, rabbitMoveDirections);

    if(rabbitCanMove(rabbitNewCoordinates)){
      return {
        rabbitCurrentCoordinates,
        rabbitNewCoordinates
      }
    }
  }

  const updateWolvesPositions = (rabbitCurrentCoordinates) => {
    const wolvesNewPositionsCollection = new Array(0);
    const rabbitNewPositions = Object.values(rabbitCurrentCoordinates);
    const rabbitCurrentPosition = Object.values(rabbitNewPositions[Y]);
    characterCurrentCoordinates(WOLF_CELL).forEach(currentPosition => {
      const newPositionsForEveryWolf = new Array(0);
      const distances = new Array(0);
      const positions = new Array(0);
      [posX, posY] = currentPosition;
      moveDirectionsValues.forEach(directionValues => {
      const newCoordinateByX = posX + directionValues[X];
      const newCoordinateByY = posY + directionValues[Y];
      const newCoordinat = [newCoordinateByX, newCoordinateByY];
        if(wolfCanMove(newCoordinateByX, newCoordinateByY)){
          const distance = calculateDistance(newCoordinat, rabbitCurrentPosition);
          distances.push(distance);
          positions.push([newCoordinateByX, newCoordinateByY]);
        }
      })
      const closestDistanceForMove = getClosestDistance(distances, positions);
      newPositionsForEveryWolf.push(closestDistanceForMove);
      const obj = new Object();
      obj.wolfCurrentPosition = [posX, posY];
      obj.wolfNewPositions = newPositionsForEveryWolf;
      wolvesNewPositionsCollection.push(obj);
    })
    return wolvesNewPositionsCollection;
  }
  
  const calculateDistanceAndCoordinates = (distanceFromRabbit, coordinates) => {
    return {
      distanceFromRabbit,
      coordinates
    }
  }
  
  const wolfCanMove = (newCoordinateX, newCoordinateY) => {
    if(newCoordinateX < 0 || newCoordinateY < 0 || newCoordinateX > (playfieldSize - 1) || newCoordinateY > (playfieldSize - 1)){
      return false;
    }
    const wolfNextPosition = currentMatrix[newCoordinateX][newCoordinateY];
    if(characters.wolfCell.canMove.includes(wolfNextPosition)){
      return true;
    }
  }

  const isRabbitWin = () => {
    const currentPosition = characterCurrentCoordinates(HOUSE_CELL);
    if(!currentPosition.length){
      return currentBoard.innerHTML = `<div id="rabbitWin"> Rabbit Win !</div>`;
    }
  }

  const isWolvesWin = () => {
    const currentPosition = characterCurrentCoordinates(RABBIT_CELL);
    if(!currentPosition.length){
      return currentBoard.innerHTML = `<div id="wolvesWin"> Wolves Win !</div>`;
    }
  }

  const charactersMove = (e) => {
    const rabbitPosition = updateRabbitPosition(e);
    const wolvesPositions = updateWolvesPositions(rabbitPosition);
    moveRabbit(RABBIT_CELL, rabbitPosition);
    moveWolves(WOLF_CELL, wolvesPositions);
    isWolvesWin();
    isRabbitWin();
    makePlayfield(currentBoard);
  }

  document.getElementById(`side-buttons${currentIdNumber}`).addEventListener('click', charactersMove);
}

const newGame = () => {
  const container = document.getElementById('container');
  container.innerHTML = `
    <div class="game-size">
    <select class="select-size" id="select-size">
        <option value = 7>7 X 7</option>
        <option value = 8>8 X 8</option>
        <option value = 9>9 X 9</option>
    </select>                
    <button class="new-board-btn">New Board</button>
    <button class="reload-btn">Reload</button>
  </div>
  <div class="board-field"></div>`

  const newBoardBtn = document.querySelector('.new-board-btn');
  const boardField = document.querySelector('.board-field');
  const reloadBtn = document.querySelector(".reload-btn");

  newBoardBtn.addEventListener("click", () => {
    makeGame(boardField);
  });
  
  reloadBtn.addEventListener('click', () => {
    location.reload();
  })

  const startGame = makeGame(boardField);
}
