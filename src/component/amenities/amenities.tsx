"use client";
import { useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import AmenitiesRoom from "./amenitiesRoom/amenitiesRoom";
import AmenitiesBranch from "./amenitiesBranch/amenitiesBranch";

export default function Amenities() {
  const [Room, setRoom] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center w-5/6 p-4">
      <button
        onClick={() => setRoom(!Room)}
        className="fixed top-5 right-10 z-50 mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300"
      >
        {Room ? "Chuyển sang tiện ích chi nhánh" : "Chuyển sang tiện ích phòng"}
      </button>
      <TransitionGroup className="w-full md:w-5/6 ">
        <CSSTransition
          key={Room ? "AmenitiesRoom" : "AmenitiesBranch"}
          timeout={300}
          classNames="fade"
        >
          <div className="transition-opacity duration-500 ease-in-out">
            {Room ? <AmenitiesRoom roomID="" /> : <AmenitiesBranch />}
          </div>
        </CSSTransition>
      </TransitionGroup>
    </div>
  );
}
