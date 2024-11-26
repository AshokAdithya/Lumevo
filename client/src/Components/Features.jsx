import React from "react";
import styled, { createGlobalStyle } from "styled-components";

// Styled components for feature container

const GlobalStyle = createGlobalStyle`
  :root {
    --color-one: #FFFFFF; //white
    --color-two: #2D2F31; //black
    --color-three: #5022C3; //bright violet
    --color-four: #C0C4FC; //light violet
    --color-five:#F8F9FB;//light white
  }
`;
const FeatureContainer = styled.div`
  width: 20%;
  background-color: var(--color-five);
  padding: 40px;
  text-align: center;
  border-radius: 20px;
`;

// Styled components for feature image
const FeatureImage = styled.img`
  width: 40px;
`;

// Styled components for feature heading
const FeatureHeading = styled.h1`
  font-size: 20px;
  font-weight: 700;
  color: var(--color-two);
`;

// Styled components for feature description
const FeatureDescription = styled.p`
  font-size: 16px;
  font-weight: 300;
  color: var(--color-two);
`;

function Features(props) {
  return (
    <>
      <GlobalStyle />
      <FeatureContainer>
        <FeatureImage src={props.image} alt="feature" />
        <FeatureHeading>{props.heading}</FeatureHeading>
        <FeatureDescription>{props.description}</FeatureDescription>
      </FeatureContainer>
    </>
  );
}

export default Features;
