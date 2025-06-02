import React, { useState, useEffect, Fragment } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GlobalStyle from "../utils/Theme";
import { api } from "../utils/useAxiosInstance";

const OuterContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 50px;
  box-sizing: border-box;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 600px;
  padding: 50px;
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

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border: 1px solid var(--color-two);
  border-radius: 8px;
  font-size: 16px;
`;

const MessageContainer = styled.div`
  margin: 15px;
  color: var(--color-three);
`;

const ErrorContainer = styled.div`
  margin: 15px;
  color: red;
`;

const Button = styled.button`
  margin-top: 20px;
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

function PasswordReset() {
  const [validUrl, setValidUrl] = useState(false);
  const [password, setPassword] = useState("");
  const params = useParams();
  const server = process.env.REACT_APP_API_SERVER;
  const url = `/password-reset/${params.id}/${params.token}`;

  const handleChange = (e) => {
    setPassword(e.target.value);
  };

  useEffect(() => {
    const verifyUrl = async () => {
      try {
        await api.get(url);
        setValidUrl(true);
      } catch (error) {
        setValidUrl(false);
      }
    };
    verifyUrl();
  }, [params, url]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post(url, { password });
      toast.success(data.message);
      window.location = "/signin";
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
      <Fragment>
        <GlobalStyle />
        {validUrl ? (
          <OuterContainer>
            <Container>
              <Form onSubmit={handleSubmit}>
                <Title>Change Password</Title>
                <Input
                  type="password"
                  placeholder="Change Password"
                  name="password"
                  onChange={handleChange}
                  value={password}
                  required
                />
                <Button type="submit">Change Password</Button>
              </Form>
            </Container>
          </OuterContainer>
        ) : (
          <OuterContainer>
            <Container>
              <Title>404 Not Found</Title>
            </Container>
          </OuterContainer>
        )}
      </Fragment>
    </>
  );
}

export default PasswordReset;
