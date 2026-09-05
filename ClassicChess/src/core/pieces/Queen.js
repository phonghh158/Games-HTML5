// src/core/pieces/Queen.js
import Piece from "./Piece.js";
import { PIECE_TYPES } from "../utils/constants.js";
import { isInsideBoard } from "../utils/helpers.js";

class Queen extends Piece {
    constructor(color, position, hasMoved = false) {
        super(PIECE_TYPES.QUEEN, color, position, hasMoved);
    }

    getPossibleMoves(board) {
        const moves = [];
        const { row, col } = this.position;
        const directions = [
            // Di chuyển đường thẳng
            { rowOffset: -1, colOffset: 0 },
            { rowOffset: 1, colOffset: 0 },
            { rowOffset: 0, colOffset: -1 },
            { rowOffset: 0, colOffset: 1 },

            // Di chuyển đường chéo
            { rowOffset: -1, colOffset: -1 },
            { rowOffset: -1, colOffset: 1 },
            { rowOffset: 1, colOffset: -1 },
            { rowOffset: 1, colOffset: 1 },
        ];

        //#region Di chuyển và ăn quân
        for (const { rowOffset, colOffset } of directions) {
            let currentRow = row + rowOffset;
            let currentCol = col + colOffset;

            while (isInsideBoard(currentRow, currentCol)) {
                const targetPiece = board.getPiece(currentRow, currentCol);

                if (targetPiece === null) {
                    moves.push({ row: currentRow, col: currentCol });
                } else {
                    if (targetPiece.color !== this.color) {
                        moves.push({ row: currentRow, col: currentCol });
                    }
                    break;
                }

                currentRow += rowOffset;
                currentCol += colOffset;
            }
        }
        //#endregion

        return moves;
    }

    clone() {
        return new Queen(this.color, this.position, this.hasMoved);
    }
}

export default Queen;
