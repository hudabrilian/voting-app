import React from "react";
import Lottie from "lottie-react";
import NotFoundAnimation from "../anims/404.json";

const NotFound = () => {
  return (
    <div className="w-screen mt-10 flex justify-center items-center">
      <Lottie
        animationData={NotFoundAnimation}
        height={100}
        width={100}
        className="w-1/2"
        loop={true}
      />
    </div>
  );
};

export default NotFound;
