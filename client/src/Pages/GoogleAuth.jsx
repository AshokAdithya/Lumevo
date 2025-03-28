import React, { useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/UserSlice";
import { setAuthenticated, setUnauthenticated } from "../redux/AuthSlice";

const GlobalStyle = createGlobalStyle`
  :root {
    --color-one: #FFFFFF; //white
    --color-two: #2D2F31; //black
    --color-three: #5022C3; //bright violet
    --color-four: #C0C4FC; //light violet
    --color-five:#F8F9FB;//light white
  }
`;

const Button = styled.button`
  padding: 10px 70px;
  position: relative;
  overflow: hidden;
  background-color: var(--color-three);
  transition: background-color 0.5s;
  color: var(--color-one);
  border: none;
  outline: none;
  font-size: 18px;
  border-radius: 9999px;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  gap: 10px;
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    transform: scale(1.03);
  }
`;

const Image = styled.img`
  width: 20px;
  height: 20px;
`;

function GoogleAuth(props) {
  const Navigate = useNavigate();
  const dispatch = useDispatch();
  const server = process.env.REACT_APP_API_SERVER;

  const login = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      const res = await axios.post(`${server}api/auth/google`, {
        access_token: codeResponse.access_token,
      });
      localStorage.setItem("accessToken", res.data.access);
      localStorage.setItem("refreshToken", res.data.refresh);
      dispatch(setAuthenticated());
      dispatch(setUser(res.data.user));
      Navigate("/user");
    },
    onError: (error) => {
      console.log(error);
      Navigate("/signup");
    },
  });

  return (
    <>
      <GlobalStyle />
      <div>
        <Button onClick={login}>
          <Image src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA" />
          {props.message}
        </Button>
      </div>
    </>
  );
}
export default GoogleAuth;
