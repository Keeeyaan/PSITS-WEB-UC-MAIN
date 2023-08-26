import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface Event {
  id: string;
  title: string;
  creationDate?: Date;
  eventDate?: Date;
  content: string;
  photo_img_links: string;
}

const dummyData: Event[] = [
  {
    id: "1234",
    title: "Pakighimamat",
    creationDate: new Date(),
    eventDate: new Date(),
    content: "wassup mananap",
    photo_img_links: "",
  },
  {
    id: "12345",
    title: "SIR DD",
    creationDate: new Date(),
    eventDate: new Date(),
    content: "ayaw kol",
    photo_img_links: "",
  },
];

const EventSchema = z.object({
  title: z.string().min(4),
  content: z.string().min(4),
  image: z.any(),
});

type EventSchema = z.infer<typeof EventSchema>;

const Event = ({ events }: { events: Event[] }) => {
  const [eventState, setEventState] = useState(false);
  const [date, setDate] = useState<Date>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventSchema>({
    resolver: zodResolver(EventSchema),
  });

  const onSubmit: SubmitHandler<EventSchema> = (data) => {
    //TODO: Send data to the server
    console.log(data);
    console.log(date);
    const newData = {
      id: (Math.random() * 1000).toString(),
      title: data.title,
      creationDate: new Date(),
      eventDate: date,
      content: data.content,
      photo_img_links: "",
    };

    dummyData.push(newData);
    setDate(undefined);
    setEventState(false);
  };

  return (
    <div className="w-[350px]">
      {eventState ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className="w-full">
            <CardHeader>
              <Input placeholder="Event Title" {...register("title")} />
              {errors.title && <p className="text-red-400 text-sm font-light">{errors.title.message}</p>}
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`justify-start text-left font-normal ${!date && "text-muted-foreground"}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
              <Textarea rows={4} className="bg-[#fafafa]" placeholder="Event description" {...register("content")} />
              {errors.content && <p className="text-red-400 text-sm font-light">{errors.content.message}</p>}
            </CardContent>
            <CardFooter className="flex items-center justify-between gap-4">
              <Input type="file" accept="image/*" placeholder="Upload a photo" {...register("image")} />
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setDate(undefined);
                    setEventState(false);
                  }}
                >
                  Cancel
                </Button>
                <Button className="bg-[#268EA7] hover:bg-[#3da7c2]"> Post </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      ) : (
        <div
          onClick={() => setEventState(true)}
          className="w-full border rounded shadow p-6 cursor-pointer flex items-center gap-4"
        >
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>
              <User />
            </AvatarFallback>
          </Avatar>
          <h1 className="text-gray-500 text-sm">Click me to add new event!</h1>
        </div>
      )}
      <div className="mt-4 border shadow p-4 rounded">
        <h1 className="text-center font-bold text-2xl mb-4">Upcoming Events</h1>
        <div className="flex flex-col gap-4 items-center">
          {dummyData.map((announcement) => {
            return (
              <Card className="w-[90%]" key={announcement.id}>
                <CardHeader>
                  <CardTitle>{announcement.title}</CardTitle>
                  <CardDescription>{announcement.eventDate?.toISOString()}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{announcement.content}</p>
                </CardContent>
                <CardFooter>
                  <p>{announcement.creationDate?.toISOString()}</p>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Event;
