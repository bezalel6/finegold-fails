import { TurnRightSharp } from "@mui/icons-material";
import { config } from "dotenv";
import { analyzedGame, f3 } from "./App";
config();
const max = 10;
let myUsername: string
export function analyze(username: string) {
  myUsername = username;
  const headers = {
    Authorization: "Bearer " + process.env.REACT_APP_lichessToken,
    // "Content-Type": "application/x-ndjson",
    // Accept: "application/x-ndjson",
  };

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
  analyzedGame();
  const game = new Game(gameStr);
  if (!game.event.includes("Rated")) {
    alert("got an unrated game")
  }
  // if (game.moves.includes(" f3")) {
  //   f3.addToCategory!()
  // }
  if (game.myMoves.find(s => s === "f3")) {
    f3.addToCategory!()
  }
}
class Game {
  event: string;
  site: string;
  white: string;
  black: string;
  result: GameResult;
  termination: Termination;
  moves: string;
  whiteMoves: string[];
  blackMoves: string[];
  constructor(pgn: string) {
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

  get myMoves(): string[] {
    return myUsername === this.black ? this.blackMoves : this.whiteMoves;
  }
  get opponentMoves(): string[] {
    return myUsername === this.white ? this.blackMoves : this.whiteMoves;
  }

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
