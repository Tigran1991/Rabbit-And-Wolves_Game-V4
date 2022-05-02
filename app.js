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

  const createInitialMatrix = (size) => {  // Create Initial Matrix,that iclude only 0 items
    const MATRIX = new Array(size)
      .fill(0)
      .map(() => new Array(size).fill(0));
    return MATRIX;
  }
  
  const getRandomPositionsForCharacter = (matrix) => {      // function that generate random coordinates for characters
    const x = Math.floor(Math.random() * PLAYFIELD_SIZE);
    const y = Math.floor(Math.random() * PLAYFIELD_SIZE);
    if (matrix[x][y] == FREE_CELL) {
      return [x, y];
    } else {
      return getRandomPositionsForCharacter(matrix);
    }
  }
  
  const setCharacterOnPlayfield = (matrix) => {             // function that set characters on playfield 
    for(let character in CHARACTERS){
      for(let i = 0; i < CHARACTERS[character].characterCount; i++){
        [m, n] = getRandomPositionsForCharacter(matrix);
        matrix[m][n] = CHARACTERS[character].code;
      }
    }
    return matrix;
  }
  
  const initialMatrix = createInitialMatrix(PLAYFIELD_SIZE);
  const CURRENT_MATRIX = setCharacterOnPlayfield(initialMatrix);

  //2.Making BOARD for PLAYFIELD and BUTTONS field for every side button

  const generateCurrentId = () => Math.floor(Math.random() * 100000);   
  const CURRENT_ID = generateCurrentId(); // generate random Id for every field

  const makeGameFields = (fieldsName, fieldsClassName, fieldsIdName) => { // pure function that make fields
    fieldsName.setAttribute('class', fieldsClassName);
    fieldsName.setAttribute('id', fieldsIdName);
    return fieldsName;
  }
  
  const makeBoard = (fieldsIdName, mainField) => {
    const BOARD = document.createElement('div');
    makeGameFields(BOARD, 'board', `board${fieldsIdName}`);
    BOARD.style.width = `${(PLAYFIELD_SIZE + 1) * CELL_WIDTH}px`; // width for board
    BOARD.style.height = `${((PLAYFIELD_SIZE  + 1) * CELL_WIDTH) + (CELL_WIDTH / 2)}px`; // height for board
    mainField.appendChild(BOARD); // appending board in main board-field

    const MOVEMENT_BUTTONS = document.createElement('div'); // creating buttons div
    makeGameFields(MOVEMENT_BUTTONS, 'side-buttons', `side-buttons${fieldsIdName}`);
    MOVEMENT_BUTTONS.style.top = `${PLAYFIELD_SIZE * CELL_WIDTH + (CELL_WIDTH / 2)}px`;
    MOVEMENT_BUTTONS.innerHTML = `
      <button class='move-right' id='move-right-${CURRENT_ID}'></button>
      <button class='move-bottom' id='move-bottom-${CURRENT_ID}'></button>
      <button class='move-left' id='move-left-${CURRENT_ID}'></button>
      <button class='move-top' id='move-top-${CURRENT_ID}'></button> `;
    BOARD.appendChild(MOVEMENT_BUTTONS);  // appending buttons div in board

    return BOARD;
  }
  
  const makePlayfield = (fieldsIdName) =>{
    if(document.getElementById(`playfield${fieldsIdName}`) !== null){ // playfield inspection
      document.getElementById(`playfield${fieldsIdName}`).remove(); //  if playfield is availible delete it
    }
    const PLAYFIELD = document.createElement('div');  
    makeGameFields(PLAYFIELD, 'playfield', `playfield${fieldsIdName}`);
    PLAYFIELD.style.width = `${PLAYFIELD_SIZE * CELL_WIDTH}px`; // width for playfield
    CURRENT_BOARD.appendChild(PLAYFIELD); // appending playfield in board

    const createItem = (itemName, className) => { 
      itemName = document.createElement('div'); // creating div for every character
      itemName.classList.add(className);
      PLAYFIELD.appendChild(itemName);
    }
    
    const addCharacters = (arrayItem) => { 
      createItem(CHARACTERS_NAMES[arrayItem], CHARACTERS_NAMES[arrayItem]);
    }
  
    CURRENT_MATRIX.forEach((arr) => { // adding every character from matrix in playfield
      arr.forEach((arrayItem) => {
        addCharacters(arrayItem);
      });
    });
  }
  
  const CURRENT_BOARD = makeBoard(CURRENT_ID, mainField);
  const CURRENT_PLAYFIELD = makePlayfield(CURRENT_ID);

  const getCharactersCurrentPosition = (character) => { // function that return array of characters current position
    const POSITION_STORAGE = new Array(0);              // that we pas like argument
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

  const rabbitCanMove = (newPosition) => { // check is new position for rabbit is availible
    const NEXT_POSITION = CURRENT_MATRIX[newPosition[X]][newPosition[Y]];
    if(CHARACTERS.rabbitCell.canMove.includes(NEXT_POSITION)){
      return true;
    }
  }

  const updateRabbitPosition = (event) => {
    const DIRECTION = event.target.className; // getting rabbit move direction
    const CURRENT_POSITION = getCharactersCurrentPosition(RABBIT_CELL)[X]; // getting current position of rabbit

    const getRabbitNewPosition = (currentPosition, direction) => { // changing rabbit position with current direction
      const STEP_ON_X = currentPosition[X] + MOVE_DIRECTION[direction][X];
      const STEP_ON_Y = currentPosition[Y] + MOVE_DIRECTION[direction][Y];
      const NEW_X = (PLAYFIELD_SIZE + STEP_ON_X) % PLAYFIELD_SIZE;
      const NEW_Y = (PLAYFIELD_SIZE + STEP_ON_Y) % PLAYFIELD_SIZE;
      const POSITION = Array.of(NEW_X, NEW_Y);
      return POSITION;
    }
    
    const newPosition = getRabbitNewPosition(CURRENT_POSITION, DIRECTION); 

    if(rabbitCanMove(newPosition)){ // if new position is availible returning new position for character
      return {
        newPosition
      }
    }
  }

  const determineNearestPosition = ({DISTANCES, POSITIONS}) => POSITIONS[DISTANCES.indexOf(Math.min(...DISTANCES))]; // determine new position for wolf that is the nearest after rabbits move

  const getClosestDistance = (position) => { // checking closest distance from maximum 4 distances that wolf can move
    const newPosition = determineNearestPosition(position);
    return {
      newPosition
    }
  }

  const calculateDistance = (newWolf, newRabbit) => Math.sqrt((newWolf[X] - newRabbit.newPosition[X])**2 + (newWolf[Y] - newRabbit.newPosition[Y])**2); // calculate distance with Pythagoras therome

  const getWolfsNewPosition = (rabbitPosition) => { // getting new positions for every wolf
    const DISTANCES = new Array(0); // array that include all distances from rabbit after rabbit move
    const POSITIONS = new Array(0);
    DIRECTION_MOVEMENT.forEach(direction => { // checking all for directions for wolf for determinating nearest position to rabbit
      const NEW_X = posX + direction[X];
      const NEW_Y = posY + direction[Y];
      const WOLF_NEW_POSITION = Array.of(NEW_X, NEW_Y); // array for all new positions that can be maximum 4
      if(wolfCanMove(WOLF_NEW_POSITION)){ // wolf can move if probable positions is availible
        const DISTANCE = calculateDistance(WOLF_NEW_POSITION, rabbitPosition); 
        DISTANCES.push(DISTANCE); 
        POSITIONS.push(WOLF_NEW_POSITION);
      }
    })
    return {
      DISTANCES, // return all distances and positions pair in object and after determinating nearest position from rabbit new position
      POSITIONS
    }
  }

  const updateWolvesPositions = (rabbitPosition) => { 
    getCharactersCurrentPosition(WOLF_CELL).forEach(currentPosition => { // checking every wolfes position and 
      [posX, posY] = currentPosition;
      if(rabbitPosition){ // if rabbit make move that means that it have new position
        const WOLFS_NEW_POSITION = getWolfsNewPosition(rabbitPosition); 
        const WOLF_NEAREST_POSITION = getClosestDistance(WOLFS_NEW_POSITION);
        moveCharacter(WOLF_CELL, WOLF_NEAREST_POSITION);
      }
    })
  }
  
  const wolfCanMove = (newPosition) => { // checking is wolf can move
    if(newPosition[X] < 0 || newPosition[Y] < 0 || newPosition[X] > (PLAYFIELD_SIZE - 1) || newPosition[Y] > (PLAYFIELD_SIZE - 1)){
      return false;
    }
    const WOLF_NEXT_POSITION = CURRENT_MATRIX[newPosition[X]][newPosition[Y]];
    if(CHARACTERS.wolfCell.canMove.includes(WOLF_NEXT_POSITION)){
      return true;
    }
  }

  const isRabbitWin = () => { // 
    const CURRENT_POSITION = getCharactersCurrentPosition(HOUSE_CELL);
    if(!CURRENT_POSITION.length){
      return true;
    }
  }

  const isWolvesWin = () => {
    const CURRENT_POSITION = getCharactersCurrentPosition(RABBIT_CELL);
    if(!CURRENT_POSITION.length){  
      return true;
    }
  }

  const charactersMovement = (event) => { // making characters move 
    const RABBIT_NEW_POSITION = updateRabbitPosition(event, CURRENT_MATRIX);
    moveCharacter(RABBIT_CELL, RABBIT_NEW_POSITION);
    updateWolvesPositions(RABBIT_NEW_POSITION);
    if(isWolvesWin()){ 
      document.getElementById(`playfield${CURRENT_ID}`).remove();
      return CURRENT_BOARD.innerHTML = `<div id="wolvesWin"> Wolves Win !</div>`;
    }else if(isRabbitWin()){
      document.getElementById(`playfield${CURRENT_ID}`).remove();
      return CURRENT_BOARD.innerHTML = `<div id="rabbitWin"> Rabbit Win !</div>`;
    }
    makePlayfield(CURRENT_ID); // make playfield after every characters move
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