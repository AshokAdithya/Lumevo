// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import styled, { createGlobalStyle } from "styled-components";
// import { useNavigate } from "react-router-dom";
// import useAuth from "../hooks/TokenManagement";
// import Header from "../Components/Header";
// import Chat from "../Components/Chat";
// import Conversation from "../assets/conversation.png";
// import Loading from "./Loading";

// const GlobalStyle = createGlobalStyle`
//   :root {
//     --color-one: #FFFFFF; //white
//     --color-two: #2D2F31; //black
//     --color-three: #5022C3; //bright violet
//     --color-four: #C0C4FC; //light violet
//     --color-five:#F8F9FB;//light white
//   }
// `;

// const Container = styled.div`
//   padding: 20px;
//   margin: 20px;
//   h1 {
//     text-align: center;
//   }
// `;

// const OrderBox = styled.div`
//   background-color: var(--color-five);
//   border-radius: 10px;
//   padding: 20px;
//   margin-bottom: 20px;
//   border: 2px solid var(--color-two);
// `;

// const FileButton = styled.button`
//   background: none;
//   border: none;
//   color: var(--color-two);
//   padding: 0;
//   margin: 5px 0;
//   text-align: left;
//   border-radius: 0;
//   text-decoration: underline;
//   font-size: 14px;

//   cursor: ${({ status }) =>
//     status === "completed" ? "not-allowed" : "pointer"};
//   background-color: ${({ status }) =>
//     status === "completed" ? "#ddd" : "none"};

//   &:hover {
//     background-color: ${({ status }) =>
//       status === "completed" ? "#ddd" : "#e0e0e0"};
//   }
// `;

// const ChangeButton = styled.button`
//   text-decoration: none;
//   background: var(--color-three);
//   border: none;
//   color: var(--color-one);
//   padding: 10px 20px;
//   cursor: pointer;
//   margin-top: 10px;
//   font-weight: 500;
//   font-size: 16px;
//   border-radius: 9999px;

//   &:hover {
//     transform: scale(1.05);
//   }
// `;

// const StatusText = styled.span`
//   font-size: 15px;
//   color: ${({ status }) => (status === "completed" ? "green" : "red")};
//   margin-left: 10px;
// `;

// const Title = styled.h2`
//   margin-top: 0;
//   color: var(--color-three);
//   border-bottom: 2px solid var(--color-two);
//   width: fit-content;
// `;

// const FileSection = styled.div`
//   margin-bottom: 15px;
//   display: flex;
//   flex-direction: column;
// `;
// const Span = styled.span`
//   color: var(--color-two);
//   margin-right: 20px;
// `;

// const ChatIconContainer = styled.div`
//   position: fixed;
//   bottom: 20px;
//   right: 20px;
//   cursor: pointer;
// `;

// const Icon = styled.div`
//   width: 50px;
//   height: 50px;
//   background-color: var(--color-four);
//   border-radius: 50%;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   color: var(--color-two);
//   font-size: 24px;
//   box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);

//   img {
//     color: var(--color-one);
//     width: 20px;
//     height: 20px;
//   }
// `;

// function MyOrders() {
//   const Navigate = useNavigate();
//   const [showChat, setShowChat] = useState(false);
//   const { loading, user, isAuthenticated } = useAuth();
//   const [files, setFiles] = useState([]);
//   const [hasPendingOrder, setHasPendingOrder] = useState(false);
//   const server = process.env.REACT_APP_API_SERVER;
//   const capitalize = (string) => {
//     return string[0].toUpperCase() + string.slice(1);
//   };

//   useEffect(() => {
//     const getData = async () => {
//       try {
//         const response = await axios.get(`${server}api/get/get-orders`, {
//           params: { userId: user.id },
//         });
//         if (response.data) {
//           console.log(response.data);
//           setFiles(response.data);
//           const pendingOrder = response.data.some(
//             (file) => file.status === "pending"
//           );
//           setHasPendingOrder(pendingOrder);
//         }
//       } catch (error) {
//         console.error("Error fetching orders:", error);
//       }
//     };

//     getData();
//   }, [user.id, server]);

//   const handleFileDownload = async (fileId, fileName) => {
//     try {
//       const res = await axios.get(
//         `${server}api/downloads/student-file/${fileId}`,
//         {
//           responseType: "blob",
//         }
//       );

//       const url = window.URL.createObjectURL(new Blob([res.data]));
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", fileName);
//       document.body.appendChild(link);
//       link.click();
//       link.parentNode.removeChild(link);
//     } catch (err) {
//       console.error("Error downloading template:", err);
//     }
//   };

