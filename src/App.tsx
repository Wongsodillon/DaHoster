import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import Home from './pages/Home'
import UserContextProvider from './context/UserContext'

function App() {

  return (
    <>
      <BrowserRouter>
        <UserContextProvider>
          <Routes>
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
              <Route path='/' element={<Home />} />
          </Routes>
        </UserContextProvider>
      </BrowserRouter>
    </>
  )
}

export default App
