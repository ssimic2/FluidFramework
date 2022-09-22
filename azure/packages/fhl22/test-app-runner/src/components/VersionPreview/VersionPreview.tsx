import React from 'react';
import ReactJson from 'react-json-view';
import { Accordion, AccordionSummary, Typography, AccordionDetails, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HeaderButtons from '../HeaderButtons/HeaderButtons';

function VersionPreview({ data }:any) {
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
                <HeaderButtons/>
                <br></br>
                <ReactJson src={data.config} style={{maxHeight : '500px', overflowY:'scroll', outline:'1px solid gray'}}/>
            </AccordionDetails>
        </Accordion>
    </Box>
  );
}

export default VersionPreview
