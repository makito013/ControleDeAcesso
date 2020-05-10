import React from "react";
import 'assets/css/paper-dashboard.css';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import {
    Button, 
  } from "reactstrap";

const modalStyle = makeStyles(theme => ({
    paper: {
      position: 'absolute',
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }));

export default function ModalCartoes() {
    const classes = modalStyle();
    // getModalStyle is not a pure function, we roll the style only on the first render
    const [open, setOpen] = React.useState(false);
  
    const handleOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
  
    return (
      <div>
        <Button block onClick={handleOpen} style={{float:"right", fontSize:"12px"}}>
          Cartões não devolvidos
        </Button>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={open}
          onClose={handleClose}
        >
          
          <div style={{top:"40%", left:"40%"}} className={classes.paper}>
            <h2 id="simple-modal-title">Visitantes</h2>
            <p id="simple-modal-description">
              Visitantes
            </p>
          </div>
        </Modal>
      </div>
    );
  }