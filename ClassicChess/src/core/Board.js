// src/core/Board.js
import { BOARD_SIZE, COLORS, PIECE_TYPES } from "./utils/constants.js";
import Pawn from "./pieces/Pawn.js";
import Rook from "./pieces/Rook.js";
import Knight from "./pieces/Knight.js";
import Bishop from "./pieces/Bishop.js";
import Queen from "./pieces/Queen.js";
import King from "./pieces/King.js";

class Board {
    //#region Private Variable
    #grid;
    //#endregion

    //#region Constructor
    constructor() {
        this.#grid = this.#createEmptyGrid();
    }
    //#endregion

    //#region Private Helper Methods
    #createEmptyGrid() {
        return Array.from({ length: BOARD_SIZE }, () =>
            Array.from({ length: BOARD_SIZE }, () => null),
        );
    }
    //#endregion

    //#region Public Methods
    getPiece(row, col) {
        return this.#grid[row][col];
    }

    setPiece(row, col, piece) {
        this.#grid[row][col] = piece;
        if (piece !== null) {
            piece.position = { row, col };
        }
    }

    setupInitialBoard() {
        this.#grid = this.#createEmptyGrid();

        // Khởi tạo hàng tốt
        for (let col = 0; col < BOARD_SIZE; col++) {
            this.setPiece(1, col, new Pawn(COLORS.BLACK, { row: 1, col }));
            this.setPiece(6, col, new Pawn(COLORS.WHITE, { row: 6, col }));
        }

        // Khởi tạo các quân còn lại
        const majorPiecesOrder = [Rook, Knight, Bishop, Queen, King, Bishop, Knight, Rook];

        for (let col = 0; col < BOARD_SIZE; col++) {
            const PieceClass = majorPiecesOrder[col];
            this.setPiece(0, col, new PieceClass(COLORS.BLACK, { row: 0, col }));
            this.setPiece(7, col, new PieceClass(COLORS.WHITE, { row: 7, col }));
        }
    }

    executeMove(move) {
        const { from, to, piece } = move;

        this.setPiece(from.row, from.col, null);
        this.setPiece(to.row, to.col, piece);
        piece.hasMoved = true;
    }

    findKingPosition(color) {
        for (let row = 0; row < BOARD_SIZE; row++) {
            for (let col = 0; col < BOARD_SIZE; col++) {
                const piece = this.getPiece(row, col);
                if (
                    piece !== null &&
                    piece.type === PIECE_TYPES.KING &&
                    piece.color === color
                ) {
                    return { row, col };
                }
            }
        }
        return null;
    }

    clone() {
        const clonedBoard = new Board();
        for (let row = 0; row < BOARD_SIZE; row++) {
            for (let col = 0; col < BOARD_SIZE; col++) {
                const piece = this.getPiece(row, col);
                if (piece !== null) {
                    clonedBoard.setPiece(row, col, piece.clone());
                }
            }
        }
        return clonedBoard;
    }
    //#endregion
}

export default Board;
