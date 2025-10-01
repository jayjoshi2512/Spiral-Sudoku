import React from 'react';
import { SPIRAL_COLORS } from '../constants';

/**
 * SpiralTracker - Shows which numbers can still be VALIDLY placed in each spiral
 * This accounts for row/column/box constraints, not just what's in the spiral
 */
const SpiralTracker = ({ spirals, userGrid, cellToSpiral }) => {
    // Helper to check if a number can be placed in a cell within a specific spiral
    const canPlaceNumber = (row, col, num, spiral) => {
        // Check row
        for (let c = 0; c < 9; c++) {
            if (userGrid[row][c] === num) return false;
        }

        // Check column
        for (let r = 0; r < 9; r++) {
            if (userGrid[r][col] === num) return false;
        }

        // Check 3x3 box
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;
        for (let r = boxRow; r < boxRow + 3; r++) {
            for (let c = boxCol; c < boxCol + 3; c++) {
                if (userGrid[r][c] === num) return false;
            }
        }

        // Check spiral constraint - make sure number isn't already in the spiral
        for (const [spiralRow, spiralCol] of spiral) {
            if (userGrid[spiralRow][spiralCol] === num) return false;
        }

        return true;
    };

    // Calculate remaining numbers for each spiral (numbers not yet placed)
    const getSpiralRemainingNumbers = (spiralIndex) => {
        const spiralData = spirals[spiralIndex];
        if (!spiralData) return { remaining: [], canPlace: [], emptyCellsCount: 0 };

        // Handle both old format (array) and new format (object with cells)
        const spiral = spiralData.cells || spiralData;
        const solutionNumbers = spiralData.solutionNumbers || null;
        const spiralSize = spiral.length;

        // Track which numbers are already present in this spiral
        const present = new Set();
        const emptyCells = [];

        spiral.forEach(([row, col]) => {
            const value = userGrid[row][col];
            if (value !== 0) {
                present.add(value);
            } else {
                emptyCells.push([row, col]);
            }
        });

        // If no empty cells, spiral is complete
        if (emptyCells.length === 0) {
            return { remaining: [], canPlace: [], emptyCellsCount: 0 };
        }

        // If we have solution numbers, show only those that are missing
        if (solutionNumbers) {
            const uniqueSolutionNumbers = [...new Set(solutionNumbers)];
            const remainingNumbers = uniqueSolutionNumbers.filter(num => !present.has(num));

            return {
                remaining: remainingNumbers,
                canPlace: remainingNumbers,
                emptyCellsCount: emptyCells.length
            };
        }

        // Fallback: check all numbers 1-9 (old behavior)
        const canPlaceNumbers = [];

        for (let num = 1; num <= 9; num++) {
            if (present.has(num)) continue;

            const canPlace = emptyCells.some(([row, col]) => canPlaceNumber(row, col, num, spiral));
            if (canPlace) {
                canPlaceNumbers.push(num);
            }
        }

        return {
            remaining: canPlaceNumbers,
            canPlace: canPlaceNumbers,
            emptyCellsCount: emptyCells.length
        };
    };

    return (
        <div className="w-full">
            <div className="text-sm font-semibold text-gray-700 mb-1">
                Spiral Progress ({spirals.length} spirals)
            </div>
            <div className="text-[10px] text-gray-500 mb-2 italic">
                Shows missing numbers from each spiral's solution
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[400px] overflow-y-auto">
                {spirals.map((spiralData, idx) => {
                    const { remaining, canPlace, emptyCellsCount } = getSpiralRemainingNumbers(idx);
                    const spiral = spiralData.cells || spiralData; // Handle both formats
                    const spiralSize = spiral.length; // Actual size of this spiral
                    const filledCount = spiralSize - emptyCellsCount;
                    const isComplete = emptyCellsCount === 0;

                    // Detect conflicts: no valid numbers can be placed but cells are empty
                    const hasConflict = emptyCellsCount > 0 && remaining.length === 0;

                    const spiralColor = SPIRAL_COLORS[idx % SPIRAL_COLORS.length];

                    return (
                        <div
                            key={idx}
                            className={`
                ${spiralColor} rounded-lg p-2 border-2 transition-all
                ${isComplete
                                    ? 'border-green-500 shadow-md'
                                    : hasConflict
                                        ? 'border-red-500 shadow-md'
                                        : 'border-gray-300'
                                }
              `}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-bold text-gray-800">
                                    Spiral {idx + 1}
                                </span>
                                <span className={`
                  text-xs font-semibold
                  ${isComplete ? 'text-green-600' : hasConflict ? 'text-red-600' : 'text-gray-600'}
                `}>
                                    {filledCount}/{spiralSize}
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-1">
                                {isComplete ? (
                                    <span className="text-xs text-green-600 font-semibold">✓ Complete</span>
                                ) : hasConflict ? (
                                    <span className="text-xs text-red-600 font-semibold">⚠ No valid moves</span>
                                ) : (
                                    remaining.map(num => (
                                        <span
                                            key={num}
                                            className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold bg-white rounded border border-gray-400 text-gray-800 shadow-sm"
                                            title={`${num} can be placed in this spiral`}
                                        >
                                            {num}
                                        </span>
                                    ))
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SpiralTracker;

