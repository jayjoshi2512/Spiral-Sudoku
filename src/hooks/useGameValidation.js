import { useState } from 'react';
import { findCompletedConstraints, findConflictingCells } from '../utils/puzzleUtils';

/**
 * Custom hook for game validation logic
 */
export const useGameValidation = () => {
    const [completedConstraints, setCompletedConstraints] = useState({
        rows: [],
        columns: [],
        boxes: [],
        spirals: []
    });
    const [conflictingCells, setConflictingCells] = useState(new Set());

    const validateGrid = (grid, spirals, cellToSpiral, solution, setIsComplete) => {
        // Check for conflicts
        const conflicts = findConflictingCells(grid, spirals, cellToSpiral);
        setConflictingCells(conflicts);

        // Check for completed constraints
        const completed = findCompletedConstraints(grid, spirals);
        setCompletedConstraints(completed);

        // Check if puzzle is complete and correct
        let allFilled = true;
        let allCorrect = true;
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (grid[row][col] === 0) {
                    allFilled = false;
                } else if (grid[row][col] !== solution[row][col]) {
                    allCorrect = false;
                }
            }
        }

        if (allFilled && allCorrect && conflicts.size === 0) {
            setIsComplete(true);
            // Show celebration message
            setTimeout(() => {
                alert('🎉 Congratulations! You solved the Spiral Sudoku perfectly!');
            }, 500);
        }
    };

    const resetValidation = () => {
        setCompletedConstraints({ rows: [], columns: [], boxes: [], spirals: [] });
        setConflictingCells(new Set());
    };

    return {
        completedConstraints,
        conflictingCells,
        validateGrid,
        resetValidation,
    };
};
