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

const makeGame = (mainField) => {

  const PLAYFIELD_SIZE = REUSABLE.getPlayfieldSize();

  const CHARACTERS = {
    [RABBIT]: {
      name: 'RABBIT',
      characterCount : 1,
      canMove: [FREE_CELL, WOLF, HOUSE],
      url: './img/bunny.png'
    },
    [WOLF]: {
      name: 'WOLF',
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

  const createInitialMatrix = () => {
    const MATRIX = new Array(PLAYFIELD_SIZE)
      .fill(0)
      .map(() => new Array(PLAYFIELD_SIZE).fill(0));
    return MATRIX;
  };

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

  const createCurrentMatrix = REUSABLE.compose(setCharacterOnPlayfield, createInitialMatrix);
  const CURRENT_MATRIX = createCurrentMatrix();
  const CURRENT_ID = REUSABLE.generateCurrentId();

  const setBoardStyles = (currentBoard) => {
    currentBoard.style.width = `${(PLAYFIELD_SIZE + 1) * CELL_WIDTH}px`;
    currentBoard.style.height = `${((PLAYFIELD_SIZE  + 1) * CELL_WIDTH) + (CELL_WIDTH / 2)}px`;
  };
  
  const setPlayfieldStyles = (currentPlayfield) => {
    currentPlayfield.style.width = `${PLAYFIELD_SIZE * CELL_WIDTH}px`;
  };

  const drawMatrix = (playfield) => {
    CURRENT_MATRIX.forEach((row) => { 
      row.forEach((rowItem) => {
        const CELL = document.createElement('div');
        CELL.setAttribute('class', 'cell');
        const ITEM = document.createElement('img');
           if(rowItem !== FREE_CELL){
              ITEM.src = CHARACTERS[rowItem].url;
            playfield.appendChild(ITEM);
          }else{
            playfield.appendChild(CELL);
          }
        })
    })
  };

  const makeButtonElements = (div) => {
    div.innerHTML = `
      <button class='move-right' id='move-right-${CURRENT_ID}'></button>
      <button class='move-bottom' id='move-bottom-${CURRENT_ID}'></button>
      <button class='move-left' id='move-left-${CURRENT_ID}'></button>
      <button class='move-top' id='move-top-${CURRENT_ID}'></button> `;
    return div; 
  };

  const removeDocumentsElement = () => {
    if(document.getElementById(`playfield${CURRENT_ID}`) !== null){
        document.getElementById(`playfield${CURRENT_ID}`).remove();
    }
  };

  const makeBoard = (mainField) => {
    const BOARD = document.createElement('div');
    REUSABLE.setAttributes(BOARD, 'board', `board-${CURRENT_ID}`);
    makeButtonElements(BOARD);
    setBoardStyles(BOARD);
    mainField.appendChild(BOARD);
    return BOARD;
  }

  const makePlayfield = (mainField) =>{
    removeDocumentsElement();
    const PLAYFIELD = document.createElement('div');
    REUSABLE.setAttributes(PLAYFIELD, 'playfield', `playfield-${CURRENT_ID}`);
    drawMatrix(PLAYFIELD);
    setPlayfieldStyles(PLAYFIELD);
    mainField.appendChild(PLAYFIELD);
    return PLAYFIELD;
  }

  const createPlayfield = REUSABLE.compose(makePlayfield, makeBoard);
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

  const moveCharacter = (character, positions) => {
    const [CURRENT_X, CURRENT_Y] = positions.CURRENT_POSITION;
    const [POSITION_X, POSITION_Y] = positions.NEW_POSITION;
    CURRENT_MATRIX[CURRENT_X].splice(CURRENT_Y, 1, FREE_CELL);
    CURRENT_MATRIX[POSITION_X].splice(POSITION_Y, 1, character);
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

  const getNewPosition = (step) => {
    const NEW_X = REUSABLE.add(PLAYFIELD_SIZE, step[X]) % PLAYFIELD_SIZE;
    const NEW_Y = REUSABLE.add(PLAYFIELD_SIZE, step[Y]) % PLAYFIELD_SIZE;
    return Array.of(NEW_X, NEW_Y);
  };

  const calculateRabbitNewPosition = (position, direction) => {
    const STEP = REUSABLE.determineAdjacentPosition(position, MOVE_DIRECTION[direction]);
    const NEW_POSITION = getNewPosition(STEP);
    return NEW_POSITION;
  }

  const getRabbitPositions = (event) => {
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

  const updateRabbitPosition = (position) => {
    if(position){
      moveCharacter(RABBIT, position);                               
    }
  }

  const getRabbitNewPosition = (event) => {
    const RABBIT_POSITIONS = getRabbitPositions(event);
    const RABBIT_NEW_POSITION = RABBIT_POSITIONS.NEW_POSITION;
    updateRabbitPosition(RABBIT_POSITIONS);
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
      const POSITION = REUSABLE.determineAdjacentPosition(wolfPosition, direction);
      if(isInRange(POSITION) && isWolfCanMove(POSITION) && rabbitPosition){
        const DISTANCE = REUSABLE.calculateDistance(POSITION, rabbitPosition);
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
    const NEW_POSITION = REUSABLE.determineNearestPosition(DISTANCES_AND_POSITIONS);
    return {
      CURRENT_POSITION,
      NEW_POSITION
    }
  }

  const updateWolfPosition = (position, rabbitNewPosition) => {
    const WOLF_POSITIONS = getPositions(position, rabbitNewPosition);
    if(!WOLF_POSITIONS.NEW_POSITION){
      WOLF_POSITIONS.NEW_POSITION = WOLF_POSITIONS.CURRENT_POSITION;
    }else if(rabbitNewPosition && getCharactersCurrentPosition(HOUSE)[X]){
      moveCharacter(WOLF, WOLF_POSITIONS);
    }
  }

  const updateWolvesPositions = (rabbitNewPosition, wolvesCurrentPosition) => {
    wolvesCurrentPosition.map(position => updateWolfPosition(position, rabbitNewPosition));
  }

  const determineWinnerCharacter = () => {
    if(!getCharactersCurrentPosition(RABBIT)[X]){
      return CHARACTERS[WOLF].name;
    }else if(!getCharactersCurrentPosition(HOUSE)[X]){
      return CHARACTERS[RABBIT].name;
    }
  }
  
  const displayWinnerCharacter = () => {
    const winnerCharacter = determineWinnerCharacter();
    CURRENT_BOARD.innerHTML = `<h1 class='winner'> ${winnerCharacter} WIN ! <h1>`;
  }
  
  const decideGameCourse = () => {
    if(!determineWinnerCharacter()){
      makePlayfield(CURRENT_BOARD);
    }else{
      displayWinnerCharacter();
    }
  }

  const makeCharactersMovement = (event) => {
    const WOLF_CURRENT_POSITION = getCharactersCurrentPosition(WOLF);
    const RABBIT_POSITION = getRabbitNewPosition(event);
    updateWolvesPositions(RABBIT_POSITION, WOLF_CURRENT_POSITION);
    decideGameCourse();
  }

  const addingEventListener = () => {
    DIRECTION_SIDES.map(direction => {
      document.getElementById(`${direction}-${CURRENT_ID}`).addEventListener('click', makeCharactersMovement);
    })
  }

  addingEventListener();
}

const newGame = () => {
  const  CONTAINER = document.getElementById('container');
  REUSABLE.showNewGamePage(CONTAINER);

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