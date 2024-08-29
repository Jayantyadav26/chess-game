import WebSocket from "ws";
import { BLACK, Chess } from 'chess.js'
import { GAME_OVER, INIT_GAME, MOVE } from "./message";

export class Game{
    public player1:WebSocket;
    public player2:WebSocket;
    public board: Chess;
    public startTime : Date;


    constructor(player1 : WebSocket, player2:WebSocket){
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.startTime = new Date();
        this.player1.send(JSON.stringify({
            type: INIT_GAME,
            payload:{
                color:"white"
            }
        }))
        this.player2.send(JSON.stringify({
            type: INIT_GAME,
            payload:{
                color:"black"
            }
        }))
    }

    makeMove(socket : WebSocket , move: {
        from: string;
        to: string;
    }){
        //Validate the type of move using zod
        if(this.board.move.length % 2 ===0 && socket !== this.player1){
            return ;
        }
        if(this.board.move.length % 2 ===0 && socket !== this.player2){
            return ;
        }
        try{
            this.board.move(move);
        }
        catch{
            return;
        }

        if(this.board.isGameOver()){
            this.player1.emit(JSON.stringify({
                type: GAME_OVER,
                playload:{
                    winner: this.board.turn() === 'w'? "black":"white"
                }
            }))
        
        if(this.board.move.length %2 ===0){
            this.player2.emit(JSON.stringify({
                type:MOVE,
                payload:move,
            }))
        } else {
            this.player1.emit(JSON.stringify({
                type: MOVE,
                payload: move,
            }))
        }
            return ;
  
        }
    }
}