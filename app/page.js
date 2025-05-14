"use client";

import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user } = useUser();
  const createUser = useMutation(api.user.createUser);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      CheckUser();
    }
  }, [user]);

  const CheckUser = async () => {
    if (!user) return;

    const result = await createUser({
      email: user.primaryEmailAddress?.emailAddress || "",
      imageUrl: user.imageUrl || "",
      userName: user.fullName || "",
    });

    console.log(result);

    // Redirect to dashboard after successful sign-in
    router.push("/dashboard");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-8">
      <h1 className="text-4xl font-bold mb-4">
        Simplify <span className="text-red-500">PDF</span>{" "}
        <span className="text-blue-500">Note</span>-Taking with AI-Powered
      </h1>

      <p className="mb-6 text-lg text-gray-700 max-w-xl">
        Elevate your note-taking experience with our AI-powered PDF app.
        Seamlessly extract key insights, summaries, and annotations from any PDF
        with just a few clicks.
      </p>

      {!user ? (
        <button
          onClick={() => router.push("/sign-in")}
          className="bg-black text-white px-6 py-3 rounded-full text-lg hover:bg-gray-800 transition"
        >
          Get Started
        </button>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-xl font-semibold">Hello {user.fullName}</h2>
          <UserButton afterSignOutUrl="/" />
        </div>
      )}
    </div>
  );
}
