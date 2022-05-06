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

const makeButtonsDivElements = (div, id) => {
  div.innerHTML = `
    <button class='move-right' id='move-right-${id}'></button>
    <button class='move-bottom' id='move-bottom-${id}'></button>
    <button class='move-left' id='move-left-${id}'></button>
    <button class='move-top' id='move-top-${id}'></button> `;
  return div; 
}

const setBoardStyles = (currentBoard, size) => {
  currentBoard.style.width = `${( size + 1) * CELL_WIDTH}px`;
  currentBoard.style.height = `${(( size  + 1) * CELL_WIDTH) + (CELL_WIDTH / 2)}px`;
}

const setButtonsDivStyles = (currentButtonsDiv, size) => {
  currentButtonsDiv.style.top = `${size * CELL_WIDTH + (CELL_WIDTH / 2)}px`;
}

const setPlayfieldStyles = (currentPlayfield, size) => {
  currentPlayfield.style.width = `${size * CELL_WIDTH}px`;;
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
  return Math.sqrt((wolfNewPosition[X] - rabbitNewPosition.NEW_POSITION[X])**2 + (wolfNewPosition[Y] - rabbitNewPosition.NEW_POSITION[Y])**2);
}

const moveCharacter = (matrix, character, positions) => {
  matrix[(Object.values(positions)[X])[X]].splice((Object.values(positions)[X])[Y], 1, FREE_CELL);
  matrix[(Object.values(positions)[Y])[X]].splice((Object.values(positions)[Y])[Y], 1, character);
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

  //2.Making BOARD for PLAYFIELD and BUTTONS field for every side button
   
  const CURRENT_ID = generateCurrentId();
  
  const makeBoard = (mainField, id) => {
    const BOARD = document.createElement('div');
    setAttributes(BOARD, 'board', `board${id}`);
    mainField.appendChild(BOARD);
    return BOARD;
  }

  const makeButtonsDiv = (id) => {
    const MOVEMENT_BUTTONS = document.createElement('div'); 
    setAttributes(MOVEMENT_BUTTONS, 'side-buttons', `side-buttons${id}`);
    makeButtonsDivElements(MOVEMENT_BUTTONS, CURRENT_ID);
    CURRENT_BOARD.appendChild(MOVEMENT_BUTTONS);
    return MOVEMENT_BUTTONS; 
  }

  const makePlayfield = (id) =>{
    removeDocumentsElement(id);
    const PLAYFIELD = document.createElement('div');  
    setAttributes(PLAYFIELD, 'playfield', `playfield${id}`);
    drawMatrix(CURRENT_MATRIX, CHARACTERS, PLAYFIELD);
    CURRENT_BOARD.appendChild(PLAYFIELD);
    return PLAYFIELD;
  }

  const CURRENT_BOARD = makeBoard(mainField, CURRENT_ID);
  const CURRENT_BUTTONS_DIV = makeButtonsDiv(CURRENT_ID);
  const CURRENT_PLAYFIELD = makePlayfield(CURRENT_ID);

  // const CURRENT_PLAYFIELD = compose(makePlayfield, makeButtonsDiv, makeBoard, CURRENT_ID);
  // console.log(CURRENT_PLAYFIELD);

  setBoardStyles(CURRENT_BOARD, PLAYFIELD_SIZE);
  setButtonsDivStyles(CURRENT_BUTTONS_DIV, PLAYFIELD_SIZE);
  setPlayfieldStyles(CURRENT_PLAYFIELD, PLAYFIELD_SIZE);

  const getCharactersCurrentPosition = (character) => {
    const CHARACTER_POSITION = new Array(0);
    CURRENT_MATRIX.forEach(elem => {
      if(elem.includes(character)){
        elem.filter((item, index) => {
          const elemIndex = CURRENT_MATRIX.indexOf(elem);
          if(item == character){
            CHARACTER_POSITION.push(Array.of(elemIndex, index));
          }
        });
      };
    });
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

  const isInRange = (position) => {
    position.forEach(coordinate => {
      if(position[X] >= 0 && position[X] <PLAYFIELD_SIZE){
        return true;
      }
    })
  }
  
  const isWolfCanMove = (position) => {
    const NEXT_POSITION_CHARACTER = determineNextPositionCharacter(position);
    if(CHARACTERS[WOLF].canMove.includes(NEXT_POSITION_CHARACTER)){
      return true;
    }
  }

  const determineAdjacentPosition = (position, direction) => {
    const STEP_ON_X = multiply(position[X], direction[X]);
    const STEP_ON_Y = multiply(position[Y], direction[Y]);
    return Array.of(STEP_ON_X, STEP_ON_Y);
  }

  const getDistancesAndPositions = (wolfPosition, rabbitPosition) => {
    const DISTANCES = new Array(0);
    const POSITIONS = new Array(0);
    DIRECTION_MOVEMENT.forEach(direction => {
      const POSITION = determineAdjacentPosition(wolfPosition, direction);
      if(isWolfCanMove(POSITION) && rabbitPosition){
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
    const WOLF_CURRENT_POSITION = wolfPosition;
    const DISTANCES_AND_POSITIONS = getDistancesAndPositions(wolfPosition, rabbitPosition);
    const WOLF_NEW_POSITION = determineNearestPosition(DISTANCES_AND_POSITIONS);
    return {
      WOLF_CURRENT_POSITION,
      WOLF_NEW_POSITION
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
      const CURRENT_PLAYFIELD = makePlayfield(CURRENT_ID);
    setPlayfieldStyles(CURRENT_PLAYFIELD, PLAYFIELD_SIZE);
    }
  }

  document.getElementById(`move-right-${CURRENT_ID}`).addEventListener('click', makeCharactersMovement);
  document.getElementById(`move-bottom-${CURRENT_ID}`).addEventListener('click', makeCharactersMovement);
  document.getElementById(`move-left-${CURRENT_ID}`).addEventListener('click', makeCharactersMovement);
  document.getElementById(`move-top-${CURRENT_ID}`).addEventListener('click', makeCharactersMovement);
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