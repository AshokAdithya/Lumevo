//New
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/TokenManagement";
import Header from "../Components/Header";
import axios from "axios";
import styled from "styled-components";
import Loading from "../Pages/Loading";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GlobalStyle from "../utils/Theme";
import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { resetFilters, setFilters, setPage } from "../redux/OrderSlice";

const OuterContainer = styled.div`
  width: 100vw;
`;

const DivContainer = styled.div`
  margin-left: 270px;
  padding: 20px;
  overflow-y: auto;
  width: calc(100%-250px);
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

const StyledButton = styled.button`
  padding: 10px 15px;
  border: 2px solid var(--color-two);
  border-radius: 5px;
  font-size: 16px;
  outline: none;
  cursor: pointer;
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

const OrderStatusButton = styled.button`
  background-color: var(--color-five);
  width: 150px;
  align-self: center;
  color: var(--color-three);
  font-weight: 600;
  border-radius: 9999px;
  border: none;
  padding: 10px 20px;
  border: 3px solid
    ${({ isSelected }) =>
      isSelected ? "var(--color-three)" : "var(--color-four)"};
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
  const [searchName, setSearchName] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [orderStatus, setOrderStatus] = useState("all");
  const dispatch = useDispatch();
  const {
    orders,
    filters,
    loading: fetchingOrders,
    total,
    page,
    limit,
  } = useSelector((state) => state.orders);

  const capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  useEffect(() => {
    dispatch(resetFilters());
    setSearchDate("");
    setSearchName("");
  }, [dispatch]);

  const handleSearchNameDateChange = () => {
    dispatch(setFilters({ search: searchName, date: searchDate }));
  };

  const handleResetChange = () => {
    setSearchDate("");
    setSearchName("");
    dispatch(setFilters({ search: "", date: "" }));
  };

  const handleAllOrders = () => {
    dispatch(setFilters({ ...filters, orderStatus: "all" }));
  };

  const handlePendingOrders = () => {
    dispatch(setFilters({ ...filters, orderStatus: "pending" }));
  };

  const handleCompletedOrders = () => {
    dispatch(setFilters({ ...filters, orderStatus: "completed" }));
  };

  const takeAction = (orderId) => {
    navigate("/take-action", { state: { orderId } });
  };

  if (loading) return <Loading />;

  return (
    <>
      <GlobalStyle />
      <Header />
      <OuterContainer>
        <Sidebar />
        <DivContainer>
          <FilterContainer>
            <OrderStatusButton
              isSelected={orderStatus === "all"}
              onClick={() => {
                setOrderStatus("all");
                handleAllOrders();
              }}
            >
              All
            </OrderStatusButton>
            <OrderStatusButton
              isSelected={orderStatus === "pending"}
              onClick={() => {
                setOrderStatus("pending");
                handlePendingOrders();
              }}
            >
              Pending
            </OrderStatusButton>
            <OrderStatusButton
              isSelected={orderStatus === "completed"}
              onClick={() => {
                setOrderStatus("completed");
                handleCompletedOrders();
              }}
            >
              Completed
            </OrderStatusButton>
          </FilterContainer>
          <FilterContainer>
            <StyledInput
              type="text"
              placeholder="Search by name or email"
              value={searchName}
              onChange={(e) => {
                setSearchName(e.target.value);
              }}
            />
            <StyledInput
              type="date"
              value={searchDate}
              onChange={(e) => {
                setSearchDate(e.target.value);
              }}
            />

            <StyledButton onClick={() => handleSearchNameDateChange()}>
              Search
            </StyledButton>
            <StyledButton onClick={() => handleResetChange()}>
              Reset Filters
            </StyledButton>
          </FilterContainer>
          <OrderList>
            {orders.length > 0 ? (
              orders.map((order) => (
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
      </OuterContainer>

    </>
  );
}

export default ExpertPage;