//   const makePayment = (applyId, type) => {
//     Navigate("/payment", { state: { applyId: applyId, type: type } });
//   };

//   const updateFile = async (type, orderId) => {
//     try {
//       const document = await axios.get(
//         `${server}api/get/get-specific-document/${type}`
//       );
//       Navigate("/update-files", {
//         state: { description: document.data.description, orderId, type },
//       });
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   if (loading) return <Loading />;
//   return (
//     <>
//       <GlobalStyle />
//       <Header />
//       {isAuthenticated && (
//         <Container>
//           <h1>My Orders:</h1>
//           {files.length > 0 ? (
//             files.map((file) => (
//               <OrderBox key={file._id}>
//                 <Title>{capitalize(file.type)}</Title>
//                 <StatusText status={file.status}>
//                   <Span>Order Status:</Span>
//                   {file.status}
//                 </StatusText>
//                 <h3>Payment</h3>
//                 <StatusText status={file.paymentStatus}>
//                   <Span>Payment Status:</Span>
//                   {file.paymentStatus}
//                 </StatusText>
//                 {file.template && (
//                   <FileSection>
//                     <h3>Template:</h3>
//                     <FileButton
//                       onClick={() =>
//                         handleFileDownload(
//                           file.template.fileId,
//                           file.template.fileName
//                         )
//                       }
//                     >
//                       {file.template.fileName}
//                     </FileButton>
//                   </FileSection>
//                 )}

//                 <FileSection>
//                   <h3>Additional Files:</h3>
//                   {file.additionalFiles.map((additional) => (
//                     <FileButton
//                       key={additional.fileId}
//                       onClick={() =>
//                         handleFileDownload(
//                           additional.fileId,
//                           additional.fileName
//                         )
//                       }
//                     >
//                       {additional.fileName}
//                     </FileButton>
//                   ))}
//                 </FileSection>
//                 {file.completedFile && (
//                   <FileSection>
//                     <h3>Completed File:</h3>
//                     <FileButton
//                       onClick={() =>
//                         handleFileDownload(
//                           file.completedFile.fileId,
//                           file.completedFile.fileName
//                         )
//                       }
//                     >
//                       {file.completedFile.fileName}
//                     </FileButton>
//                   </FileSection>
//                 )}
//                 {file.status !== "completed" && (
//                   <ChangeButton
//                     onClick={() => {
//                       updateFile(file.type, file._id);
//                     }}
//                   >
//                     Update Details
//                   </ChangeButton>
//                 )}
//                 <br />
//                 <br />
//                 {file.paymentStatus === "pending" && (
//                   <ChangeButton
//                     onClick={() => makePayment(file._id, file.type)}
//                   >
//                     Initiate Payment
//                   </ChangeButton>
//                 )}
//               </OrderBox>
//             ))
//           ) : (
//             <p>No orders found.</p>
//           )}
//         </Container>
//       )}

//       {hasPendingOrder && (
//         <ChatIconContainer onClick={() => setShowChat(!showChat)}>
//           <Icon>
//             <img
//               width="20px"
//               height="20px"
//               src={Conversation}
//               alt="conversation pic"
//             />
//           </Icon>
//         </ChatIconContainer>
//       )}
//       <Chat
//         show={showChat}
//         onClose={() => setShowChat(false)}
//         name="Expert"
//         id={user.id}
//       />
//     </>
//   );
// }

// export default MyOrders;

import axios from "axios";
import React, { useEffect, useState, useMemo } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/TokenManagement";
import Header from "../Components/Header";
import Chat from "../Components/Chat";
import Conversation from "../assets/conversation.png";
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
  h1 {
    text-align: center;
  }
`;

const OrderBox = styled.div`
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
  font-size: 14px;

  cursor: ${({ status }) =>
    status === "completed" ? "not-allowed" : "pointer"};
  background-color: ${({ status }) =>
    status === "completed" ? "#ddd" : "none"};

  &:hover {
    background-color: ${({ status }) =>
      status === "completed" ? "#ddd" : "#e0e0e0"};
  }
`;

const ChangeButton = styled.button`
  text-decoration: none;
  background: var(--color-three);
  border: none;
  color: var(--color-one);
  padding: 10px 20px;
  cursor: pointer;
  margin-top: 10px;
  font-weight: 500;
  font-size: 16px;
  border-radius: 9999px;

  &:hover {
    transform: scale(1.05);
  }
