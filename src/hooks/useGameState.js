import { useState } from 'react';
import { generateSolvedSudoku } from '../utils/sudokuGenerator';
import { generateSpirals, createCellToSpiralMapping } from '../utils/spiralGenerator';
import { createPlayablePuzzle } from '../utils/puzzleUtils';
import { DIFFICULTY_LEVELS } from '../constants';

/**
 * Custom hook for managing game state
 */
export const useGameState = () => {
    const [solution, setSolution] = useState(null);
    const [puzzle, setPuzzle] = useState(null);
    const [userGrid, setUserGrid] = useState(null);
    const [givenCells, setGivenCells] = useState(new Set());
    const [spirals, setSpirals] = useState([]);
    const [cellToSpiral, setCellToSpiral] = useState({});
    const [loading, setLoading] = useState(false);
    const [difficulty, setDifficulty] = useState('EASY');
    const [selectedCell, setSelectedCell] = useState(null);
    const [isComplete, setIsComplete] = useState(false);

    const generateNewPuzzle = (difficultyLevel = difficulty) => {
        setLoading(true);
        setTimeout(() => {
            const level = DIFFICULTY_LEVELS[difficultyLevel];
            const grid = generateSolvedSudoku();
            const newSpirals = generateSpirals(grid, level.minCells, level.maxCells);
            const mapping = createCellToSpiralMapping(newSpirals);

            // Create playable puzzle
            const { puzzle: playablePuzzle, solution: solutionGrid } = createPlayablePuzzle(grid, difficultyLevel);

            // Track given cells
            const given = new Set();
            for (let row = 0; row < 9; row++) {
                for (let col = 0; col < 9; col++) {
                    if (playablePuzzle[row][col] !== 0) {
                        given.add(`${row},${col}`);
                    }
                }
            }

            setSolution(solutionGrid);
            setPuzzle(playablePuzzle);
            setUserGrid(playablePuzzle.map(row => [...row]));
            setGivenCells(given);
            setSpirals(newSpirals);
            setCellToSpiral(mapping);
            setDifficulty(difficultyLevel);
            setSelectedCell(null);
            setIsComplete(false);
            setLoading(false);
        }, 100);
    };

    const handleDifficultyChange = (newDifficulty) => {
        generateNewPuzzle(newDifficulty);
    };

    const handleClearAll = () => {
        setUserGrid(puzzle.map(row => [...row]));
        setSelectedCell(null);
        setIsComplete(false);
    };

    return {
        // State
        solution,
        puzzle,
        userGrid,
        setUserGrid,
        givenCells,
        spirals,
        cellToSpiral,
        loading,
        difficulty,
        selectedCell,
        setSelectedCell,
        isComplete,
        setIsComplete,

        // Actions
        generateNewPuzzle,
        handleDifficultyChange,
        handleClearAll,
    };
};
