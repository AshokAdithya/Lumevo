import React from "react";
import styled, { createGlobalStyle } from "styled-components";
import img from "../assets/Graduates.png";
import { Link } from "react-router-dom";
import useAuth from "../hooks/TokenManagement";
import { useDispatch } from "react-redux";

// Define global CSS variables
const GlobalStyle = createGlobalStyle`
  :root {
    --color-one: #FFFFFF; //white
    --color-two: #2D2F31; //black
    --color-three: #5022C3; //bright violet
    --color-four: #C0C4FC; //light violet
    --color-five:#F8F9FB;//light white
  }
`;

// Styled components using CSS variables
const Section = styled.section`
  background-color: var(--color-one);
  height: 85vh;
  overflow-x: hidden;
  overflow-y: hidden;
  box-sizing: border-box;
`;

const Container = styled.div`
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ImageContainer = styled.div`
  position: absolute;
  top: 50px;
  right: 0px;
  transform: translate(45%, 10%);
`;

const Image = styled.img`
  width: 70%;
  height: 70%;
  z-index: -1;
`;

const LeftHoldings = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0px 50px;
  justify-content: center;
  align-items: flex-start;
  height: 100%;
`;

const Descriptions = styled.div`
  width: 65%;
`;

const Description1 = styled.h1`
  font-size: 35px;
  margin-bottom: 20px;
  color: var(--color-two);
  text-transform: uppercase;
`;

const Description2 = styled.h3`
  font-size: 23px;
  margin-bottom: 40px;
  line-height: 1.6;
  color: var(--color-two);
`;

const Description3 = styled.p`
  margin-top: 20px;
  font-size: 13px;
  letter-spacing: 0.2px;
  font-weight: 400;
  color: var(--color-two);
`;

const ButtonBundle = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
`;

const Button = styled(Link)`
  padding: 10px 70px;
  position: relative;
  overflow: hidden;
  background-color: var(--color-three);
  transition: background-color 0.5s;
  color: #fff;
  border: none;
  outline: none;
  border-radius: 9999px;
  cursor: pointer;
  text-decoration: none;
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    transform: scale(1.03);
  }
`;

const AuthenticatedContent = styled.div`
  font-size: 20px;
  color: var(--color-two);
  font-weight: 500;
  margin-bottom: 30px;
`;

//
function Home1() {
  const { loading, user, isAuthenticated } = useAuth();
  const dispatch = useDispatch();
  return (
    <>
      <GlobalStyle />
      <Section>
        <Container>
          <ImageContainer>
            <Image src={img} alt="Graduates" />
          </ImageContainer>
          <LeftHoldings>
            <Descriptions>
              <Description1>
                <strong>
                  Transform your academic dreams into reality with Lumevo!
                </strong>
              </Description1>
              <Description2>
                With the support of our talented Language experts, we
                meticulously shape your SOPs and LORs to stand out and leave a
                lasting impression on admissions committees.
              </Description2>
            </Descriptions>
            {!isAuthenticated ? (
              <>
                <ButtonBundle>
                  <Button to="/signup">Sign Up</Button>
                  <Button to="/signin">Sign In</Button>
                </ButtonBundle>
                <Descriptions>
                  <Description3>
                    Sign up to access your dedicated portal, where you can
                    securely upload documents for your SOP. <br></br>Connect
                    directly with our experts, ensuring personalized assistance
                    tailored to your needs and aspirations.
                  </Description3>
                </Descriptions>
              </>
            ) : (
              <Descriptions>
                {user.role.includes("student") && (
                  <AuthenticatedContent>
                    Welcome back! Move to your dashboard to start working on
                    your applications.
                  </AuthenticatedContent>
                )}

                <Button to="/user">Go to Dashboard</Button>
              </Descriptions>
            )}
          </LeftHoldings>
        </Container>
      </Section>
    </>
  );
}

export default Home1;
