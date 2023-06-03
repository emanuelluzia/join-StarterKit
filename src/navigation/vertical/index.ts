// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Produtos',
      path: '/home',
      icon: 'bx:box'
    },
    {
      title: 'Categorias',
      path: '/categorias',
      icon: 'bx:bookmark'
    }
  ]
}

export default navigation
