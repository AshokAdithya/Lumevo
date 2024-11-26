// import React, { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
// import { clearUser } from "../redux/UserSlice";
// import { setUnauthenticated } from "../redux/AuthSlice";
// import { Link, useNavigate } from "react-router-dom";
// import useAuth from "../hooks/TokenManagement";
// import Header from "../Components/Header";
// import axios from "axios";
// import styled, { createGlobalStyle } from "styled-components";
// import Loading from "./Loading";

// // Global style for consistency
// const GlobalStyle = createGlobalStyle`
//   :root {
//     --color-one: #FFFFFF; //white
//     --color-two: #2D2F31; //black
//     --color-three: #5022C3; //bright violet
//     --color-four: #C0C4FC; //light violet
//     --color-five:#F8F9FB;//light white
//   }
// `;

// const DivContainer = styled.div`
//   padding: 20px;
//   background-color: var(--color-one);
//   height: 100vh;
// `;

// const FilterContainer = styled.div`
//   display: flex;
//   gap: 20px;
//   margin-bottom: 20px;
// `;

// const OrderList = styled.ul`
//   list-style-type: none;
//   padding: 0;
// `;

// const OrderItem = styled.li`
//   display: flex;
//   flex-direction: column;
//   justify-content: space-between;
//   border: 2px solid var(--color-two);
//   padding: 15px;
//   margin: 0px 20px 10px 20px;
//   border-radius: 5px;
//   background-color: var(--color-five);
// `;

// const OrderHeader = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
// `;

// const OrderDetails = styled.div`
//   margin-top: 10px;

//   span {
//     margin-left: 30px;
//   }
// `;

// const OrderTitle = styled.h3`
//   margin: 0;
// `;

// const OrderStatus = styled.span`
//   color: ${({ status }) => (status === "completed" ? "green" : "red")};
// `;

// const OrderButton = styled.button`
//   background-color: var(--color-three);
//   align-self: center;
//   color: var(--color-one);
//   border-radius: 9999px;
//   border: none;
//   padding: 10px 20px;
//   font-weight: 500;
//   font-size: 16px;
//   cursor: pointer;

//   &:hover {
//     transform: scale(1.03);
//   }
// `;

// function ExpertPage() {
//   const { loading, user, isAuthenticated } = useAuth();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const server = process.env.REACT_APP_API_SERVER;
//   const [orders, setOrders] = useState([]);
//   const [searchName, setSearchName] = useState("");
//   const [searchDate, setSearchDate] = useState("");
//   const capitalize = (string) => {
//     return string[0].toUpperCase() + string.slice(1);
//   };

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const response = await axios.get(`${server}api/uploads/admin/orders`);
//         setOrders(response.data);
//       } catch (error) {
//         console.error("Error fetching orders:", error);
//       }
//     };

//     fetchOrders();
//   }, []);

//   const takeAction = (orderId) => {
//     navigate("/take-action", { state: { orderId } });
//   };

//   if (loading) return <Loading />;

//   return (
//     <>
//       <GlobalStyle />
//       <Header />
//       <DivContainer>
//         <h1 style={{ textAlign: "center" }}>Student Orders</h1>
//         <FilterContainer>
//           <input
//             type="text"
//             placeholder="Search by name"
//             value={searchName}
//             onChange={(e) => setSearchName(e.target.value)}
//           />
//           <input
//             type="date"
//             placeholder="Search by date"
//             value={searchDate}
//             onChange={(e) => setSearchDate(e.target.value)}
//           />
//         </FilterContainer>
//         <OrderList>
//           {orders.map((order) => (
//             <OrderItem key={order._id}>
//               <OrderHeader>
//                 <OrderTitle>{capitalize(order.type)}</OrderTitle>
//                 <OrderStatus status={order.status}>{order.status}</OrderStatus>
//               </OrderHeader>
//               <OrderDetails>
//                 <p>
//                   <strong>Payment Status:</strong> {order.paymentStatus}
//                 </p>
//                 <p>
//                   <strong>Files:</strong>
//                 </p>
//                 <ul>
//                   <li>
//                     <a
//                       href={`/download/${order.template.fileId}`}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                     >
//                       {order.template.fileName}
//                     </a>
//                   </li>
//                   {order.additionalFiles.map((file) => (
//                     <li key={file.fileId}>
//                       <a
//                         href={`/download/${file.fileId}`}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                       >
//                         {file.fileName}
//                       </a>
//                     </li>
//                   ))}
//                 </ul>
//                 <p style={{ display: "flex", flexDirection: "column" }}>
//                   <strong>Submitted by:</strong>
//                   <span>
//                     <strong>Name: </strong>
//                     {order.user.name}
//                   </span>
//                   <span>
//                     <strong>Email: </strong>
//                     <a href={`mailto:${order.user.email}`}>
//                       {order.user.email}
//                     </a>
//                   </span>
//                 </p>
//               </OrderDetails>
//               <OrderButton
//                 onClick={() => {
//                   takeAction(order._id);
//                 }}
//               >
//                 Take Action
//               </OrderButton>
//             </OrderItem>
//           ))}
//         </OrderList>
//       </DivContainer>
//     </>
//   );
// }

// export default ExpertPage;

