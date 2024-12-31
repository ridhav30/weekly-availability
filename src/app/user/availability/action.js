"use server";
import { parse, isBefore, isAfter } from "date-fns";

import { redisClient } from "@/utils/redis";
import { z } from "zod";
const timeSchema = z
  .string()
  .regex(
    /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM|am|pm)$/,
    "Time must be in the format HH:MM AM/PM"
  );
const schema = z.object({
  from: timeSchema,
  to: timeSchema,
});
const parseTime = (timeString) => {
  return parse(timeString, "hh:mm a", new Date());
};

const isTimeValid = (from, to) => {
  const fromTime = parseTime(from);
  const toTime = parseTime(to);
  return isBefore(fromTime, toTime);
};
const isSlotOverlapping = (newSlot, existingSlots) => {
  const newStart = parseTime(newSlot.from);
  const newEnd = parseTime(newSlot.to);

  return existingSlots.some((slot) => {
    const existingStart = parseTime(slot.from);
    const existingEnd = parseTime(slot.to);
    return (
      (isBefore(newStart, existingEnd) && isAfter(newEnd, existingStart))
    );
  });
};
export async function addTimeFn(previData, formData) {
  try {
    const { from, to, id, dayId, name } = Object.fromEntries(formData);

    const data = {
      from,
      to,
      id,
    };
    const errors = schema.safeParse(data);
    if (!errors?.success) {
      return {
        message: "Time must be in the format HH:MM AM/PM",
      };
    }
    const validTime = isTimeValid(from, to);
    if (!validTime) {
      return {
        message: "From Time should lesser than To Time",
      };
    }
    const prevData = await redisClient.get(`user:${id}`);
    const jsonData = JSON.parse(prevData || "[]");
    const findDataIndex = jsonData.findIndex((item) => item.id == dayId);
    const isOverlapping = isSlotOverlapping(
      { from, to },
      jsonData[findDataIndex]?.availabilityTimes || []
    );
    if (isOverlapping) {
      return {
        message: "Times are overlapping",
      };
    }
    if (findDataIndex > -1) {
      const updateData = {
        ...jsonData[findDataIndex],
        availabilityTimes: [
          ...jsonData[findDataIndex]?.availabilityTimes,
          {
            id: `${id}${name}${from}${to}`,
            from,
            to,
          },
        ],
      };
      jsonData.splice(findDataIndex, 1, updateData);
    } else {
      jsonData.push({
        id: dayId,
        name,
        availabilityTimes: [
          {
            id: `${id}${name}${from}${to}`,
            from,
            to,
          },
        ],
      });
    }
    await redisClient.set(`user:${id}`, JSON.stringify(jsonData));
    return {
      message: "",
      payload: jsonData,
      success: true,
    };
  } catch (error) {
    console.log(error);
    return {
      message: "Please provide inputs",
    };
  }
}
export async function deleteTimeFn(id, parentIndex, index) {
  const prevData = await redisClient.get(`user:${id}`);
  const jsonData = JSON.parse(prevData || "[]");
  jsonData[parentIndex].availabilityTimes.splice(index, 1);
  await redisClient.set(`user:${id}`, JSON.stringify(jsonData));
  return {
    message: "",
    payload: jsonData,
    success: true,
  };
}
