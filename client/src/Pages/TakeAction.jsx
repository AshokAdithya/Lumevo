import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import Header from "../Components/Header";
import Chat from "../Components/Chat";
import Conversation from "../assets/conversation.png";
import Loading from "./Loading";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Global style for consistency
const GlobalStyle = createGlobalStyle`
  :root {
    --color-one: #FFFFFF; //white
    --color-two: #2D2F31; //black
    --color-three: #5022C3; //bright violet
    --color-four: #C0C4FC; //light violet
    --color-five:#F8F9FB; //light white
  }

  body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    background-color: var(--color-five);
  }
`;

const Container = styled.div`
  padding: 20px;
  background-color: var(--color-one);
  min-height: 100vh;
`;

const Heading = styled.h1`
  text-align: center;
  color: var(--color-two);
`;

const Section = styled.section`
  margin: 20px 0;
`;

const Details = styled.div`
  border: 1px solid var(--color-two);
  padding: 15px;
  border-radius: 5px;
  background-color: var(--color-one);
`;

const FileList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const FileItem = styled.li`
  margin-bottom: 10px;
`;

const Input = styled.input`
  display: block;
  margin: 20px auto;
`;

const Button = styled.button`
  background-color: var(--color-three);
  color: var(--color-one);
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    transform: scale(1.03);
  }
`;

const Message = styled.p`
  text-align: center;
  color: ${(status) => (status ? "green" : "red")};
`;

const ChatIconContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  cursor: pointer;
`;

const Icon = styled.div`
  width: 50px;
  height: 50px;
  background-color: var(--color-four);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-two);
  font-size: 24px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);

  img {
    color: var(--color-one);
    width: 20px;
    height: 20px;
  }
`;

function TakeAction() {
  const [showChat, setShowChat] = useState(false);
  const location = useLocation();
  const Navigate = useNavigate();
  const { orderId } = location.state || {};
  const [orderDetails, setOrderDetails] = useState(null);
  const [completedFile, setCompletedFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const server = process.env.REACT_APP_API_SERVER;
  const capitalize = (string) => {
    return string[0].toUpperCase() + string.slice(1);
  };

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`${server}api/get/expert/order`, {
          params: { orderId: orderId },
        });
        setOrderDetails(response.data);
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    fetchOrderDetails();
  }, [orderId, server]);

  const handleFileChange = (event) => {
    setCompletedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!completedFile) {
      toast.info("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("files", completedFile);
    formData.append("orderId", orderId);

    try {
      const response = await axios.post(
        `${server}api/uploads/expert/upload`,
        formData
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setSuccessMessage(response.data.success);
        Navigate("/user");
      } else {
        setSuccessMessage(response.data.success);
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Error uploading file.");
    }
  };

  if (!orderDetails) return <Loading />;

  return (
    <>
      <GlobalStyle />
      <Header />
      <Container>
        <Heading>Order Details - {capitalize(orderDetails.type)}</Heading>
        <Section>
          <h2>Submitted by</h2>
          <Details>
            <p>
              <strong>Name:</strong> {orderDetails.user.name}
            </p>
            <p>
              <strong>Email:</strong>
              <a href={`mailto:${orderDetails.user.email}`}>
                {orderDetails.user.email}
              </a>
            </p>
          </Details>
        </Section>
        <Section>
          <h2>Template</h2>
          <Details>
            <p>
              <a
                href={`${server}api/downloads/student-file/${orderDetails.template.fileId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {orderDetails.template.fileName}
              </a>
            </p>
          </Details>
        </Section>
        <Section>
          <h2>Additional Files</h2>
          <Details>
            <FileList>
              {orderDetails.additionalFiles.map((file) => (
                <FileItem key={file.fileId}>
                  <a
                    href={`${server}api/downloads/student-file/${file.fileId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {file.fileName}
                  </a>
                </FileItem>
              ))}
            </FileList>
          </Details>
        </Section>
        {orderDetails.status === "completed" && (
          <Section>
            <h2>Uploaded File By Expert</h2>
            <Details>
              <p>
                <a
                  href={`${server}api/downloads/student-file/${orderDetails.completedFile.fileId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {orderDetails.completedFile.fileName}
                </a>
              </p>
            </Details>
          </Section>
        )}

        <Section>
          <h2>Upload Completed Document</h2>
          <form onSubmit={handleSubmit}>
            <Input
              type="file"
              onChange={handleFileChange}
              accept=".doc, .docx, .pdf"
            />
            <Button type="submit">Submit</Button>
          </form>
        </Section>
      </Container>
      {orderDetails.status === "pending" && (
        <>
          <ChatIconContainer onClick={() => setShowChat(!showChat)}>
            <Icon>
              <img src={Conversation} alt="conversation pic" />
            </Icon>
          </ChatIconContainer>
          <Chat
            show={showChat}
            onClose={() => setShowChat(false)}
            name={orderDetails.user.name}
            id={orderDetails.userId}
          />
        </>
      )}
      <ToastContainer />
    </>
  );
}

export default TakeAction;
