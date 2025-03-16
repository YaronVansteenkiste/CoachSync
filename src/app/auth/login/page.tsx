import React from 'react';
import { LoginForm } from '@/components/auth/login-form';
import AuthLayout from '../layout';

export default function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}