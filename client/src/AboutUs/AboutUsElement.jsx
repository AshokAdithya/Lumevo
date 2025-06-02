import React from "react";
import styled from "styled-components";

const DivContainer = styled.div`
  padding: 50px 150px;
  background-color: #f6f8f8;
`;

const ElementWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const ElementImage = styled.div`
  width: 400px;
  max-width: 400px;
`;

const Image = styled.img`
  width: 100%;
  box-sizing: border-box;
`;

const ElementText = styled.div`
  flex: 1;
  width: 100%;
  max-width: 500px;
`;

const H1 = styled.h1`
  color: #4a4a4a;
  font-size: 40px;
`;

const Paragraph = styled.p`
  color: #4a4a4a;
`;

function AboutUsElement(props) {
  return (
    <DivContainer>
      <ElementWrapper style={{ flexDirection: props.direction }}>
        <ElementImage>
          <Image src={props.image} />
        </ElementImage>
        <ElementText>
          <H1>{props.heading}</H1>
          <Paragraph>{props.description}</Paragraph>
        </ElementText>
      </ElementWrapper>
    </DivContainer>
  );
}

export default AboutUsElement;
