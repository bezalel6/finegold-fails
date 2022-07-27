import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import { analyze, Game } from "./GameParser";
import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Divider,
  Grid,
  IconButton,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { Info } from "@mui/icons-material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
let numAnalyzed: number, setNumAnalyzed: (num: number) => any;
function createSummary(): React.ReactNode {
  let numLoss = 0, numWin = 0;
  allCategories.forEach(c => {
    // console.log(c)
    if (c.kind === "fail") {
      numLoss += c.rarity * (!c.numMade ? 0 : c.numMade);
    } else {
      numWin += c.rarity * (!c.numMade ? 0 : c.numMade);
    }
  })
  return <h4>Finegold wins:{numWin} Finegold losses:{numLoss}</h4>
}
function App() {
  [numAnalyzed, setNumAnalyzed] = useState(0);
  const [summary, setSummery] = useState<React.ReactNode>();
  useEffect(() => {
    setSummery(createSummary());
  }, [numAnalyzed, setNumAnalyzed])
  // const darkTheme = createTheme({
  //   palette: {
  //     mode: "dark",
  //   },
  // });


  return (
    <>
      <CssBaseline />
      <main>
        <img src="icon.svg" className="App-logo" />

        <form
          className="form"
          onSubmit={(e) => {
            e.preventDefault();

            resetEverything()
            analyze((document.getElementById('username') as HTMLInputElement).value);
          }}
        >
          <TextField
            required
            placeholder="bbb"
            value={"bezalel6"}
            label="Username"
            variant="filled"
            id="username"
          ></TextField>
          <br />
          <Button type="submit" variant="contained">
            Analyze Games
          </Button>
        </form>
        <h3>{numAnalyzed} games analyzed</h3>
        {summary}
        {allCategories.map(c => <Category key={c.name} category={c}></Category>)}
      </main>
    </>
  );
}
function resetEverything() {
  setNumAnalyzed(0);
  backupNum = 0;
  allCategories.forEach(a => { a.resetCategory!() })
}
enum Rarity {
  Common = 1,
  Uncommon = 2,
  Epic = 4,
  Legendary = 6,
}
export const f3Mate: CategoryInterface = {
  name: "F3#",
  explanation: "mated with f3",
  rarity: Rarity.Legendary,
  kind: "win"
}
export const f3Check: CategoryInterface = {
  name: "F3+",
  explanation: "checked with f3. what? couldnt resist check?",
  rarity: Rarity.Common,
  kind: "fail"
}
export const f3: CategoryInterface = {
  name: "F3",
  explanation: "NEVER PLAY F3",
  rarity: Rarity.Common,
  kind: "fail"
}
export const f3StillWon: CategoryInterface = {
  name: "F3 and still won",
  explanation: "you learned a bad lesson. played f3 and still won.",
  rarity: Rarity.Legendary,
  kind: "fail"
}
export const f3Drew: CategoryInterface = {
  name: "F3 and drew",
  explanation: "you learned a bad lesson. you managed to squeeze a draw after playing f3",
  rarity: Rarity.Epic,
  kind: "fail"
}
export const drew: CategoryInterface = {
  name: "Drew",
  explanation: "you tried to win, and failed. lesson is never try.",
  rarity: Rarity.Uncommon,
  kind: "fail"
}
export const won: CategoryInterface = {
  name: "Won",
  explanation: "you won somehow!",
  rarity: Rarity.Epic,
  kind: "win"
}
export const lost: CategoryInterface = {
  name: "Lost",
  explanation: "you tried to win, and you failed. lesson is never try.",
  rarity: Rarity.Common,
  kind: "fail"
}
const allCategories = [f3, f3Check, f3Mate, f3StillWon, f3Drew, drew, won, lost];
type Kind = "fail" | "win";
interface CategoryInterface {
  name: string;
  explanation: string;
  rarity: Rarity;
  kind: Kind;
  exampleBoard?: string;
  exampleVideo?: string;
  numMade?: number;
  addToCategory?: (game: Game) => void;
  resetCategory?: () => void;
}
type CategoryProps = { category: CategoryInterface; };
function Category({ category }: CategoryProps) {
  const [arr, setArr] = useState(new Array<React.ReactNode>());
  function createChild(game: Game) {
    const src = "fail.svg"
    return <a href={game.site} target={"_blank"} className={"failContainer"}> <img src={src} key={Date.now()} className={category.kind + " icon"} /></a>
  }
  useEffect(() => {
    category.addToCategory = (game: Game) => {
      category.numMade = category.numMade ? category.numMade + 1 : 1;
      setArr([...arr, createChild(game)]);
    }
    category.resetCategory = () => {
      category.numMade = 0;
      setArr([]);
    }
  }, [arr, setArr])
  return (
    <div className={"category"}>
      <Card >
        <Box sx={{ p: 2, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Typography fontWeight={700} fontSize={25} >
            {category.name}
            <Typography className={"rarity " + Rarity[category.rarity].toLowerCase()} fontSize={20} fontWeight={600} >
              {Rarity[category.rarity]}
            </Typography>
          </Typography>


          <Typography fontWeight={700} fontSize={15}>
            {category.explanation}
          </Typography>
        </Box>
        <Divider></Divider>
        <div className="fails">{arr}</div>

      </Card>
    </div>
  );
}
let backupNum: number | null = null;
export function analyzedGame() {
  if (backupNum === null)
    backupNum = numAnalyzed + 1
  else backupNum++
  setNumAnalyzed(backupNum)
}
export default App;
