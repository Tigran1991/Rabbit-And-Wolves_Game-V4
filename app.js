const FREE_CELL = 0;
const RABBIT_CELL = 1;
const WOLF_CELL = 2;
const HOUSE_CELL = 3;
const FENCE_CELL = 4;

const X = 0, Y = 1;

const MOVE_DIRECTION = {
  'move-right': [0, 1],
  'move-bottom': [1, 0],
  'move-left': [0, -1],
  'move-top': [-1, 0]
}
 
const CELL_WIDTH = 60;

const DIRECTION_MOVEMENT = Object.values(MOVE_DIRECTION);

const createInitialMatrix = (size) => {
  const MATRIX = new Array(size)
    .fill(0)
    .map(() => new Array(size).fill(0));
  return MATRIX;
}

const generateCurrentId = () => Math.floor(Math.random() * 100000);

const makeGameFields = (fieldsName, fieldsClassName, fieldsIdName) => { 
  fieldsName.setAttribute('class', fieldsClassName);
  fieldsName.setAttribute('id', fieldsIdName);
  return fieldsName;
}

const makeButtonsDivElements = (buttonsDiv, id) => {
  buttonsDiv.innerHTML = `
    <button class='move-right' id='move-right-${id}'></button>
    <button class='move-bottom' id='move-bottom-${id}'></button>
    <button class='move-left' id='move-left-${id}'></button>
    <button class='move-top' id='move-top-${id}'></button> `;
  return buttonsDiv; 
}

const setBoardStyles = (currentBoard, size) => {
  currentBoard.style.width = `${( size + 1) * CELL_WIDTH}px`;
  currentBoard.style.height = `${(( size  + 1) * CELL_WIDTH) + (CELL_WIDTH / 2)}px`;
}

const setButtonsDivStyles = (currentButtonsDiv, size) => {
  currentButtonsDiv.style.top = `${ size * CELL_WIDTH + (CELL_WIDTH / 2)}px`;
}

const setPlayfieldStyles = (currentPlayfield, size) => {
  currentPlayfield.style.width = `${size * CELL_WIDTH}px`;;
}

const drawMatrix = (matrix, obj, playfield) => {
  matrix.forEach((arr) => { 
    arr.forEach((arrayItem) => {
      const CELL = document.createElement('div');
      CELL.setAttribute('class', 'freeCell');
      const ITEM = document.createElement('img');
        if(arrayItem !== FREE_CELL){
          ITEM.src = obj[arrayItem].url;
          playfield.appendChild(ITEM);
        }else{
          playfield.appendChild(CELL);
        }
    })
  })  
}

const multiply = (a, b) => a + b;

