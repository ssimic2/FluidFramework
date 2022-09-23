import React from 'react';
import { CircularProgress } from '@mui/material';
import { CheckCircle, Pending, Error } from '@mui/icons-material';

function StatusIcon(data:any) {
    switch(data.status) {
        case 'RUNNING':
            return (<CircularProgress sx={{height: '30px !important', width:'30px !important'}}/>);
        case 'NOTSTARTED':
            return (<Pending color="secondary" fontSize='large'/>);
        case 'ERROR':
            return (<Error color="warning" fontSize='large'/>);
        case 'SUCCESS':
            return (<CheckCircle color="success" fontSize='large'/>);
        default:
            return (<></>);
      }
}

export default StatusIcon
