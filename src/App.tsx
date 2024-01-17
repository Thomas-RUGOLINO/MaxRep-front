import './App.scss'
import {Routes, Route} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage/HomePage';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import PerformancePage from './pages/PerformancePage/PerformancePage';
import SessionPage from './pages/SessionPage/SessionPage';
import RankingPage from './pages/RankingPage/RankingPage';
import ErrorPage from './pages/ErrorPage/ErrorPage';

const App = () => {

  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path='/' element={<HomePage />} /> 
          <Route path='/login' element={<LoginPage />} /> 
          <Route path='/register' element={<RegisterPage />} /> 
          <Route path='/profile' element={<ProfilePage />} /> 
          <Route path='/performance' element={<PerformancePage />} /> 
          <Route path='/session' element={<SessionPage />} /> 
          <Route path='/ranking' element={<RankingPage />} /> 
          <Route path='*' element= {<ErrorPage status={404} message='Not Found / Non trouvé' />} />
        </Routes>
      </AuthProvider>
    </>
  )
}

export default App
