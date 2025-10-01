import React from 'react';

/**
 * NumberPad with integrated number availability counter
 */
const NumberPad = ({ onNumberClick, onClear, selectedCell, userGrid }) => {
    // Calculate availability for each number
    const calculateAvailability = () => {
        const counts = {};
        for (let num = 1; num <= 9; num++) {
            counts[num] = 9;
        }

        if (userGrid) {
            for (let row = 0; row < 9; row++) {
                for (let col = 0; col < 9; col++) {
                    const value = userGrid[row][col];
                    if (value !== 0) {
                        counts[value] = Math.max(0, counts[value] - 1);
                    }
                }
            }
        }

        return counts;
    };

    const availability = calculateAvailability();

    return (
        <div className="w-full">
            <div className="text-xs font-semibold text-gray-600 mb-2 text-center">
                {selectedCell ? 'Select a number' : 'Click a cell first'}
            </div>
            <div className="grid grid-cols-9 gap-1.5">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => {
                    const remaining = availability[num];
                    const isComplete = remaining === 0;

                    return (
                        <button
                            key={num}
                            onClick={() => onNumberClick(num)}
                            disabled={!selectedCell || isComplete}
                            className={`
                relative aspect-square flex flex-col items-center justify-center
                rounded-lg font-bold transition-all duration-200
                ${!selectedCell
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    : isComplete
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95 hover:scale-105 shadow-md hover:shadow-lg'
                                }
              `}
                        >
                            <span className="text-base sm:text-lg md:text-xl">{num}</span>
                            <span className={`
                text-[9px] sm:text-[10px] font-semibold mt-0.5
                ${isComplete ? 'text-gray-400' : 'text-blue-100'}
              `}>
                                {remaining}
                            </span>
                        </button>
                    );
                })}
            </div>

            <button
                onClick={onClear}
                disabled={!selectedCell}
                className={`
          w-full mt-2 py-2.5 rounded-lg font-semibold text-sm
          transition-all duration-200
          ${!selectedCell
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-red-500 text-white hover:bg-red-600 active:scale-98 hover:shadow-lg'
                    }
        `}
            >
                Clear
            </button>
        </div>
    );
};

export default NumberPad;
