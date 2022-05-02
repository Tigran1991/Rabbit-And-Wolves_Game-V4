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

const makeGame = (mainField) => {

  const getPLAYFIELD_SIZE = () => parseInt(document.getElementById('select-size').value);
  const PLAYFIELD_SIZE = getPLAYFIELD_SIZE();

  const CHARACTERS = {
    'freeCell': 0,
    'rabbitCell': {
      code: 1,
      characterCount : 1,
      canMove: [FREE_CELL, WOLF_CELL, HOUSE_CELL],
    },
    'wolfCell': {
      code: 2,
      characterCount : (PLAYFIELD_SIZE * 40) / 100,
      canMove: [FREE_CELL, RABBIT_CELL],
    },
    'houseCell': {
      code: 3,
      characterCount : 1,
    },
    'fenceCell': {
      code: 4,
      characterCount : (PLAYFIELD_SIZE * 40) / 100,
    },
  };

  const CHARACTERS_NAMES = Object.keys(CHARACTERS);

  //1. Creating matrix

  const createInitialMatrix = (size) => {
    const MATRIX = new Array(size)
      .fill(0)
      .map(() => new Array(size).fill(0));
    return MATRIX;
  }
  
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
        matrix[m][n] = CHARACTERS[character].code;
      }
    }
    return matrix;
  }
  
  const CURRENT_MATRIX = setCharacterOnPlayfield(createInitialMatrix(PLAYFIELD_SIZE));

  //2.Making BOARD for PLAYFIELD and Buttons field for every side button

  const generateCurrentId = () => Math.floor(Math.random() * 100000);
  const CURRENT_ID = generateCurrentId();

  const makeGameFields = (fieldsName, fieldsClassName, fieldsIdName) => {
    fieldsName.setAttribute('class', fieldsClassName);
    fieldsName.setAttribute('id', fieldsIdName);
    return fieldsName;
  }
  
  const makeBoard = (fieldsIdName, mainField) => {
    const BOARD = document.createElement('div');
    makeGameFields(BOARD, 'board', `board${fieldsIdName}`);
    BOARD.style.width = `${(PLAYFIELD_SIZE + 1) * CELL_WIDTH}px`;
    BOARD.style.height = `${((PLAYFIELD_SIZE  + 1) * CELL_WIDTH) + (CELL_WIDTH / 2)}px`;
    mainField.appendChild(BOARD);

    const MOVEEMENT_BUTTONS = document.createElement('div');
    makeGameFields(MOVEEMENT_BUTTONS, 'side-buttons', `side-buttons${fieldsIdName}`)
    MOVEEMENT_BUTTONS.style.top = `${PLAYFIELD_SIZE * CELL_WIDTH + (CELL_WIDTH / 2)}px`;
    MOVEEMENT_BUTTONS.innerHTML = `
      <button id='move-right'></button>
      <button id='move-bottom'></button>
      <button id='move-left'></button>
      <button id='move-top'></button> `;
    BOARD.appendChild(MOVEEMENT_BUTTONS);

    return BOARD;
  }
  
  const makePlayfield = () =>{
    const PLAYFIELD = document.createElement('div');
    PLAYFIELD.setAttribute('class', 'playfield');
    PLAYFIELD.style.width = `${PLAYFIELD_SIZE * CELL_WIDTH}px`;
    CURRENT_BOARD.appendChild(PLAYFIELD);

    const createItem = (itemName, className) => {
      itemName = document.createElement('div');
      itemName.classList.add(className);
      PLAYFIELD.appendChild(itemName);
    }
    
    const addCharacters = (arrayItem) => {
      createItem(CHARACTERS_NAMES[arrayItem], CHARACTERS_NAMES[arrayItem]);
    }
  
    CURRENT_MATRIX.forEach((arr) => {
      arr.forEach((arrayItem) => {
        addCharacters(arrayItem);
      });
    });
  }
  
  const CURRENT_BOARD = makeBoard(CURRENT_ID, mainField);
  const CURRENT_PLAYFIELD = makePlayfield(CURRENT_MATRIX, CURRENT_BOARD);

  const getCharactersCurrentPosition = (character) => { // function that return array of character current position
    const POSITION_STORAGE = new Array(0);   // that we pas like argument
    CURRENT_MATRIX.forEach(arr => {
      for(let i = 0; i < arr.length; i++){
        if(arr[i] == character){
          posX = CURRENT_MATRIX.indexOf(arr);
          posY = i;
          POSITION_STORAGE.push([posX, posY]);
        }
      }
    })
    return POSITION_STORAGE;
  }

  const moveCharacter = (character, characterPosition) => {  // function that getting old և new positions of character
    if(characterPosition){                                   //  and makes change on matrix
      CURRENT_MATRIX[posX].splice(posY, 1, FREE_CELL);
      CURRENT_MATRIX[characterPosition.newPosition[X]].splice(characterPosition.newPosition[Y], 1, character);
    }
  }

  const rabbitCanMove = (newPosition) => {
    const NEXT_POSITION = CURRENT_MATRIX[newPosition[X]][newPosition[Y]];
    if(CHARACTERS.rabbitCell.canMove.includes(NEXT_POSITION)){
      return true;
    }
    return false;
  }

  const updateRabbitPosition = (event) => {
    const DIRECTION = event.target.id;
    const CURRENT_POSITION = getCharactersCurrentPosition(RABBIT_CELL)[X];

    const getRabbitNewPosition = (currentPosition, direction) => {
      const STEP_ON_X = currentPosition[X] + MOVE_DIRECTION[direction][X];
      const STEP_ON_Y = currentPosition[Y] + MOVE_DIRECTION[direction][Y];
      const NEW_X = (PLAYFIELD_SIZE + STEP_ON_X) % PLAYFIELD_SIZE;
      const NEW_Y = (PLAYFIELD_SIZE + STEP_ON_Y) % PLAYFIELD_SIZE;
      const POSITION = Array.of(NEW_X, NEW_Y);
      return POSITION;
    }
    
    const newPosition = getRabbitNewPosition(CURRENT_POSITION, DIRECTION);

    if(rabbitCanMove(newPosition)){
      return {
        newPosition
      }
    }
  }

  const determineNearestPosition = ({DISTANCES, POSITIONS}) => POSITIONS[DISTANCES.indexOf(Math.min(...DISTANCES))];

  const getClosestDistance = (position) => {
    const newPosition = determineNearestPosition(position);
    return {
      newPosition
    }
  }

  const calculateDistance = (newWolf, newRabbit) => Math.sqrt((newWolf[X] - newRabbit.newPosition[X])**2 + (newWolf[Y] - newRabbit.newPosition[Y])**2);

  const getWolfsNewPosition = (rabbitPosition) => {
    const DISTANCES = new Array(0);
    const POSITIONS = new Array(0);
    DIRECTION_MOVEMENT.forEach(direction => {  
      const NEW_X = posX + direction[X];
      const NEW_Y = posY + direction[Y];
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
      [posX, posY] = currentPosition;
      if(rabbitPosition){
        const WOLFS_NEW_POSITION = getWolfsNewPosition(rabbitPosition);
        const WOLF_NEW_POSITION = getClosestDistance(WOLFS_NEW_POSITION);
        moveCharacter(WOLF_CELL, WOLF_NEW_POSITION);
      }
    })
  }
  
  const wolfCanMove = (newPosition) => {
    if(newPosition[X] < 0 || newPosition[Y] < 0 || newPosition[X] > (PLAYFIELD_SIZE - 1) || newPosition[Y] > (PLAYFIELD_SIZE - 1)){
      return false;
    }
    const WOLF_NEXT_POSITION = CURRENT_MATRIX[newPosition[X]][newPosition[Y]];
    if(CHARACTERS.wolfCell.canMove.includes(WOLF_NEXT_POSITION)){
      return true;
    }
  }

  const isRabbitWin = () => {
    const CURRENT_POSITION = getCharactersCurrentPosition(HOUSE_CELL);
    if(!CURRENT_POSITION.length){
      CURRENT_BOARD.innerHTML = `<div id="rabbitWin"> Rabbit Win !</div>`
      return true;
    }else{
      return false;
    }
  }

  const isWolvesWin = () => {
    const CURRENT_POSITION = getCharactersCurrentPosition(RABBIT_CELL);
    if(!CURRENT_POSITION.length){
      CURRENT_BOARD.innerHTML = `<div id="wolvesWin"> Wolves Win !</div>`;
      return true;
    }else{
      return false;
    }
  }

  const charactersMovement = (event) => {
    const RABBIT_NEW_POSITION = updateRabbitPosition(event, CURRENT_MATRIX);
    console.log(RABBIT_NEW_POSITION)
    moveCharacter(RABBIT_CELL, RABBIT_NEW_POSITION);
    if(!isRabbitWin()){
      updateWolvesPositions(RABBIT_NEW_POSITION);
      isWolvesWin();
    }
    makePlayfield(CURRENT_BOARD);
  }

  document.getElementById(`side-buttons${CURRENT_ID}`).addEventListener('click', charactersMovement);
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