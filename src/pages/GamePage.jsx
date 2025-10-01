import React, { useEffect } from 'react';
import { SudokuGrid, NumberPad, SpiralTracker } from '../components';
import { useGameState, useGameValidation, useGameControls } from '../hooks';
import { DIFFICULTY_LEVELS } from '../constants';

const GamePage = () => {
    const {
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
        generateNewPuzzle,
        handleDifficultyChange,
        handleClearAll,
    } = useGameState();

    const {
        completedConstraints,
        conflictingCells,
        validateGrid,
        resetValidation,
    } = useGameValidation();

    const handleNumberInput = (num) => {
        if (!selectedCell) return;

        const [row, col] = selectedCell;
        const newGrid = userGrid.map(r => [...r]);
        newGrid[row][col] = num;
        setUserGrid(newGrid);

        validateGrid(newGrid, spirals, cellToSpiral, solution, setIsComplete);
    };

    const handleClear = () => {
        if (!selectedCell) return;

        const [row, col] = selectedCell;
        const newGrid = userGrid.map(r => [...r]);
        newGrid[row][col] = 0;
        setUserGrid(newGrid);

        validateGrid(newGrid, spirals, cellToSpiral, solution, setIsComplete);
    };

    const handleClearAllWithValidation = () => {
        handleClearAll();
        resetValidation();
    };

    const { handleCellClick } = useGameControls({
        selectedCell,
        setSelectedCell,
        userGrid,
        handleNumberInput,
        handleClear,
    });

    useEffect(() => {
        generateNewPuzzle();
    }, []);

    if (!puzzle) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-xl font-semibold text-gray-600">Loading...</div>
            </div>
        );
    }

    const filledCells = userGrid.flat().filter(cell => cell !== 0).length;

    return (
        <div className="min-h-screen bg-gray-50 py-4 px-2 sm:px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header - Minimal & Clean */}
                <div className="text-center mb-4">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                        Spiral Sudoku
                    </h1>
                    <p className="text-sm text-gray-600">
                        Classic Sudoku with spiral constraints
                    </p>
                </div>

                {/* Main Game Container - Grid Focused */}
                <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-4">
                    {/* Top Controls - Compact */}
                    <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
                        {/* Difficulty Selector - Inline */}
                        <div className="flex gap-2">
                            {Object.entries(DIFFICULTY_LEVELS).map(([key, level]) => (
                                <button
                                    key={key}
                                    onClick={() => handleDifficultyChange(key)}
                                    disabled={loading}
                                    className={`
                    px-3 py-1.5 rounded-md text-sm font-medium transition-all
                    ${difficulty === key
                                            ? level.color + ' text-white shadow-md'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }
                    ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                                >
                                    {level.name}
                                </button>
                            ))}
                        </div>

                        {/* Stats - Compact */}
                        <div className="flex items-center gap-3 text-sm">
                            <span className="text-gray-600">
                                {filledCells}/81
                            </span>
                            {conflictingCells.size > 0 && (
                                <span className="text-red-600 font-medium">
                                    {conflictingCells.size} errors
                                </span>
                            )}
                            <button
                                onClick={handleClearAllWithValidation}
                                disabled={loading}
                                className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-md font-medium transition-colors disabled:opacity-50"
                                title="Clear all entries and restart this puzzle"
                            >
                                Clear All
                            </button>
                            <button
                                onClick={() => generateNewPuzzle()}
                                disabled={loading}
                                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors disabled:opacity-50"
                            >
                                New Game
                            </button>
                        </div>
                    </div>

                    {/* Main Layout: 70% Grid + 30% Controls */}
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Grid Section - 70% */}
                        <div className="flex-1 lg:w-[70%]">
                            <SudokuGrid
                                puzzle={puzzle}
                                userGrid={userGrid}
                                cellToSpiral={cellToSpiral}
                                givenCells={givenCells}
                                selectedCell={selectedCell}
                                onCellClick={handleCellClick}
                                completedConstraints={completedConstraints}
                                conflictingCells={conflictingCells}
                            />
                        </div>

                        {/* Number Pad - Directly below grid on mobile, in sidebar on desktop */}
                        <div className="lg:hidden">
                            <NumberPad
                                onNumberClick={handleNumberInput}
                                onClear={handleClear}
                                selectedCell={selectedCell}
                                userGrid={userGrid}
                            />
                        </div>

                        {/* Controls Section - 30% on desktop */}
                        <div className="lg:w-[30%] flex flex-col gap-4">
                            {/* Spiral Tracker - First */}
                            <div>
                                <SpiralTracker
                                    spirals={spirals}
                                    userGrid={userGrid}
                                    cellToSpiral={cellToSpiral}
                                />
                            </div>

                            {/* Number Pad - Only visible on desktop */}
                            <div className="hidden lg:block">
                                <NumberPad
                                    onNumberClick={handleNumberInput}
                                    onClear={handleClear}
                                    selectedCell={selectedCell}
                                    userGrid={userGrid}
                                />
                            </div>

                            {/* How to Play - Third */}
                            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                <details>
                                    <summary className="font-semibold cursor-pointer hover:text-blue-600 text-sm text-gray-700">
                                        📖 How to Play
                                    </summary>
                                    <div className="mt-2 space-y-2 text-xs text-gray-600">
                                        <p><strong>Standard Rules:</strong> Fill 1-9 in each row, column, and 3×3 box with no repeats</p>
                                        <p><strong>Spiral Rule:</strong> Each colored spiral must have <strong>no duplicate numbers</strong> (spirals can be 4-9 cells)</p>
                                        <p><strong>Spiral Tracker:</strong> Shows missing numbers from each spiral's solution</p>
                                        <p><strong>Highlighting:</strong> Click any cell to highlight all instances of that number</p>
                                        <p><strong>Controls:</strong> Click cell → Select number or use keyboard (1-9, Delete/Backspace to clear)</p>
                                    </div>
                                </details>
                            </div>
                        </div>
                    </div>

                    {/* Success Message */}
                    {isComplete && (
                        <div className="mt-6 bg-green-500 text-white p-4 rounded-lg text-center font-semibold">
                            🎉 Congratulations! Puzzle solved perfectly! 🎉
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GamePage;
