"use client";
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from "react-icons/ai";

import { useActionState, useEffect, useState } from "react";
import { addTimeFn, deleteTimeFn } from "../user/availability/action";

export const DateToggle = ({ text, onClick, isActive }) => {
  return (
    <div
      onClick={onClick}
      className={`rounded-full w-[40px] h-[40px] flex justify-center items-center hover:bg-gray-200 hover:cursor-pointer ${
        isActive
          ? "bg-blue-500 hover:bg-blue-500 text-white"
          : "bg-[#f2f2f2] text-gray-500"
      }`}
    >
      {text}
    </div>
  );
};
export const TimeContainer = ({ children }) => {
  return (
    <div className="bg-[#f2f2f2] py-2 px-4 rounded-sm flex justify-between w-[400px]">
      {children}
    </div>
  );
};
export const AvailabilityStack = ({
  availabilityData = [],
  masterData,
  userId,
}) => {
  const [data, setData] = useState(availabilityData);
  const deleteTimeFnWithId = deleteTimeFn.bind(null, userId);
  const [selectedDays, setSelectedDays] = useState(
    availabilityData.map((item) => parseInt(item.id)) || []
  );
  const addDay = (obj) => {
    const id = obj.id;
    const index = data.findIndex((item) => item?.id == id);
    if (index > -1) {
      const newData = [...data];
      newData.splice(index, 1);
      setData(newData.sort((a, b) => a.id - b.id));
      const removeActiveDateArray = [...selectedDays];
      const removeActiveIndex = removeActiveDateArray.findIndex(
        (item) => item == id
      );
      removeActiveDateArray.splice(removeActiveIndex, 1);
      setSelectedDays(removeActiveDateArray);
    } else {
      setData(
        [...data, { ...obj, availabilityTimes: [] }].sort((a, b) => a.id - b.id)
      );
      setSelectedDays([...selectedDays, parseInt(id)]);
    }
  };
  const addTime = (index) => {
    setData((prevData) => {
      const newData = [...prevData];

      const currentData = newData[index] || {};

      const availabilityTimes = currentData.availabilityTimes || [];

      newData[index] = {
        ...currentData,
        availabilityTimes: [
          ...availabilityTimes,
          {
            id: undefined,
            from: "",
            to: "",
            saving: true,
          },
        ],
      };

      return newData;
    });
  };

  return (
    <div className="flex flex-col gap-4 p-8">
      <div className="flex gap-2 w-[600px]">
        {masterData &&
          masterData.map((item) => {
            return (
              <DateToggle
                key={item.id}
                text={item.text}
                onClick={() => addDay(item)}
                isActive={selectedDays.includes(item.id)}
              />
            );
          })}
      </div>
      <div className="flex flex-col gap-4 text-gray-500 w-[70%]">
        {data &&
          data.map((item, i) => {
            const { availabilityTimes } = item;
            const availabilityTimesLength = availabilityTimes.length;
            return (
              <div key={item.id} className="grid grid-cols-2 gap-4">
                <div className="p-2 capitalize font-medium">{item.name}</div>
                <div className="flex flex-col gap-4">
                  {availabilityTimesLength > 0 &&
                    availabilityTimes.map((item1, index) => {
                      return (
                        <div key={index} className="flex gap-2 items-center">
                          {!item1.saving && (
                            <TimeContainer key={index}>
                              <div className="lowercase">{item1.from}</div> to{" "}
                              <div className="lowercase">{item1.to}</div>
                            </TimeContainer>
                          )}
                          {item1.saving && (
                            <Form
                              userId={userId}
                              data={item}
                              setData={setData}
                            />
                          )}
                          {availabilityTimesLength - 1 === index && (
                            <div className="flex gap-8">
                              <AiOutlinePlusCircle
                                size={26}
                                className="cursor-pointer"
                                onClick={() => addTime(i)}
                              />
                              <AiOutlineMinusCircle
                                size={26}
                                className="cursor-pointer"
                                onClick={async () => {
                                  const res = await deleteTimeFnWithId(
                                    i,
                                    index
                                  );
                                  if (res.success) {
                                    setData(res.payload);
                                  }
                                }}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  {availabilityTimesLength === 0 && (
                    <Form userId={userId} data={item} setData={setData} />
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
const initialState = {
  message: "",
  payload: null,
  success: false,
};
const Input = ({ id, name, title }) => {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id}>{title}</label>
      <input
        className="px-2 py-1 border rounded"
        type="text"
        id={id}
        name={name}
        placeholder="HH:MM am or HH:MM pm"
      />
    </div>
  );
};
const Form = ({ userId, data, setData }) => {
  const [state, formAction, pending] = useActionState(addTimeFn, initialState);
  useEffect(() => {
    if (state?.success) {
      setData(state?.payload);
    }
  }, [state, setData]);
  return (
    <form className="flex flex-col gap-2" action={formAction}>
      <input type="hidden" value={userId} name="id" />
      <input type="hidden" value={data.name} name="name" />
      <input type="hidden" value={data.id} name="dayId" />
      <div className="flex gap-2">
        <Input id={"from"} name={"from"} title={"From"} />
        <Input id={"to"} name={"to"} title={"To"} />
      </div>
      <div>
        <button
          disabled={pending}
          className={`border px-2 py-1 rounded ${
            pending ? "bg-blue-300" : "bg-blue-700"
          }  text-white`}
        >
          Save
        </button>
      </div>
      <div className="p-2 text-red-500">{state?.message}</div>
    </form>
  );
};
