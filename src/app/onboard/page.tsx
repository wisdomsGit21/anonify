"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Footer from "@/components/footer";
import { useShallow } from "zustand/react/shallow";
import { useCreateUser } from "@/features/useCreateUser";
import { toast } from "sonner";
import { useStore } from "@/store/store";
import { useRouter } from "next/navigation";
import { useCreateChatRoom } from "@/features/useCreateChatRoom";
import { Loader } from "lucide-react";

const FormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

export default function Onboard() {
  const router = useRouter();
  const { mutate, isPending } = useCreateUser();
  const { mutate: createChatroom, isPending: chatRoomPending } =
    useCreateChatRoom();
  const { setUserId, setUsername } = useStore(
    useShallow((state) => ({
      setUserId: state.setUserId,
      setUsername: state.setUsername,
    }))
  );
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    mutate(data.username, {
      onError: (err) => {
        toast.error(err.message);
      },

      onSuccess: (result) => {
        if (result) {
          setUserId(result.user.id);
          setUsername(result.user.username);
        } else {
          console.log("AN ERROR OCCURRED SAVING THE USER ID");
        }
        createChatroom(result.user.id, {
          onError: (err) => {
            console.log(err.message);
          },
          onSuccess: (result) => {
            toast.success("Lobby created");
            router.push(`/messages/${result.chatGroupId}`);
          },
        });
      },
    });
  }

  return (
    <main className='flex h-screen items-center justify-center '>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='lg:w-1/3 w-[90%]  lg:-mt-16 border border-dashed border-muted p-8 rounded-md space-y-6'
        >
          <FormField
            control={form.control}
            name='username'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder='wizzie'
                    type='text'
                    autoComplete='off'
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type='submit'>
            {isPending || chatRoomPending ? (
              <Loader className='animate-spin' />
            ) : (
              "Submit"
            )}
          </Button>
        </form>
      </Form>
      <Footer />
    </main>
  );
}
