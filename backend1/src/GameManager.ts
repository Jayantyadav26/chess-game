import WebSocket from "ws";
import { Game } from "./Game";
import { INIT_GAME, MOVE } from "./message";

//user,Game

export class GameManager{
    //create a game array using Game class
    private games: Game[]; 
    private pendingUser : WebSocket|null; //user waiting to get connected.
    private users : WebSocket[];

    constructor(){
        //constructor that initilaizes our game array;
        this.games = [];
        this.pendingUser = null;
        this.users = [];
    }

    addUser(socket : WebSocket){
        this.users.push(socket);
    }

    removeUser(socket : WebSocket){
        this.users = this.users.filter(users => users !== socket);
        //stop the game here because the user left
    }

    private handleMessage(){
        //private means cannot be called from outside. Only accesible within the class.

    }

    private addHandler(socket : WebSocket){
        socket.on("message",(data)=>{
            const message = JSON.parse(data.toString());
            if(message.type === INIT_GAME){
                if(this.pendingUser){
                    //start game
                    const game = new Game(this.pendingUser,socket); //player1 player2
                    this.games.push(game);
                    this.pendingUser = null;
                }
                else{
                    this.pendingUser = socket;
                }
            }

            if(message.type === MOVE){
                const game = this.games.find(game => game.player1 === socket || game.player2 === socket);
                    if(game){
                        game.makeMove(socket , message.move);
                    }

            }
            
        })
    }

}