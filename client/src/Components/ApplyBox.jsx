// src/Components/ApplyBox.js
import React from "react";
import styled from "styled-components";
import GlobalStyle from "../utils/Theme";
const DivContainer = styled.div`
  background: var(--color-five);
  border-radius: 8px;
  padding: 15px;
  divcontainer-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  text-align: center;
  height: 180px;
  border: 2px solid var(--color-two);

  &:hover {
    transform: translateY(-5px);
  }
`;

const Image = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 8px;
`;

const Title = styled.h3`
  font-size: 18px;
  margin-bottom: 5px;
  color: var(--color-two);
`;

const Description = styled.p`
  font-size: 14px;
  margin-bottom: 10px;
  color: var(--color-two);
`;

const Button = styled.button`
  padding: 10px 30px;
  position: relative;
  overflow: hidden;
  background-color: var(--color-three);
  font-size: 16px;
  transition: background-color 0.5s;
  color: #fff;
  border: none;
  outline: none;
  border-radius: 9999px;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    transform: scale(1.05);
  }
`;

function ApplyBox({ image, title, description, onApply }) {
  return (
    <>
      <GlobalStyle />
      <DivContainer>
        <Image src={image} alt={title} />
        <Title>{title}</Title>
        <Description>{description}</Description>
        <Button onClick={onApply}>Apply Now</Button>
      </DivContainer>
    </>
  );
}

export default ApplyBox;