`;

const StatusText = styled.span`
  font-size: 15px;
  color: ${({ status }) => (status === "completed" ? "green" : "red")};
  margin-left: 10px;
`;

const Title = styled.h2`
  margin-top: 0;
  color: var(--color-three);
  border-bottom: 2px solid var(--color-two);
  width: fit-content;
`;

const FileSection = styled.div`
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
`;
const Span = styled.span`
  color: var(--color-two);
  margin-right: 20px;
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

function MyOrders() {
  const Navigate = useNavigate();
  const [showChat, setShowChat] = useState(false);
  const { loading, user, isAuthenticated } = useAuth();
  const [files, setFiles] = useState([]);
  const server = process.env.REACT_APP_API_SERVER;

  const capitalize = (string) => {
    return string[0].toUpperCase() + string.slice(1);
  };

  // Fetch orders data
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(`${server}api/get/get-orders`, {
          params: { userId: user.id },
        });
        if (response.data) {
          setFiles(response.data);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    getData();
  }, [user.id, server]);

  const hasPendingOrder = useMemo(() => {
    return files.some((file) => file.status === "pending");
  }, [files]);

  // File download function
  const handleFileDownload = async (fileId, fileName) => {
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
      toast.success("File downloaded successfully");
    } catch (err) {
      console.error("Error downloading template:", err);
      toast.error("Error downloading template:", err);
    }
  };

  const makePayment = (applyId, type) => {
    Navigate("/payment", { state: { applyId, type } });
  };

  const updateFile = async (type, orderId) => {
    try {
      const document = await axios.get(
        `${server}api/get/get-specific-document/${type}`
      );
      Navigate("/update-files", {
        state: { description: document.data.description, orderId, type },
      });
    } catch (err) {
      toast.error(err);
      console.log(err);
    }
  };

  if (loading) return <Loading />;
  return (
    <>
      <GlobalStyle />
      <Header />
      {isAuthenticated && (
        <Container>
          <h1>My Orders:</h1>
          {files.length > 0 ? (
            files.map((file) => (
              <OrderBox key={file._id}>
                <Title>{capitalize(file.type)}</Title>
                <StatusText status={file.status}>
                  <Span>Order Status:</Span>
                  {file.status}
                </StatusText>
                <h3>Payment</h3>
                <StatusText status={file.paymentStatus}>
                  <Span>Payment Status:</Span>
                  {file.paymentStatus}
                </StatusText>
                {file.template && (
                  <FileSection>
                    <h3>Template:</h3>
                    <FileButton
                      onClick={() =>
                        handleFileDownload(
                          file.template.fileId,
                          file.template.fileName
                        )
                      }
                    >
                      {file.template.fileName}
                    </FileButton>
                  </FileSection>
                )}

                <FileSection>
                  <h3>Additional Files:</h3>
                  {file.additionalFiles.map((additional) => (
                    <FileButton
                      key={additional.fileId}
                      onClick={() =>
                        handleFileDownload(
                          additional.fileId,
                          additional.fileName
                        )
                      }
                    >
                      {additional.fileName}
                    </FileButton>
                  ))}
                </FileSection>
                {file.completedFile && (
                  <FileSection>
                    <h3>Completed File:</h3>
                    <FileButton
                      onClick={() =>
                        handleFileDownload(
                          file.completedFile.fileId,
                          file.completedFile.fileName
                        )
                      }
                    >
                      {file.completedFile.fileName}
                    </FileButton>
                  </FileSection>
                )}
                {file.status !== "completed" && (
                  <ChangeButton onClick={() => updateFile(file.type, file._id)}>
                    Update Details
                  </ChangeButton>
                )}
                <br />
                <br />
                {file.paymentStatus === "pending" && (
                  <ChangeButton
                    onClick={() => makePayment(file._id, file.type)}
                  >
                    Initiate Payment
                  </ChangeButton>
                )}
              </OrderBox>
            ))
          ) : (
            <p>No orders found.</p>
          )}
        </Container>
      )}

      {hasPendingOrder && (
        <ChatIconContainer onClick={() => setShowChat(!showChat)}>
          <Icon>
            <img
              width="20px"
              height="20px"
              src={Conversation}
              alt="conversation pic"
            />
          </Icon>
        </ChatIconContainer>
      )}
      <Chat
        show={showChat}
        onClose={() => setShowChat(false)}
        name="Expert"
        id={user.id}
      />
      <ToastContainer />
    </>
  );
}

export default MyOrders;
