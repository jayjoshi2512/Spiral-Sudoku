import { useEffect } from 'react';

/**
 * Custom hook for handling game controls (keyboard, mouse)
 */
export const useGameControls = ({
    selectedCell,
    setSelectedCell,
    userGrid,
    handleNumberInput,
    handleClear,
}) => {
    const handleCellClick = (row, col) => {
        setSelectedCell([row, col]);
    };

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (!selectedCell) return;

            if (e.key >= '1' && e.key <= '9') {
                handleNumberInput(parseInt(e.key));
            } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
                handleClear();
            } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                e.preventDefault();
                const [row, col] = selectedCell;
                let newRow = row;
                let newCol = col;

                if (e.key === 'ArrowUp') newRow = Math.max(0, row - 1);
                if (e.key === 'ArrowDown') newRow = Math.min(8, row + 1);
                if (e.key === 'ArrowLeft') newCol = Math.max(0, col - 1);
                if (e.key === 'ArrowRight') newCol = Math.min(8, col + 1);

                setSelectedCell([newRow, newCol]);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [selectedCell, userGrid, handleNumberInput, handleClear, setSelectedCell]);

    return {
        handleCellClick,
    };
};
