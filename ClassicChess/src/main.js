// src/main.js
import GameState from "./core/GameState.js";
import ChessAppView from "./ui/ChessAppView.js";
import GameController from "./controllers/GameController.js";

document.addEventListener("DOMContentLoaded", () => {
    const rootContainer = document.getElementById("game-container");
    const themeToggleBtn = document.getElementById("theme-toggle-btn");

    if (!rootContainer) {
        throw new Error("Game container element not found (#game-container)");
    }

    // Khoi tao giao dien tong the
    const chessAppView = new ChessAppView(rootContainer);

    // Khoi tao du lieu game va bo dieu phoi
    const gameState = new GameState();
    let gameController = null;

    const startNewGame = () => {
        if (gameController) {
            gameController.destroy();
        }
        gameController = new GameController(gameState, chessAppView.boardView);
        gameController.init();
    };

    chessAppView.init({
        onRestart: () => {
            startNewGame();
        },
        onResign: () => {
            console.log("Player resigned.");
        },
        onDraw: () => {
            console.log("Draw offered.");
        },
    });

    // Bat dau van co dau tien
    startNewGame();

    // Xu ly chuyen doi Dark / Light mode
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            const htmlElement = document.documentElement;
            const currentTheme = htmlElement.getAttribute("data-theme");
            const newTheme = currentTheme === "dark" ? "light" : "dark";

            htmlElement.setAttribute("data-theme", newTheme);
            themeToggleBtn.textContent = newTheme === "dark" ? "☼" : "☾";
        });
    }
});
