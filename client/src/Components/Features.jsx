import React from "react";
import styled from "styled-components";

import GlobalStyle from "../utils/Theme";

// Styled components for feature container

const FeatureContainer = styled.div`
  width: 18%;
  background-color: var(--color-five);
  padding: 40px;
  text-align: center;
  border-radius: 20px;
  border: 2px solid var(--color-three);

  @media (max-width: 768px) {
    width: 100%;
  }
`;

// Styled components for feature image
const FeatureImage = styled.img`
  width: 40px;
`;

// Styled components for feature heading
const FeatureHeading = styled.h1`
  font-size: 18px;
  font-weight: 700;
  color: var(--color-two);
`;

// Styled components for feature description
const FeatureDescription = styled.p`
  font-size: 14px;
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
