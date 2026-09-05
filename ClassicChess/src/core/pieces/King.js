// src/core/pieces/King.js
import Piece from "./Piece.js";
import { PIECE_TYPES } from "../utils/constants.js";
import { isInsideBoard } from "../utils/helpers.js";

class King extends Piece {
    constructor(color, position, hasMoved = false) {
        super(PIECE_TYPES.KING, color, position, hasMoved);
    }

    getPossibleMoves(board) {
        const moves = [];
        const { row, col } = this.position;
        const directions = [
            { rowOffset: -1, colOffset: 0 },
            { rowOffset: 1, colOffset: 0 },
            { rowOffset: 0, colOffset: -1 },
            { rowOffset: 0, colOffset: 1 },
            { rowOffset: -1, colOffset: -1 },
            { rowOffset: -1, colOffset: 1 },
            { rowOffset: 1, colOffset: -1 },
            { rowOffset: 1, colOffset: 1 },
        ];

        //#region Di chuyển và ăn quân thông thường
        for (const { rowOffset, colOffset } of directions) {
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
        return new King(this.color, this.position, this.hasMoved);
    }
}

export default King;
