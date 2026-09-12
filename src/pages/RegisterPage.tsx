import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/hosgeldiniz', { replace: true });
  }, [navigate]);

  return null;
};
