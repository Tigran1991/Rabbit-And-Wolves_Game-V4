const FREE_CELL = 0;
const RABBIT = 1;
const WOLF = 2;
const HOUSE = 3;
const FENCE = 4;

const X = 0, Y = 1;

const MOVE_DIRECTION = {
  'move-right': [0, 1],
  'move-bottom': [1, 0],
  'move-left': [0, -1],
  'move-top': [-1, 0]
}
 
const CELL_WIDTH = 60;
const DIRECTION_MOVEMENT = Object.values(MOVE_DIRECTION);
const DIRECTION_SIDES = Object.keys(MOVE_DIRECTION);

  
const createInitialMatrix = (size) => {
  const MATRIX = new Array(size)
    .fill(0)
    .map(() => new Array(size).fill(0));
  return MATRIX;
}

const generateCurrentId = () => Math.floor(Math.random() * 100000);

const setAttributes = (div, className, id) => {
  div.setAttribute('class', className);
  div.setAttribute('id', id);
  return div;
}

const makeButtonElements = (div, id) => {
  div.innerHTML = `
    <button class='move-right' id='move-right-${id}'></button>
    <button class='move-bottom' id='move-bottom-${id}'></button>
    <button class='move-left' id='move-left-${id}'></button>
    <button class='move-top' id='move-top-${id}'></button> `;
  return div; 
}

const removeDocumentsElement = (id) => {
  if(document.getElementById(`playfield${id}`) !== null){
      document.getElementById(`playfield${id}`).remove();
  }
}

const drawMatrix = (matrix, obj, playfield) => {
  matrix.forEach((row) => { 
    row.forEach((rowItem) => {
      const CELL = document.createElement('div');
      CELL.setAttribute('class', 'cell');
      const ITEM = document.createElement('img');
        if(rowItem !== FREE_CELL){
          ITEM.src = obj[rowItem].url;
          playfield.appendChild(ITEM);
        }else{
          playfield.appendChild(CELL);
        }
    })
  })
}

const compose = (...fns) => (x) => fns.reduceRight((res, fn) => fn(res), x);

const multiply = (summableA, sumableB) => summableA + sumableB;

const isEqual = (comparableA, comparableB) => comparableA[X] == comparableB[X] && comparableB[Y] == comparableB[Y];

const determineAdjacentPosition = (position, direction) => {
  const STEP_ON_X = multiply(position[X], direction[X]);
  const STEP_ON_Y = multiply(position[Y], direction[Y]);
  return Array.of(STEP_ON_X, STEP_ON_Y);
}

const getNewPosition = (size, step) => {
  const NEW_X = multiply(size, step[X]) % size;
  const NEW_Y = multiply(size, step[Y]) % size;
  return Array.of(NEW_X, NEW_Y);
}

const calculateDistance = (wolfNewPosition, rabbitNewPosition) => {
  const [POSITION_X, POSITION_Y] = rabbitNewPosition.NEW_POSITION;
  return Math.sqrt((wolfNewPosition[X] - POSITION_X)**2 + (wolfNewPosition[Y] - POSITION_Y)**2);
}

const moveCharacter = (matrix, character, positions) => {
  const [CURRENT_X, CURRENT_Y] = positions.CURRENT_POSITION;
  const [POSITION_X, POSITION_Y] = positions.NEW_POSITION;
  matrix[CURRENT_X].splice(CURRENT_Y, 1, FREE_CELL);
  matrix[POSITION_X].splice(POSITION_Y, 1, character);
}

const determineNearestPosition = ({DISTANCES, POSITIONS}) => POSITIONS[DISTANCES.indexOf(Math.min(...DISTANCES))];

