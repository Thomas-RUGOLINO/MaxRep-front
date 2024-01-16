import './App.scss'
import {Routes, Route} from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import ErrorPage from './pages/ErrorPage/ErrorPage';

const App = () => {

  return (
    <>
      <Routes>
        <Route path='/' element={<HomePage />} /> 
        <Route path='/login' element={<LoginPage />} /> 
        <Route path='/register' element={<RegisterPage />} /> 
        <Route path='/profile' element={<ProfilePage />} /> 
        <Route path='*' element= {<ErrorPage status={404} message='Not Found / Non trouvé' />} />
      </Routes>
    </>
  )
}

export default App
