import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import axios from "axios";
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

const SignUpContainer = styled.div`
  margin-top: 40px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--color-five);
  width: 55%;
  height: 65%;
  border-radius: 40px;
  z-index: 101;
  display: flex;
  border: 2px solid var(--color-two);
`;

const SignUpLeft = styled.div`
  width: 30%;
  margin: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const Divider = styled.div`
  width: 2px;
  background-color: var(--color-two);
`;

const SignUpRight = styled.div`
  width: 70%;
  border-top-right-radius: 40px;
  border-bottom-right-radius: 40px;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const H1 = styled.h1`
  font-size: 30px;
  color: var(--color-two);
  text-align: center;
  margin-bottom: 30px;
`;

const ErrorContainer = styled.div``;
const VerifyContainer = styled.div``;

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

const NameDiv = styled.div`
  display: flex;
  gap: 20px;
`;
const Input = styled.input`
  border: none;
  outline: none;
  padding: 10px;
  border-radius: 7px;
  width: 200px;
  border: 2px solid var(--color-two);
  color: var(--color-two);
  font-size: 16px;

  &::placeholder {
    color: var(--color-two);
  }
`;

const Image = styled.img`
  width: 20px;
  height: 20px;
`;

function SignUp() {
  const Navigate = useNavigate();
  const { loading, user, isAuthenticated } = useAuth();
  const server = process.env.REACT_APP_API_SERVER;

  if (user) {
    Navigate("/");
  }
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `${server}api/auth/signup`;
      const res = await axios.post(url, data);
      toast.success(res.data.message);
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        console.log(error.response.data.message);
        toast.error(error.response.data.message);
      }
    }
  };
  return (
    <>
      <GlobalStyle />
      <Header />
      <DivContainer>
        <SignUpContainer>
          <SignUpLeft>
            <H1>Welcome, Back</H1>
            <Link style={{ textDecoration: "none" }} to="/signin">
              <Button>Sign In</Button>
            </Link>
          </SignUpLeft>
          <Divider />
          <SignUpRight>
            <H1>Create Account</H1>
            <Form onSubmit={handleSubmit}>
              <NameDiv>
                <Input
                  type="text"
                  placeholder="First Name"
                  name="firstName"
                  onChange={handleChange}
                  value={data.firstName}
                  required
                />
                <Input
                  type="text"
                  placeholder="Last Name"
                  name="lastName"
                  onChange={handleChange}
                  value={data.lastName}
                  required
                />
              </NameDiv>

              <Input
                type="email"
                placeholder="Email"
                name="email"
                onChange={handleChange}
                value={data.email}
                required
              />
              <Input
                type="password"
                placeholder="Password"
                name="password"
                onChange={handleChange}
                value={data.password}
                required
              />
              <Button type="submit">Sign Up</Button>
            </Form>
            <GoogleAuth message="Sign up with Google" />
          </SignUpRight>
        </SignUpContainer>
      </DivContainer>
      <ToastContainer />
    </>
  );
}

export default SignUp;
