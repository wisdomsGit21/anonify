import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

import { Loader, Send } from "lucide-react";
import { useSendMessage } from "@/features/useSendMessage";
import { useQueryClient } from "@tanstack/react-query";

const FormSchema = z.object({
  content: z.string().min(1, {
    message: "Message cannot be empty.",
  }),
});

export default function MessageBox({ chatRoomId }: { chatRoomId: string }) {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useSendMessage();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      content: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    mutate(
      {
        content: data.content,
        chatRoomId: chatRoomId,
      },
      {
        onSuccess: () => {
          form.reset();
          queryClient.invalidateQueries({ queryKey: ["messages"] });
        },
      }
    );
  }

  return (
    <div className='sticky  lg:inset-x-16 lg:py-4 lg:px-0 z-30 inset-x-4   rounded-md bottom-0'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex items-center  gap-3'
        >
          <FormField
            control={form.control}
            name='content'
            render={({ field }) => (
              <FormItem className='flex-grow'>
                <FormControl>
                  <Input
                    placeholder='Enter your message here'
                    type='text'
                    autoComplete='off'
                    className='w-full'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button size={"icon"} className='bg-teal-500'>
            {isPending ? <Loader className='animate-spin' /> : <Send />}
          </Button>
        </form>
      </Form>
      <div className='px-4 py-3 text-muted-foreground'>
        <p className='text-center text-sm font-medium'>
          Made with ❤️ by {""}
          <a
            href='https://www.instagram.com/wizzie_dev?igsh=MXRsYWkxOTl3aTFiaQ=='
            className='inline-block underline'
          >
            Wizzie
          </a>
        </p>
      </div>
    </div>
  );
}
