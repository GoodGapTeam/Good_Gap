import { Route, Routes } from 'react-router-dom'
import './App.css'
import MainLayout from './App/layouts/MainLayout'
import ScrollToTop from './components/common/ScrollToTop'
import BookDemo from './features/BookDemo'
import ContactUs from './features/ContactUs'
import About from './pages/About'
import Home from './pages/Home'
import Services from './pages/Services'

function App() {
  return (
    <>
      <ScrollToTop/>
      <Routes>
        <Route element={<MainLayout/>}>
          <Route path='/' element={<Home/>} />
          <Route path ='/services' element={<Services/>}/>
          <Route path ='/about' element={<About/>}/>
          <Route path ='/contact/contactUs' element={<ContactUs/>}/>
          <Route path ='/book-demo' element={<BookDemo/>}/>
        </Route>
      </Routes>
    </>
  )
}

export default App
