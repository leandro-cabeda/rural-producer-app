
import './App.css';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ProducerForm from './pages/ProducerForm';
import ProducersList from './pages/ProducersList';
import Dashboard from './pages/Dashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/producers" element={<ProducersList />} />
        <Route path="/add-edit-producer" element={<ProducerForm />} />
        <Route path="/add-edit-producer/:id" element={<ProducerForm />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={5000} />
    </>
  );
};

export default App;
