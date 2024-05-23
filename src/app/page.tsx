import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { MessageCircleDashed } from "lucide-react";
import Link from "next/link";
export default function Home() {
  return (
    <main className='w-full relative h-screen gap-y-3 flex flex-col items-center justify-center'>
      <div className='fixed h-96 w-96 bg-gradient-to-r animate-pulse blur-md rounded-full opacity-35 from-teal-700 to-gray-700 p-4 -z-20'></div>
      <div className='flex items-center gap-x-2'>
        <MessageCircleDashed className='text-teal-500 w-12 h-12' />
        <h2 className='font-semibold text-2xl'>Anonify</h2>
      </div>
      <h1 className='text-3xl text-secondary-foreground text-center font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none'>
        Secure and Anonymous Messaging
      </h1>
      <p className=' font-inter text-center max-w-[700px] text-muted-foreground md:text-xl'>
        Communicate privately with end-to-end encryption, no data collection,
        and complete anonymity.
      </p>
      <Button
        asChild
        className=' font-inter bg-teal-500 hover:bg-teal-600'
        size={"lg"}
      >
        <Link href={"/onboard"}>Get Started</Link>
      </Button>
      <Footer />
    </main>
  );
}
