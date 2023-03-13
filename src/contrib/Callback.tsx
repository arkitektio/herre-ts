import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";
import { useHerre } from "../herre/HerreContext";

export interface CallbackProps {}

export const Callback: React.FC<CallbackProps> = (props) => {
  const [params, setParams] = useSearchParams();
  const { setCode, user } = useHerre();
  const navigate = useNavigate();

  useEffect(() => {
    let code = params.get("code");
    console.log(code);
    if (code) {
      setCode(code);
      window.close();
    }
  }, []);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);

  return <>Signing in.....</>;
};
