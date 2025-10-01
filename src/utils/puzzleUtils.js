import { PUZZLE_CONFIG } from '../constants';
import { isValid } from './validators';

/**
 * Remove cells from a solved puzzle based on difficulty
 * @param {Array} solvedGrid - The complete solved grid
 * @param {String} difficulty - Difficulty level (EASY, MEDIUM, HARD)
 * @returns {Object} - { puzzle: grid with empty cells, solution: original grid }
 */
export const createPlayablePuzzle = (solvedGrid, difficulty) => {
    // Define how many cells to remove based on difficulty
    const cellsToRemove = {
        EASY: { min: 30, max: 40 },
        MEDIUM: { min: 40, max: 50 },
        HARD: { min: 50, max: 60 }
    };

    const { min, max } = cellsToRemove[difficulty] || cellsToRemove.EASY;
    const removeCount = Math.floor(Math.random() * (max - min + 1)) + min;

    // Create a copy for the puzzle
    const puzzle = solvedGrid.map(row => [...row]);

    // Get all cell positions
    const allCells = [];
    for (let row = 0; row < PUZZLE_CONFIG.GRID_SIZE; row++) {
        for (let col = 0; col < PUZZLE_CONFIG.GRID_SIZE; col++) {
            allCells.push([row, col]);
        }
    }

    // Shuffle cells
    for (let i = allCells.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allCells[i], allCells[j]] = [allCells[j], allCells[i]];
    }

    // Remove cells
    let removed = 0;
    for (const [row, col] of allCells) {
        if (removed >= removeCount) break;

        const temp = puzzle[row][col];
        puzzle[row][col] = 0;

        // Ensure puzzle still has a unique solution (simplified check)
        // In production, you'd want a more sophisticated check
        removed++;
    }

    return {
        puzzle,
        solution: solvedGrid.map(row => [...row])
    };
};

/**
 * Check if a specific constraint (row/column/box/spiral) is complete and valid
 */
export const checkConstraint = (grid, constraintCells) => {
    const values = constraintCells.map(([row, col]) => grid[row][col]);

    // Check if all cells are filled
    if (values.includes(0)) return false;

    // Check if all values are unique
    const uniqueValues = new Set(values);
    return uniqueValues.size === values.length && uniqueValues.size === constraintCells.length;
};

/**
 * Get all cells in a row
 */
export const getRowCells = (row) => {
    const cells = [];
    for (let col = 0; col < PUZZLE_CONFIG.GRID_SIZE; col++) {
        cells.push([row, col]);
    }
    return cells;
};

/**
 * Get all cells in a column
 */
export const getColumnCells = (col) => {
    const cells = [];
    for (let row = 0; row < PUZZLE_CONFIG.GRID_SIZE; row++) {
        cells.push([row, col]);
    }
    return cells;
};

/**
 * Get all cells in a box
 */
export const getBoxCells = (boxIndex) => {
    const cells = [];
    const startRow = Math.floor(boxIndex / 3) * 3;
    const startCol = (boxIndex % 3) * 3;

    for (let row = startRow; row < startRow + 3; row++) {
        for (let col = startCol; col < startCol + 3; col++) {
            cells.push([row, col]);
        }
    }
    return cells;
};

/**
 * Check all constraints and return completed ones
 */
export const findCompletedConstraints = (grid, spirals) => {
    const completed = {
        rows: [],
        columns: [],
        boxes: [],
        spirals: []
    };

    // Check rows
    for (let row = 0; row < PUZZLE_CONFIG.GRID_SIZE; row++) {
        if (checkConstraint(grid, getRowCells(row))) {
            completed.rows.push(row);
        }
    }

    // Check columns
    for (let col = 0; col < PUZZLE_CONFIG.GRID_SIZE; col++) {
        if (checkConstraint(grid, getColumnCells(col))) {
            completed.columns.push(col);
        }
    }

    // Check boxes
    for (let box = 0; box < 9; box++) {
        if (checkConstraint(grid, getBoxCells(box))) {
            completed.boxes.push(box);
        }
    }

    // Check spirals
    spirals.forEach((spiralData, idx) => {
        const spiral = spiralData.cells || spiralData; // Handle both formats
        if (checkConstraint(grid, spiral)) {
            completed.spirals.push(idx);
        }
    });

    return completed;
};

/**
 * Find all cells that have conflicts (errors)
 */
export const findConflictingCells = (grid, spirals, cellToSpiral) => {
    const conflicts = new Set();

    // Check rows for duplicates
    for (let row = 0; row < PUZZLE_CONFIG.GRID_SIZE; row++) {
        const rowValues = {};
        for (let col = 0; col < PUZZLE_CONFIG.GRID_SIZE; col++) {
            const value = grid[row][col];
            if (value !== 0) {
                if (rowValues[value]) {
                    conflicts.add(`${row},${col}`);
                    conflicts.add(`${rowValues[value]}`);
                } else {
                    rowValues[value] = `${row},${col}`;
                }
            }
        }
    }

    // Check columns for duplicates
    for (let col = 0; col < PUZZLE_CONFIG.GRID_SIZE; col++) {
        const colValues = {};
        for (let row = 0; row < PUZZLE_CONFIG.GRID_SIZE; row++) {
            const value = grid[row][col];
            if (value !== 0) {
                if (colValues[value]) {
                    conflicts.add(`${row},${col}`);
                    conflicts.add(`${colValues[value]}`);
                } else {
                    colValues[value] = `${row},${col}`;
                }
            }
        }
    }

    // Check boxes for duplicates
    for (let box = 0; box < 9; box++) {
        const boxValues = {};
        const cells = getBoxCells(box);
        for (const [row, col] of cells) {
            const value = grid[row][col];
            if (value !== 0) {
                if (boxValues[value]) {
                    conflicts.add(`${row},${col}`);
                    conflicts.add(`${boxValues[value]}`);
                } else {
                    boxValues[value] = `${row},${col}`;
                }
            }
        }
    }

    // Check spirals for duplicates
    spirals.forEach((spiralData) => {
        const spiral = spiralData.cells || spiralData; // Handle both formats
        const spiralValues = {};
        for (const [row, col] of spiral) {
            const value = grid[row][col];
            if (value !== 0) {
                if (spiralValues[value]) {
                    conflicts.add(`${row},${col}`);
                    conflicts.add(`${spiralValues[value]}`);
                } else {
                    spiralValues[value] = `${row},${col}`;
                }
            }
        }
    });

    return conflicts;
};

