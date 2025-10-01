import React from 'react';

/**
 * NumberAvailability Component
 * Shows how many times each number (1-9) can still be placed in the grid
 * Provides visual feedback with color coding:
 * - Green: Plenty available (6-9 remaining)
 * - Yellow: Limited (3-5 remaining)
 * - Orange: Almost complete (1-2 remaining)
 * - Gray with checkmark: Complete (0 remaining)
 */
const NumberAvailability = ({ userGrid, isVisible }) => {
    if (!isVisible) return null;

    // Calculate how many times each number can still be placed
    const calculateAvailability = () => {
        const counts = {};

        // Initialize all numbers 1-9 with max count of 9
        for (let num = 1; num <= 9; num++) {
            counts[num] = 9;
        }

        // Subtract numbers already placed on the grid
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const value = userGrid[row][col];
                if (value !== 0) {
                    counts[value] = Math.max(0, counts[value] - 1);
                }
            }
        }

        return counts;
    };

    const availability = calculateAvailability();

    // Determine color and style based on remaining count
    const getNumberStyle = (count) => {
        if (count === 0) {
            return {
                bgColor: 'bg-gray-200',
                textColor: 'text-gray-400',
                borderColor: 'border-gray-300',
                ringColor: '',
                isComplete: true,
            };
        } else if (count <= 2) {
            return {
                bgColor: 'bg-orange-50',
                textColor: 'text-orange-600',
                borderColor: 'border-orange-300',
                ringColor: 'ring-2 ring-orange-400',
                isComplete: false,
            };
        } else if (count <= 5) {
            return {
                bgColor: 'bg-yellow-50',
                textColor: 'text-yellow-700',
                borderColor: 'border-yellow-300',
                ringColor: 'ring-2 ring-yellow-400',
                isComplete: false,
            };
        } else {
            return {
                bgColor: 'bg-green-50',
                textColor: 'text-green-600',
                borderColor: 'border-green-300',
                ringColor: 'ring-2 ring-green-400',
                isComplete: false,
            };
        }
    };

    return (
        <div className="animate-slide-up w-full">
            <div className="glass-effect rounded-xl shadow-lg p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
                        <span className="text-2xl">🔢</span>
                        <span>Number Availability</span>
                    </h3>
                    <div className="text-xs text-gray-500 hidden sm:block">
                        Remaining uses
                    </div>
                </div>

                <div className="grid grid-cols-9 gap-1.5 sm:gap-2 md:gap-3">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
                        const count = availability[num];
                        const style = getNumberStyle(count);
                        const animationClass = count === 0 ? 'animate-number-complete' : '';

                        return (
                            <div
                                key={num}
                                className={`
                  relative flex flex-col items-center justify-center
                  rounded-lg border-2 transition-all duration-300
                  ${style.bgColor} ${style.borderColor} ${style.ringColor}
                  ${animationClass}
                  hover:scale-105 hover:shadow-md
                  p-2 sm:p-3
                `}
                            >
                                {/* Number */}
                                <div className={`
                  text-xl sm:text-2xl md:text-3xl font-bold
                  ${style.textColor}
                  ${style.isComplete ? 'line-through' : ''}
                `}>
                                    {num}
                                </div>

                                {/* Count or Checkmark */}
                                <div className={`
                  text-xs sm:text-sm font-semibold mt-1
                  ${style.textColor}
                `}>
                                    {style.isComplete ? (
                                        <span className="text-green-500 text-lg">✓</span>
                                    ) : (
                                        <span>{count}</span>
                                    )}
                                </div>

                                {/* Subtle indicator dot for status */}
                                {!style.isComplete && (
                                    <div className={`
                    absolute -top-1 -right-1 w-2 h-2 rounded-full
                    ${count <= 2 ? 'bg-orange-500 animate-pulse' : ''}
                    ${count > 2 && count <= 5 ? 'bg-yellow-500' : ''}
                    ${count > 5 ? 'bg-green-500' : ''}
                  `} />
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Legend */}
                <div className="mt-4 flex flex-wrap gap-3 justify-center text-xs sm:text-sm">
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-gray-600">Plenty (6-9)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <span className="text-gray-600">Limited (3-5)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-orange-500 animate-pulse"></div>
                        <span className="text-gray-600">Almost Done (1-2)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                        <span className="text-gray-600">Complete</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NumberAvailability;
