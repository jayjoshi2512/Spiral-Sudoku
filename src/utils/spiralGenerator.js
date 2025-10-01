import { PUZZLE_CONFIG, DIRECTIONS } from '../constants';
import { isSpiralValid, shuffleArray } from './validators';

/**
 * Find a spiral path starting from a specific position
 */
const findSpiral = (startRow, startCol, targetSize, grid, usedCells) => {
    const visited = new Set();
    const path = [[startRow, startCol]];
    visited.add(`${startRow},${startCol}`);

    const findPath = () => {
        if (path.length === targetSize) {
            return isSpiralValid(path, grid);
        }

        const [currRow, currCol] = path[path.length - 1];

        // Shuffle directions for variety
        const shuffledDirs = shuffleArray(DIRECTIONS);

        for (let [dr, dc] of shuffledDirs) {
            const newRow = currRow + dr;
            const newCol = currCol + dc;
            const key = `${newRow},${newCol}`;

            if (
                newRow >= 0 &&
                newRow < PUZZLE_CONFIG.GRID_SIZE &&
                newCol >= 0 &&
                newCol < PUZZLE_CONFIG.GRID_SIZE &&
                !visited.has(key) &&
                !usedCells.has(key)
            ) {
                visited.add(key);
                path.push([newRow, newCol]);

                if (findPath()) {
                    return true;
                }

                path.pop();
                visited.delete(key);
            }
        }

        return false;
    };

    if (findPath()) {
        return path;
    }
    return null;
};

/**
 * Generate spirals for a solved Sudoku puzzle
 * @param {Array} grid - The solved Sudoku grid
 * @param {Number} minCells - Minimum number of spiral cells
 * @param {Number} maxCells - Maximum number of spiral cells
 */
export const generateSpirals = (grid, minCells = 30, maxCells = 50) => {
    const spirals = [];
    const usedCells = new Set();
    let totalCells = 0;
    const { MIN_SPIRAL_SIZE, MAX_SPIRAL_SIZE, MAX_GENERATION_ATTEMPTS } = PUZZLE_CONFIG;

    let attemptCount = 0;

    while (totalCells < minCells && attemptCount < MAX_GENERATION_ATTEMPTS) {
        attemptCount++;

        // Random spiral size
        const size = Math.floor(Math.random() * (MAX_SPIRAL_SIZE - MIN_SPIRAL_SIZE + 1)) + MIN_SPIRAL_SIZE;

        // Get available starting positions
        const availableStarts = [];
        for (let row = 0; row < PUZZLE_CONFIG.GRID_SIZE; row++) {
            for (let col = 0; col < PUZZLE_CONFIG.GRID_SIZE; col++) {
                if (!usedCells.has(`${row},${col}`)) {
                    availableStarts.push([row, col]);
                }
            }
        }

        if (availableStarts.length === 0) break;

        const [startRow, startCol] = availableStarts[
            Math.floor(Math.random() * availableStarts.length)
        ];

        const spiral = findSpiral(startRow, startCol, size, grid, usedCells);

        if (spiral && totalCells + spiral.length <= maxCells) {
            // Store the spiral with its solution numbers
            const spiralNumbers = spiral.map(([row, col]) => grid[row][col]);
            spirals.push({
                cells: spiral,
                solutionNumbers: spiralNumbers
            });
            spiral.forEach(([row, col]) => {
                usedCells.add(`${row},${col}`);
            });
            totalCells += spiral.length;
        }
    }

    return spirals;
};

/**
 * Create a mapping of cells to their spiral indices
 */
export const createCellToSpiralMapping = (spirals) => {
    const mapping = {};
    spirals.forEach((spiral, idx) => {
        const cells = spiral.cells || spiral; // Support both old and new format
        cells.forEach(([row, col]) => {
            mapping[`${row},${col}`] = idx;
        });
    });
    return mapping;
};
