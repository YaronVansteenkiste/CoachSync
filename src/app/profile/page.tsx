'use client'
import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth/client';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const { 
        data: session, 
        isPending, 
        error, 
        refetch 
    } = authClient.useSession();
    const router = useRouter();

    const handleLogout = async () => {
        await authClient.signOut();
        router.push('/auth/login');
    };

    if (isPending) {
        return <p>Loading...</p>;
    }

    if (!session) {
        return <p>No session found.</p>;
    }

    return (
        <div className="flex justify-center items-center min-h-screen">
            <Card className="w-96">
                <CardHeader>
                    <h1 className="text-2xl font-bold">Profile Page</h1>
                </CardHeader>
                <CardContent>
                    <div className="mb-4">
                        <p className="text-lg">{session.user?.name || 'Firstname Lastname'}</p>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" onClick={handleLogout}>Logout</Button>
                </CardFooter>
            </Card>
        </div>
    );
};