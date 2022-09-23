import React from 'react';
import { CircularProgress } from '@mui/material';
import { CheckCircle, Pending, Error } from '@mui/icons-material';

function StatusIcon(data:any) {
    switch(data.status) {
        case 'RUNNING':
            return (<CircularProgress sx={{height: '25px !important', width:'25px !important'}}/>);
        case 'NOTSTARTED':
            return (<Pending color="secondary"/>);
        case 'ERROR':
            return (<Error color="warning"/>);
        case 'SUCCESS':
            return (<CheckCircle color="success"/>);
        default:
            return (<></>);
      }
}

export default StatusIcon
