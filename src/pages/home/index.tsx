import { useEffect, useState } from 'react'
// ** MUI Imports
import { Button, DialogContentText, InputLabel, Pagination } from '@mui/material'
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
import Cleave from 'cleave.js'

const schema = yup
  .object({
    nomeProduto: yup.string().required('O nome do Produto é obrigatório'),
    valorProduto: yup.number().positive().integer().required('Valor do Produto é obrigatório'),
    categoriaId: yup.string().required('A categoria é obrigatório')
  })
  .required()

const Produtos = () => {
  const [categorias, setCategorias] = useState([])
  const [produtos, setProdutos] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [productData, setProductData] = useState<any>({})
  const [openDialogName, setOpenDialog] = useState<any>(false)
  const [anchorEl, setAnchorEl] = useState<any>(null)
  const [paginaAtual, setPaginaAtual] = useState<number>(1)
  const [qtdPaginas, setQtdPaginas] = useState<number>(1)

  const itensPorPagina = 5

  async function getCategorias() {
    await fetch('http://localhost:8989/api/categorias')
      .then(response => response.json())
      .then(response => setCategorias(response.data))
  }

  async function getProdutos() {
    await fetch(`http://localhost:8989/api/produtos?page=${paginaAtual}`)
      .then(response => response.json())
      .then(response => {
        setProdutos(response.data)
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
    console.log(productData.id)
    nProgress.start()

    let url: string = ''
    let body: any = {
      nome_produto: form.nomeProduto,
      valor_produto: form.valorProduto,
      id_categoria_produto: form.categoriaId
    }

    if (!form.nomeProduto && data !== 'DELETE') {
      closeDialog()
      nProgress.done()
      return
    }

    switch (data) {
      case 'POST':
        url = 'http://localhost:8989/api/produtos/'
        break
      case 'PUT':
        url = `http://localhost:8989/api/produtos/${productData.id}`
        break
      case 'DELETE':
        url = `http://localhost:8989/api/produtos/${productData.id}`
        break

      default:
        break
    }

    await fetch(url, {
      method: data,
      body: JSON.stringify(body),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    })
      .then(response => {
        response.json()
        reset()
      })
      .then(json => console.log(json))

    getProdutos()
    closeDialog()
    nProgress.done()
  }

  const handleOpenClose = (value: boolean) => {
    setOpen(value)
  }

  useEffect(() => {
    getCategorias()
    getProdutos()
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

  const openDeleteDialog = async (value: any) => {
    reset()
    const productData = {
      id: value.id_produto,
      nomeProduto: value.nome_produto,
      categoriaId: value.id_categoria_produto,
      valorProduto: value.valor_produto
    }

    setProductData(productData)
    setOpenDialog('APAGAR')
    handleClose()
  }

  const openEditDialog = async (value: any) => {
    reset()
    const productData = {
      id: value.id_produto,
      nomeProduto: value.nome_produto,
      categoriaId: value.id_categoria_produto,
      valorProduto: value.valor_produto
    }

    setProductData(productData)
    setOpenDialog('EDIT')
    handleClose()
  }

  const closeDialog = () => {
    reset()
    setOpenDialog(false)
  }

  return (
    <>
      {/* Modal de Criação */}
      <Modal
        title='Criação Produto'
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
            label='Nome Produto'
            {...register('nomeProduto', { required: true })}
            error={Boolean(errors['nomeProduto']?.message)}
            helperText={errors.nomeProduto?.message?.toString()}
          />

          <TextField
            type='number'
            label='Valor Produto'
            id='form-props-number c'
            InputLabelProps={{ shrink: true }}
            {...register('valorProduto', { required: true })}
            error={Boolean(errors['valorProduto']?.message)}
            helperText={errors.valorProduto?.message?.toString()}
          />
          <Select
            label='Age'
            defaultValue=''
            id='demo-simple-select-required'
            labelId='demo-simple-select-required-label'
            {...register('categoriaId')}
            error={Boolean(errors['categoriaId']?.message)}
          >
            <MenuItem value=''>
              <em>None</em>
            </MenuItem>
            {categorias.map((fbb: any) => (
              <MenuItem key={fbb.id_categoria_planejamento} value={fbb.id_categoria_planejamento}>
                {fbb.nome_categoria}
              </MenuItem>
            ))}
          </Select>
        </form>
      </Modal>

      {/* Modal de Edição */}
      <Modal
        title='Edição Produto'
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
            label='Nome Produto'
            {...register('nomeProduto', { required: true })}
            defaultValue={productData.nomeProduto}
            error={Boolean(errors['nomeProduto']?.message)}
            helperText={errors.nomeProduto?.message?.toString()}
          />
          <TextField
            type='number'
            label='Valor Produto'
            id='form-props-number'
            InputLabelProps={{ shrink: true }}
            defaultValue={productData.valorProduto}
            {...register('valorProduto', { required: true })}
            error={Boolean(errors['valorProduto']?.message)}
            helperText={errors.valorProduto?.message?.toString()}
          />
          <Select
            // label='Age'
            defaultValue={productData.categoriaId}
            id='demo-simple-select-required'
            labelId='demo-simple-select-required-label'
            {...register('categoriaId')}
            error={Boolean(errors['categoriaId']?.message)}
          >
            <MenuItem value=''>
              <em>None</em>
            </MenuItem>
            {categorias.map((fbb: any) => (
              <MenuItem key={fbb.id_categoria_planejamento} value={fbb.id_categoria_planejamento}>
                {fbb.nome_categoria}
              </MenuItem>
            ))}
          </Select>
        </form>
      </Modal>

      {/* Modal de Exclusão */}
      <Modal
        title='Excluir Produto'
        buttonLabel='Excluir'
        open={openDialogName === 'APAGAR'}
        onClose={closeDialog}
        handleSave={() => onSubmit('DELETE')}
        reset={reset}
        errors={errors}
        onClick={testeFields}
      >
        <form className='demo-space-x' noValidate autoComplete='off'>
          <DialogContentText> Tem certeza que Deseja Excluir o produto {productData.nomeProduto} ?</DialogContentText>
        </form>
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
              <TableCell align='left'>Valor</TableCell>
              <TableCell align='left'>Categoria</TableCell>
              <TableCell align='left'>Data Cadastro</TableCell>
              <TableCell align='left'>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {produtos.map(row => (
              <TableRow key={row.id_produto} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell align='left'>{row.id_produto}</TableCell>
                <TableCell align='left'>{row.nome_produto}</TableCell>
                <TableCell align='left'>{row.valor_produto}</TableCell>
                <TableCell align='left'>{row.categorias.nome_categoria}</TableCell>
                <TableCell align='left'>{row.cadastroFormat}</TableCell>
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

export default Produtos
