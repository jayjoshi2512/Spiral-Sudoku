import { PUZZLE_CONFIG } from '../constants';

/**
 * Check if placing a number in a specific position is valid
 */
export const isValid = (grid, row, col, num) => {
    // Check row
    for (let x = 0; x < PUZZLE_CONFIG.GRID_SIZE; x++) {
        if (grid[row][x] === num) return false;
    }

    // Check column
    for (let x = 0; x < PUZZLE_CONFIG.GRID_SIZE; x++) {
        if (grid[x][col] === num) return false;
    }

    // Check 3x3 box
    const startRow = row - (row % PUZZLE_CONFIG.BOX_SIZE);
    const startCol = col - (col % PUZZLE_CONFIG.BOX_SIZE);
    for (let i = 0; i < PUZZLE_CONFIG.BOX_SIZE; i++) {
        for (let j = 0; j < PUZZLE_CONFIG.BOX_SIZE; j++) {
            if (grid[i + startRow][j + startCol] === num) return false;
        }
    }

    return true;
};

/**
 * Get box number for a cell (0-8)
 */
export const getBoxNumber = (row, col) => {
    return Math.floor(row / PUZZLE_CONFIG.BOX_SIZE) * PUZZLE_CONFIG.BOX_SIZE +
        Math.floor(col / PUZZLE_CONFIG.BOX_SIZE);
};

/**
 * Check if a spiral is valid according to all rules
 */
export const isSpiralValid = (cells, grid) => {
    const size = cells.length;

    // Count cells per box
    const boxCounts = {};
    const rows = new Set();
    const cols = new Set();

    cells.forEach(([row, col]) => {
        const box = getBoxNumber(row, col);
        boxCounts[box] = (boxCounts[box] || 0) + 1;
        rows.add(row);
        cols.add(col);
    });

    // Must span multiple boxes
    if (Object.keys(boxCounts).length === 1) return false;

    // Must span multiple rows (NEW CONSTRAINT)
    if (rows.size === 1) return false;

    // Must span multiple columns (NEW CONSTRAINT)
    if (cols.size === 1) return false;

    // Check box constraints based on spiral size
    // For larger spirals, allow more cells per box, but still maintain distribution
    const maxCellsPerBox = Math.ceil(size / 2) + 1;
    for (let count of Object.values(boxCounts)) {
        if (count > maxCellsPerBox) return false;
    }

    // Similar constraint for rows and columns
    // No spiral should have too many cells in one row or column
    const rowCounts = {};
    const colCounts = {};
    cells.forEach(([row, col]) => {
        rowCounts[row] = (rowCounts[row] || 0) + 1;
        colCounts[col] = (colCounts[col] || 0) + 1;
    });

    const maxCellsPerLine = Math.ceil(size / 2) + 1;
    for (let count of Object.values(rowCounts)) {
        if (count > maxCellsPerLine) return false;
    }
    for (let count of Object.values(colCounts)) {
        if (count > maxCellsPerLine) return false;
    }

    // Check if all numbers are unique
    const numbers = cells.map(([row, col]) => grid[row][col]);
    const uniqueNumbers = new Set(numbers);
    if (uniqueNumbers.size !== numbers.length) return false;

    return true;
};

/**
 * Shuffle an array in place (Fisher-Yates algorithm)
 */
export const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};
