import { Outlet } from 'react-router-dom'
import Footer from 'src/components/Footer'
import HeaderRegister from 'src/components/HeaderRegister'

const RegisterLayout = () => {
  return (
    <div>
      <HeaderRegister />
      <Outlet />
      <Footer />
    </div>
  )
}

export default RegisterLayout
