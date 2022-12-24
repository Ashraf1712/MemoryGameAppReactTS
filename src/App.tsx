import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { random, result, shuffle } from 'lodash'

type TCell = {
  row: number;
  column: number;
}

function App() {

  const rows = 3;
  const cols = 4;
  let cards: number[][] = [];
  let counterTerminator = 0, counter = 0;

  for (var i = 0; i < rows; i++) {
    cards[i] = [];
    for (var j = 0; j < cols; j++) {
      //set first row 0,0,1,1
      cards[i][j] = counter;
      counterTerminator++;
      if (counterTerminator >= 2) {
        counterTerminator = 0;
        counter++;
      }
    }
    counterTerminator = 0;
  }

  const shuffleCard = (array: number[][]) => {
    var rand_row = 0, rand_col = 0, temp = 0;
    for (var i = 0; i < rows; i++){
      for (var j = 0; j < cols; j++){
        rand_row = (random() * 90) % rows;
        rand_col = (random() * 90) % cols;

        temp = array[i][j];
        array[i][j] = array[rand_row][rand_col];
        array[rand_row][rand_col] = temp;
      }
    }
    return array;
  }

  const [grid, setGrid] = useState(
    shuffleCard(cards),    
  );
  const [revealedGrid, setRevealedGrid] = useState(
    new Array(grid.length).fill('')
      .map(() => new Array(grid[0].length).fill(false))
  );
  const [previousClicked, setPreviousClicked] = useState<TCell | undefined>();
  const [disabled, setDisabled] = useState(false);

  function handleCardClicked(rowIndex: number, colIndex: number) {
    if (revealedGrid[rowIndex][colIndex]) return;
    const clickedNumber = grid[rowIndex][colIndex];
    const newRevealedGrid = [...revealedGrid];
    newRevealedGrid[rowIndex][colIndex] = true;
    setRevealedGrid(newRevealedGrid);

    
    if (previousClicked && !disabled) {
      const previousClickedNumber = grid[previousClicked.row][previousClicked?.column];
      if (previousClickedNumber !== clickedNumber) {
        setDisabled(true);
        setTimeout(() => {
          newRevealedGrid[rowIndex][colIndex] = false;
          newRevealedGrid[previousClicked.row][previousClicked.column] = false;
          setRevealedGrid([...newRevealedGrid])
        }, 1000);
      } else {
        const hasWon = revealedGrid.flat().every((isRevealed) => isRevealed);
        if (hasWon) {
          setTimeout(() => {
            alert("You Won!");
          },70)
          
        }
      }
      setTimeout(() => {
        setDisabled(false);
      },1000)
      setPreviousClicked(undefined);
    } else {
      setPreviousClicked({
        row: rowIndex,
        column: colIndex,
      });
    }
  }
  
  return (
    <div className="App">
      <div className='grid'>
      {
        grid.map((row, rowIndex) => {
          return <div key={rowIndex} className='row'>
            {
              row.map((number, colIndex) => (
                <div onClick={() => disabled ? "" : handleCardClicked(rowIndex, colIndex)}
                  key={colIndex}
                  className={"card " + (revealedGrid[rowIndex][colIndex] ? "revealed" : "")}>
                  {revealedGrid[rowIndex][colIndex] ? number : " "}
                </div>
                ))
            }
          </div>
        })}
      </div>
    </div>
  )
}

export default App
