import { TurnRightSharp } from "@mui/icons-material";
import { analyzedGame } from "./App";
import { drew, f3, f3ConfuseOnTime, f3Drew, f3Mate, f3StillWon, lost, opponentPlayedF3, opponentPlayedF3Lost, opponentPlayedF3Won, won } from "./Categories";
const max = 500;
let myUsername: string
export async function analyze(username: string, accessToken: string | undefined) {



  const userDetailsF = await fetch("https://lichess.org/api/user/" + username)
  const userDetails: { count: { rated: number } } = await userDetailsF.json();

  console.log(userDetails.count.rated);

  myUsername = username;
  let headers = {
    // Authorization: "Bearer " + process.env.REACT_APP_lichessToken,
    // "Content-Type": "application/x-ndjson",
    // Accept: "application/x-ndjson",
  };
  if (accessToken) {
    headers = {
      ...headers,
      Authorization: "Bearer " + accessToken
    }
  }

  fetch(`https://lichess.org/api/games/user/${username}?max=${max}&rated=true`, {
    headers,
    mode: "cors",
  }).then((res) => {
    // stream the response body as text
    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    const read = () => {
      reader.read().then((result) => {
        if (result.done) {
          console.log("done reading!");
          //   console.log("majesty", chunks.join(""));
          return;
        }
        const got = decoder.decode(result.value, { stream: true });
        got
          .split("\n\n\n")
          .filter((split) => split.trim())
          .forEach(game);
        read();
      });
    };
    read();
  });
}
function game(gameStr: string) {
  //   console.log("got", game, new Game(game));
  const game = new Game(gameStr);
  analyzedGame();
  const dynamicF3: DynamicMove = { row: 3, col: "f" };
  if (game.didIPlay(dynamicF3)) {

    f3.addToCategory!(game)
    if (game.myMoves[game.myMoves.length - 1] === game.convertDynamic(dynamicF3, myUsername)) {
      if (game.didLose) {

      } else if (game.termination === "Time forfeit") {
        f3ConfuseOnTime.addToCategory!(game)
      } else {
        f3Mate.addToCategory!(game);
      }
    }
    if (game.didWin) {

      f3StillWon.addToCategory!(game);
    }
    if (game.didDraw) {
      f3Drew.addToCategory!(game);
    }
  }
  if (game.didOpponentPlay(dynamicF3, true)) {
    opponentPlayedF3.addToCategory!(game);
    if (game.didWin) {
      opponentPlayedF3Won.addToCategory!(game);
    } else if (!game.didDraw) {
      opponentPlayedF3Lost.addToCategory!(game);
    }
  }
  switch (game.perspectiveResult) {
    case "i drew": {
      drew.addToCategory!(game);
      break;
    } case "i lost": {
      lost.addToCategory!(game);
      break;
    }
    case "i won": {
      won.addToCategory!(game);
      break;
    }

  }
}
export class Game {
  event: string;
  site: string;
  white: string;
  black: string;
  result: GameResult;
  termination: Termination;
  moves: string;
  whiteMoves: string[];
  blackMoves: string[];
  pgn:string;
  constructor(pgn: string) {
    this.pgn = pgn;
    this.event = pgnProperty("Event", pgn);
    this.site = pgnProperty("Site", pgn);
    this.white = pgnProperty("White", pgn);
    this.black = pgnProperty("Black", pgn);
    this.result = pgnProperty("Result", pgn) as GameResult;
    this.termination = pgnProperty("Termination", pgn) as Termination;
    this.moves = pgn.match("\n(1[.].+)")!.at(1)!;
    this.whiteMoves = [];
    this.blackMoves = [];
    const m = this.moves.split(/[0-9]+[.] /);
    for (let i = 1; i < m.length; i++) {
      const [whiteM, blackM] = m[i].split(' ').filter(s => !!s.trim().length);
      if (!(this.result === "1-0" && i === m.length - 1)) {
        this.blackMoves.push(blackM);
      }
      this.whiteMoves.push(whiteM);

    }
  }

  get didWin(): boolean {
    return (this.result === "1-0" && this.isWhite) || (this.result === "0-1" && !this.isWhite)
  }
  get didDraw(): boolean {
    return this.result === "1/2-1/2";
  }
  get didLose(): boolean {
    return !this.didDraw;
  }
  get myMoves(): string[] {
    return this.isWhite ? this.whiteMoves : this.blackMoves;
  }
  get opponentMoves(): string[] {
    return this.isWhite ? this.blackMoves : this.whiteMoves;
  }
  get isWhite(): boolean {
    return myUsername === this.white;
  }
  get opponentUsername(): string {
    return this.isWhite ? this.black : this.white;
  }

  get perspectiveResult(): "i won" | "i lost" | "i drew" {
    return this.didWin ? "i won" : this.didLose ? "i lost" : "i drew";
  }
  didIPlay(move: string | DynamicMove, exact: boolean = false) {
    // check if move is a string or dynamic move
    if (typeof move === "string") {
      return this.didPlay(move, this.myMoves, exact);
    }

    return this.didPlay(this.convertDynamic(move, myUsername), this.myMoves, exact);
  }

  didOpponentPlay(move: string | DynamicMove, exact: boolean = false) {
    // check if move is a string or dynamic move
    if (typeof move === "string") {
      return this.didPlay(move, this.opponentMoves, exact);
    }

    return this.didPlay(this.convertDynamic(move, this.opponentUsername), this.opponentMoves, exact);
  }

  didPlay(move: string, moves: string[], exact: boolean) {
    return moves.find(m => (exact ? m === move : m.includes(move)))
  }
  convertDynamic(move: DynamicMove, player: string) {
    if (player === this.white) {
      return move.col + "" + move.row;
    }
    const a = Math.abs(move.row - 8) + 1
    return move.col + "" + a;
  }
}

type Column = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h"
type Row = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
//will adjust to fit player
interface DynamicMove {
  col: Column;
  row: Row;
}

type Termination =
  | "Abandoned"
  | "Death"
  | "Emergency"
  | "Normal"
  | "Rules infraction"
  | "Time forfeit";
type GameResult = "1-0" | "0-1" | "1/2-1/2";

function pgnProperty(property: string, pgn: string): string {
  return pgn.match(`\\[${property} "([^"]+)`)?.at(1)!;
}
