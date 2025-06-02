import React, { useState, useEffect } from "react";
import styled from "styled-components";
import GlobalStyle from "../utils/Theme";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setFilters } from "../redux/OrderSlice";
import { fetchOrders, setPage } from "../redux/OrderSlice";
import { api } from "../utils/useAxiosInstance";

const DivContainer = styled.div`
  position: fixed;
  top: 80px;
  left: 0;
  margin-left: 20px;
  margin-top: 20px;
`;

const Button = styled.button`
  margin: 10px;
  padding: 10px;
  border-radius: 15px;
  width: 90%;
  color: ${({ isSelected }) =>
    isSelected ? "var(--color-one)" : "var(--color-two)"};
  font-size: 20px;
  background-color: ${({ isSelected }) =>
    isSelected ? "var(--color-three)" : "var(--color-four)"};
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
`;

const InnerContainer = styled.div`
  border-radius: 20px;
  background-color: var(--color-five);
  width: 250px;
  height: max-content;
  background-color: var(--color-four);
  overflow-y: auto;
`;

const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: 20px;
  backgroind-color: var(--color-three);
  gap: 5px;
`;

const PageButton = styled.button`
  width: 100px;
  padding: 10px 0px;
  border: 2px solid var(--color-two);
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  color: var(--color-three);
  &:focus {
    border-color: var(--color-three);
  }
`;

const Span = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
`;

const H1 = styled.h1`
  font-size: 18px;
  margin: 0;
`;

const P = styled.p`
  font-size: 14px;
  margin: 0;
`;

// Sidebar Component
const Sidebar = () => {
  const server = process.env.REACT_APP_API_SERVER;
  const [selectedType, setSelectedType] = useState("All");
  const [types, setTypes] = useState([]);
  const dispatch = useDispatch();
  const [count, setCount] = useState();
  const { filters, page, limit, total } = useSelector((state) => state.orders);

  const capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  useEffect(() => {
    const getAllTypes = async () => {
      try {
        const response = await api.get(`/get/types`);
        setTypes(["All", ...response.data]);
      } catch (error) {
        console.log("Error fetching data", error);
      }
    };

    const countOrders = async () => {
      try {
        const response = await api.get(`/get/get-specific-count`);
        setCount(response.data);
        console.log(response.data);
      } catch (error) {
        console.log("Error fetching data", error);
      }
    };

    countOrders();
    getAllTypes();
  }, [server]);

  useEffect(() => {
    dispatch(fetchOrders({ page, limit, filters }));
  }, [dispatch, filters, page, limit]);

  const totalPages = Math.ceil(total / limit);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      dispatch(setPage(newPage));
    }
  };

  return (
    <>
      <GlobalStyle />
      <DivContainer>
        <InnerContainer>
          {types.map((type) => (
            <Button
              key={type}
              isSelected={type === selectedType}
              onClick={() => {
                setSelectedType(type);
                dispatch(setFilters({ type: type !== "All" ? type : "" }));
              }}
            >
              <Span>
                <H1>{capitalize(type)}</H1>
                <P>{count[type]} Orders Recieved</P>
              </Span>
            </Button>
          ))}
        </InnerContainer>
        <PaginationContainer>
          <PageButton
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >
            Previous
          </PageButton>
          <span>
            Page {page} of {totalPages}
          </span>
          <PageButton
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </PageButton>
        </PaginationContainer>
      </DivContainer>
    </>
  );
};

export default Sidebar;
