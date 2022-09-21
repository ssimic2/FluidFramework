import React from 'react';
import ReactJson from 'react-json-view';
import './StatusDisplay.css';
import { Paper, Typography, Box } from '@mui/material';
import StatusIcon from '../StatusIcon/StatusIcon'

function StatusDisplay({ data }:any) {
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
      }}
    >
        {
            data? (
                <Paper elevation={3}>
                    <React.Fragment>
                        <Typography variant="h5" component="div">
                            {data.testName}
                        </Typography>
                        <Typography variant="subtitle1" component="div">
                            {data.status}
                            <StatusIcon status={data.status}/>
                        </Typography>
                        <div className="JsonViewer">
                            <Typography variant="subtitle1" component="div">
                                Additional Data
                            </Typography>
                            <ReactJson src={data.customData}/>
                        </div>
                    </React.Fragment>
                </Paper>
            ):(<div></div>)
        }
    </Box>
  );
}

export default StatusDisplay
