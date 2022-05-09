const REUSABLE = {

  showNewGamePage : (showField) => {
    showField.innerHTML = `
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
  },

  getPlayfieldSize : () => parseInt(document.getElementById('select-size').value),
      
  generateCurrentId : () => Math.floor(Math.random() * 100000),
    
  setAttributes : (div, className, id) => {
    div.setAttribute('class', className);
    div.setAttribute('id', id);
    return div;
  },

  compose : (...fns) => (x) => fns.reduceRight((res, fn) => fn(res), x),
      
  add : (summableA, sumableB) => summableA + sumableB,
      
  isEqual : (comparableA, comparableB) => comparableA[X] == comparableB[X] && comparableB[Y] == comparableB[Y],
      
  determineAdjacentPosition : (position, direction) => {
    const STEP_ON_X = REUSABLE.add(position[X], direction[X]);
    const STEP_ON_Y = REUSABLE.add(position[Y], direction[Y]);
    return Array.of(STEP_ON_X, STEP_ON_Y);
  },
      
  calculateDistance : (wolfNewPosition, rabbitNewPosition) => {
    const [POSITION_X, POSITION_Y] = rabbitNewPosition.NEW_POSITION;
    return Math.sqrt((wolfNewPosition[X] - POSITION_X)**2 + (wolfNewPosition[Y] - POSITION_Y)**2);
  },
      
  moveCharacter : (matrix, character, positions) => {
    const [CURRENT_X, CURRENT_Y] = positions.CURRENT_POSITION;
    const [POSITION_X, POSITION_Y] = positions.NEW_POSITION;
    matrix[CURRENT_X].splice(CURRENT_Y, 1, FREE_CELL);
    matrix[POSITION_X].splice(POSITION_Y, 1, character);
  },
      
  determineNearestPosition : ({DISTANCES, POSITIONS}) => POSITIONS[DISTANCES.indexOf(Math.min(...DISTANCES))]
}