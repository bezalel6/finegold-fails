/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import { analyze } from "./GameParser";
import {
  Button,
  Card,
  Slide,
  TextField,
  Tooltip,
} from "@mui/material";
import { Info } from "@mui/icons-material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { allCategories, CategoryInterface, outerCategoriesArr } from "./Categories";
import { Ctrl } from "./Auth";
import { TransitionProps } from "@mui/material/transitions";
import { fontSize } from "@mui/system";
import { Scales } from "./Scales";
import { LoginComponent } from "./LoginComponent";
import { Category } from "./Category";
let numAnalyzed: number, setNumAnalyzed: (num: number) => any;
export let createdChildren: Array<React.ReactNode> = [];
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
  // return <h4>Finegold wins:{numWin} Finegold losses:{numLoss}</h4>
  return <Card className="summary"><h2>finegold sins: {numLoss} redemptions: {numWin}</h2>{createdChildren.map(ch => {
    return ch
  })}
    <h3>{numAnalyzed} games analyzed</h3>
  </Card>

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
  let ct = useRef(new Ctrl()).current;
  useEffect(() => {
    console.log("initing")
    ct.init()
  }, [])
  return (
    <>
      <CssBaseline />
      <main>
        <Scales></Scales>
        {/* <img src="icon.svg" className="App-logo" /> */}
        <h1 className="App-header">Finegold sins</h1>
        <h3>How is your karma these days? you better be on ben's good side or he'll have to beat you <Tooltip title={<h2>to death</h2>} followCursor><div className="inline interest"> old fashion style</div></Tooltip></h3>
        <form
          className="form"
          onSubmit={(e) => {
            e.preventDefault();

            resetEverything();
            analyze((document.getElementById('username') as HTMLInputElement).value, ct.accessContext?.token?.value);
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
          <LoginComponent ct={ct}></LoginComponent>
          <br />
          <Button type="submit" variant="contained">
            Analyze Games
          </Button>
        </form>

        {summary}
        <div className="categories grid">
          {outerCategoriesArr.map(outer => {
            return <div key={outer.description} className="outer-category grid">

              <h2 className="grid-header">{outer.description}</h2>
              {allCategories.filter(cat => cat.outerCategory === outer).map(c => <Category key={c.name} category={c}></Category>)}
            </div>
          })}
        </div>
      </main>
    </>
  );

}

export const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  // choose random direction left or right or up or down
  let direction = (Math.random() < 0.5 ? "left" : Math.random() < 0.5 ? "right" : Math.random() < 0.5 ? "up" : "down") as "left" | "right" | "up" | "down";
  return <Slide direction={direction} ref={ref} {...props} />;
});
function resetEverything() {
  setNumAnalyzed(0);
  backupNum = 0;
  allCategories.forEach(a => { a.resetCategory!() })
}
export type Kind = "fail" | "win";

export function getIcon(category: CategoryInterface) {
  const src = "fail.svg"

  return <img src={src} key={Date.now()} className={category.kind + " icon"} />
}
export type CategoryProps = { category: CategoryInterface; };
let backupNum: number | null = null;
export function analyzedGame() {
  if (backupNum === null)
    backupNum = numAnalyzed + 1
  else backupNum++
  setNumAnalyzed(backupNum)
}
export default App;
