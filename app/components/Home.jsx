"use client";
import React, { useEffect, useState } from "react";
import LanguageToggle from "./Toggel";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { useDispatch } from "react-redux";
import animationData from "../../public/animateLottie.json";
import { setUserEmail, setUserToken } from "../store/counterSlice";
import NotValid from "./NotValid";

const LottieNoSSR = dynamic(() => import("lottie-react"), { ssr: false });

const CheckHome = () => {
  const [isValid, setIsValid] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  useEffect(() => {
    const fetchData = async () => {
      if (email && token) {
        dispatch(setUserEmail(email));
        dispatch(setUserToken(token));
        setIsValid(true);
      } else {
        setIsValid(false);
      }
    };

    fetchData();
  }, [email, token]);

  if (!isValid) {
    return <NotValid />;
  }

  return (
    <div className="flex h-screen bg-gradient-to-br items-center justify-center">
      <div className="w-[375px] h-[600px] bg-gradient-to-b from-green-100 to-white rounded-3xl shadow-2xl flex flex-col justify-between p-6">
        <h1 className="text-3xl font-extrabold text-gray-800 text-center mb-4">
          Video KYC
        </h1>

        <div className="w-full h-[30%] flex items-center justify-center">
          <LottieNoSSR
            animationData={animationData}
            loop={true}
            className="w-60"
          />
        </div>

        <div className="flex flex-col justify-center items-center">
          <label className="text-sm  text-gray-700 text-center  mb-4">
            Choose your preferred Language ?
          </label>
          <LanguageToggle />
        </div>

        <footer className="mt-6">
          <button
            onClick={() => router.push("/check")}
            className="bg-gradient-to-r from-green-300 to-green-700 p-2 rounded-lg w-[100%] text-white font-bold"
          >
            Let's Go
          </button>
          <div className="italic text-sm flex items-end justify-end text-black mt-1">
            Powered By
            <span className="font-bold pl-1">DETEX.Tech</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default CheckHome;
