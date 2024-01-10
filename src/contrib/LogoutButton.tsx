import { useFakts, useLoadFakts } from "@jhnnsrs/fakts";
import { useState } from "react";
import { useHerre, useLogin } from "../herre";

const defaultClassName =
  "w-full shadow-lg shadow-primary-300/60 flex items-center justify-center px-8 py-3 border text-base font-medium rounded-md dark:text-white text-back-700 border-primary-400 bg-primary-300 hover:bg-primary-400 md:py-4 md:text-lg md:px-10";

export type LogoutButtonProps = {
  className?: string;
  children?: React.ReactNode;
};

export const LogoutButton = ({
  className = defaultClassName,
  children = "Logout",
}: LogoutButtonProps) => {
  const { logout } = useLogin({});

  return (
    <>
      <button type="button" onClick={() => logout()}>
        {children}
      </button>
    </>
  );
};
