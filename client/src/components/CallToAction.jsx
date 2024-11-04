import { Button, TextInput } from "flowbite-react";
import React from "react";
import freddy from "../assets/freddy.svg";

export default function CallToAction() {
  return (
    <div className="max-w-sm md:max-w-xl my-5 ">
      <div className="flex flex-col bg-transparent">
        <div className="place-items-end">
          <img src={freddy} alt="" className="w-96 mr-16 shadow-" />
        </div>
        <div className=" flex flex-col sm:flex-row p-3 border-4  border-[#8C462A]  justify-center rounded-tl-3xl rounded-br-3xl bg-amber-100 dark:bg-slate-800">
          <div className="flex flex-col items-center justify-center gap-4">
            <h1 className="text-2xl font-bold">
              Stay Connected, Stay Inspired!
            </h1>
            <p className="text-gray-500 text-sm">
              Subscribe to our newsletter to get the latest stories, exclusive
              insights, and handpicked articles delivered right to your inbox.
              Join a community of curious minds and never miss a post that
              matters to you.
            </p>
            <p className="font-semibold">
              Sign up now and be the first to explore new perspectives every
              week!
            </p>
            <form action="submit" className="flex gap-2">
              <TextInput
                placeholder="Name"
                className="flex-grow w-2/3"
              ></TextInput>
              <TextInput
                placeholder="Email"
                className="flex-grow w-full"
              ></TextInput>
            </form>
            <Button
              outline
              pill
              color={"#8C462A"}
              className="bg-[#8C462A] text-white"
            >
              Subscribe
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
