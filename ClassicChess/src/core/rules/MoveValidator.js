// src/core/rules/MoveValidator.js
import CheckDetector from "./CheckDetector.js";
import Move from "../Move.js";

class MoveValidator {
    static getLegalMoves(piece, board) {
        const legalMoves = [];
        const possibleMoves = piece.getPossibleMoves(board);

        for (const targetCoords of possibleMoves) {
            const simulatedBoard = board.clone();
            const simulatedPiece = simulatedBoard.getPiece(
                piece.position.row,
                piece.position.col,
            );
            const capturedPiece = simulatedBoard.getPiece(targetCoords.row, targetCoords.col);

            const move = new Move({
                from: piece.position,
                to: targetCoords,
                piece: simulatedPiece,
                capturedPiece: capturedPiece,
            });

            simulatedBoard.executeMove(move);

            const isCheckAfterMove = CheckDetector.isKingInCheck(piece.color, simulatedBoard);

            if (!isCheckAfterMove) {
                legalMoves.push(targetCoords);
            }
        }

        return legalMoves;
    }
}

export default MoveValidator;
