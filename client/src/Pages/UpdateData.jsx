// src/Pages/UpdateData.js
import React, { useEffect, useState } from "react";
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
  padding: 20px 20px 20px 50px;
  background-color: var(--color-one);
  height: 100vh;
  width: 95vw;
`;

const H1 = styled.h1`
  font-size: 30px;
  color: var(--color-two);
  margin: 0;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const Label = styled.label`
  font-size: 16px;
  color: var(--color-two);
  margin-bottom: 5px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid var(--color-two);
  border-radius: 5px;
  outline: none;
  font-size: 16px;
`;

const FileInput = styled.input`
  padding: 10px;
  border: 1px solid var(--color-two);
  border-radius: 5px;
  outline: none;
  font-size: 16px;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 16px;
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

const AddTemplateButton = styled(Button)`
  align-self: flex-start;
`;

const DocumentBox = styled.div`
  background-color: var(--color-five);
  border: 1px solid var(--color-two);
  border-radius: 10px;
  padding: 20px;
  margin: 10px 0;
  width: 300px;
  display: flex;
  flex-direction: column;
`;

const DocumentGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
`;

const ButtonLink = styled.button`
  border: none;
  outline: none;
  background: none;
  cursor: pointer;
  margin: 15px 0px;
  font-size: 14px;
  color: var(--color-three);
  text-decoration: underline;
`;

function UpdateData() {
  const { loading } = useAuth();
  const [loader, setLoader] = useState(false);
  const server = process.env.REACT_APP_API_SERVER;

  const [documents, setDocuments] = useState([]);
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    files: null,
  });

  useEffect(() => {
    const fetchDocumentTypes = async () => {
      try {
        const res = await axios.get(`${server}api/get/get-documents`);
        if (res.data) {
          setDocuments(res.data);
        } else {
          console.log("No documents found");
        }
      } catch (error) {
        console.error("Error fetching document types:", error);
      }
    };
    fetchDocumentTypes();
  }, [loader, server]);

  const handleInputChange = (e, doc, field) => {
    const { value } = e.target;
    setDocuments((prevDocuments) =>
      prevDocuments.map((d) =>
        d._id === doc._id ? { ...d, [field]: value } : d
      )
    );
  };

  const handleFileChange = (e, doc) => {
    const file = e.target.files[0];
    setDocuments((prevDocuments) =>
      prevDocuments.map((d) => (d._id === doc._id ? { ...d, files: file } : d))
    );
  };

  const handleUpdate = async (doc) => {
    const formData = new FormData();
    formData.append("type", doc.type);
    formData.append("description", doc.description);
    formData.append("price", doc.price);
    formData.append("image", doc.image);
    if (doc.files) {
      formData.append("files", doc.files);
    }

    try {
      await axios.put(`${server}api/uploads/admin-update/${doc._id}`, formData);
      setLoader(!loader);
      toast.success("Document updated successfully");
    } catch (error) {
      console.error("Error updating document:", error);
      toast.error("Error updating document:", error);
    }
  };

  const handleDownload = async (type) => {
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

  const handleAddTemplate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("type", newTemplate.type);
    formData.append("price", newTemplate.price);
    formData.append("image", newTemplate.image);
    formData.append("description", newTemplate.description);
    if (newTemplate.files) {
      formData.append("files", newTemplate.files);
    }

    try {
      await axios.post(`${server}api/uploads/upload-template`, formData);
      setLoader(!loader);
      toast.success("Template added successfully");
      setNewTemplate({
        type: "",
        price: "",
        files: null,
        image: "",
        description: "",
      });
    } catch (error) {
      console.error("Error adding template:", error);
      toast.error("Error adding template:", error);
    }
  };

  if (loading) return <Loading />;

  return (
    <>
      <GlobalStyle />
      <Header />
      <DivContainer>
        <H1>Update Document Types</H1>
        <DocumentGrid>
          {documents.map((doc) => (
            <DocumentBox key={doc._id}>
              <FormGroup>
                <Label htmlFor={`name-${doc._id}`}>Name</Label>
                <Input
                  id={`name-${doc._id}`}
                  name="type"
                  type="text"
                  value={doc.type}
                  onChange={(e) => handleInputChange(e, doc, "type")}
                />
                <Label htmlFor={`description-${doc._id}`}>Description</Label>
                <Input
                  id={`description-${doc._id}`}
                  name="description"
                  type="text"
                  value={doc.description}
                  onChange={(e) => handleInputChange(e, doc, "description")}
                />
                <Label htmlFor={`price-${doc._id}`}>Price</Label>
                <Input
                  id={`price-${doc._id}`}
                  name="price"
                  type="number"
                  value={doc.price}
                  onChange={(e) => handleInputChange(e, doc, "price")}
                />
                <Label htmlFor={`image-${doc._id}`}>Image Link</Label>
                <Input
                  id={`image-${doc._id}`}
                  name="image"
                  type="text"
                  value={doc.image}
                  onChange={(e) => handleInputChange(e, doc, "image")}
                />
                {doc.files && (
                  <ButtonLink onClick={() => handleDownload(doc.type)}>
                    {doc.files.fileName}
                  </ButtonLink>
                )}
                <Label htmlFor={`files-${doc._id}`}>Change Template File</Label>
                <FileInput
                  id={`files-${doc._id}`}
                  name="files"
                  type="file"
                  onChange={(e) => handleFileChange(e, doc)}
                />
                <Button type="button" onClick={() => handleUpdate(doc)}>
                  Update
                </Button>
              </FormGroup>
            </DocumentBox>
          ))}
        </DocumentGrid>

        <H1>Add New Template</H1>
        <DocumentBox>
          <FormContainer as="form" onSubmit={handleAddTemplate}>
            <FormGroup>
              <Label htmlFor="newTemplateName">Name</Label>
              <Input
                id="newTemplateName"
                name="type"
                type="text"
                value={newTemplate.type}
                onChange={(e) =>
                  setNewTemplate({ ...newTemplate, type: e.target.value })
                }
              />
              <Label htmlFor="newTemplateName">Description</Label>
              <Input
                id="newTemplateName"
                name="description"
                type="text"
                value={newTemplate.description}
                onChange={(e) =>
                  setNewTemplate({
                    ...newTemplate,
                    description: e.target.value,
                  })
                }
              />
              <Label htmlFor="newTemplatePrice">Price</Label>
              <Input
                id="newTemplatePrice"
                name="price"
                type="number"
                value={newTemplate.price}
                onChange={(e) =>
                  setNewTemplate({ ...newTemplate, price: e.target.value })
                }
              />
              <Label htmlFor="newTemplateName">Image Link</Label>
              <Input
                id="newTemplateName"
                name="image"
                type="text"
                value={newTemplate.image}
                onChange={(e) =>
                  setNewTemplate({ ...newTemplate, image: e.target.value })
                }
              />
              <Label htmlFor="newTemplateFile">Template File</Label>
              <FileInput
                id="newTemplateFile"
                name="files"
                type="file"
                onChange={(e) =>
                  setNewTemplate({
                    ...newTemplate,
                    files: e.target.files[0],
                  })
                }
              />
            </FormGroup>
            <AddTemplateButton type="submit">Add Template</AddTemplateButton>
          </FormContainer>
        </DocumentBox>
      </DivContainer>
      <ToastContainer />
    </>
  );
}

export default UpdateData;
