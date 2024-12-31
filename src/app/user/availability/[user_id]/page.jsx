import { AvailabilityStack, DateToggle } from "@/app/ui/component";
import { redisClient } from "@/utils/redis";

export default async function Page({ params }) {
  const { user_id } = await params;
  const availabilityData = await redisClient.get(`user:${user_id}`)
  const masterData = [
    {
      id: 0,
      name: "sunday",
      text: "S",
    },
    ,
    {
      id: 1,
      name: "monday",
      text: "M",
    },
    {
      id: 2,
      name: "tuesday",
      text: "T",
    },
    {
      id: 3,
      name: "wednesday",
      text: "W",
    },
    {
      id: 4,
      name: "Thursday",
      text: "T",
    },
    {
      id: 5,
      name: "friday",
      text: "F",
    },
    {
      id: 6,
      name: "saturday",
      text: "S",
    },
  ];
  return (
    <AvailabilityStack
      availabilityData={JSON.parse(availabilityData || "[]")}
      masterData={masterData}
      userId={user_id}
    />
  );
}
