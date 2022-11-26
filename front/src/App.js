import { Routes, Route, NavLink } from 'react-router-dom';

import './App.scss';

import SignUp from './components/SignUp/SignUp';
import SignIn from './components/SignIn/SignIn';
import MonCompte from './components/MonCompte/MonCompte';
import { Admin } from './components/Admin/Admin';

function App() {
  return (
    <>
      <Routes>
        <Route path="SignUp" element={<SignUp />} />
        <Route path="SignIn" element={<SignIn />} />
        <Route path="MonCompte/*" element={<MonCompte />} />
        <Route path="Admin/*" element={<Admin />} />
      </Routes>

      <NavLink to="SignIn">Connexion</NavLink>
    </>
  )
}

export default App;
