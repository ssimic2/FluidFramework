import React from "react";
import { Button } from '@mui/material';
import StageLoadModal from "../StageLoadModal/StageLoadModal";

function FileCollect() {
    return (
        <div>
            <Button variant="contained">Start</Button>
            <Button variant="contained">Stop</Button>
            <StageLoadModal/>
        </div>
    )
}

export default FileCollect;
