import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import Header from "../Components/Header";
import useAuth from "../hooks/TokenManagement";
import axios from "axios";
import Loading from "./Loading";

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
  padding: 40px 60px;
  background-color: var(--color-one);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const H1 = styled.h1`
  font-size: 24px;
  color: var(--color-two);
  margin-bottom: 20px;
  text-align: center;
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

  &:hover {
    transform: scale(1.03);
  }
`;

const UploadSection = styled.div`
  margin-bottom: 30px;
  text-align: center;

  label {
    display: block;
    font-size: 20px;
    color: var(--color-two);
    margin-bottom: 10px;
    font-weight:500;
  }

  input {
    display: block;
    margin: 0 auto 10px;
  }

  button {
    background-color: var(--color-three);
    color: var(--color-one);
    padding: 12px 24px;
    border: none;
    cursor: pointer;
    border-radius: 9999px;
    font-weight: 500;
    font-size: 16px;
    margin-top: 10px;

    &:hover {
      transform: scale(1.03);
    }

`;

const OuterSection = styled.div`
  padding: 50px;
  border-radius: 40px;
  border: 2px solid var(--color-two);
  margin-bottom: 20px;
  width: 400px;
  background: var(--color-five);
`;

const UploadedFilesSection = styled.div`
  margin-bottom: 30px;

  h1 {
    font-size: 20px;
    font-weight: 500;
    text-align: center;
  }

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
function ApplyType() {
  const { loading, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { description, type, orderId } = location.state || "";
  const server = process.env.REACT_APP_API_SERVER;

  const [completedTemplate, setCompletedTemplate] = useState(null);
  const [additionalFiles, setAdditionalFiles] = useState();
  const [uploadedTemplate, setUploadedTemplate] = useState(null);
  const [uploadedAdditionalFiles, setUploadedAdditionalFiles] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${server}api/get/get-update-upload`, {
          params: {
            orderId: orderId,
          },
        });

        if (response.data) {
          setUploadedTemplate(response.data.dbuploadedTemplate);
          setUploadedAdditionalFiles(response.data.dbadditionalFiles);
        }
      } catch (error) {
        console.error("Error loading files:", error);
        navigate("/my-orders");
      }
    };

    fetchData();
  }, [loader, navigate, orderId, server]);

  const downloadStudentFile = async (fileId, fileName) => {
    try {
      const res = await axios.get(
        `${server}api/downloads/student-file/${fileId}`,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      console.error("Error downloading template:", err);
    }
  };

  const handleDownload = async () => {
    try {
      const res = await axios.get(`${server}api/downloads/${type}`, {
        responseType: "blob",
      });
      const contentType = res.headers["content-type"];

      const url = window.URL.createObjectURL(
        new Blob([res.data], { type: contentType })
      );
      console.log(url);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${type}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      console.error("Error downloading template:", err);
    }
  };

  const handleTemplateChange = (e) => {
    setCompletedTemplate(e.target.files[0]);
  };

  const handleAdditionalFileChange = (e) => {
    setAdditionalFiles(e.target.files[0]);
  };
  const uploadTemplate = async () => {
    if (!completedTemplate) {
      alert("Please select a template file first.");
      return;
    }

    const formData = new FormData();
    formData.append("files", completedTemplate);
    formData.append("fileType", "template");
    formData.append("userId", user.id);
    formData.append("type", type);

    try {
      const response = await axios.post(
        `${server}api/uploads/student-upload`,
        formData
      );
      if (response.data.message) {
        setCompletedTemplate(null);
      } else {
        alert("Error: " + response.data.message);
      }

      setLoader(!loader);
    } catch (error) {
      console.error("Error uploading template:", error);
      alert("An error occurred while uploading the template.");
    }
  };

  const uploadAdditionalFiles = async () => {
    if (!additionalFiles) {
      alert("Please select additional files first.");
      return;
    }

    const formData = new FormData();
    formData.append("files", additionalFiles);
    formData.append("fileType", "additional");
    formData.append("userId", user.id);
    formData.append("type", type);

    try {
      const response = await axios.post(
        `${server}api/uploads/student-upload`,
        formData
      );
      if (response.data.message) {
        console.log(response.data.message);
        setAdditionalFiles(null);
      } else {
        alert("Error: " + response.data.message);
      }
      setLoader(!loader);
    } catch (error) {
      console.error("Error uploading template:", error);
      alert("An error occurred while uploading the template.");
    }
  };

  const deleteFile = async (fileId) => {
    try {
      const res = await axios.delete(
        `${server}api/delete/student-file/${fileId}`
      );
      setLoader(!loader);
      console.log(res.data.message);
    } catch (err) {
      console.error("Error deleting file:", err);
    }
  };

  if (loading) return <Loading />;

  return (
    <>
      <GlobalStyle />
      <Header />
      <DivContainer>
        <H1>{`Apply for ${description}`}</H1>
        <Button onClick={handleDownload}>Download Template</Button>
        <OuterSection>
          <UploadSection>
            <label htmlFor="upload-template">Upload Completed Template:</label>
            <input
              type="file"
              name="files"
              id="upload-template"
              onChange={handleTemplateChange}
            />
            <button type="button" onClick={uploadTemplate}>
              Upload Template
            </button>
          </UploadSection>
          {uploadedTemplate && uploadedTemplate.fileId && (
            <UploadedFilesSection>
              <h1>Uploaded Template</h1>
              <ul>
                <li key={uploadedTemplate.fileId}>
                  <button
                    onClick={() =>
                      downloadStudentFile(
                        uploadedTemplate.fileId,
                        uploadedTemplate.fileName
                      )
                    }
                  >
                    {uploadedTemplate.fileName}
                  </button>
                  <button
                    style={{ color: "red" }}
                    onClick={() => deleteFile(uploadedTemplate.fileId)}
                  >
                    Delete
                  </button>
                </li>
              </ul>
            </UploadedFilesSection>
          )}
        </OuterSection>
        <OuterSection>
          <UploadSection>
            <label htmlFor="upload-documents">
              Upload Additional Documents:
            </label>
            <input
              type="file"
              name="files"
              id="upload-documents"
              multiple
              onChange={handleAdditionalFileChange}
            />
            <button type="button" onClick={uploadAdditionalFiles}>
              Upload Files
            </button>
          </UploadSection>
          {uploadedAdditionalFiles.length > 0 && (
            <UploadedFilesSection>
              <h1>Uploaded Files</h1>
              <ul>
                {uploadedAdditionalFiles.map((file) => (
                  <li key={file.fileId}>
                    <button
                      onClick={() =>
                        downloadStudentFile(orderId, file.fileName)
                      }
                    >
                      {file.fileName}
                    </button>
                    <button
                      style={{ color: "red" }}
                      onClick={() => deleteFile(file.fileId)}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </UploadedFilesSection>
          )}
        </OuterSection>
      </DivContainer>
    </>
  );
}

export default ApplyType;
