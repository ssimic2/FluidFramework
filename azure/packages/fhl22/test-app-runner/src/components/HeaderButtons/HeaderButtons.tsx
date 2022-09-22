import React from "react";
import { Button } from '@mui/material';

function FileCollect() {
    return (
        <div>
            <Button variant="contained" sx={{marginRight: '1rem'}}>Start</Button>
            <Button variant="contained" className="startStopButton">Stop</Button>
        </div>
    )
}

export default FileCollect;
