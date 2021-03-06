// gameboard module
var gameBoard = (() => {
    // private variables
    var winner = 0; // 0 = awaiting winner, 1 = player 1, 2 = player 2, -1 = tie
    var availableMoves = [1,2,3,4,5,6,7,8,9];

    
    // private methods

    return {
        // public methods 
        getMoves: function(player) {
            // gets moves a player has made 
        },

        movesLeft: function() {
            // gets availableMoves
            return availableMoves;
        },

        clearBoard: function () {
            // reset board, set availableMoves to start, set playerA and B moves = empty
            let myGameBoard = document.getElementById('game-board');
            let myGrid = document.getElementsByClassName('game-board-grid');

            for (i = 0; i < 9; i++) {
                myGrid[i].textContent = "";
            }
            return;
        },

        getWinner: function() {
            // gets winner 
            return winner;
        }

    }
})();


// gameController module
var gameController = (function () {
    // private variables

    let gameActive = true; // pause the game in case of an end-game scenario
    let currentPlayer = "X"; // store current player here, so we know whos turn it is
    let gameState = ["","","","","","","","",""]  // store current game state here, the form of empty strings will let us easily track played cells & validate game state
    let playerTurnDisplay = document.getElementById("current-player-display");

    var playerAMoves = [];
    var playerBMoves = [];
    let moveCount = 0;
    let winner = "";
    let playerAScore = 0;
    let playerBScore = 0;
    let matchWinner = "";
    let numRounds = 0;

    // endgame messages
    const winningMessage = () => {`Player ${currentPlayer} is the winner!`};
    const drawMessage = () => {`It's a draw!`};

    return {

        declareWinner: function (winner) {
            alert(`Player ${winner} is the winner!`);
            alert('Click Start to start a new round.');
            if (winner == 'X') {
                playerAScore++;
            } else if (winner == 'O') {
                playerBScore++;
            }
            numRounds++;


            // there's only 5 rounds per game
            if (numRounds == 5) {
                // determine overall game winner
                if (playerAScore > playerBScore) {
                    alert('Player 1 is the winner! Click Reset to start a new game.');
                } else if (playerBScore > playerAScore) {
                    alert('Player 2 is the winner! Click Reset to start a new game.') 
                } else if (playerBScore == playerAScore) {
                    alert('It\'s a tie! Click Reset to start a new game.')
                }
            }
        },

        newMoveClickHandler: function (e) {
            // sets a move for a player
            let space = document.getElementById(e.target.id).textContent;
            let spaceNum = document.getElementById(e.target.id).id;
            // validate move is possible on the board
            if ( space  == 'X' || space == 'O') {
                alert('That space is unavailable.')
            } // validate the move hasn't been made
                else if (playerAMoves.find(num => num == spaceNum) || playerBMoves.find(num => num == spaceNum)) {
                    alert("That move has been made already.")
                }

            else {
                if (currentPlayer == "X") {
                    document.getElementById(e.target.id).textContent = "X";
                } else if (currentPlayer == "O") { 
                    document.getElementById(e.target.id).textContent = "O";
                }
                this.makeMove(spaceNum);
                this.updateDisplay();
            }   
        },

        updateDisplay: function () {
            // update display in HTML
            // div with id according to each player's moves with .textContent = X or O or ""
            playerTurnDisplay.textContent = (`It's ${currentPlayer}'s turn. :)`);
            document.getElementById('p1-score').textContent = `${playerAScore}`;
            document.getElementById('p2-score').textContent = `${playerBScore}`;
        },  


        // public methods

        startGame: function(e) {
            gameBoard.clearBoard();
            this.gamePlay();
            playerAMoves = [];
            playerBMoves = [];
            document.getElementById('p1-score').textContent = `${playerAScore}`;
            document.getElementById('p2-score').textContent = `${playerBScore}`;
        },

        resetGame: function () {
            playerAScore = 0;
            playerBScore = 0;
            this.startGame;
            numRounds = 0;
        },

        makeMove: function (spaceNum) {
            // register the move 
            if (currentPlayer == 'X') {
                playerAMoves.push(spaceNum);
            } else if (currentPlayer == 'O') {
                playerBMoves.push(spaceNum);
            }
            moveCount++;

            // check endgame
            this.checkEndgame(currentPlayer);

            // switch players
            if (currentPlayer == 'X') {
                currentPlayer = 'O' 
            } else if (currentPlayer == 'O') {
                currentPlayer = 'X'
            }
            
        },

        checkEndgame: function (player) {
            // check for endgame
                // did someone win?
                let winningSet = [
                    // array of winning combos
                    [1,2,3],
                    [4,5,6],
                    [7,8,9],
                    [1,5,9],
                    [1,4,7],
                    [2,5,8],
                    [3,5,7]
                ]
            
                let count = 0;
                if (player == 'X') {
                    winningSet.forEach( (set) => {
                        for (i = 0; i < playerAMoves.length; i++) {
                        if (set.find(num => num == playerAMoves[i])) {
                            count++;
                        } 

                        // if 3 moves map to a set, that's a win
                        if (count >= 3) {
                            this.declareWinner(player);
                            winner = player;
                        }
                    } 
                    count = 0;
                  }) 
                } else if (player == 'O') {
                    winningSet.forEach( (set) => {
                        for (i = 0; i < playerBMoves.length; i++) {
                        if (set.find(num => num == playerBMoves[i])) {
                            count++;
                        } 

                        // if 3 moves map to a set, that's a win
                        if (count >= 3) {
                            this.declareWinner(player);
                            winner = player;
                        }
                    } 
                    count = 0;
                  }) 
                }
                
                // is it a draw
                if (moveCount == 9 && (winner == "") ) { 
                    alert("It's a draw!");
                }


            // a move was made -> update game state 
            // gameState[moveCount - 1] = "_"; // signals a move was made up to moveCount
            
        },

        gamePlay: function () {
            // gameplay controls. 

            // start game 
                gameBoard.clearBoard();
                currentPlayer = "X"; // player 1 starts
                this.updateDisplay(); // update the display of the board 
        },
    }
})();

gameBoard.clearBoard();

// event listeners
// listen for player click on a game-board-grid and if they do call gameBoard.newMoveClickHandler(player, id)
for (i=1; i<=9; i++) {
    document.getElementById(`${i}`).addEventListener('click', (e) => { 
        gameController.newMoveClickHandler(e)   
    });
    console.log(document.getElementById(`${i}`));
}


// start button -> start
let startBtn = document.getElementById('start');
startBtn.addEventListener('click', (e) => {
    gameController.startGame(e)
});

let resetBtn = document.getElementById('reset');
resetBtn.addEventListener('click', (e) => {
    gameController.resetGame(e);
});
