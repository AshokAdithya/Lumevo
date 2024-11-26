import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import styled, { createGlobalStyle } from "styled-components";
import useAuth from "../hooks/TokenManagement";
import Header from "../Components/Header";
import Loading from "./Loading";
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

const Container = styled.div`
  padding: 20px;
  margin: 20px;
`;

const ProfileBox = styled.div`
  background-color: var(--color-five);
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  border: 2px solid var(--color-two);
`;

const FileButton = styled.button`
  background: none;
  border: none;
  color: var(--color-two);
  padding: 0;
  margin: 5px 0;
  text-align: left;
  border-radius: 0;
  text-decoration: underline;
  font-size: 20px;
  cursor: pointer;
`;

const Info = styled.div`
  margin-bottom: 15px;
  font-size: 18px;
  color: var(--color-two);
`;

const Input = styled.input`
  padding: 10px;
  margin-bottom: 10px;
  width: 100%;
  background: var(--color-one);
  box-sizing: border-box;
  border: 1px solid var(--color-two);
  border-radius: 5px;
`;

const Button = styled.button`
  background-color: var(--color-three);
  color: var(--color-one);
  padding: 12px 24px;
  margin: 10px;
  border: none;
  cursor: pointer;
  border-radius: 9999px;
  font-weight: 500;
  font-size: 16px;
  margin-bottom: 20px;
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    transform: scale(1.03);
  }
`;

const FileUploadContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-bottom: 20px;
`;

const UploadedFileSection = styled.div`
  li {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    &::before {
      content: "•";
      position: static;
      left: 0;
      color: var(--color-three);
      font-size: 20px;
    }
  }

  button {
    background: none;
    border: none;
    outline: none;
    text-decoration: underline;
    font-size: 15px;
    font-weight: 400;
    cursor: pointer;
    &:hover {
      transform: scale(1.03);
    }
  }
`;

function MyProfile() {
  const { loading, user, isAuthenticated } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userFiles, setUserFiles] = useState([]);
  const [uploadFile, setUploadFile] = useState(null);

  const server = process.env.REACT_APP_API_SERVER;
  const email = user.profile.email;

  useEffect(() => {
    if (user) {
      setFirstName(user.profile.firstName);
      setLastName(user.profile.lastName);
      getUserFiles();
    }
  }, [user]);

  const getUserFiles = useCallback(async () => {
    try {
      const response = await axios.get(
        `${server}api/get/get-user-files/${user.profile._id}`
      );
      if (response.data.userFiles) {
        setUserFiles(response.data.userFiles);
      }
    } catch (err) {
      toast.error("Internal Server Error");
      console.error(err);
    }
  }, [server, user]);

  const handleUpdateProfile = async () => {
    try {
      await axios.put(`${server}api/user/profile/${user.profile._id}`, {
        firstName,
        lastName,
      });
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile");
    }
  };

  const handleFileDownload = async (fileId, fileName) => {
    try {
      const response = await axios.get(
        `${server}api/downloads/user-file/${user.profile._id}/${fileId}`,
        { responseType: "blob" }
      );
      const contentType = response.headers["content-type"];

      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: contentType })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("File donwloaded successfully");
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Error downloading file");
    }
  };

  const handleFileChange = (e) => {
    setUploadFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!uploadFile) {
      toast.info("Please select a file first.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("files", uploadFile);
      formData.append("profileId", user.profile._id);

      const response = await axios.post(
        `${server}api/uploads/user-file`,
        formData
      );
      if (response.data.message) {
        toast.success(response.data.message);
        setUserFiles((userFiles) => [...userFiles, response.data.file]);
        setUploadFile(null);
      }
    } catch (err) {
      console.error("Error uploading file:", err);
      toast.error("An error occurred while uploading the file.");
    }
  };

  const deleteFile = async (fileId) => {
    try {
      await axios.delete(`${server}api/delete/portfolio/${fileId}`);
      setUserFiles((prevFiles) =>
        prevFiles.filter((file) => file.fileId !== fileId)
      );
      toast.success("File deleted successfully!");
    } catch (err) {
      console.error("Error deleting file:", err);
      toast.error("Error deleting file");
    }
  };

  if (loading) return <Loading />;

  return (
    <>
      <GlobalStyle />
      <Header />
      {isAuthenticated && (
        <Container>
          <h1>My Profile:</h1>
          <ProfileBox>
            <Info>
              <strong>First Name:</strong>
              <Input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </Info>
            <Info>
              <strong>Last Name:</strong>
              <Input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </Info>
            <Info>
              <strong>Email:</strong> {email}
            </Info>
            <Button onClick={handleUpdateProfile}>Update Profile</Button>
          </ProfileBox>
          <ProfileBox>
            <h1>Your Files:</h1>
            <FileUploadContainer>
              <Input
                type="file"
                name="files"
                id="user-file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx" // Adjust accepted file types as necessary
              />
              <Button onClick={handleFileUpload}>Upload File</Button>
            </FileUploadContainer>
            <UploadedFileSection>
              <ul>
                {userFiles.map((file) => (
                  <li key={file.fileId}>
                    <FileButton
                      onClick={() =>
                        handleFileDownload(file.fileId, file.fileName)
                      }
                    >
                      {file.fileName}
                    </FileButton>
                    <button
                      style={{ color: "red" }}
                      onClick={() => deleteFile(file.fileId)}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </UploadedFileSection>
          </ProfileBox>
        </Container>
      )}
      <ToastContainer />
    </>
  );
}

export default MyProfile;
