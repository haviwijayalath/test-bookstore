import { Outlet } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar.jsx'

function App() {

  return (
    <>
      <Navbar />
      <div className='min-h-screen'>
        <Outlet />
      </div>
      
    </>
  )
}

export default App
