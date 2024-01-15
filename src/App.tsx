import './App.scss'
import {Routes, Route} from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';

const App = () => {

  return (
    <>
      <Routes>
        <Route path='/' element={<HomePage />} /> 
        <Route path='/login' element={<LoginPage />} /> 
        <Route path='/register' element={<RegisterPage />} /> 
        <Route path='/profile/:id' element={<ProfilePage />} /> 
      </Routes>
    </>
  )
}

export default App
