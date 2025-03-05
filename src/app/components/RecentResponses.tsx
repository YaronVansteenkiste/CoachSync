import { useEffect, useState } from 'react';
import { getRecentResponses } from '@/app/actions/getRecentResponses';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface Response {
    id: number;
    content: string;
    createdAt: string | null;
}

export default function RecentResponses({ userId }: { userId: string }) {
    const [responses, setResponses] = useState<Response[]>([]);
    const router = useRouter();

    useEffect(() => {
        async function fetchResponses() {
            const recentResponses = await getRecentResponses(userId);
            setResponses(recentResponses);
        }

        fetchResponses();
    }, [userId]);

    const trimContent = (content: string) => {
        return content.length > 100 ? content.substring(0, 100) + "..." : content;
    };

    const navigateToCoachGPT = () => {
        router.push('/coachgpt');
    };

    return (
        <div className="mt-6">
            <h2 className="text-2xl font-bold">Recent Responses</h2>
            <ul>
                {responses.slice(0, 2).map((response: Response) => (
                    <li key={response.id} className="mb-2 p-2 border rounded">
                        <p>{trimContent(response.content)}</p>
                    </li>
                ))}
                {responses.length > 2 && (
                    <li className="mb-2 p-2 border rounded">
                        <p>...</p>
                    </li>
                )}
            </ul>
            <Button className="w-full my-2 w-50" onClick={navigateToCoachGPT}>Go to CoachGPT</Button>
        </div>
    );
}
