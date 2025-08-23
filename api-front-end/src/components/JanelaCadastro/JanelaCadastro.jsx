import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export function JanelaCadastro(props) {
  const [open, setOpen] = React.useState(false);
  
  const [nome, setNome] = React.useState(props.nome);
  const [telefone, setTelefone] = React.useState(props.telefone);
  const [email, setEmail] = React.useState(props.email);
  const [endereco, setEndereco] = React.useState(props.endereco);
  const [identificacao, setIdentificacao] = React.useState(props.identificacao);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <div onClick={handleClickOpen}>
        {props.children}
      </div>
      <BootstrapDialog fullWidth maxWidth='lg'
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2, fontSize:'2rem' }} id="customized-dialog-title">
          {props.action}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers sx={{display:'flex', justifyContent:'space-evenly'}}>
          <div>
            <h2>Nome:</h2>
            <TextField defaultValue={props.nome} onChange={(e) => setNome(e.target.value)} sx={{width:'35vw', marginBottom:'3rem'}} id="outlined-basic" variant="outlined" />
            <h2>E-mail:</h2>
            <TextField defaultValue={props.email} onChange={(e) => setEmail(e.target.value)} sx={{width:'35vw', marginBottom:'3rem'}} id="outlined-basic" variant="outlined" />
            <h2>Telefone:</h2>
            <TextField defaultValue={props.telefone} onChange={(e) => setTelefone(e.target.value)} sx={{width:'35vw', marginBottom:'3rem'}} id="outlined-basic" variant="outlined" />
          </div>
          <div>
            <h2>Endereço:</h2>
            <TextField defaultValue={props.endereco} onChange={(e) => setEndereco(e.target.value)} sx={{width:'35vw', marginBottom:'3rem'}} id="outlined-basic" variant="outlined" />
            <h2>CPF/CNPJ:</h2>
            <TextField defaultValue={props.identificacao} onChange={(e) => setIdentificacao(e.target.value)} sx={{width:'35vw', marginBottom:'3rem'}} id="outlined-basic" variant="outlined" />
          </div>
        </DialogContent>
        <DialogActions sx={{display:'flex', justifyContent:'center'}}>
          <Button autoFocus onClick={() => {
            props.func(props.id, props.categoria, nome, telefone, email, endereco, identificacao); 
            handleClose();
            }
            } sx={{color:'white', fontSize:'1.5rem', border:'2px solid black', backgroundColor:'blue'}}>
            {props.message}
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
}