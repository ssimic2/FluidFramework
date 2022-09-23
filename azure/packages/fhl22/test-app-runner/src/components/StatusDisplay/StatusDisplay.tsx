import React from 'react';
import ReactJson from 'react-json-view';
import './StatusDisplay.css';
import { Paper, Typography, Box } from '@mui/material';
import StatusIcon from '../StatusIcon/StatusIcon'

function StatusDisplay(status: any) {
  return (
    <Box
     sx={{
        display: 'flex',
        flexWrap: 'wrap',
        '& > :not(style)': {
          m: 1,
          width: 1,
        },
        justifyContent: 'center',
      }}
    >

        {
            status.data ?
                (status.data.map((data: any, key: any) => {
                    return (
                        <Paper elevation={3} sx={{padding: '1rem'}} key={key}>
                            <React.Fragment>
                                <Typography variant="h5" component="div"
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between'
                                    }}>
                                    {data.title}
                                    <StatusIcon status={data.status.toUpperCase()}/>
                                </Typography>
                                <Typography variant="body1" component="div">
                                    {data.description}
                                </Typography>
                                <br></br>
                                <div className="JsonViewer">
                                    <Typography variant="subtitle1" component="div">
                                        Additional Data
                                    </Typography>
                                    <ReactJson src={data.details}/>
                                </div>
                                <br></br>
                                <Typography variant="h6" component="div">
                                    {data.status.toUpperCase()}
                                </Typography>
                            </React.Fragment>
                        </Paper>
                    );
                })) : (<div></div>)
        }
    </Box>
  );
}

export default StatusDisplay
