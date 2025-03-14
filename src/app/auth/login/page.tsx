import React from 'react';
import { LoginForm } from '@/components/auth/login-form';
import AuthLayout from '../layout';

export default function Page() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}