//New
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/TokenManagement";
import Header from "../Components/Header";
import axios from "axios";
import styled, { createGlobalStyle } from "styled-components";
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
    --color-five:#F8F9FB;//light white
  }
`;

const DivContainer = styled.div`
  padding: 20px;
  background-color: var(--color-one);
  height: 100vh;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  margin-left: 20px;
`;

const StyledInput = styled.input`
  padding: 10px;
  border: 2px solid var(--color-two);
  border-radius: 5px;
  font-size: 16px;
  outline: none;

  &:focus {
    border-color: var(--color-three);
  }
`;

const StyledSelect = styled.select`
  padding: 10px;
  border: 2px solid var(--color-two);
  border-radius: 5px;
  font-size: 16px;
  outline: none;

  &:focus {
    border-color: var(--color-three);
  }
`;

const OrderList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const OrderItem = styled.li`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 2px solid var(--color-two);
  padding: 15px;
  margin: 0px 20px 10px 20px;
  border-radius: 5px;
  background-color: var(--color-five);
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const OrderDetails = styled.div`
  margin-top: 10px;

  span {
    margin-left: 30px;
  }
`;

const OrderTitle = styled.h3`
  margin: 0;
`;

const OrderStatus = styled.span`
  color: ${({ status }) => (status === "completed" ? "green" : "red")};
`;

const OrderButton = styled.button`
  background-color: var(--color-three);
  align-self: center;
  color: var(--color-one);
  border-radius: 9999px;
  border: none;
  padding: 10px 20px;
  font-weight: 500;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    transform: scale(1.03);
  }
`;

function ExpertPage() {
  const { loading } = useAuth();
  const navigate = useNavigate();
  const server = process.env.REACT_APP_API_SERVER;
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [types, setTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("all"); // New state for selected order type

  const capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${server}api/get/expert/orders`);
        setOrders(response.data);
        setFilteredOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    const getAllTypes = async () => {
      try {
        const response = await axios.get(`${server}api/get/types`);
        setTypes(response.data);
      } catch (error) {
        console.log("Error fetching data", error);
      }
    };

    fetchOrders();
    getAllTypes();
  }, [server]);

  useEffect(() => {
    const filterOrders = () => {
      const filtered = orders.filter((order) => {
        const fullName = `${order.user.name}`.toLowerCase();
        let orderDate = "";
        if (order.paymentDate) {
          try {
            orderDate = new Date(order.paymentDate).toISOString().split("T")[0];
          } catch (error) {
            console.error("Invalid payment date:", order.paymentDate);
          }
        }
        const matchesName = fullName.includes(searchName.toLowerCase());
        const matchesDate = searchDate === "" || orderDate === searchDate;
        const matchesType =
          selectedType === "all" || order.type === selectedType; // Match selected type

        return matchesName && matchesDate && matchesType;
      });
      setFilteredOrders(filtered);
    };

    filterOrders();
  }, [searchName, searchDate, selectedType, orders]); // Add selectedType to dependencies

  const takeAction = (orderId) => {
    navigate("/take-action", { state: { orderId } });
  };

  if (loading) return <Loading />;

  return (
    <>
      <GlobalStyle />
      <Header />
      <DivContainer>
        <h1 style={{ textAlign: "center" }}>Student Orders</h1>
        <FilterContainer>
          <StyledInput
            type="text"
            placeholder="Search by name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <StyledInput
            type="date"
            placeholder="Search by date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
          />
          <StyledSelect
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="all">All Types</option>
            {types &&
              types.map((type) => (
                <option key={type} value={type}>
                  {capitalize(type)}
                </option>
              ))}
          </StyledSelect>
        </FilterContainer>
        <OrderList>
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <OrderItem key={order._id}>
                <OrderHeader>
                  <OrderTitle>{capitalize(order.type)}</OrderTitle>
                  <OrderStatus status={order.status}>
                    {order.status}
                  </OrderStatus>
                </OrderHeader>
                <OrderDetails>
                  <p>
                    <strong>Payment Status:</strong> {order.paymentStatus}
                  </p>
                  <p>
                    <strong>Files:</strong>
                  </p>
                  <ul>
                    <li>
                      <a
                        href={`/download/${order.template.fileId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {order.template.fileName}
                      </a>
                    </li>
                    {order.additionalFiles.map((file) => (
                      <li key={file.fileId}>
                        <a
                          href={`/download/${file.fileId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {file.fileName}
                        </a>
                      </li>
                    ))}
                  </ul>
                  <p style={{ display: "flex", flexDirection: "column" }}>
                    <strong>Submitted by:</strong>
                    <span>
                      <strong>Name: </strong>
                      {order.user.name}
                    </span>
                    <span>
                      <strong>Email: </strong>
                      <a href={`mailto:${order.user.email}`}>
                        {order.user.email}
                      </a>
                    </span>
                  </p>
                </OrderDetails>
                <OrderButton
                  onClick={() => {
                    takeAction(order._id);
                  }}
                >
                  Take Action
                </OrderButton>
              </OrderItem>
            ))
          ) : (
            <p>No orders found.</p>
          )}
        </OrderList>
      </DivContainer>
      <ToastContainer />
    </>
  );
}

export default ExpertPage;
