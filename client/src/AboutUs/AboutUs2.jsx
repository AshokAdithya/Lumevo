import React from "react";
import styled from "styled-components";
import AboutUsSlider from "./AboutUsSlider";

const DivContainer = styled.div`
  height: 500px;
`;

const HeadingSlider = styled.div`
  text-align: center;
`;

const Slider = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: baseline;
`;

function AboutUs2() {
  return (
    <DivContainer>
      <HeadingSlider>
        <h1>Our Experts</h1>
      </HeadingSlider>
      <Slider>
        <AboutUsSlider />
      </Slider>
    </DivContainer>
  );
}

export default AboutUs2;
