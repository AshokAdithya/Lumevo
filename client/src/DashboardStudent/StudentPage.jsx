// src/Pages/StudentPage.js
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import useAuth from "../hooks/TokenManagement";
import ApplyBox from "../Components/ApplyBox";
import orders from "../assets/orders.png";
import Loading from "../Pages/Loading";
import axios from "axios";
import GlobalStyle from "../utils/Theme";
import { api } from "../utils/useAxiosInstance";

const DivContainer = styled.div`
  padding: 20px 20px 20px 100px;
  background-color: var(--color-one);
  height: 100vh;
`;

const H1 = styled.h1`
  font-size: 30px;
  color: var(--color-two);
  margin: 0;
`;

const H2 = styled.h2`
  font-size: 24px;
  color: var(--color-two);
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const HeadingContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  margin-right: 30px;

  img {
    width: 20px;
    height: 20px;
    margin-right: 5px;
    color: var(--color-one);
  }
  a {
    font-size: 16px;
    font-weight: 500;
    display: flex;
    tex-align: center;
    align-self: center;
    justify-content: center;
    color: var(--color-two);
    padding: 10px 20px;
    border-radius: 9999px;
    background: var(--color-four);
  }
`;

const ApplyContainer = styled.div`
  margin-left: 150px;
  display: flex;
  flex-wrap: wrap;
  gap: 50px;
  justify-content: flex-start;

  & > div {
    flex: 1 1 calc(25% - 30px);
    max-width: calc(25% - 30px);
  }

  & > div:nth-child(4) {
    margin-left: 15%;
  }

  & > div:nth-child(4),
  & > div:nth-child(5) {
    flex: 1 1 calc(25% - 30px);
    max-width: calc(25% - 30px);
  }
`;

function StudentPage() {
  const { loading, user } = useAuth();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const server = process.env.REACT_APP_API_SERVER;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/get/get-documents`, {});
        if (response.data) {
          setDocuments(response.data);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [server]);

  if (loading) return <Loading />;

  const handleApply = (type, description) => {
    navigate(`/apply/${type}`, { state: { description } });
  };

  return (
    <>
      <GlobalStyle />
      <Header />
      <DivContainer>
        <HeadingContainer>
          <H1>Hi {`${user.profile.firstName} ${user.profile.lastName}`},</H1>
          <Link to="/my-orders">
            <img src={orders} alt="images" />
            MyOrders
          </Link>
        </HeadingContainer>

        <FormContainer>
          <H2>Apply For :</H2>
          <ApplyContainer>
            {documents.length !== 0 &&
              documents.map((doc) => (
                <ApplyBox
                  key={doc.id}
                  image={doc.image}
                  title={doc.type}
                  description={doc.description}
                  onApply={() => handleApply(doc.type, doc.description)}
                />
              ))}
          </ApplyContainer>
        </FormContainer>
      </DivContainer>
    </>
  );
}

export default StudentPage;
