import React from 'react';
import { SignupForm } from '@/components/auth/register-form';
import AuthLayout from '../layout';

export default function Page() {
  return (
    <AuthLayout>
      <SignupForm />
    </AuthLayout>
  );
}