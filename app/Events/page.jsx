import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Page = () => {
  // Simulated branches data (should be objects)
  const branches = [
    { id: 1, name: "Branch 1", ifsc: "IFSC001", manager: "Alice", employees: 20, contact: "9876543210" },
    { id: 2, name: "Branch 2", ifsc: "IFSC002", manager: "Bob", employees: 25, contact: "9876543220" },
    { id: 3, name: "Branch 3", ifsc: "IFSC003", manager: "Charlie", employees: 18, contact: "9876543230" },
    { id: 4, name: "Branch 4", ifsc: "IFSC004", manager: "David", employees: 22, contact: "9876543240" },
    { id: 5, name: "Branch 1", ifsc: "IFSC001", manager: "Alice", employees: 20, contact: "9876543210" },
    { id: 6, name: "Branch 2", ifsc: "IFSC002", manager: "Bob", employees: 25, contact: "9876543220" },
    { id: 7, name: "Branch 3", ifsc: "IFSC003", manager: "Charlie", employees: 18, contact: "9876543230" },
    { id: 8, name: "Branch 4", ifsc: "IFSC004", manager: "David", employees: 22, contact: "9876543240" },
  ];

  return (
    <div className="bg-[#17003A] dark:bg-[#8617C0] p-10">
      <div className="text-2xl text-white mb-5">Events</div>

      {/* Branch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 place-items-center gap-4 ">
        {branches.map((branch) => (
          <Card key={branch.id} className="w-[350px] bg-secondary text-primary shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl">Branch Name: {branch.name}</CardTitle>
              <hr />
            </CardHeader>
            <CardContent>
              <div className="text-xl">
                <div className="flex flex-row w-full items-center gap-2">
                  <div className="font-semibold">IFSC Code:</div>
                  <div>{branch.ifsc}</div>
                </div>
                <div className="flex flex-row w-full items-center gap-2">
                  <div className="font-semibold">Manager:</div>
                  <div>{branch.manager}</div>
                </div>
                <div className="flex flex-row w-full items-center gap-2">
                  <div className="font-semibold">Number of Employees:</div>
                  <div>{branch.employees}</div>
                </div>
                <div className="flex flex-row w-full items-center gap-2">
                  <div className="font-semibold">Contact:</div>
                  <div>{branch.contact}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Page;
