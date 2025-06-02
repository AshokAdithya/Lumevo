import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css"; // Import core styles
import "swiper/css/autoplay"; // Import autoplay styles
import { Autoplay } from "swiper/modules";
import styled from "styled-components";
import Image1 from "../assets/PraveensamSir.jpeg";
import Image2 from "../assets/DivyajohnMam.jpeg";
import Image3 from "../assets/VijayabhaskarSir.png";
// import Image4 from "../assets/MarthaMam.jpg";

const SwiperContainer = styled(Swiper)`
  height: 300px;
  width: 800px;
  border-radius: 9999px;
  background: #4a4a4a;
  border-top: 15px solid #005f7c;
`;

const SwiperImage = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, 30%);
  width: 100px;
  height: 100px;
  border-radius: 50%;
  z-index: 100;
`;
const SliderContent = styled.div`
  * {
    color: #f6f8f8;
    text-align: center;
  }
`;

const H1 = styled.h1`
  font-size: 28px;
`;

const Paragraph = styled.p``;

export default function AboutUsSlider() {
  const arrNames = [
    "Praveen Sam",
    "Divya John",
    "Vijaya Bhaskhar Chandran",
    // "Martha Karunakar",
  ];
  const description = [
    "Loreum ipsum",
    "Loreum ipsum",
    "Loreum ipsum",
    // "Loreum ipsum",
  ];
  const Images = [Image1, Image2, Image3];

  return (
    <SwiperContainer
      modules={[Autoplay]}
      spaceBetween={50}
      slidesPerView={1}
      autoplay={{ delay: 3000 }}
      centeredSlides={true}
    >
      {Images.map((image, index) => (
        <SwiperSlide key={index} className="slider-container">
          <SwiperImage src={image} alt="" />
          <SliderContent>
            <H1>{arrNames[index]}</H1>
            <Paragraph>{description[index]}</Paragraph>
          </SliderContent>
        </SwiperSlide>
      ))}
    </SwiperContainer>
  );
}
