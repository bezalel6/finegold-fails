import React, { useEffect, useState } from "react";
import { Game } from "./GameParser";
import { Box, Card, Divider, Typography } from "@mui/material";
import { Rarity } from "./Rarity";
import { CategoryProps, createdChildren, getIcon } from "./App";
import { getState } from "./Scales";

export function Category({ category }: CategoryProps) {
    const [arr, setArr] = useState(new Array<React.ReactNode>());
    function createChild(game: Game) {
        const state = getState();
        if(category.kind==="win"){
            state.addToRight();
        }else{
            state.addToLeft();
        }
        const ret = <a href={game.site} target={"_blank"} key={createdChildren.length} className={"failContainer"} rel="noreferrer">{getIcon(category)} </a>;
        createdChildren.push(ret);
        return ret;
    }
    const [gray, setGray] = useState("grayout");
    useEffect(() => {
        setGray((!!category.numMade) ? "" : "grayout");
        category.addToCategory = (game: Game) => {
            category.numMade = category.numMade ? category.numMade + 1 : 1;
            setArr([...arr, createChild(game)]);
        };
        category.resetCategory = () => {
            category.numMade = 0;
            setArr([]);
        };
    }, [arr, setArr]);
    return (
        <Box className={"category " + gray}>
            <Card>
                {/* <div> */}
                <Box className="oneline">
                    <Typography component={'span'} fontWeight={700} fontSize={25}>
                        {category.name}
                        <Typography component={'span'} className={"rarity " + Rarity[category.rarity].toLowerCase()} fontSize={20} fontWeight={600}>
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
