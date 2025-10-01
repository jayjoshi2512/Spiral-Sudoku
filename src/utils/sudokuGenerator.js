import { PUZZLE_CONFIG } from '../constants';
import { isValid, shuffleArray } from './validators';

/**
 * Solve Sudoku using backtracking algorithm with randomization
 */
const solve = (grid) => {
    for (let row = 0; row < PUZZLE_CONFIG.GRID_SIZE; row++) {
        for (let col = 0; col < PUZZLE_CONFIG.GRID_SIZE; col++) {
            if (grid[row][col] === 0) {
                const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
                const shuffledNumbers = shuffleArray(numbers);

                for (let num of shuffledNumbers) {
                    if (isValid(grid, row, col, num)) {
                        grid[row][col] = num;

                        if (solve(grid)) {
                            return true;
                        }

                        grid[row][col] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
};

/**
 * Generate a complete solved Sudoku puzzle
 */
export const generateSolvedSudoku = () => {
    const grid = Array(PUZZLE_CONFIG.GRID_SIZE)
        .fill(null)
        .map(() => Array(PUZZLE_CONFIG.GRID_SIZE).fill(0));

    solve(grid);
    return grid;
};
