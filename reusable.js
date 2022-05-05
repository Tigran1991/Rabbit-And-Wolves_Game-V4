const REUSABLE = {
    createInitialMatrix : (size) => {
        const MATRIX = new Array(size)
          .fill(0)
          .map(() => new Array(size).fill(0));
        return MATRIX;
    },
      
    generateCurrentId : () => Math.floor(Math.random() * 100000),
      
    setAttributes : (fieldsName, fieldsClassName, fieldsIdName) => { 
        fieldsName.setAttribute('class', fieldsClassName);
        fieldsName.setAttribute('id', fieldsIdName);
        return fieldsName;
    },
      
    makeButtonsDivElements : (buttonsDiv, id) => {
        buttonsDiv.innerHTML = `
            <button class='move-right' id='move-right-${id}'></button>
            <button class='move-bottom' id='move-bottom-${id}'></button>
            <button class='move-left' id='move-left-${id}'></button>
            <button class='move-top' id='move-top-${id}'></button> `;
        return buttonsDiv; 
    },
      
    setBoardStyles : (currentBoard, size) => {
        currentBoard.style.width = `${( size + 1) * CELL_WIDTH}px`;
        currentBoard.style.height = `${(( size  + 1) * CELL_WIDTH) + (CELL_WIDTH / 2)}px`;
    },
      
    setButtonsDivStyles : (currentButtonsDiv, size) => {
        currentButtonsDiv.style.top = `${ size * CELL_WIDTH + (CELL_WIDTH / 2)}px`;
    },
      
    setPlayfieldStyles : (currentPlayfield, size) => {
        currentPlayfield.style.width = `${size * CELL_WIDTH}px`;;
    },
      
    removeDocumentsElement : (fieldsIdName) => {
        if(document.getElementById(`playfield${fieldsIdName}`) !== null){
            document.getElementById(`playfield${fieldsIdName}`).remove();
        }
    },
      
    drawMatrix : (matrix, obj, playfield) => {
        matrix.forEach((arr) => { 
          arr.forEach((arrayItem) => {
            const CELL = document.createElement('div');
                CELL.setAttribute('class', 'FREE_CELLCell');
                const ITEM = document.createElement('img');
                    if(arrayItem !== FREE_CELL_CELL){
                        ITEM.src = obj[arrayItem].url;
                        playfield.appendChild(ITEM);
                    }else{
                        playfield.appendChild(CELL);
                }
            })
        })  
    },
      
    multiply : (a, b) => a + b
      
}