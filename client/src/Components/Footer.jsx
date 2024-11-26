import React from "react";
import { Link } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import moment from "moment";
import FacebookIcon from "@mui/icons-material/Facebook";
import XIcon from "@mui/icons-material/X";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

const GlobalStyle = createGlobalStyle`
  :root {
    --color-one: #FFFFFF; //white
    --color-two: #2D2F31; //black
    --color-three: #5022C3; //bright violet
    --color-four: #C0C4FC; //light violet
    --color-five:#F8F9FB;//light white
  }
`;

// Styled components for footer container
const FooterContainer = styled.footer`
  display: flex;
  flex-direction: column;
  background-color: var(--color-two);
  min-height: 500px;
  padding: 20px 50px;
  gap: 30px;
`;

// Styled components for footer details
const FooterDetails = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
`;

// Styled components for footer section
const FooterSection = styled.div`
  width: 20%;
  display: flex;
  flex-direction: column;
  gap: 5px;

  & a {
    text-decoration: none;
    color: var(--color-four);
    transition: all 0.1s ease-in-out;
    width: fit-content;

    &:hover::after {
      content: " ";
      width: 100%;
      display: block;
      border: 1px solid var(--color-three);
    }
  }
`;

// Styled components for headings
const Heading = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: var(--color-one);
  display: "flex",
  justify-content: "center",
  align-items: "center",
`;

// Styled components for paragraphs
const Paragraph = styled.p`
  font-size: 16px;
  font-weight: 300;
  color: var(--color-one);
`;

// Styled components for social icons
const SocialIcons = styled.div`
  display: flex;
  justify-content: center;
  gap: 50px;
  margin: 20px 0;

  & a > * {
    font-size: 40px;
  }

  & a:nth-child(1) {
    color: #1877f2;
  }

  & a:nth-child(2) {
    color: #1da1f2;
  }

  & a:nth-child(3) {
    color: #075e54;
  }

  & a:nth-child(4) {
    color: #0077b5;
  }

  & a:hover {
    transform: scale(1.1);
  }
`;

// Styled components for copyright details
const CopyrightDetails = styled.div`
  align-self: center;
`;

const Hr = styled.hr`
  border: 1px solid var(--color-three);
`;

const Span = styled.span``;

function Footer() {
  const currentDate = moment();
  const currentYear = currentDate.format("YYYY");
  return (
    <>
      <GlobalStyle />
      <FooterContainer>
        <FooterDetails>
          <FooterSection>
            <Heading>
              <Link to="/">Lumevo</Link>
            </Heading>
            <Paragraph>
              SOP Maker is India's most trusted SOP writing services brand. With
              over 8000 successful cases we have done, we are proud to share
              that SOP Maker is backed and supported with India's highly
              experienced SOP writers.
            </Paragraph>
          </FooterSection>
          <FooterSection>
            <Heading>Explore</Heading>
            <Link to="/">About Us</Link>
            <Link to="/">Our Achievements</Link>
            <Link to="/">Contact Us</Link>
            <Link to="/">Contact Us</Link>
            <Link to="/expert-details">Want to join as expert at Lumevo</Link>
          </FooterSection>
          <FooterSection>
            <Heading>Contact Us</Heading>
            <Link to="tel:+919487XXXXX">+919487XXXXX</Link>
            <Link to="mailto:testing@gmail.com">testing@gmail.com</Link>
            <Paragraph>
              SSN College of Engineering, Kalavakkam , Chennai-603110.
            </Paragraph>
          </FooterSection>
          <FooterSection>
            <Heading>Help</Heading>
            <Link to="/">Help Me</Link>
            <Link to="/">Feedback</Link>
            <Link to="/">Report an issue</Link>
          </FooterSection>
        </FooterDetails>

        <SocialIcons>
          <Link>
            <FacebookIcon />
          </Link>
          <Link>
            <XIcon />
          </Link>
          <Link>
            <WhatsAppIcon />
          </Link>
          <Link>
            <LinkedInIcon />
          </Link>
        </SocialIcons>
        <CopyrightDetails>
          <Hr />
          <Heading>
            <Span>Copyright - </Span>
            {currentYear} - Lumevo
          </Heading>
        </CopyrightDetails>
      </FooterContainer>
    </>
  );
}

export default Footer;
