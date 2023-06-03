import { useEffect, useState } from 'react'
// ** MUI Imports
import { Alert, Button, DialogContentText, Pagination } from '@mui/material'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Modal from 'src/components/modal'
import * as yup from 'yup'
import nProgress from 'nprogress'
import IconifyIcon from 'src/@core/components/icon'

const schema = yup
  .object({
    nomeCategoria: yup.string().required('O nome da Categoria é obrigatório')
  })
  .required()

const Categorias = () => {
  const [categorias, setCategorias] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [categoryData, setCategoryData] = useState<any>({})
  const [openDialogName, setOpenDialog] = useState<any>(false)
  const [anchorEl, setAnchorEl] = useState<any>(null)
  const [paginaAtual, setPaginaAtual] = useState<number>(1)
  const [qtdPaginas, setQtdPaginas] = useState<number>(1)
  const [erroCategoria, setErroCategoria] = useState<boolean>(false)

  const itensPorPagina = 5

  async function getCategorias() {
    await fetch(`http://localhost:8989/api/categorias?page=${paginaAtual}`)
      .then(response => response.json())
      .then(response => {
        setCategorias(response.data)
        setQtdPaginas(response.last_page)
      })
  }

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  })

  const form = watch()

  const testeFields = () => {
    setOpen(true)
  }

  const onSubmit = async (data: any) => {
    nProgress.start()
    let url: string = ''

    let body: any = {
      nome_categoria: form.nomeCategoria
    }

    if (!form.nomeCategoria && data !== 'DELETE') {
      closeDialog()
      nProgress.done()
      return
    }

    switch (data) {
      case 'POST':
        url = 'http://localhost:8989/api/categorias/'
        break
      case 'PUT':
      case 'DELETE':
        url = `http://localhost:8989/api/categorias/${categoryData.id}`
        break

      default:
        break
    }

    let aux = false
    await fetch(url, {
      method: data,
      body: JSON.stringify(body),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    })
      .then(response => {
        response.json()
        if (response.status === 401) {
          setErroCategoria(true)
          nProgress.done()
          aux = true
        }

        reset()
      })
      .catch(error => {
        console.error(error)
      })

    if (!aux) {
      getCategorias()
      closeDialog()
      nProgress.done()
    }
  }

  const handleOpenClose = (value: boolean) => {
    setOpen(value)
  }

  useEffect(() => {
    getCategorias()
  }, [paginaAtual])

  const handlePaginaChange = (event: any, novaPagina: number) => {
    setPaginaAtual(novaPagina)
  }

  const handleClose = () => {
    setAnchorEl(false)
  }

  const openAddDialog = () => {
    reset()
    setOpenDialog('ADD')
    handleClose()
  }

  const openDeleteDialog = (value: any) => {
    setOpenDialog('DELETE')
    const categoryData = {
      id: value.id_categoria_planejamento,
      nomeCategoria: value.nome_categoria
    }
    setCategoryData(categoryData)
    handleClose()
  }

  const openEditDialog = async (value: any) => {
    reset()
    const categoryData = {
      id: value.id_categoria_planejamento,
      nomeCategoria: value.nome_categoria
    }

    setCategoryData(categoryData)
    setOpenDialog('EDIT')
    handleClose()
  }

  const closeDialog = () => {
    reset()
    setErroCategoria(false)
    setOpenDialog(false)
  }

  return (
    <>
      {/* Modal de Criação */}
      <Modal
        title='Criação Categoria'
        buttonLabel='Salvar'
        open={openDialogName === 'ADD'}
        onClose={closeDialog}
        handleSave={handleSubmit(() => onSubmit('POST'))}
        reset={reset}
        errors={errors}
        onClick={testeFields}
      >
        <form className='demo-space-x' noValidate autoComplete='off'>
          <TextField
            required
            id='form-props-required c'
            label='Nome Categoria'
            {...register('nomeCategoria', { required: true })}
            error={Boolean(errors['nomeCategoria']?.message)}
            helperText={errors.nomeCategoria?.message?.toString()}
          />
        </form>
      </Modal>

      {/* Modal de Edição */}
      <Modal
        title='Edição Categoria'
        buttonLabel='Salvar'
        open={openDialogName === 'EDIT'}
        onClose={closeDialog}
        handleSave={handleSubmit(() => onSubmit('PUT'))}
        reset={reset}
        errors={errors}
        onClick={testeFields}
      >
        <form className='demo-space-x' noValidate autoComplete='off'>
          <TextField
            required
            id='form-props-required'
            label='Nome Categoria'
            {...register('nomeCategoria', { required: true })}
            defaultValue={categoryData.nomeCategoria}
            error={Boolean(errors['nomeCategoria']?.message)}
            helperText={errors.nomeCategoria?.message?.toString()}
          />
        </form>
      </Modal>

      {/* Modal Exclusão */}
      <Modal
        title='Exclusão Categoria'
        buttonLabel='Excluir'
        open={openDialogName === 'DELETE'}
        onClose={closeDialog}
        handleSave={() => onSubmit('DELETE')}
        reset={reset}
        errors={errors}
        onClick={testeFields}
      >
        <DialogContentText>
          {' '}
          Tem certeza que Deseja Excluir a Categoria {categoryData.nomeCategoria} ?
        </DialogContentText>
        {erroCategoria && (
          <Alert variant='filled' severity='error'>
            A categoria {categoryData.nomeCategoria}, esta relacionado a um ou vários produtos. Eles precisam ser
            excluídos primeiro!
          </Alert>
        )}
      </Modal>

      <Button
        variant='outlined'
        onClick={openAddDialog}
        sx={{ marginBottom: 5 }}
        startIcon={<IconifyIcon icon='bx:add-to-queue' />}
      >
        Cadastrar
      </Button>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell align='left'>ID</TableCell>
              <TableCell align='left'>Nome</TableCell>
              <TableCell align='left'>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categorias.map(row => (
              <TableRow key={row.id_categoria_planejamento} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell align='left'>{row.id_categoria_planejamento}</TableCell>
                <TableCell align='left'>{row.nome_categoria}</TableCell>
                <TableCell align='left'>
                  <Button
                    variant='outlined'
                    startIcon={<IconifyIcon icon='mingcute:edit-line' />}
                    onClick={({ target }) => openEditDialog(row)}
                    sx={{ marginRight: 5 }}
                  >
                    Editar
                  </Button>
                  <Button
                    startIcon={<IconifyIcon icon='bx:trash-alt' />}
                    variant='outlined'
                    onClick={({ target }) => openDeleteDialog(row)}
                  >
                    Excluir
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination
        sx={{ marginTop: 5 }}
        count={qtdPaginas}
        page={paginaAtual}
        color='primary'
        onChange={handlePaginaChange}
        showFirstButton
        showLastButton
      />
    </>
  )
}

export default Categorias
