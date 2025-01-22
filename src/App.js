import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/auth';
import AdminLayout from './layouts/admin';
import SignIn from './views/auth/signIn/index'; 

import {
  ChakraProvider,
} from '@chakra-ui/react';
import initialTheme from './theme/theme'; 
import { useState } from 'react';

export default function Main() {
  // eslint-disable-next-line
  const [currentTheme, setCurrentTheme] = useState(initialTheme);
  return (
    <ChakraProvider theme={currentTheme}>
      <Routes>
        <Route path="/" element={<Navigate to="/auth/signin" />} />
        <Route path="auth/*" element={<AuthLayout />} />
        <Route path="auth/signin" element={<SignIn />} />
        <Route
          path="admin/*"
          element={
            <AdminLayout theme={currentTheme} setTheme={setCurrentTheme} />
          }
        />
      </Routes>
    </ChakraProvider>
  );
}