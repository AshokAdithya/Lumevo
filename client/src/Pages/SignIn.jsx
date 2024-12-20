import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/UserSlice";
import { setAuthenticated, setUnauthenticated } from "../redux/AuthSlice";
import GoogleAuth from "./GoogleAuth";
import Header from "../Components/Header";
import useAuth from "../hooks/TokenManagement";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const GlobalStyle = createGlobalStyle`
  :root {
    --color-one: #FFFFFF; //white
    --color-two: #2D2F31; //black
    --color-three: #5022C3; //bright violet
    --color-four: #C0C4FC; //light violet
    --color-five:#F8F9FB;//light white
  }
`;

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
      const url = `${server}api/auth/signin`;
      const res = await axios.post(url, data);
      localStorage.setItem("accessToken", res.data.access);
      localStorage.setItem("refreshToken", res.data.refresh);
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
      <ToastContainer />
    </>
  );
}

export default SignIn;

const SocialSignUpOptions = [
  {
    id: 1,
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/fe25702b65b129e3e683d1a34a7c75018db2bf42110c67ce80951dd6ddd37741?apiKey=57ccf907906c4012b1a75d0dde5c8ad7&",
    text: "Sign up with Google",
  },
  {
    id: 2,
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/7ab9e8aaf8155aaecddc0e66ffe572ccfd0433c7c78938648b2670e8c209ac6d?apiKey=57ccf907906c4012b1a75d0dde5c8ad7&",
    text: "Sign up with LinkedIn",
  },
];
