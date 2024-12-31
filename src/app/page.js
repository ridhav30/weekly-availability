import Link from "next/link";
import { IoEyeOutline } from "react-icons/io5";

export default function Home() {
  const data = [
    {
      id: 1,
      name: "Jhon",
      designation: "Developer",
      place: "Malappuram",
    },
    {
      id: 2,
      name: "Mathew",
      designation: "Developer",
      place: "Kannur",
    },
    {
      id: 3,
      name: "Hari",
      designation: "Developer",
      place: "Calicut",
    },
    {
      id: 4,
      name: "Vishnu",
      designation: "Developer",
      place: "Idukki",
    },
    {
      id: 5,
      name: "Ridha",
      designation: "Developer",
      place: "Malappuram",
    },
  ];
  return (
    <div className="flex flex-col gap-4 p-8">
      <h1 className="font-semibold text-2xl">Users</h1>
      <table>
        <thead>
          <tr>
            <th className="border p-2 text-left">Name</th>
            <th className="border p-2 text-left">Designation</th>
            <th className="border p-2 text-left">Place</th>
            <th className="border p-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {data &&
            data.map((item) => {
              return (
                <tr key={item.id}>
                  <td className="p-2 border">{item.name}</td>
                  <td className="p-2 border">{item.designation}</td>
                  <td className="p-2 border">{item.place}</td>
                  <td className="p-2 border">
                    <Link href={`/user/availability/${item.id}`}>
                      <IoEyeOutline
                        size={24}
                        className="text-blue-600 cursor-pointer"
                      />
                    </Link>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}
