// src/controllers/GameController.js
import Move from "../core/Move.js";
import MoveValidator from "../core/rules/MoveValidator.js";
import SpecialMoves from "../core/rules/SpecialMoves.js";
import InputHandler from "./InputHandler.js";

class GameController {
    //#region Private Variables
    #gameState;
    #boardView;
    #inputHandler;
    #selectedSquare;
    #validMoves;
    //#endregion

    //#region Constructor
    constructor(gameState, boardView) {
        this.#gameState = gameState;
        this.#boardView = boardView;
        this.#inputHandler = null;
        this.#selectedSquare = null;
        this.#validMoves = [];
    }
    //#endregion

    //#region Lifecycle Methods
    init() {
        this.#gameState.init();
        this.#boardView.init();
        this.#inputHandler = new InputHandler(
            this.#boardView.boardElement,
            this.handleSquareClick.bind(this),
        );
        this.#updateView();
    }

    destroy() {
        if (this.#inputHandler) {
            this.#inputHandler.destroy();
            this.#inputHandler = null;
        }
    }
    //#endregion

    //#region Interaction Handling
    async handleSquareClick({ row, col }) {
        const board = this.#gameState.board;
        const clickedPiece = board.getPiece(row, col);

        // 1. Truong hop da chon 1 quan co truoc do va click vao mot o
        if (this.#selectedSquare !== null) {
            const targetMove = this.#validMoves.find(
                (move) => move.to.row === row && move.to.col === col,
            );

            if (targetMove) {
                await this.#executeMoveFlow(targetMove);
                this.#clearSelection();
                return;
            }

            // Click lai chinh o dang chon de huy chon
            if (this.#selectedSquare.row === row && this.#selectedSquare.col === col) {
                this.#clearSelection();
                return;
            }
        }

        // 2. Chon quan co moi thuoc luot di hien tai
        if (clickedPiece !== null && clickedPiece.color === this.#gameState.currentTurn) {
            this.#selectSquare({ row, col }, clickedPiece);
        } else {
            this.#clearSelection();
        }
    }
    //#endregion

    //#region Private Helpers
    #selectSquare(position, piece) {
        this.#selectedSquare = position;
        const board = this.#gameState.board;
        const lastMove = this.#gameState.lastMove;

        this.#validMoves = [];

        // Lay cac nuoc di thong thuong da qua kiem duyet chieu
        const legalCoords = MoveValidator.getLegalMoves(piece, board);
        for (const targetCoords of legalCoords) {
            const capturedPiece = board.getPiece(targetCoords.row, targetCoords.col);
            const isPromotion = SpecialMoves.isPromotion(piece, targetCoords.row);

            this.#validMoves.push(
                new Move({
                    from: position,
                    to: targetCoords,
                    piece,
                    capturedPiece,
                    promotionPieceType: isPromotion ? "PENDING" : null,
                }),
            );
        }

        // Lay nuoc nhap thanh neu la Vua
        if (piece.type === "KING") {
            const castlingMoves = SpecialMoves.getCastlingMoves(piece, board);
            for (const castlingData of castlingMoves) {
                this.#validMoves.push(
                    new Move({
                        from: castlingData.from,
                        to: castlingData.to,
                        piece,
                        isCastling: true,
                    }),
                );
            }
        }

        // Lay nuoc bat tot qua duong neu la Tot
        if (piece.type === "PAWN" && lastMove !== null) {
            const enPassantData = SpecialMoves.getEnPassantMove(piece, board, lastMove);
            if (enPassantData !== null) {
                const capturedPiece = board.getPiece(
                    enPassantData.capturedPosition.row,
                    enPassantData.capturedPosition.col,
                );
                this.#validMoves.push(
                    new Move({
                        from: enPassantData.from,
                        to: enPassantData.to,
                        piece,
                        capturedPiece,
                        isEnPassant: true,
                    }),
                );
            }
        }

        this.#boardView.highlightSelectedSquare(position);
        this.#boardView.highlightValidMoves(this.#validMoves.map((m) => m.to));
    }

    #clearSelection() {
        this.#selectedSquare = null;
        this.#validMoves = [];
        this.#boardView.clearHighlights();
    }

    async #executeMoveFlow(move) {
        let finalMove = move;

        // Xu ly lua chon quan co khi phong cap
        if (move.promotionPieceType === "PENDING") {
            const chosenType = await this.#boardView.showPromotionModal(move.piece.color);
            finalMove = new Move({
                from: move.from,
                to: move.to,
                piece: move.piece,
                capturedPiece: move.capturedPiece,
                promotionPieceType: chosenType,
            });
        }

        const success = this.#gameState.makeMove(finalMove);
        if (success) {
            this.#updateView();
        }
    }

    #updateView() {
        this.#boardView.render(this.#gameState.board);
        this.#boardView.updateStatus(this.#gameState.status, this.#gameState.currentTurn);
    }
    //#endregion
}

export default GameController;
