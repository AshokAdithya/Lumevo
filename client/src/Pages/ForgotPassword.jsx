import React, { useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import axios from "axios";
import Header from "../Components/Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Define Global Styles
const GlobalStyle = createGlobalStyle`
  :root {
    --color-one: #FFFFFF; /* white */
    --color-two: #2D2F31; /* black */
    --color-three: #5022C3; /* bright violet */
    --color-four: #C0C4FC; /* light violet */
    --color-five: #F8F9FB; /* light white */
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 30px auto;
  max-width: 600px;
  padding: 30px;
  border: 1px solid var(--color-two);
  border-radius: 8px;
  background-color: var(--color-five);
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Title = styled.h1`
  font-size: 28px;
  margin-bottom: 20px;
  color: var(--color-two);
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  align-self: start;
  color: var(--color-two);
  font-weight: 500;
  margin-left: -10px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border: 1px solid var(--color-two);
  border-radius: 8px;
  font-size: 16px;
`;

const MessageContainer = styled.div`
  margin: 15px 0px;
  color: var(--color-three);
`;

const ErrorContainer = styled.div`
  margin: 15px 0px;
  color: red;
`;

const Button = styled.button`
  padding: 12px 25px;
  border: none;
  border-radius: 9999px;
  background-color: var(--color-three);
  color: var(--color-one);
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    transform: scale(1.03);
  }
`;

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const server = process.env.REACT_APP_API_SERVER;

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `${server}api/password-reset`;
      const { data } = await axios.post(url, { email });
      toast.success(data.message);
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
      <Container>
        <Title>Forgot Password</Title>
        <Form onSubmit={handleSubmit}>
          <Label htmlFor="email-for-password">Enter your Email</Label>
          <Input
            type="email"
            id="email-for-password"
            placeholder="Email"
            name="email"
            onChange={handleChange}
            value={email}
            required
          />
          <Button type="submit">Submit</Button>
        </Form>
      </Container>
      <ToastContainer />
    </>
  );
}

export default ForgotPassword;
