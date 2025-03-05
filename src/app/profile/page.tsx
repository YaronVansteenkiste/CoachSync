'use client'
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { authClient } from '@/lib/auth/client';
import { useRouter } from 'next/navigation';
import { getProgressRecord, addProgressRecord } from '@/app/actions/progressRecords';

export default function ProfilePage() {
    const {
        data: session,
        isPending,
        error,
        refetch
    } = authClient.useSession();
    const router = useRouter();
    const [progressRecords, setProgressRecords] = useState<Array<{ id: number; userId: string | null; date: string; weightKg: number; bodyFatPercentage: number }>>([]);
    const [weight, setWeight] = useState('');
    const [bodyFatPercentage, setBodyFatPercentage] = useState('');

    useEffect(() => {
        async function fetchProgressRecords() {
            if (session?.user?.id) {
                const userId = session.user.id;
                const records = await getProgressRecord(userId);
                setProgressRecords(records);
            }
        }
        fetchProgressRecords();
    }, [session]);

    const handleLogout = async () => {
        await authClient.signOut();
        router.push('/auth/login');
    };

    const handleAddProgressRecord = async (e: React.FormEvent) => {
        e.preventDefault();
        if (session?.user?.id) {
            const userId = session.user.id;
            await addProgressRecord(userId, parseFloat(weight), parseFloat(bodyFatPercentage));
            refetch();
            setWeight('');
            setBodyFatPercentage('');
        }
    };

    if (isPending) {
        return <p>Loading...</p>;
    }

    if (!session) {
        return <p>No session found.</p>;
    }

    return (
        <div className="flex flex-col items-center min-h-screen space-y-6">
            <Card className="w-full max-w-4xl">
                <CardHeader>
                    <h1 className="text-2xl font-bold">Profile Page</h1>
                </CardHeader>
                <CardContent>
                    <div className="mb-4">
                        <p className="text-lg">Name: {session!.user.name}</p>
                    </div>
                    <form onSubmit={handleAddProgressRecord} className="mb-4">
                        <div className="mb-2">
                            <label className="block text-sm font-medium">Weight (kg)</label>
                            <Input
                                type="number"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block text-sm font-medium">Body Fat Percentage</label>
                            <Input
                                type="number"
                                value={bodyFatPercentage}
                                onChange={(e) => setBodyFatPercentage(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full">Add Progress Record</Button>
                    </form>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" onClick={handleLogout}>Logout</Button>
                </CardFooter>
            </Card>

            <Card className="w-full max-w-4xl">
                <CardHeader>
                    <h2 className="text-xl font-bold mb-2">Progress Records</h2>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Weight (kg)</TableHead>
                                <TableHead>Body Fat (%)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {progressRecords.map(record => (
                                <TableRow key={record.id}>
                                    <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                                    <TableCell>{record.weightKg}</TableCell>
                                    <TableCell>{record.bodyFatPercentage}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}