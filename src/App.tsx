/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import { analyze, Game } from "./GameParser";
import InfoIcon from '@mui/icons-material/Info';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Slide,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { Info } from "@mui/icons-material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { allCategories, CategoryInterface, outerCategoriesArr, OuterCategory } from "./Categories";
import { Rarity } from "./Rarity";
import { Ctrl } from "./Auth";
import { TransitionProps } from "@mui/material/transitions";
let numAnalyzed: number, setNumAnalyzed: (num: number) => any;
let createdChildren: Array<React.ReactNode> = [];
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
        <img src="icon.svg" className="App-logo" />

        <form
          className="form"
          onSubmit={(e) => {
            e.preventDefault();

            resetEverything();
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
          <LoginComponent ct={ct}></LoginComponent>
          <br />
          <Button type="submit" variant="contained">
            Analyze Games
          </Button>
        </form>

        {summary}
        <div className="categories">
          {outerCategoriesArr.map(outer => {
            return <div key={outer.description} className="outer-category">

              <h2>{outer.description}</h2>
              {allCategories.filter(cat => cat.outerCategory === outer).map(c => <Category key={c.name} category={c}></Category>)}
            </div>
          })}
        </div>
      </main>
    </>
  );

}


const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
function LoginComponent({ ct }: { ct: Ctrl }) {
  const [open, setOpen] = React.useState(false);
  // console.log(ct)
  // ct.oauth.getAccessToken().then(console.log)
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" onClick={() => {
        ct.login();
      }}>
        Login with lichess
      </Button>
      <IconButton onClick={handleClickOpen}><InfoIcon></InfoIcon></IconButton>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Lichess login"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Login to download your own games at 3x the speed and other's games at 1.5x the speed.
          </DialogContentText>
        </DialogContent>
        {/* <DialogActions>
          
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={handleClose}>Agree</Button>
        </DialogActions> */}
      </Dialog>
    </div>
  );
  // return <Button onClick={() => { ct.login() }}>Login with lichess</Button>

}
function resetEverything() {
  setNumAnalyzed(0);
  backupNum = 0;
  allCategories.forEach(a => { a.resetCategory!() })
}
export type Kind = "fail" | "win";

function getIcon(category: CategoryInterface) {
  const src = "fail.svg"

  return <img src={src} key={Date.now()} className={category.kind + " icon"} />
}
type CategoryProps = { category: CategoryInterface; };
function Category({ category }: CategoryProps) {
  const [arr, setArr] = useState(new Array<React.ReactNode>());
  function createChild(game: Game) {
    const ret = <a href={game.site} target={"_blank"} key={createdChildren.length} className={"failContainer"} rel="noreferrer">{getIcon(category)} </a>
    createdChildren.push(ret);
    return ret;
  }
  const [gray, setGray] = useState("grayout");
  useEffect(() => {
    setGray((!!category.numMade) ? "" : "grayout")
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
    <Box className={"category " + gray}>
      <Card >
        {/* <div> */}
        <Box className="oneline">
          <Typography component={'span'} fontWeight={700} fontSize={25} >
            {category.name}
            <Typography component={'span'} className={"rarity " + Rarity[category.rarity].toLowerCase()} fontSize={20} fontWeight={600} >
              {Rarity[category.rarity]}

            </Typography>
          </Typography>
        </Box>

        <Typography fontWeight={700} fontSize={15}>
          {category.explanation}
        </Typography>
        {/* </div> */}
        {arr.length !== 0 && <Divider></Divider>}
        <div className="fails">{arr}</div>

      </Card>
    </Box>
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
