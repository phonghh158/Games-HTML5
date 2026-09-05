// src/core/pieces/Knight.js
import Piece from "./Piece.js";
import { PIECE_TYPES } from "../utils/constants.js";
import { isInsideBoard } from "../utils/helpers.js";

class Knight extends Piece {
    constructor(color, position, hasMoved = false) {
        super(PIECE_TYPES.KNIGHT, color, position, hasMoved);
    }

    getPossibleMoves(board) {
        const moves = [];
        const { row, col } = this.position;
        const offsets = [
            { rowOffset: -2, colOffset: -1 },
            { rowOffset: -2, colOffset: 1 },
            { rowOffset: -1, colOffset: -2 },
            { rowOffset: -1, colOffset: 2 },
            { rowOffset: 1, colOffset: -2 },
            { rowOffset: 1, colOffset: 2 },
            { rowOffset: 2, colOffset: -1 },
            { rowOffset: 2, colOffset: 1 },
        ];

        //#region Di chuyển và ăn quân
        for (const { rowOffset, colOffset } of offsets) {
            const targetRow = row + rowOffset;
            const targetCol = col + colOffset;

            if (isInsideBoard(targetRow, targetCol)) {
                const targetPiece = board.getPiece(targetRow, targetCol);

                if (targetPiece === null || targetPiece.color !== this.color) {
                    moves.push({ row: targetRow, col: targetCol });
                }
            }
        }
        //#endregion

        return moves;
    }

    clone() {
        return new Knight(this.color, this.position, this.hasMoved);
    }
}

export default Knight;
