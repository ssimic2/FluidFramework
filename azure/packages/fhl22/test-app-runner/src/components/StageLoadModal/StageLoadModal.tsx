import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import YAML from 'yaml';

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 0.5,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function StageLoadModal() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    let input: any;
    const onChange = (newValue: any) => {
        input = newValue;
    }

    const handleSubmit = () => {
        console.log("INPUT SUBMITTED: ", input);
        const doc = new YAML.Document()
        doc.contents = input
        console.log("YAML INPUT: ", doc.toString());
        console.log("stringify: ", YAML.stringify(input))
        handleClose();
    }

    return (
      <>
        <Button variant="contained" onClick={handleOpen}>Load Yaml</Button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <AceEditor
                mode="json"
                theme="github"
                name="UNIQUE_ID_OF_DIV"
                onChange={onChange}
                editorProps={{ $blockScrolling: true }}
                focus={ true }
            />
            <Button variant="contained" onClick={handleSubmit}>Confirm</Button>
          </Box>
        </Modal>
      </>
    );
  }
