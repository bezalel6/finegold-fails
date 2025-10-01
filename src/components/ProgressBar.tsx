import * as React from 'react';
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Setter } from './Setter';

function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

let progress, setProgress:Setter<number>;
let outerTotal:number,outerSetTotal:Setter<number>;
export default function ProgressBar() {
  [progress,setProgress] = React.useState(0);
  const [total,setTotal] = React.useState(0);
    React.useEffect(()=>{
        outerTotal = total;
        outerSetTotal = setTotal;
    },[total,setTotal])

  return (
    <Box sx={{ width: '80%' }}>
        {total!==0?
      <LinearProgressWithLabel value={progress} />:<></>}
    </Box>
  );
}
export function initializeBar(totalGames:number){
    outerSetTotal(totalGames)
}
export function addToBar(){
    setProgress(prev=>{
        return prev+(100/outerTotal)
    })
}