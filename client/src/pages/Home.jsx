import React, { useEffect, useState } from "react";
import CallToAction from "../components/CallToAction";
import PostCard from "../components/PostCard";
import { Link } from "react-router-dom";
import AnimatedWave from "../components/AnimatedWave";

export default function Home() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/post/getpost?limit=9&isDraft=false");
        const data = await res.json();
        setPosts(data.posts);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchPosts();
  }, []);
  return (
    <div className="flex flex-col justify-between items-center">
      <div className="flex gap-6 flex-nowrap flex-row items-center justify-between relative z-10 max-w-6xl  mt-16  py-48 px-10 mb-20 w-full md:px-9  ">
        <AnimatedWave className="" />

        <div className="flex flex-col gap-2 mx-auto text-left select-none relative">
          <h1 className="text-3xl font-black lg:text-6xl shaodw-lg ">
            Welcome to my Blog
          </h1>
          <p className=" text-xs sm:text-sm max-w-2xl font-extralight shaodw-lg">
            Discover stories, insights, and ideas from creators around the
            world. Whether you're here for inspiration, knowledge, or just a
            good read, we've got something for you. Our blog brings together a
            vibrant community of writers, thinkers, and enthusiasts covering
            topics across Technology, Lifestyle, Health, Travel, and more. Dive
            in and explore content tailored to spark curiosity and fuel your
            passion.
          </p>
        </div>
      </div>

      <div className="mx-w-6xl mx-auto p-3 flex flex-col gap-8 py-7">
        {posts && posts.length > 0 && (
          <div className="flex flex-col gap-6">
            <h2 className="text-xl font-semibold text-center">Latest Posts</h2>
            <div className="flex flex-wrap gap-4 justify-center">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            <Link
              to={"/search"}
              className="text-lg text-teal-500 hover:underline text-center"
            >
              View all posts
            </Link>
          </div>
        )}
      </div>
      <CallToAction />
    </div>
  );
}