const makeGame = (mainField) => {

  const getPlayfieldSize = () => parseInt(document.getElementById('select-size').value);
  const PLAYFIELD_SIZE = getPlayfieldSize();

  const CHARACTERS = {
    [RABBIT]: {
      characterCount : 1,
      canMove: [FREE_CELL, WOLF, HOUSE],
      url: './img/bunny.png'
    },
    [WOLF]: {
      characterCount : (PLAYFIELD_SIZE * 40) / 100,
      canMove: [FREE_CELL, RABBIT],
      url: './img/wolf.png',

    },
    [HOUSE]: {
      characterCount : 1,
      url: './img/house.png'
    },
    [FENCE]: {
      characterCount : (PLAYFIELD_SIZE * 40) / 100,
      url: './img/fence.png'
    },
  };

  const CHARACTERS_KEYS = Object.keys(CHARACTERS);

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
    CHARACTERS_KEYS.forEach(character => {
      for(let i = 0; i < CHARACTERS[character].characterCount; i++){
        [m, n] = getRandomPositionsForCharacter(matrix);
        matrix[m][n] = Number(character);
      }
    })
    return matrix;
  }

  const createCurrentMatrix = compose(setCharacterOnPlayfield, createInitialMatrix);
  const CURRENT_MATRIX = createCurrentMatrix(PLAYFIELD_SIZE);
  const CURRENT_ID = generateCurrentId();

  const setBoardStyles = (currentBoard) => {
    currentBoard.style.width = `${(PLAYFIELD_SIZE + 1) * CELL_WIDTH}px`;
    currentBoard.style.height = `${((PLAYFIELD_SIZE  + 1) * CELL_WIDTH) + (CELL_WIDTH / 2)}px`;
  }
  
  const setPlayfieldStyles = (currentPlayfield) => {
    currentPlayfield.style.width = `${PLAYFIELD_SIZE * CELL_WIDTH}px`;;
  }
  
  const makeBoard = (mainField) => {
    const BOARD = document.createElement('div');
    setAttributes(BOARD, 'board', `board-${CURRENT_ID}`);
    makeButtonElements(BOARD, CURRENT_ID);
    setBoardStyles(BOARD);
    mainField.appendChild(BOARD);
    return BOARD;
  }

  const makePlayfield = (mainField) =>{
    removeDocumentsElement(CURRENT_ID);
    const PLAYFIELD = document.createElement('div');
    setAttributes(PLAYFIELD, 'playfield', `playfield-${CURRENT_ID}`);
    drawMatrix(CURRENT_MATRIX, CHARACTERS, PLAYFIELD);
    setPlayfieldStyles(PLAYFIELD);
    mainField.appendChild(PLAYFIELD);
    return PLAYFIELD;
  }

  const createPlayfield = compose(makePlayfield, makeBoard);
  createPlayfield(mainField);

  const CURRENT_BOARD = document.getElementById(`board-${CURRENT_ID}`);

  const getCharactersCurrentPosition = (character) => {
    const CHARACTER_POSITION = new Array(0);
    CURRENT_MATRIX.forEach(elem => {
      if(elem.includes(character)){
        elem.filter((item, index) => {
          const elemIndex = CURRENT_MATRIX.indexOf(elem);
          if(item == character){
            CHARACTER_POSITION.push(Array.of(elemIndex, index));
          }
        })
      }
    })
    return CHARACTER_POSITION;
  }

  const determineNextPositionCharacter = (position) => {
    return CURRENT_MATRIX[position[X]][position[Y]];
  }

  const isRabbitCanMove = (position) => {
    const NEXT_POSITION_CHARACTER = determineNextPositionCharacter(position);
    if(CHARACTERS[RABBIT].canMove.includes(NEXT_POSITION_CHARACTER)){
      return true;
    }
  }

  const calculateRabbitNewPosition = (position, direction) => {
    const STEP = determineAdjacentPosition(position, MOVE_DIRECTION[direction]);
    const NEW_POSITION = getNewPosition(PLAYFIELD_SIZE, STEP);
    return NEW_POSITION;
  }

  const getRabbitNewPosition = (event) => {
    const DIRECTION = event.target.className;
    const CURRENT_POSITION = getCharactersCurrentPosition(RABBIT)[X];
    const NEW_POSITION = calculateRabbitNewPosition(CURRENT_POSITION, DIRECTION);
    if(isRabbitCanMove(NEW_POSITION) && isInRange(NEW_POSITION)){
      return {
        CURRENT_POSITION,
        NEW_POSITION
      }
    }
  }

  const updateRabbitPosition = (event) => {
    const RABBIT_NEW_POSITION = getRabbitNewPosition(event);
    if(RABBIT_NEW_POSITION){
      moveCharacter(CURRENT_MATRIX, RABBIT, RABBIT_NEW_POSITION);                               
    }
    return RABBIT_NEW_POSITION;
  }

  const getPlayfieldRange = () => {
    return [...Array(PLAYFIELD_SIZE).keys()];
  }

  const isInRange = (position) => {
    const RANGE = getPlayfieldRange();
    if(RANGE.includes(position[X]) && RANGE.includes(position[Y])){
      return true;
    }
  }
  
  const isWolfCanMove = (position) => {
    const NEXT_POSITION_CHARACTER = determineNextPositionCharacter(position);
    if(CHARACTERS[WOLF].canMove.includes(NEXT_POSITION_CHARACTER)){
      return true;
    }
  }

  const getDistancesAndPositions = (wolfPosition, rabbitPosition) => {
    const DISTANCES = new Array(0);
    const POSITIONS = new Array(0);
    DIRECTION_MOVEMENT.forEach(direction => {
      const POSITION = determineAdjacentPosition(wolfPosition, direction);
      if(isInRange(POSITION) && isWolfCanMove(POSITION) && rabbitPosition){
        const DISTANCE = calculateDistance(POSITION, rabbitPosition);
        DISTANCES.push(DISTANCE);
        POSITIONS.push(POSITION);
      }
    })
    return {
      DISTANCES,
      POSITIONS
    }
  }

  const getPositions = (wolfPosition, rabbitPosition) => {
    const CURRENT_POSITION = wolfPosition;
    const DISTANCES_AND_POSITIONS = getDistancesAndPositions(wolfPosition, rabbitPosition);
    const NEW_POSITION = determineNearestPosition(DISTANCES_AND_POSITIONS);
    return {
      CURRENT_POSITION,
      NEW_POSITION
    }
  }

  const updateWolvesPosition = (position, rabbitNewPosition) => {
    const WOLF_POSITIONS = getPositions(position, rabbitNewPosition);
    if(rabbitNewPosition && getCharactersCurrentPosition(HOUSE)[X]){
      moveCharacter(CURRENT_MATRIX, WOLF, WOLF_POSITIONS); 
    }
  }

  const updateWolvesPositions = (rabbitNewPosition, wolvesCurrentPosition) => {
    wolvesCurrentPosition.map(position => updateWolvesPosition(position, rabbitNewPosition));
  }

  const determineWinnerCharacter = () => {
    if(!getCharactersCurrentPosition(RABBIT)[X]){
      removeDocumentsElement(CURRENT_ID);
      return CURRENT_BOARD.innerHTML = `<h1 class='wolvesWin'> WOLVES WIN ! <h1>`;
    }else if(!getCharactersCurrentPosition(HOUSE)[X]){
      removeDocumentsElement(CURRENT_ID);
      return CURRENT_BOARD.innerHTML = `<h1 class='rabbitWin'> RABBIT WIN ! <h1>`;
    }
  }

  const makeCharactersMovement = (event) => {
    const WOLF_CURRENT_POSITION = getCharactersCurrentPosition(WOLF);
    const RABBIT_POSITION = updateRabbitPosition(event);
    updateWolvesPositions(RABBIT_POSITION, WOLF_CURRENT_POSITION);
    if(!determineWinnerCharacter()){
      makePlayfield(CURRENT_BOARD);
    }
  }

  const addingEventListener = () => {
    DIRECTION_SIDES.map(direction => {
      document.getElementById(`${direction}-${CURRENT_ID}`).addEventListener('click', makeCharactersMovement);
    })
  }

  addingEventListener();
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
}