// src/core/GameState.js
import { COLORS, GAME_STATUS, PIECE_TYPES } from "./utils/constants.js";
import Board from "./Board.js";
import CheckDetector from "./rules/CheckDetector.js";
import MoveGenerator from "./rules/MoveGenerator.js";
import Rook from "./pieces/Rook.js";
import Knight from "./pieces/Knight.js";
import Bishop from "./pieces/Bishop.js";
import Queen from "./pieces/Queen.js";

class GameState {
    //#region Private Variables
    #board;
    #currentTurn;
    #status;
    #moveHistory;
    #capturedPieces;
    //#endregion

    //#region Constructor
    constructor() {
        this.#board = new Board();
        this.#currentTurn = COLORS.WHITE;
        this.#status = GAME_STATUS.ACTIVE;
        this.#moveHistory = [];
        this.#capturedPieces = {
            [COLORS.WHITE]: [],
            [COLORS.BLACK]: [],
        };
    }
    //#endregion

    //#region Getters
    get board() {
        return this.#board;
    }

    get currentTurn() {
        return this.#currentTurn;
    }

    get status() {
        return this.#status;
    }

    get moveHistory() {
        return [...this.#moveHistory];
    }

    get capturedPieces() {
        return {
            [COLORS.WHITE]: [...this.#capturedPieces[COLORS.WHITE]],
            [COLORS.BLACK]: [...this.#capturedPieces[COLORS.BLACK]],
        };
    }

    get lastMove() {
        if (this.#moveHistory.length === 0) {
            return null;
        }
        return this.#moveHistory[this.#moveHistory.length - 1];
    }
    //#endregion

    //#region Game Lifecycle Methods
    init() {
        this.#board.setupInitialBoard();
        this.#currentTurn = COLORS.WHITE;
        this.#status = GAME_STATUS.ACTIVE;
        this.#moveHistory = [];
        this.#capturedPieces = {
            [COLORS.WHITE]: [],
            [COLORS.BLACK]: [],
        };
    }

    makeMove(move) {
        if (this.#status === GAME_STATUS.CHECKMATE || this.#status === GAME_STATUS.STALEMATE) {
            return false;
        }

        const { from, to, piece, isCastling, isEnPassant, promotionPieceType } = move;

        // 1. Xu ly an quan
        if (isEnPassant) {
            const capturedRow = from.row;
            const capturedCol = to.col;
            const capturedPawn = this.#board.getPiece(capturedRow, capturedCol);
            if (capturedPawn !== null) {
                this.#capturedPieces[this.#currentTurn].push(capturedPawn);
                this.#board.setPiece(capturedRow, capturedCol, null);
            }
        } else {
            const targetPiece = this.#board.getPiece(to.row, to.col);
            if (targetPiece !== null) {
                this.#capturedPieces[this.#currentTurn].push(targetPiece);
            }
        }

        // 2. Thuc thi di chuyen tren ban co
        this.#board.executeMove(move);

        // 3. Xu ly di chuyen bo sung khi Nhap thanh
        if (isCastling) {
            const isKingside = to.col === 6;
            const rookFromCol = isKingside ? 7 : 0;
            const rookToCol = isKingside ? 5 : 3;
            const rook = this.#board.getPiece(from.row, rookFromCol);

            this.#board.setPiece(from.row, rookFromCol, null);
            this.#board.setPiece(from.row, rookToCol, rook);
            if (rook !== null) {
                rook.hasMoved = true;
            }
        }

        // 4. Xu ly Phong cap
        if (promotionPieceType !== null && piece.type === PIECE_TYPES.PAWN) {
            const PromotedClass = this.#getPromotionClass(promotionPieceType);
            const promotedPiece = new PromotedClass(
                piece.color,
                { row: to.row, col: to.col },
                true,
            );
            this.#board.setPiece(to.row, to.col, promotedPiece);
        }

        // 5. Luu lich su nuoc di
        this.#moveHistory.push(move);

        // 6. Chuyen luot va cap nhat trang thai tran dau
        this.#switchTurn();
        this.#updateGameStatus();

        return true;
    }
    //#endregion

    //#region Private Helpers
    #switchTurn() {
        this.#currentTurn = this.#currentTurn === COLORS.WHITE ? COLORS.BLACK : COLORS.WHITE;
    }

    #getPromotionClass(type) {
        switch (type) {
            case PIECE_TYPES.ROOK:
                return Rook;
            case PIECE_TYPES.KNIGHT:
                return Knight;
            case PIECE_TYPES.BISHOP:
                return Bishop;
            case PIECE_TYPES.QUEEN:
            default:
                return Queen;
        }
    }

    #updateGameStatus() {
        const isCurrentInCheck = CheckDetector.isKingInCheck(this.#currentTurn, this.#board);
        const hasMoves = MoveGenerator.hasAnyLegalMoves(
            this.#currentTurn,
            this.#board,
            this.lastMove,
        );

        if (!hasMoves) {
            if (isCurrentInCheck) {
                this.#status = GAME_STATUS.CHECKMATE;
            } else {
                this.#status = GAME_STATUS.STALEMATE;
            }
            return;
        }

        if (isCurrentInCheck) {
            this.#status = GAME_STATUS.CHECK;
        } else {
            this.#status = GAME_STATUS.ACTIVE;
        }
    }
    //#endregion
}

export default GameState;
