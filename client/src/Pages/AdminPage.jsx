// src/Pages/ExpertRequests.js
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import styled, { createGlobalStyle } from "styled-components";
import Header from "../Components/Header";
import Loading from "./Loading";
import useAuth from "../hooks/TokenManagement";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Global style for consistency
const GlobalStyle = createGlobalStyle`
  :root {
    --color-one: #FFFFFF; //white
    --color-two: #2D2F31; //black
    --color-three: #5022C3; //bright violet
    --color-four: #C0C4FC; //light violet
    --color-five: #F8F9FB; //light white
  }
`;

const DivContainer = styled.div`
  padding: 20px;
  background-color: var(--color-one);
  height: 100vh;
  width: 95vw;
`;

const H1 = styled.h1`
  font-size: 30px;
  color: var(--color-two);
  margin: 0;
  margin-bottom: 20px;
`;

const RequestBox = styled.div`
  background-color: var(--color-five);
  border: 2px solid var(--color-two);
  border-radius: 10px;
  padding: 15px;
  margin: 10px 20px;
  width: 300px !important;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
`;

const RequestGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;

const Label = styled.label`
  font-size: 14px;
  color: var(--color-two);
  margin-bottom: 5px;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid var(--color-two);
  border-radius: 5px;
  outline: none;
  font-size: 14px;
  width: 90%;
  margin-bottom: 10px;
`;

const Button = styled.button`
  padding: 8px 16px;
  font-size: 14px;
  color: white;
  background-color: var(--color-three);
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    transform: scale(1.03);
  }
`;

const ApproveButton = styled(Button)`
  background-color: var(--color-three);
`;

const RejectButton = styled(Button)`
  background-color: var(--color-four);
`;

const ReadOnlyInput = ({ label, value }) => (
  <>
    <Label>{label}</Label>
    <Input value={value} readOnly />
  </>
);

function ExpertRequests() {
  const { loading } = useAuth();
  const [requests, setRequests] = useState([]);
  const server = process.env.REACT_APP_API_SERVER;

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${server}api/auth/admin/requests`);
      if (res.data.success) {
        setRequests(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching expert requests:", error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const requestItems = useMemo(
    () =>
      requests.map((req) => (
        <RequestBox key={req.email}>
          <ReadOnlyInput label="First Name" value={req.firstName} />
          <ReadOnlyInput label="Last Name" value={req.lastName} />
          <ReadOnlyInput label="Phone Number" value={req.phoneNumber} />
          <ReadOnlyInput label="Email" value={req.email} />
          <p>Status: {req.status}</p>
          <ApproveButton onClick={() => handleApprove(req)}>
            Approve
          </ApproveButton>
          <RejectButton onClick={() => handleReject(req.email)}>
            Reject
          </RejectButton>
        </RequestBox>
      )),
    [requests]
  );

  const handleApprove = async (req) => {
    try {
      await axios.post(`${server}api/auth/admin/create-expert`, {
        email: req.email,
        firstName: req.firstName,
        lastName: req.lastName,
        phoneNumber: req.phoneNumber.toString(),
      });
      toast.success("Expert request approved successfully!");
      setTimeout(() => {}, 2000);
      fetchRequests();
    } catch (error) {
      console.error("Error approving request:", error);
      toast.error("Error approving request.");
    }
  };

  const handleReject = async (email) => {
    try {
      await axios.post(`${server}api/auth/admin/reject-request/${email}`);
      toast.success("Expert request rejected successfully!");
      setTimeout(() => {}, 2000);
      fetchRequests();
    } catch (error) {
      toast.error("Error rejecting request.");
    }
  };

  if (loading) return <Loading />;

  return (
    <>
      <GlobalStyle />
      <Header />
      <DivContainer>
        <H1>Expert Requests:</H1>
        {requests.length > 0 ? (
          <RequestGrid>{requestItems}</RequestGrid>
        ) : (
          <p>No requests found</p>
        )}
      </DivContainer>
      <ToastContainer />
    </>
  );
}

export default ExpertRequests;
