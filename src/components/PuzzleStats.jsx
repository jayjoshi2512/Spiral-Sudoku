import React from 'react';
import { DIFFICULTY_LEVELS } from '../constants';

const PuzzleStats = ({ spiralCount, totalSpiralCells, difficulty }) => {
    const difficultyInfo = DIFFICULTY_LEVELS[difficulty];

    return (
        <div className="flex flex-wrap gap-3 text-sm">
            <div className="bg-purple-100 px-3 py-2 rounded">
                <span className="font-semibold">Difficulty:</span> {difficultyInfo?.name || 'Easy'}
            </div>
            <div className="bg-blue-100 px-3 py-2 rounded">
                <span className="font-semibold">Spirals:</span> {spiralCount}
            </div>
            <div className="bg-green-100 px-3 py-2 rounded">
                <span className="font-semibold">Spiral Cells:</span> {totalSpiralCells}
            </div>
        </div>
    );
};

export default PuzzleStats;
