// src/core/pieces/Pawn.js
import Piece from "./Piece.js";
import { COLORS, PIECE_TYPES } from "../utils/constants.js";
import { isInsideBoard } from "../utils/helpers.js";

class Pawn extends Piece {
    constructor(color, position, hasMoved = false) {
        super(PIECE_TYPES.PAWN, color, position, hasMoved);
    }

    getPossibleMoves(board) {
        const moves = [];
        const { row, col } = this.position;
        const direction = this.color === COLORS.WHITE ? -1 : 1;
        const startRow = this.color === COLORS.WHITE ? 6 : 1;

        //#region Di chuyển và ăn quân
        // Tiến 1 ô
        const oneStepRow = row + direction;
        if (isInsideBoard(oneStepRow, col) && board.getPiece(oneStepRow, col) === null) {
            moves.push({ row: oneStepRow, col });

            // Tiến 2 ô
            const twoStepRow = row + 2 * direction;
            if (row === startRow && board.getPiece(twoStepRow, col) === null) {
                moves.push({ row: twoStepRow, col });
            }
        }

        // Ăn quân
        const captureOffsets = [-1, 1];
        for (const offset of captureOffsets) {
            const targetRow = row + direction;
            const targetCol = col + offset;

            if (isInsideBoard(targetRow, targetCol)) {
                const targetPiece = board.getPiece(targetRow, targetCol);
                if (targetPiece !== null && targetPiece.color !== this.color) {
                    moves.push({ row: targetRow, col: targetCol });
                }
            }
        }
        //#endregion

        return moves;
    }

    clone() {
        return new Pawn(this.color, this.position, this.hasMoved);
    }
}

export default Pawn;
