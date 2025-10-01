// Spiral color configurations
export const SPIRAL_COLORS = [
    'bg-red-200 border-red-500',
    'bg-blue-200 border-blue-500',
    'bg-green-200 border-green-500',
    'bg-yellow-200 border-yellow-500',
    'bg-purple-200 border-purple-500',
    'bg-pink-200 border-pink-500',
    'bg-indigo-200 border-indigo-500',
    'bg-orange-200 border-orange-500',
    'bg-teal-200 border-teal-500',
    'bg-cyan-200 border-cyan-500',
];

// Puzzle configuration
export const PUZZLE_CONFIG = {
    MIN_SPIRAL_SIZE: 4,
    MAX_SPIRAL_SIZE: 9,
    GRID_SIZE: 9,
    BOX_SIZE: 3,
    MAX_GENERATION_ATTEMPTS: 1000,
};

// Difficulty levels configuration
export const DIFFICULTY_LEVELS = {
    EASY: {
        name: 'Easy',
        minCells: 30,
        maxCells: 50,
        color: 'bg-green-600 hover:bg-green-700',
        description: '30-50 spiral cells'
    },
    MEDIUM: {
        name: 'Medium',
        minCells: 50,
        maxCells: 60,
        color: 'bg-yellow-600 hover:bg-yellow-700',
        description: '50-60 spiral cells'
    },
    HARD: {
        name: 'Hard',
        minCells: 60,
        maxCells: 70,
        color: 'bg-red-600 hover:bg-red-700',
        description: '60-70 spiral cells'
    }
};

// Movement directions for spiral generation
export const DIRECTIONS = [
    [0, 1],   // right
    [1, 0],   // down
    [0, -1],  // left
    [-1, 0],  // up
    [1, 1],   // diagonal down-right
    [1, -1],  // diagonal down-left
    [-1, 1],  // diagonal up-right
    [-1, -1]  // diagonal up-left
];
