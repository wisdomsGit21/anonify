"use client";
import React from "react";
import { useParams } from "next/navigation";
import MessageBox from "@/components/messageBox";
import { useGetMessages } from "@/features/useGetMessages";

import WaveLoader from "@/components/waveLoader";
import { Button } from "@/components/ui/button";
import { Home, Share, VenetianMask } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/store/store";
import { useShallow } from "zustand/react/shallow";
import Image from "next/image";

export default function Messages() {
  const params = useParams<{ slug: string }>();
  const { data, isLoading } = useGetMessages(params.slug);

  const { username } = useStore(
    useShallow((state) => ({
      username: state.username,
    }))
  );
  const handleShare = async () => {
    try {
      const shareData = {
        title: "Title of the page",
        text: "Description of the page",
        url: window.location.href,
      };
      await navigator.share(shareData);
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };
  return (
    <main className='mx-auto lg:container px-4 '>
      <section className='lg:p-4 py-4 h-screen'>
        <div className='flex flex-col lg:flex-row lg:items-center justify-between mt-4 gap-4 mb-6'>
          <h1 className='text-3xl font-bold '> {`${username}'s Lobby`}</h1>
          <div className='flex items-center gap-4'>
            <Button onClick={handleShare} size={"icon"}>
              <Share />
            </Button>
            <Button asChild variant={"secondary"}>
              <Link href={"/onboard"}>Create new lobby</Link>
            </Button>
            <Button asChild size={"icon"}>
              <Link href={"/"}>
                <Home />
              </Link>
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className='flex items-center h-full justify-center -mt-16'>
            <WaveLoader />
          </div>
        ) : data?.length == 0 ? (
          <div className='flex flex-col items-center justify-center -mt-16 gap-3  h-full'>
            <Image
              src={"/not-found.svg"}
              alt='not found image'
              width={360}
              height={360}
            />
            <h1 className='text-muted-foreground text-3xl'>No Messages</h1>
          </div>
        ) : (
          data?.map((datum) => {
            return (
              <>
                <div className='flex items-start my-8   gap-2.5'>
                  <VenetianMask className='bg-slate-900/90 lg:h-12 rounded-full lg:w-12 w-10 h-10 p-1.5 text-teal-500' />
                  <div className='flex flex-col w-full max-w-[520px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700'>
                    <p className='text-sm font-normal py-1 text-gray-900 dark:text-white'>
                      {datum.content}
                    </p>
                    <span className='text-xs font-normal text-gray-500 dark:text-gray-400'>
                      Delivered
                    </span>
                  </div>
                </div>
              </>
            );
          })
        )}
        <MessageBox chatRoomId={params.slug} />
      </section>
    </main>
  );
}
