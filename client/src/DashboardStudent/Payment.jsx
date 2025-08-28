import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/TokenManagement";
import axios from "axios";
import Header from "../Components/Header";
import styled from "styled-components";
import Loading from "../Pages/Loading";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GlobalStyle from "../utils/Theme";
import { api } from "../utils/useAxiosInstance";
// Define Global Styles
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 30px auto;
  max-width: 600px;
  padding: 30px;
  border: 1px solid var(--color-two);
  border-radius: 8px;
  background-color: var(--color-five);
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Title = styled.h1`
  font-size: 28px;
  margin-bottom: 20px;
  color: var(--color-two);
`;

const OrderDetails = styled.div`
  margin-bottom: 30px;
  padding: 15px;
  border-bottom: 1px solid var(--color-two);
`;

const DetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  font-size: 20px;
  color: var(--color-two);
`;

const Price = styled.span`
  font-weight: bold;
  color: var(--color-three);
`;

const Button = styled.button`
  padding: 12px 25px;
  border: none;
  border-radius: 9999px;
  background-color: var(--color-three);
  color: var(--color-one);
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    transform: scale(1.03);
  }
`;

const Description = styled.p`
  margin: 15px 0;
  font-size: 16px;
  color: var(--color-two);
`;

function Payment() {
  const { loading, user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { applyId, type } = location.state || {};
  const server = process.env.REACT_APP_API_SERVER;

  const [price, setPrice] = useState();
  const [documentType, setDocumentType] = useState();

  useEffect(() => {
    if (applyId) {
      const fetchPaymentDetails = async () => {
        try {
          const response = await api.get(`/payment/get-details`, {
            params: { applyId },
          });
          if (response.data) {
            setPrice(response.data.price);
            setDocumentType(response.data.type);
          }

          const status = await api.get(`/payment/status`, {
            params: { applyId },
          });

          if (!status.data.success) {
            navigate("/my-orders");
          }
        } catch (err) {
          console.log(err);
          navigate(`/apply/${type}`);
        }
      };
      fetchPaymentDetails();
    } else {
      navigate("/");
    }
  }, [applyId, type, navigate]);

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const initPayment = async (data) => {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      toast.error("Razorpay SDK failed to load. Are you online?");
      return;
    }

    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY,
      amount: data.amount,
      currency: data.currency,
      name: documentType,
      description: "Test Transaction",
      order_id: data.id,
      handler: async (response) => {
        navigate("/my-orders");
      },
      prefill: {
        name: user.name,
        email: user.email,
      },
      theme: {
        color: "#5022C3",
      },
    };
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  const makePayment = async () => {
    try {
      const orderUrl = `/payment/orders/${applyId}`;
      const { data } = await api.post(orderUrl, { amount: price });
      initPayment(data.data);
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) return <Loading />;

  return (
    <>
      <GlobalStyle />
      <Header />
      <Container>
        <Title>Checkout</Title>
        <OrderDetails>
          <Description>
            Please review your order details before proceeding.
          </Description>
          <DetailItem>
            <span>{documentType}</span>
            <Price>&#x20B9; {price}</Price>
          </DetailItem>
        </OrderDetails>
        <Button onClick={makePayment}>Make Payment</Button>
      </Container>
    </>
  );
}

export default Payment;
