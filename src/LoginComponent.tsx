import React, { useState } from "react";
import InfoIcon from '@mui/icons-material/Info';
import {
    Button, Dialog, DialogContent,
    DialogContentText,
    DialogTitle, IconButton
} from "@mui/material";
import { Ctrl } from "./Auth";
import { Transition } from "./App";

export function LoginComponent({ ct }: { ct: Ctrl; }) {
    const [open, setOpen] = React.useState(false);
    // console.log(ct)
    // ct.oauth.getAccessToken().then(console.log)
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const [loggedIn, setLoggedIn] = useState(false);
    function redraw() {
        setLoggedIn(!!ct.accessContext);

    }
    ct.redraw = redraw;
    return (
        <div>
            {loggedIn ?
                <p style={{ display: "inline-block" }}>logged in. <Button onClick={() => { ct.logout(); }}>Log out</Button></p> : <Button variant="outlined" onClick={() => {
                    ct.login();
                }}>
                    Login with lichess
                </Button>}

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
