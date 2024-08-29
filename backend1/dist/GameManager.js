"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
const Game_1 = require("./Game");
const message_1 = require("./message");
//user,Game
class GameManager {
    constructor() {
        //constructor that initilaizes our game array;
        this.games = [];
        this.pendingUser = null;
        this.users = [];
    }
    addUser(socket) {
        this.users.push(socket);
        this.addHandler(socket);
    }
    removeUser(socket) {
        this.users = this.users.filter(users => users !== socket);
        //stop the game here because the user left
    }
    handleMessage() {
        //private means cannot be called from outside. Only accesible within the class.
    }
    addHandler(socket) {
        socket.on("message", (data) => {
            const message = JSON.parse(data.toString());
            if (message.type === message_1.INIT_GAME) {
                if (this.pendingUser) {
                    //start game
                    const game = new Game_1.Game(this.pendingUser, socket); //player1 player2
                    this.games.push(game);
                    this.pendingUser = null;
                }
                else {
                    this.pendingUser = socket;
                }
            }
            if (message.type === message_1.MOVE) {
                console.log("move initiated");
                const game = this.games.find(game => game.player1 === socket || game.player2 === socket);
                if (game) {
                    console.log("inside makeMove");
                    game.makeMove(socket, message.move);
                }
            }
        });
    }
}
exports.GameManager = GameManager;
