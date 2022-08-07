import React from "react";

interface IButtonProps {
  onClick: any;
  children: React.ReactNode;
}

const Button = ({ onClick, children }: IButtonProps) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`w-10 h-10 aspect-square md:w-auto focus:outline-none text-gray-800 bg-gray-200 hover:bg-gray-300 focus-visible:ring-4 focus:ring-gray-600 font-medium rounded-lg text-lg flex items-center justify-center`}
    >
      {children}
    </button>
  );
};

export default Button;
