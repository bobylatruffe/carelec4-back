import { Route, Routes } from 'react-router-dom';

import './App.scss';
import Accueil from './components/Accueil/Accueil';
import { Admin } from './components/Admin/Admin';
import Menu from './components/Menu/Menu';
import MonCompte from './components/MonCompte/MonCompte';
import SignIn from './components/SignIn/SignIn';
import SignUp from './components/SignUp/SignUp';

function App() {
  return (
    <>
      <Menu />

      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="SignUp" element={<SignUp />} />
        <Route path="SignIn" element={<SignIn />} />
        <Route path="MonCompte/*" element={<MonCompte />} />
        <Route path="Admin/*" element={<Admin />} />
      </Routes>
    </>
  )
}

export default App;
