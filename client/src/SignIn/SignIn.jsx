import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/UserSlice";
import { setAuthenticated, setUnauthenticated } from "../redux/AuthSlice";
import GoogleAuth from "../Components/GoogleAuth";
import Header from "../Components/Header";
import useAuth from "../hooks/TokenManagement";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GlobalStyle from "../utils/Theme";
import { api } from "../utils/useAxiosInstance";

const DivContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 30px;
  background-color: var(--color-one);
`;

const SignInContainer = styled.div`
  margin-top: 40px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--color-five);
  width: 55%;
  height: 60%;
  border-radius: 40px;
  z-index: 101;
  display: flex;
  border: 2px solid var(--color-two);
`;

const SignInLeft = styled.div`
  width: 70%;
  height: 100%;
  display: flex;
  align-items: center;
  border-top-left-radius: 40px;
  border-bottom-left-radius: 40px;
  flex-direction: column;
`;

const Divider = styled.div`
  width: 2px;
  background-color: var(--color-two);
`;

const SignInRight = styled.div`
  width: 30%;
  margin: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const H1 = styled.h1`
  font-size: 30px;
  color: var(--color-two);
  text-align: center;
  margin-bottom: 30px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  margin-bottom: 20px;
`;
const Button = styled.button`
  padding: 10px 70px;
  position: relative;
  overflow: hidden;
  margin-top: 20px;
  background-color: var(--color-three);
  transition: background-color 0.5s;
  color: var(--color-one);
  border: none;
  outline: none;
  border-radius: 9999px;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  font-weight: 500;
  gap: 10px;
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    transform: scale(1.03);
  }
`;
const Input = styled.input`
  border: none;
  outline: none;
  padding: 10px;
  background: var(--color-one);
  border: 2px solid var(--color-two);
  border-radius: 7px;
  width: 200px;
  color: var(--color-two);
  font-size: 16px;

  &::placeholder {
    color: var(--color-three);
  }
`;

function SignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, user, isAuthenticated } = useAuth();
  const server = process.env.REACT_APP_API_SERVER;

  if (user) {
    navigate("/");
  }

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `/auth/signin`;
      const res = await api.post(url, data);
      dispatch(setAuthenticated());
      dispatch(setUser(res.data.user));
      navigate("/user");
      toast.success(res.data.message);
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        toast.error(error.response.data.message);
      }
    }
  };

  return (
    <>
      <GlobalStyle />
      <Header />
      <DivContainer>
        <SignInContainer>
          <SignInLeft>
            <H1>Sign In</H1>
            <Form onSubmit={handleSubmit}>
              <Input
                type="email"
                placeholder="Email"
                name="email"
                onChange={handleChange}
                value={data.email}
              />
              <Input
                type="password"
                placeholder="Password"
                name="password"
                onChange={handleChange}
                value={data.password}
              />
              <Link style={{ textDecoration: "none" }} to="/password-reset">
                Forgot Password
              </Link>
              <Button type="submit" on>
                Sign In
              </Button>
            </Form>
            <GoogleAuth message="Sign in with Google" />
          </SignInLeft>
          <Divider />
          <SignInRight>
            <H1>New to Lumevo</H1>
            <Link style={{ textDecoration: "none" }} to="/signup">
              <Button type="button">Sign up</Button>
            </Link>
          </SignInRight>
        </SignInContainer>
      </DivContainer>
    </>
  );
}

export default SignIn;