const makeGame = (mainField) => {

  const getPlayfieldSize = () => parseInt(document.getElementById('select-size').value);
  const PLAYFIELD_SIZE = getPlayfieldSize();

  const CHARACTERS = {
    [RABBIT_CELL]: {
      characterCount : 1,
      canMove: [FREE_CELL, WOLF_CELL, HOUSE_CELL],
      url: './img/bunny.png'
    },
    [WOLF_CELL]: {
      characterCount : (PLAYFIELD_SIZE * 40) / 100,
      canMove: [FREE_CELL, RABBIT_CELL],
      url: './img/wolf.png'
    },
    [HOUSE_CELL]: {
      characterCount : 1,
      url: './img/house.png'
    },
    [FENCE_CELL]: {
      characterCount : (PLAYFIELD_SIZE * 40) / 100,
      url: './img/fence.png'
    },
  };

  //1. Creating matrix

  const getRandomPositionsForCharacter = (matrix) => {
    const x = Math.floor(Math.random() * PLAYFIELD_SIZE);
    const y = Math.floor(Math.random() * PLAYFIELD_SIZE);
    if (matrix[x][y] == FREE_CELL) {
      return [x, y];
    } else {
      return getRandomPositionsForCharacter(matrix);
    }
  }
  
  const setCharacterOnPlayfield = (matrix) => {
    for(let character in CHARACTERS){
      for(let i = 0; i < CHARACTERS[character].characterCount; i++){
        [m, n] = getRandomPositionsForCharacter(matrix);
        matrix[m][n] = Number(character);
      }
    }
    return matrix;
  }
  
  const INITIAL_MATRIX = createInitialMatrix(PLAYFIELD_SIZE);
  const CURRENT_MATRIX = setCharacterOnPlayfield(INITIAL_MATRIX);
  console.log(CURRENT_MATRIX)

  //2.Making BOARD for PLAYFIELD and BUTTONS field for every side button
   
  const CURRENT_ID = generateCurrentId();
  
  const makeBoard = (fieldsIdName, mainField) => {
    const BOARD = document.createElement('div');
    makeGameFields(BOARD, 'board', `board${fieldsIdName}`);
    mainField.appendChild(BOARD);
    return BOARD;
  }

  const makeButtonsDiv = (currentBoard, fieldsIdName) => {
    const MOVEMENT_BUTTONS = document.createElement('div'); 
    makeGameFields(MOVEMENT_BUTTONS, 'side-buttons', `side-buttons${fieldsIdName}`);
    makeButtonsDivElements(MOVEMENT_BUTTONS, CURRENT_ID);
    currentBoard.appendChild(MOVEMENT_BUTTONS);
    return MOVEMENT_BUTTONS; 
  }

  const removeDocumentsElement = (fieldsIdName) => {
    if(document.getElementById(`playfield${fieldsIdName}`) !== null){
      document.getElementById(`playfield${fieldsIdName}`).remove();
    }
  }

  const makePlayfield = (fieldsIdName) =>{
    removeDocumentsElement(fieldsIdName);
    const PLAYFIELD = document.createElement('div');  
    makeGameFields(PLAYFIELD, 'playfield', `playfield${fieldsIdName}`);
    drawMatrix(CURRENT_MATRIX, CHARACTERS, PLAYFIELD);
    CURRENT_BOARD.appendChild(PLAYFIELD);
    return PLAYFIELD;
  }

  const CURRENT_BOARD = makeBoard(CURRENT_ID, mainField);
  const CURRENT_BUTTONS_DIV = makeButtonsDiv(CURRENT_BOARD, CURRENT_ID);
  const CURRENT_PLAYFIELD = makePlayfield(CURRENT_ID);

  setBoardStyles(CURRENT_BOARD, PLAYFIELD_SIZE);
  setButtonsDivStyles(CURRENT_BUTTONS_DIV, PLAYFIELD_SIZE);
  setPlayfieldStyles(CURRENT_PLAYFIELD, PLAYFIELD_SIZE);

  const getCharactersCurrentPosition = (character) => { 
    const POSITION_STORAGE = new Array(0);             
    CURRENT_MATRIX.forEach(arr => {
      for(let i = 0; i < arr.length; i++){
        if(arr[i] == character){
          const posX = CURRENT_MATRIX.indexOf(arr);
          const posY = i;
          const WOLF_POSITION = Array.of(posX, posY);
          POSITION_STORAGE.push(WOLF_POSITION);
        }
      }
    })
    return POSITION_STORAGE;
  }

  const moveCharacter = (character, characterPosition) => {
    if(characterPosition){                                   
      CURRENT_MATRIX[characterPosition.CURRENT_POSITION[X]].splice(characterPosition.CURRENT_POSITION[Y], 1, FREE_CELL);
      CURRENT_MATRIX[characterPosition.NEW_POSITION[X]].splice(characterPosition.NEW_POSITION[Y], 1, character);
    }
  }

  const rabbitCanMove = (newPosition) => {
    const NEXT_POSITION = CURRENT_MATRIX[newPosition[X]][newPosition[Y]];
    if(CHARACTERS[RABBIT_CELL].canMove.includes(NEXT_POSITION)){
      return true;
    }
  }

  const getRabbitNewPosition = (currentPosition, direction) => {
    const STEP_ON_X = multiply(currentPosition[X], MOVE_DIRECTION[direction][X]);
    const STEP_ON_Y = multiply(currentPosition[Y], MOVE_DIRECTION[direction][Y]);
    const NEW_X = multiply(PLAYFIELD_SIZE, STEP_ON_X) % PLAYFIELD_SIZE;
    const NEW_Y = multiply(PLAYFIELD_SIZE, STEP_ON_Y) % PLAYFIELD_SIZE;
    const POSITION = Array.of(NEW_X, NEW_Y);
    return POSITION;
  }

  const updateRabbitPosition = (event) => {
    const DIRECTION = event.target.className;
    const CURRENT_POSITION = getCharactersCurrentPosition(RABBIT_CELL)[X];
    getRabbitNewPosition(CURRENT_POSITION, DIRECTION);
    const NEW_POSITION = getRabbitNewPosition(CURRENT_POSITION, DIRECTION); 
    if(rabbitCanMove(NEW_POSITION)){
      return {
        CURRENT_POSITION,
        NEW_POSITION
      }
    }
  }

  const determineNearestPosition = ({DISTANCES, POSITIONS}) => POSITIONS[DISTANCES.indexOf(Math.min(...DISTANCES))];

  const getClosestDistance = (position, wolfPosition) => {
    const CURRENT_POSITION = wolfPosition;
    const NEW_POSITION = determineNearestPosition(position);
    return {
      CURRENT_POSITION,
      NEW_POSITION
    }
  }

  const calculateDistance = (newWolf, newRabbit) => Math.sqrt((newWolf[X] - newRabbit.NEW_POSITION[X])**2 + (newWolf[Y] - newRabbit.NEW_POSITION[Y])**2);

  const getWolfsNewPosition = (rabbitPosition, wolfPosition) => {
    const DISTANCES = new Array(0);
    const POSITIONS = new Array(0);
    DIRECTION_MOVEMENT.forEach(direction => {
      const NEW_X = multiply(wolfPosition[X], direction[X]);
      const NEW_Y = multiply(wolfPosition[Y], direction[Y]);
      const WOLF_NEW_POSITION = Array.of(NEW_X, NEW_Y);
      if(wolfCanMove(WOLF_NEW_POSITION)){
        const DISTANCE = calculateDistance(WOLF_NEW_POSITION, rabbitPosition); 
        DISTANCES.push(DISTANCE); 
        POSITIONS.push(WOLF_NEW_POSITION);
      }
    })
    return {
      DISTANCES,
      POSITIONS
    }
  }

  const updateWolvesPositions = (rabbitPosition) => { 
    getCharactersCurrentPosition(WOLF_CELL).forEach(currentPosition => {
      if(rabbitPosition){
        const WOLFS_NEW_POSITION = getWolfsNewPosition(rabbitPosition, currentPosition); 
        const WOLF_NEAREST_POSITION = getClosestDistance(WOLFS_NEW_POSITION, currentPosition);
        return moveCharacter(WOLF_CELL, WOLF_NEAREST_POSITION);
      }
    })
  }
  
  const wolfCanMove = (newPosition) => {
    if(newPosition[X] < 0 || newPosition[Y] < 0 || newPosition[X] > (PLAYFIELD_SIZE - 1) || newPosition[Y] > (PLAYFIELD_SIZE - 1)){
      return false;
    }
    const WOLF_NEXT_POSITION = CURRENT_MATRIX[newPosition[X]][newPosition[Y]];
    if(CHARACTERS[WOLF_CELL].canMove.includes(WOLF_NEXT_POSITION)){
      return true;
    }
  }

  const isRabbitWin = () => { // 
    if(!CURRENT_MATRIX.some(el => el.includes(HOUSE_CELL))){
      return true;
    }
  }

  const isWolvesWin = () => {
    if(!CURRENT_MATRIX.some(el => el.includes(RABBIT_CELL))){  
      return true;
    }
  }

  const checkGameStatus = () => {
    if(isWolvesWin()){ 
      document.getElementById(`playfield${CURRENT_ID}`).remove();
      return CURRENT_BOARD.innerHTML = `<div id="wolvesWin"> Wolves Win !</div>`;
    }else if(isRabbitWin()){
      document.getElementById(`playfield${CURRENT_ID}`).remove();
      return CURRENT_BOARD.innerHTML = `<div id="rabbitWin"> Rabbit Win !</div>`;
    }
  }

  const charactersMovement = (event) => {
    const RABBIT_NEW_POSITION = updateRabbitPosition(event, CURRENT_MATRIX);
    moveCharacter(RABBIT_CELL, RABBIT_NEW_POSITION);
    checkGameStatus();
    updateWolvesPositions(RABBIT_NEW_POSITION);
    checkGameStatus();
    const UPDATE_PLAYFIELD = makePlayfield(CURRENT_ID);
    setPlayfieldStyles(UPDATE_PLAYFIELD, PLAYFIELD_SIZE);
  }

  document.getElementById(`move-right-${CURRENT_ID}`).addEventListener('click', charactersMovement);
  document.getElementById(`move-bottom-${CURRENT_ID}`).addEventListener('click', charactersMovement);
  document.getElementById(`move-left-${CURRENT_ID}`).addEventListener('click', charactersMovement);
  document.getElementById(`move-top-${CURRENT_ID}`).addEventListener('click', charactersMovement);
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

  const NEW_BOARD_BUTTON = document.querySelector('.new-board-btn');
  const BOARD_FIELD = document.querySelector('.board-field');
  const RELOAD_BTN = document.querySelector(".reload-btn");

  NEW_BOARD_BUTTON.addEventListener("click", () => {
    makeGame(BOARD_FIELD);
  });
  
  RELOAD_BTN.addEventListener('click', () => {
    location.reload();
  })

  const START_GAME = makeGame(BOARD_FIELD);
}