import React from 'react';

const RulesSection = () => {
    return (
        <div className="bg-white rounded-lg shadow-xl p-6">
            <h2 className="text-2xl font-bold text-purple-800 mb-4">How to Play</h2>

            <div className="space-y-4">
                <div>
                    <h3 className="font-bold text-lg text-gray-800 mb-2">🎮 Controls</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 ml-2">
                        <li>Click a cell to select it</li>
                        <li>Click a number button or press 1-9 on keyboard</li>
                        <li>Use arrow keys to navigate between cells</li>
                        <li>Press Backspace/Delete to clear a cell</li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-bold text-lg text-gray-800 mb-2">📜 Rules</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 ml-2">
                        <li>
                            <span className="font-semibold">Classic Sudoku:</span> Each row, column, and 3×3 box must contain digits 1-9
                        </li>
                        <li>
                            <span className="font-semibold">Spiral Uniqueness:</span> Each colored spiral must also contain unique numbers
                        </li>
                        <li>
                            <span className="font-semibold">Spiral Distribution:</span> Spirals must span multiple boxes, rows, and columns
                        </li>
                        <li>
                            <span className="font-semibold">Maximum Concentration:</span> For 9-cell spirals, max 4 cells per box/row/column
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-bold text-lg text-gray-800 mb-2">🎯 Difficulty Levels</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 ml-2">
                        <li><span className="font-semibold">🟢 Easy:</span> 30-50 spiral cells, 30-40 empty cells</li>
                        <li><span className="font-semibold">🟡 Medium:</span> 50-60 spiral cells, 40-50 empty cells</li>
                        <li><span className="font-semibold">🔴 Hard:</span> 60-70 spiral cells, 50-60 empty cells</li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-bold text-lg text-gray-800 mb-2">✨ Visual Feedback</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 ml-2">
                        <li>Completed rows, columns, boxes, and spirals will pulse with green animation</li>
                        <li>Track your progress with the completion counters</li>
                        <li>Use "👁️ Solution" button to check answers (no penalty!)</li>
                        <li>Click "✓ Check" when all cells are filled to verify solution</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default RulesSection;
