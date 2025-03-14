import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BoringAvatar from "boring-avatars";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {gymQuotes} from '@/lib/quotes'
import { useEffect, useState } from "react";

export default function WelcomeCard({ userName, image }: { userName: string, image: string }) {
  const router = useRouter();
  const [randomQuote, setRandomQuote] = useState("");
  const [quoteKey, setQuoteKey] = useState(0);

  useEffect(() => {
    const updateQuote = () => {
      setRandomQuote(gymQuotes[Math.floor(Math.random() * gymQuotes.length)]);
      setQuoteKey(prevKey => prevKey + 1); 
    };

    updateQuote(); 
    const intervalId = setInterval(updateQuote, 1000); 

    return () => clearInterval(intervalId); 
  }, []);

  const handleProfileNavigation = () => {
    router.push('/profile');
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const textVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { delay: 0.5, duration: 0.5 } },
  };

  const userNameVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { delay: 1, duration: 0.5 } },
  };

  const quoteVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { delay: 1.5, duration: 0.5 } },
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={cardVariants} className="mb-0 h-full">
      <Card className="h-full">
        <CardHeader className="flex flex-col items-center">
          <motion.div variants={userNameVariants}>
            <CardTitle className="my-3 text-center text-lg">
              <motion.span
                initial={{ scale: 1 }}
                animate={{ scale: 1.1 }}
                transition={{ duration: 0.5, yoyo: Infinity }}
                className="font-light"
              >
                Welcome back
              </motion.span>
              <motion.span
                initial={{ scale: 1 }}
                animate={{ scale: 1.1 }}
                transition={{ duration: 0.5, yoyo: Infinity }}
                className="text-blue-300 font-bold block text-2xl mt-2"
              >
                {userName}!
              </motion.span>
            </CardTitle>
          </motion.div>
          <BoringAvatar
            size={100}
            name={image}
            variant="beam"
            colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
          />
        </CardHeader>
        <CardContent className="text-center">
          <motion.p key={quoteKey} initial="hidden" animate="visible" variants={quoteVariants} className="text-gray-500 italic">
            {randomQuote}
          </motion.p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={handleProfileNavigation}>Go to Profile</Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}