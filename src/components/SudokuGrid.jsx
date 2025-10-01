import React from 'react';
import { SPIRAL_COLORS } from '../constants';

const SudokuGrid = ({
    puzzle,
    userGrid,
    cellToSpiral,
    givenCells,
    selectedCell,
    onCellClick,
    completedConstraints,
    conflictingCells
}) => {
    const isGiven = (row, col) => givenCells?.has(`${row},${col}`);
    const isSelected = (row, col) => selectedCell && selectedCell[0] === row && selectedCell[1] === col;
    const hasConflict = (row, col) => conflictingCells?.has(`${row},${col}`);

    // Check if cell has same number as selected cell (including the selected cell itself)
    const hasSameNumber = (row, col) => {
        if (!selectedCell || !userGrid) return false;
        const [selRow, selCol] = selectedCell;
        const selectedValue = userGrid[selRow][selCol];
        const cellValue = userGrid[row][col];
        return selectedValue !== 0 && cellValue === selectedValue;
    };

    const isInCompletedConstraint = (row, col) => {
        if (!completedConstraints) return false;

        // Check if in completed row
        if (completedConstraints.rows.includes(row)) return 'row';

        // Check if in completed column
        if (completedConstraints.columns.includes(col)) return 'column';

        // Check if in completed box
        const boxIndex = Math.floor(row / 3) * 3 + Math.floor(col / 3);
        if (completedConstraints.boxes.includes(boxIndex)) return 'box';

        // Check if in completed spiral
        const cellKey = `${row},${col}`;
        const spiralIdx = cellToSpiral[cellKey];
        if (spiralIdx !== undefined && completedConstraints.spirals.includes(spiralIdx)) return 'spiral';

        return false;
    };

    return (
        <div className="flex justify-center items-center w-full">
            <div className="inline-block bg-gray-900 p-1.5 rounded-lg shadow-xl">
                <div className="bg-white p-0.5 rounded-md">
                    {puzzle.map((row, rowIdx) => (
                        <div key={rowIdx} className="flex">
                            {row.map((cell, colIdx) => {
                                const cellKey = `${rowIdx},${colIdx}`;
                                const spiralIdx = cellToSpiral[cellKey];
                                const isSpiral = spiralIdx !== undefined;
                                const spiralColor = isSpiral
                                    ? SPIRAL_COLORS[spiralIdx % SPIRAL_COLORS.length]
                                    : '';

                                // Thinner, professional borders for 3x3 boxes
                                const isRightBoxEdge = colIdx === 2 || colIdx === 5;
                                const isBottomBoxEdge = rowIdx === 2 || rowIdx === 5;
                                const isRightEdge = colIdx === 8;
                                const isBottomEdge = rowIdx === 8;

                                const given = isGiven(rowIdx, colIdx);
                                const selected = isSelected(rowIdx, colIdx);
                                const conflict = hasConflict(rowIdx, colIdx);
                                const sameNumber = hasSameNumber(rowIdx, colIdx);
                                const completionType = isInCompletedConstraint(rowIdx, colIdx);
                                const displayValue = userGrid ? userGrid[rowIdx][colIdx] : cell;

                                // Subtle box shading
                                const boxRow = Math.floor(rowIdx / 3);
                                const boxCol = Math.floor(colIdx / 3);
                                const isAlternateBox = (boxRow + boxCol) % 2 === 1;

                                return (
                                    <div
                                        key={colIdx}
                                        onClick={() => onCellClick && onCellClick(rowIdx, colIdx)}
                                        className={`
                      w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 xl:w-[72px] xl:h-[72px]
                      flex items-center justify-center
                      text-base sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold
                      relative
                      transition-all duration-200
                      
                      ${!isRightEdge ? 'border-r' : ''} 
                      ${!isBottomEdge ? 'border-b' : ''}
                      ${isRightBoxEdge && !isRightEdge ? 'border-r-2 border-r-gray-900' : 'border-r-gray-300'}
                      ${isBottomBoxEdge && !isBottomEdge ? 'border-b-2 border-b-gray-900' : 'border-b-gray-300'}
                      
                      ${conflict ? 'bg-red-50 ring-2 ring-red-500 ring-inset animate-shake-smooth' :
                                                sameNumber ? 'bg-gray-300' :
                                                    isSpiral ? spiralColor : isAlternateBox ? 'bg-gray-50' : 'bg-white'}
                      
                      ${given ? 'text-gray-900 font-bold cursor-default' : conflict ? 'text-red-600 font-bold cursor-pointer' : 'text-blue-600 cursor-pointer'}
                      
                      ${selected ? 'ring-2 ring-blue-600 ring-inset z-10' : ''}
                      
                      ${completionType ? 'ring-2 ring-green-500 ring-inset' : ''}
                      
                      ${!given && !selected && !conflict ? 'hover:bg-blue-50' : ''}
                      
                      ${isSpiral && spiralIdx !== undefined ? 'border-2' : ''}
                    `}
                                    >
                                        <span>
                                            {displayValue !== 0 ? displayValue : ''}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SudokuGrid;
