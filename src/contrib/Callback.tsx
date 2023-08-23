import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";
import { useHerre } from "../herre/HerreContext";

export interface CallbackProps {}

export const Callback: React.FC<CallbackProps> = (props) => {
  const [params, setParams] = useSearchParams();

  useEffect(() => {
    let code = params.get("code");
    console.log(code);
    if (code) {
      localStorage.setItem("herre-code", code);
      window.close();
    }
  }, []);

  return <>Signing in.....</>;
};
