import axios from "axios";
import React, { useState, useEffect, Fragment } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f7f7f7;
  text-align: center;
`;

const Button = styled.button`
  padding: 10px 20px;
  margin-top: 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

function EmailVerify() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const navigate = useNavigate();
  const server = process.env.REACT_APP_API_SERVER;

  useEffect(() => {
    const verifyEmailUrl = async () => {
      try {
        const url = `${server}api/auth/${params.id}/verify/${params.token}`;
        const res = await axios.get(url);
        console.log(res.message);
        toast.success("Email verified successfully. You can now sign in.");
        setTimeout(() => {}, 2000);
        setLoading(false);
      } catch (error) {
        toast.error("Invalid or expired verification link.");
        setLoading(false);
      }
    };
    verifyEmailUrl();
  }, [params]);

  return (
    <MessageContainer>
      {loading ? <p>Verifying...</p> : navigate("/signin")}
    </MessageContainer>
  );
}

export default EmailVerify;
