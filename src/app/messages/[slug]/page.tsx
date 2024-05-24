"use client";
import React from "react";
import { useParams } from "next/navigation";
import MessageBox from "@/components/messageBox";
import { useGetMessages } from "@/features/useGetMessages";

import WaveLoader from "@/components/waveLoader";
import { Button, buttonVariants } from "@/components/ui/button";
import { Home, Share, VenetianMask } from "lucide-react";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import { useGetUser } from "@/features/useGetUser";

export default function Messages() {
  const params = useParams<{ slug: string }>();
  const { data, isLoading } = useGetMessages(params.slug);
  const { data: userData, isLoading: userDataLoading } = useGetUser(
    params.slug
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
    <main className='mx-auto relative w-full lg:container px-4 '>
      <section className='lg:p-4 py-4 lg:mb-72   h-full mb-12'>
        <div className='flex flex-col lg:flex-row lg:items-center justify-between mt-4 gap-4 mb-6'>
          <div>
            <h1 className='text-3xl font-bold '>
              {" "}
              {userDataLoading ? "loading..." : `${userData?.username}'s Lobby`}
            </h1>
            <p className='text-muted-foreground mt-1 text-xs'>
              Share to your friends, have fun.
            </p>
          </div>
          <div className='flex items-center  gap-4'>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger
                  onClick={handleShare}
                  className={buttonVariants({
                    variant: "default",
                    size: "icon",
                  })}
                >
                  <Share />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share to your friends</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Button asChild variant={"secondary"}>
              <Link href={"/onboard"}>Create new lobby</Link>
            </Button>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger
                  className={buttonVariants({
                    variant: "default",
                    size: "icon",
                  })}
                >
                  <Link href={"/"}>
                    <Home />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Go back home</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {isLoading ? (
          <div className='p-3  absolute top-96 lg:top-80 2xl:top-96 left-[44%] lg:left-[47%] 2xl:left-[50%]    '>
            <WaveLoader />
          </div>
        ) : data?.length == 0 ? (
          <div className='flex flex-col mt-16 2xl:mt-30 items-center justify-center  gap-3  h-full'>
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
              <div key={datum.id}>
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
              </div>
            );
          })
        )}
        <MessageBox chatRoomId={params.slug} />
      </section>
    </main>
  );
}
