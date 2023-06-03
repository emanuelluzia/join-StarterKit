// ** React Imports
import { Fragment, useState } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import TextField from '@mui/material/TextField'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import { useForm, useFormContext } from 'react-hook-form'

const Modal = (props: any) => {
  // ** State
  const [open, setOpen] = useState(false)
  const handleClickOpen = () => {
    setOpen(props.open)
  }
  const handleClose = () => {
    setOpen(false)
  }
  const sendData = () => {
    props.handleSave()
    console.log('ferfefr')
  }

  return (
    <Fragment>
      <Dialog open={props.open} onClose={handleClose} aria-labelledby='form-dialog-title'>
        <DialogTitle id='form-dialog-title'>{props.title}</DialogTitle>
        <DialogContent>{props.children}</DialogContent>
        <DialogActions>
          <Button variant='outlined' color='secondary' onClick={props.onClose}>
            Cancelar
          </Button>
          <Button variant='contained' onClick={sendData}>
            {props.buttonLabel}
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  )
}

export default Modal
