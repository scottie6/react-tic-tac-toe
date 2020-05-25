import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const Square = (props) => {
    return (
        <button
            className={'square ' + (props.highlight ? 'winning-square' : '')}
            onClick={props.onClick}
        >
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                key={i}
                highlight={this.props.winningSquares.includes(i)}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        )
    }

    render() {
        return (
            <div>{ [0, 1, 2].map((i) => {
                return (
                    <div key={i} className="board-row">
                        {[0, 1, 2].map((j) => {
                            let index = Math.floor((3 * j) / 3) + 3 * i;
                            return this.renderSquare(index)
                        })}
                    </div>
                )})
            }</div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{ 
                squares: Array(9).fill(null),
            }],
            xIsNext: true,
            stepNumber: 0,
            sortDesc: true
        }
    }

    handleClick(i) {
        const sqLocations = [
            [1, 1], [2, 1], [3, 1], 
            [1, 2], [2, 2], [3, 2], 
            [1, 3], [2, 3], [3, 3]
        ];
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        const winner = calculateWinner(squares);
        if (winner || squares[i]) return;
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                location: sqLocations[i]
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    handleSort() {
        this.setState({
            sortDesc: !this.state.sortDesc
        })
    }

    handleReset() {
        this.setState({
            history: [{
                squares: Array(9).fill(null),
            }],
            xIsNext: true,
            stepNumber: 0,
            sortDesc: true
        })
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move + ` @(${history[move].location})` :
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>
                        {move === this.state.stepNumber ? <b>{desc}</b> : desc}
                    </button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = `Winner: ${winner.player}!`;
        } else if (!current.squares.includes(null)) {
            status = 'Game ends in a draw :/';
        } else {
            status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
        }

        return (
            <div className="App">
                <header className="App-header">
                    <p>react tic-tac-toe</p>
                </header>
                <div className="game">
                    <div className="game-board">
                        <Board
                            winningSquares={winner ? winner.line : []}
                            squares={current.squares}
                            onClick={(i) => this.handleClick(i)} />
                        <div className='reset-btn'>
                            <button onClick={() => this.handleReset()}>Reset Game</button>
                        </div>
                    </div>
                    <div className="game-info">
                        <div className='status'>{status}</div>
                        <button className='sort-btn' onClick={() => this.handleSort()}>Sort Moves</button>
                        <ol>{ this.state.sortDesc ? moves : moves.reverse() }</ol>
                    </div>
                </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return { player: squares[a], line: [a, b, c] };
        }
    }
    return null;
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
