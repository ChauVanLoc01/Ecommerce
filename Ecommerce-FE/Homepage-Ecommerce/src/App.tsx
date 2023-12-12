import { lazy, Suspense } from 'react'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import RegisterLayout from './layouts/RegisterLayout'
// import Login from './pages/Login'
// import Register from './pages/Register'
// import ProductList from './pages/ProductList'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import MainLayout from './layouts/MainLayout'
import './index.css'
import { useCallback, useContext, useEffect } from 'react'
import { Context } from './context/AppContext'
import { PathRoute } from './constants/PathRoute'
// import ProductDetail from './pages/ProductDetail'
import { eventTarget } from './utils/LocalStorage'
import SkeletonProductDetail from './components/SkeletonProductDetail'
// import Cart from './pages/Cart'
// import User from './pages/User'
// import Account from './pages/User/Account'
// import Password from './pages/User/Account/Password'
// import Address from './pages/User/Account/Address'
// import Order from './pages/User/Order'
// import Profile from './pages/User/Account/Profile'
// import NotFound from './pages/NotFound'

function ProtectedRoute() {
  const { isAuth } = useContext(Context)
  return isAuth ? <Outlet /> : <Navigate to='/login' />
}

function RejectedRoute() {
  const { isAuth } = useContext(Context)
  return !isAuth ? <Outlet /> : <Navigate to='/' />
}

const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const ProductList = lazy(() => import('./pages/ProductList'))
const Cart = lazy(() => import('./pages/Cart'))
const User = lazy(() => import('./pages/User'))
const Account = lazy(() => import('./pages/User/Account'))
const Password = lazy(() => import('./pages/User/Account/Password'))
const Order = lazy(() => import('./pages/User/Order'))
const Profile = lazy(() => import('./pages/User/Account/Profile'))
const NotFound = lazy(() => import('./pages/NotFound'))

function App() {
  const { setUser } = useContext(Context)
  const resetUser = useCallback(() => {
    setUser(null)
  }, [])

  useEffect(() => {
    eventTarget.addEventListener('resetUser', resetUser)

    return () => {
      eventTarget.removeEventListener('resetUser', resetUser)
    }
  }, [setUser])

  return (
    <div>
      <Routes>
        <Route path='/' element={<MainLayout />}>
          <Route
            index
            element={
              <Suspense>
                <ProductList />
              </Suspense>
            }
          />
          <Route
            path={`:${PathRoute.idNameProduct}`}
            element={
              <Suspense>
                <ProductDetail />
              </Suspense>
            }
          />
        </Route>
        <Route path='' element={<ProtectedRoute />}>
          <Route path='/' element={<MainLayout />}>
            <Route
              path={PathRoute.cart}
              element={
                <Suspense>
                  <Cart />
                </Suspense>
              }
            />
            <Route
              path={PathRoute.user}
              element={
                <Suspense>
                  <User />
                </Suspense>
              }
            >
              <Route
                path={PathRoute.account}
                element={
                  <Suspense>
                    <Account />
                  </Suspense>
                }
              >
                <Route
                  path={PathRoute.profile}
                  element={
                    <Suspense>
                      <Profile />
                    </Suspense>
                  }
                />
                <Route
                  path={PathRoute.password}
                  element={
                    <Suspense>
                      <Password />
                    </Suspense>
                  }
                />
              </Route>
              <Route
                path={PathRoute.order}
                element={
                  <Suspense>
                    <Order />
                  </Suspense>
                }
              />
            </Route>
          </Route>
        </Route>
        <Route path='' element={<RejectedRoute />}>
          <Route path='/' element={<RegisterLayout />}>
            <Route
              path={PathRoute.login}
              element={
                <Suspense>
                  <Login />
                </Suspense>
              }
            />
            <Route
              path={PathRoute.register}
              element={
                <Suspense>
                  <Register />
                </Suspense>
              }
            />
          </Route>
        </Route>
        <Route path='skeleton' element={<SkeletonProductDetail />} />
        <Route
          path='*'
          element={
            <Suspense>
              <NotFound />
            </Suspense>
          }
        />
      </Routes>
      <ToastContainer />
    </div>
  )
}

export default App
