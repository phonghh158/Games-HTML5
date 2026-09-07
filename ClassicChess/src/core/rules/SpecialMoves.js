// src/core/rules/SpecialMoves.js
import { COLORS, PIECE_TYPES } from "../utils/constants.js";
import CheckDetector from "./CheckDetector.js";
import Move from "../Move.js";

class SpecialMoves {
    // Nhập thành
    static getCastlingMoves(king, board) {
        const moves = [];

        if (king.hasMoved) {
            return moves;
        }

        const opponentColor = king.color === COLORS.WHITE ? COLORS.BLACK : COLORS.WHITE;

        if (CheckDetector.isKingInCheck(king.color, board)) {
            return moves;
        }

        const { row, col } = king.position;

        // Nhập thành gần
        const kingsideRook = board.getPiece(row, 7);
        if (
            kingsideRook !== null &&
            kingsideRook.type === PIECE_TYPES.ROOK &&
            !kingsideRook.hasMoved
        ) {
            const isPathClear =
                board.getPiece(row, 5) === null && board.getPiece(row, 6) === null;

            if (isPathClear) {
                const isPathSafe =
                    !CheckDetector.isSquareAttacked({ row, col: 5 }, opponentColor, board) &&
                    !CheckDetector.isSquareAttacked({ row, col: 6 }, opponentColor, board);

                if (isPathSafe) {
                    moves.push({
                        from: { row, col },
                        to: { row, col: 6 },
                        isCastling: true,
                        rookFrom: { row, col: 7 },
                        rookTo: { row, col: 5 },
                    });
                }
            }
        }

        // Nhập thành xa
        const queensideRook = board.getPiece(row, 0);
        if (
            queensideRook !== null &&
            queensideRook.type === PIECE_TYPES.ROOK &&
            !queensideRook.hasMoved
        ) {
            const isPathClear =
                board.getPiece(row, 1) === null &&
                board.getPiece(row, 2) === null &&
                board.getPiece(row, 3) === null;

            if (isPathClear) {
                const isPathSafe =
                    !CheckDetector.isSquareAttacked({ row, col: 2 }, opponentColor, board) &&
                    !CheckDetector.isSquareAttacked({ row, col: 3 }, opponentColor, board);

                if (isPathSafe) {
                    moves.push({
                        from: { row, col },
                        to: { row, col: 2 },
                        isCastling: true,
                        rookFrom: { row, col: 0 },
                        rookTo: { row, col: 3 },
                    });
                }
            }
        }

        return moves;
    }

    // Bắt tốt qua đường
    static getEnPassantMove(pawn, board, lastMove) {
        if (!lastMove) {
            return null;
        }

        const isOpponentPawn =
            lastMove.piece.type === PIECE_TYPES.PAWN && lastMove.piece.color !== pawn.color;

        const isDoubleStep = Math.abs(lastMove.to.row - lastMove.from.row) === 2;

        if (!isOpponentPawn || !isDoubleStep) {
            return null;
        }

        const { row, col } = pawn.position;
        const isHorizontallyAdjacent =
            lastMove.to.row === row && Math.abs(lastMove.to.col - col) === 1;

        if (!isHorizontallyAdjacent) {
            return null;
        }

        const direction = pawn.color === COLORS.WHITE ? -1 : 1;
        const targetCoords = {
            row: row + direction,
            col: lastMove.to.col,
        };

        const simulatedBoard = board.clone();
        const simulatedPawn = simulatedBoard.getPiece(row, col);
        const targetPawn = simulatedBoard.getPiece(lastMove.to.row, lastMove.to.col);

        const move = new Move({
            from: { row, col },
            to: targetCoords,
            piece: simulatedPawn,
            capturedPiece: targetPawn,
            isEnPassant: true,
        });

        simulatedBoard.executeMove(move);
        simulatedBoard.setPiece(lastMove.to.row, lastMove.to.col, null);

        const isCheckAfterMove = CheckDetector.isKingInCheck(pawn.color, simulatedBoard);

        if (!isCheckAfterMove) {
            return {
                from: { row, col },
                to: targetCoords,
                isEnPassant: true,
                capturedPosition: { row: lastMove.to.row, col: lastMove.to.col },
            };
        }

        return null;
    }

    // Phong cấp
    static isPromotion(pawn, targetRow) {
        const promotionRow = pawn.color === COLORS.WHITE ? 0 : 7;
        return pawn.type === PIECE_TYPES.PAWN && targetRow === promotionRow;
    }
}

export default SpecialMoves;
