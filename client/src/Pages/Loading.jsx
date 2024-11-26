// LoadingSpinner.js
import React, { memo } from "react";
import styled, { keyframes } from "styled-components";

const SpinnerContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 9999;
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  border: 8px solid #f3f3f3; /* Light grey */
  border-top: 8px solid #5022c3; /* Blue */
  border-radius: 50%;
  width: 90px;
  height: 90px;
  animation: ${spin} 2s linear infinite;
`;

const Loading = () => {
  return (
    <SpinnerContainer>
      <Spinner />
    </SpinnerContainer>
  );
};

export default memo(Loading);
