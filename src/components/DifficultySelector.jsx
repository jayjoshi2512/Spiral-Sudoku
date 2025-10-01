import React from 'react';
import { DIFFICULTY_LEVELS } from '../constants';

const DifficultySelector = ({ currentDifficulty, onDifficultyChange, loading }) => {
    return (
        <div className="flex flex-wrap gap-2 sm:gap-4 justify-center animate-slide-down">
            {Object.entries(DIFFICULTY_LEVELS).map(([key, level]) => (
                <button
                    key={key}
                    onClick={() => onDifficultyChange(key)}
                    disabled={loading}
                    className={`
            ${level.color}
            ${currentDifficulty === key
                            ? 'ring-4 ring-offset-2 ring-purple-500 scale-110 shadow-2xl'
                            : 'hover:scale-105 shadow-lg hover:shadow-xl'
                        }
            disabled:bg-gray-400 disabled:cursor-not-allowed
            text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl 
            transition-all duration-300
            transform active:scale-95
            disabled:transform-none disabled:ring-0 disabled:shadow-none
            relative overflow-hidden group
            border-2 border-white/30
          `}
                >
                    <div className="relative z-10">
                        <div className="text-sm sm:text-base font-bold">{level.name}</div>
                        <div className="text-xs opacity-90 mt-1 hidden sm:block">{level.description}</div>
                    </div>
                    {currentDifficulty === key && (
                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
            ))}
        </div>
    );
};

export default DifficultySelector;
