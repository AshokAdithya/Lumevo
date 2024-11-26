import React, { useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import axios from "axios";
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
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--color-one);
  backdrop-filter: blur(3px);
  z-index: 100;
`;

const FillForm = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--color-one);
  width: 40%;
  height: 60%;
  border-radius: 40px;
  z-index: 101;
  display: flex;
  align-items: center;
  flex-direction: column;
  border: 2px solid var(--color-two);
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
  border-radius: 5px;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  font-weight: 500;
  gap: 10px;

  &:hover {
    transform: scale(1.05);
  }
`;

const MessageContainer = styled.div``;
const ErrorContainer = styled.div``;

function ExpertDetails() {
  const server = process.env.REACT_APP_API_SERVER;
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${server}api/auth/expert-request`, data);
      toast.success(res.data.message);
      setData({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
      });
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        console.log(error.response.data.message);
        toast.error(error.response.data.message);
      }
      setData({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
      });
    }
  };

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };
  return (
    <>
      <GlobalStyle />
      <DivContainer>
        <FillForm>
          <H1>Expert Details</H1>
          <Form onSubmit={handleSubmit}>
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
            <Input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
              value={data.email}
              required
            />
            <Input
              type="tel"
              placeholder="Phone Number"
              name="phoneNumber"
              onChange={handleChange}
              value={data.phoneNumber}
              required
            />
            <Button type="submit">Submit</Button>
          </Form>
        </FillForm>
      </DivContainer>
      <ToastContainer />
    </>
  );
}

export default ExpertDetails;
