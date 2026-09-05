// src/core/rules/CheckDetector.js
import { BOARD_SIZE, COLORS, PIECE_TYPES } from "../utils/constants.js";

class CheckDetector {
    static isSquareAttacked(targetPosition, attackingColor, board) {
        for (let row = 0; row < BOARD_SIZE; row++) {
            for (let col = 0; col < BOARD_SIZE; col++) {
                const piece = board.getPiece(row, col);

                if (piece === null || piece.color !== attackingColor) {
                    continue;
                }

                // Xử lý đoạn bị check mate bởi tốt
                if (piece.type === PIECE_TYPES.PAWN) {
                    const direction = piece.color === COLORS.WHITE ? -1 : 1;
                    const attackRow = row + direction;
                    const attackCols = [col - 1, col + 1];

                    if (
                        attackRow === targetPosition.row &&
                        attackCols.includes(targetPosition.col)
                    ) {
                        return true;
                    }
                    continue;
                }

                const possibleMoves = piece.getPossibleMoves(board);
                const isAttacking = possibleMoves.some(
                    (move) =>
                        move.row === targetPosition.row && move.col === targetPosition.col,
                );

                if (isAttacking) {
                    return true;
                }
            }
        }

        return false;
    }

    static isKingInCheck(kingColor, board) {
        const kingPosition = board.findKingPosition(kingColor);
        if (kingPosition === null) {
            return false;
        }

        const opponentColor = kingColor === COLORS.WHITE ? COLORS.BLACK : COLORS.WHITE;

        return CheckDetector.isSquareAttacked(kingPosition, opponentColor, board);
    }
}

export default CheckDetector;
