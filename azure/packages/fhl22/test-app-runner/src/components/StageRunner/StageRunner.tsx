import React, { useState } from "react"
import ReactJson from 'react-json-view';
import { Accordion, AccordionSummary, Typography, AccordionDetails, Box, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TestApi from '../../api/api'
import StatusDisplay from '../StatusDisplay/StatusDisplay'

function StageRunner({ data }:any) {
    const testApi = new TestApi();
    const [status, setStatus] = useState<any>('');
    const [pollingId, setPollingId] = useState<any>('');

    const handlePolling = async (id:string) => {
        let intervalId = setInterval(async () => {
            await testApi.pollTestStatus(id).then((res) => { setStatus(res.data); console.log("POLLING", res.data) })
        }, 200)

        return intervalId
    }

    const handleStart = async () => {
        if (pollingId) clearInterval(pollingId);
        let runId = await testApi.startStageTest(data.version).then((res) => { return res.data.runId });
        console.log("RUNNING ID ", runId)
        let status = await testApi.pollTestStatus(runId).then((res) => { return res.data });
        console.log("STATUS:", status);
        await handlePolling(runId).then((res) => { setPollingId(res) });
    }

    const handleStop = async () => {
        if (pollingId) clearInterval(pollingId);
    }

    let statusDisplay;
    if (status) {
        statusDisplay = <StatusDisplay data={status.stages}/>
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexWrap: 'wrap',
                '& > :not(style)': {
                m: 1,
                width: 0.5,
                },
                justifyContent: 'center',
            }}>
            <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                >
                <Typography variant="h4">{data.version}</Typography>
                </AccordionSummary>
                <AccordionDetails
                    sx={{textAlign: 'left'}}>
                    <div>
                        <Button variant="contained" sx={{marginRight: '1rem'}} onClick={handleStart}>Start</Button>
                        <Button variant="contained" className="startStopButton" onClick={handleStop}>Stop</Button>
                    </div>
                    <br></br>
                    { statusDisplay }
                    <br></br>
                    <ReactJson src={data.config} style={{maxHeight : '500px', overflowY:'scroll', outline:'1px solid gray'}}/>
                </AccordionDetails>
            </Accordion>
        </Box>
    );
}

export default StageRunner
