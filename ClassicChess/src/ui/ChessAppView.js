// src/ui/ChessAppView.js
import BoardView from "./BoardView.js";
import PlayerBar from "./PlayerBar.js";
import SidebarView from "./SidebarView.js";

class ChessAppView {
    //#region Private Variables
    #rootContainer;
    #boardView;
    #topPlayerBar;
    #bottomPlayerBar;
    #sidebarView;
    //#endregion

    //#region Constructor
    constructor(rootContainer) {
        this.#rootContainer = rootContainer;
        this.#boardView = null;
        this.#topPlayerBar = null;
        this.#bottomPlayerBar = null;
        this.#sidebarView = null;
    }
    //#endregion

    //#region Getters
    get boardView() {
        return this.#boardView;
    }

    get topPlayerBar() {
        return this.#topPlayerBar;
    }

    get bottomPlayerBar() {
        return this.#bottomPlayerBar;
    }

    get sidebarView() {
        return this.#sidebarView;
    }
    //#endregion

    //#region Lifecycle Methods
    init({ onRestart, onResign, onDraw } = {}) {
        this.#rootContainer.innerHTML = "";

        const leftColumn = document.createElement("div");
        leftColumn.className = "game-left-column";

        this.#topPlayerBar = new PlayerBar({
            name: "Opponent",
            elo: 1500,
        });

        const boardMountPoint = document.createElement("div");
        boardMountPoint.style.display = "flex";
        boardMountPoint.style.alignItems = "center";
        boardMountPoint.style.justifyContent = "center";
        boardMountPoint.style.flex = "1";
        boardMountPoint.style.width = "100%";

        this.#boardView = new BoardView(boardMountPoint);

        this.#bottomPlayerBar = new PlayerBar({
            name: "Player",
            elo: 1500,
        });

        leftColumn.appendChild(this.#topPlayerBar.element);
        leftColumn.appendChild(boardMountPoint);
        leftColumn.appendChild(this.#bottomPlayerBar.element);

        this.#sidebarView = new SidebarView({
            onRestart,
            onResign,
            onDraw,
        });

        this.#rootContainer.appendChild(leftColumn);
        this.#rootContainer.appendChild(this.#sidebarView.element);
    }
    //#endregion
}

export default ChessAppView;
