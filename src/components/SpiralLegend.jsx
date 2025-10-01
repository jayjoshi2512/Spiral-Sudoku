import React from 'react';
import { SPIRAL_COLORS } from '../constants';
import { getBoxNumber } from '../utils/validators';

const SpiralLegend = ({ spirals }) => {
    return (
        <div className="mt-6">
            <h3 className="font-bold text-lg mb-3">Spirals Details:</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                {spirals.map((spiralData, idx) => {
                    const spiral = spiralData.cells || spiralData; // Handle both formats
                    const boxCounts = {};
                    const rowCounts = {};
                    const colCounts = {};

                    spiral.forEach(([row, col]) => {
                        const box = getBoxNumber(row, col);
                        boxCounts[box] = (boxCounts[box] || 0) + 1;
                        rowCounts[row] = (rowCounts[row] || 0) + 1;
                        colCounts[col] = (colCounts[col] || 0) + 1;
                    });

                    return (
                        <div
                            key={idx}
                            className={`${SPIRAL_COLORS[idx % SPIRAL_COLORS.length]} p-2 rounded border-2 text-xs`}
                        >
                            <div className="font-bold">Spiral {idx + 1}</div>
                            <div>Size: {spiral.length} cells</div>
                            <div>Boxes: {Object.keys(boxCounts).length}</div>
                            <div>Rows: {Object.keys(rowCounts).length}</div>
                            <div>Cols: {Object.keys(colCounts).length}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SpiralLegend;
