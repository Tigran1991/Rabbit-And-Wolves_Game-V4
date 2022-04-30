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

  const calculateDistance = (a, b) => Math.pow(a[X] - b[X], 2) + Math.pow(a[Y] - b[Y], 2);

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

  const createCurrentMatrix = () => {

    const createInitialMatrix = () => {
      emptyMatrix = new Array(playfieldSize)
        .fill(0)
        .map(() => new Array(playfieldSize).fill(0));
      return emptyMatrix;
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
          [m, n] = getRandomPositionsForCharacter(initialMatrix)
          matrix[m][n] = characters[character].code;
        }
      }
      return matrix;
    }
  
    const initialMatrix = createInitialMatrix(playfieldSize);
    const setCharacters = setCharacterOnPlayfield(initialMatrix);

    return initialMatrix;
  }

  const currentMatrix = createCurrentMatrix(playfieldSize);

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

  const currentRabbitMove = (currentPosition, direction) => {
    const [posX, posY] = currentPosition[X];
    const rabbitStepOnX = posX + moveDirections[direction][X];
    const rabbitStepOnY = posY + moveDirections[direction][Y];
    const rabbitNewX = (playfieldSize + rabbitStepOnX) % playfieldSize;
    const rabbitNewY = (playfieldSize + rabbitStepOnY) % playfieldSize;
    return {
      rabbitNewX,
      rabbitNewY
    }
  }

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

  const rabbitCanMove = (newCoordinates) => {
    const rabbitNextPosition = currentMatrix[newCoordinates.rabbitNewX][newCoordinates.rabbitNewY];
    if(rabbitNextPosition == HOUSE_CELL){
      return currentBoard.innerHTML = `<h1 id='rabbitWin'>Rabbit Win !</h1>`;
    }else if(characters.rabbitCell.canMove.includes(rabbitNextPosition)){
      return true;
    }
  }

  const moveCharacter = (character, newCoordinates) => {
    const characterCoordinates = Object.values(newCoordinates);
    currentMatrix[posX].splice(posY, 1, characters.freeCell);
    currentMatrix[characterCoordinates[X]].splice(characterCoordinates[Y], 1, character);
  }

  getClosestDistancesPositionFromRabbit = ({distanceFromRabbit, coordinates}) => coordinates[distanceFromRabbit.indexOf(Math.min(...distanceFromRabbit))];

  const getClosestDistance = (distancesCollection, positionsCollection) => {
    const distancesAndPositions = calculateDistanceAndCoordinates(distancesCollection, positionsCollection);
    const closestDistance = getClosestDistancesPositionFromRabbit(distancesAndPositions);
    return closestDistance;
  }

  const updateWolvesPositions = (rabbitNewPosition) => {
    const rabbitCurrentPosition = Object.values(rabbitNewPosition);
    characterCurrentCoordinates(WOLF_CELL).map(currentPosition => {
      const distances = new Array(0);
      const positions = new Array(0);
      [posX, posY] = currentPosition;
      moveDirectionsValues.map(directionValues => {
      const newCoordinateByX = posX + directionValues[X];
      const newCoordinateByY = posY + directionValues[Y];
        if(wolfCanMove(newCoordinateByX, newCoordinateByY)){
          const distance = calculateDistance(directionValues, rabbitCurrentPosition);
          distances.push(distance);
          positions.push([newCoordinateByX, newCoordinateByY]);
        }
      })
      const closestDistanceForMove = getClosestDistance(distances, positions);
      moveCharacter(WOLF_CELL, closestDistanceForMove);     
    }) 
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
      if(characters.wolfCell.canMove.includes(wolfNextPosition) && wolfNextPosition == RABBIT_CELL){
        currentBoard.innerHTML = `<h1 id='wolvesWin'>Wolves Win !</h1>`;
        return false;
      }else if(characters.wolfCell.canMove.includes(wolfNextPosition)){
        return true;
      }
  }

  const rabbitMove = (e) => {
    const rabbitMoveDirections = e.target.id;
    const rabbitNewCoordinates = currentRabbitMove(characterCurrentCoordinates(RABBIT_CELL), rabbitMoveDirections);
      if(compose(currentRabbitMove, characterCurrentCoordinates)){
        moveCharacter(RABBIT_CELL, rabbitNewCoordinates);
      }
      makePlayfield(currentBoard, updateWolvesPositions(rabbitNewCoordinates));
  }

  document.getElementById(`side-buttons${currentIdNumber}`).addEventListener('click', rabbitMove);
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
  
  reloadBtn.addEventListener('click', function (){
    location.reload();
  })

  const startGame = makeGame(boardField);
}
