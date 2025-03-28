import React from "react";
import { Link, useLocation } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import Logo from "./Logo";
import useAuth from "../hooks/TokenManagement";
import User from "../assets/user.png";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearUser } from "../redux/UserSlice";
import { setUnauthenticated } from "../redux/AuthSlice";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Loading from "../Pages/Loading";

const GlobalStyle = createGlobalStyle`
  :root {
    --color-one: #FFFFFF; //white
    --color-two: #2D2F31; //black
    --color-three: #5022C3; //bright violet
    --color-four: #C0C4FC; //light violet
    --color-five:#F8F9FB;//light white
  }
`;

const Container = styled.header`
  margin: 0;
  padding: 0px 40px;
  display: flex;
  max-width: 100vw;
  width: 100vw;
  align-items: center;
  justify-content: space-between;
  background-color: var(--color-one);
  box-sizing: border-box;
  position: relative;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
`;

const LogoLink = styled(Link)`
  text-decoration: none;
`;

const LogoText = styled.h1`
  margin-left: 10px;
  font-size: 28px;
  font-weight: 700;
  color: var(--color-three);
  align-self: center;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 20px;
`;

const Option = styled(Link)`
  padding: 10px 20px;
  transition-duration: 0.6ms;
  line-height: 1.4;
  position: relative;
  white-space: nowrap;
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-two);
  text-decoration: none;

  &.active {
    color: var(--color-three);
  }

  &.active:after {
    border: 1px solid var(--color-four);
    content: "";
    display: block;
    margin: 0 auto;
    position: relative;
    width: 90%;
    transform: scale(1.05);
  }

  &:hover,
  &:active {
    transform: scale(1.05);
  }
`;

const AuthButtons = styled.div`
  display: flex;
  gap: 20px;
`;

const Functionalities = styled.div`
  background: var(--color-two);
  position: absolute;
  top: 50px;
  right: -20px;
  display: none;
  flex-direction: column;
  z-index: 100;
  padding: 10px 15px;
  width: 150px;
  text-align: center;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  color: var(--color-one);
`;

const LoggedButtons = styled.div`
  display: flex;
  gap: 10px;
  margin-right: 30px;
  position: relative;
  align-items: center;
  cursor: pointer;

  &:hover .dropdown-arrow {
    transform: rotate(180deg); /* Rotate the arrow on hover */
  }

  &:hover ${Functionalities} {
    display: flex;
  }
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
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    transform: scale(1.03);
  }
`;

const Image = styled.img`
  width: 35px;
  align-self: center;
  color: var(--color-three);
`;

const H1 = styled.h1`
  font-size: 18px;
  color: var(--color-three);
`;

const Arrow = styled(ArrowDropDownIcon)`
  transition: transform 0.3s ease;
`;

const Hr = styled.hr`
  border: none;
  border-top: 1px solid #ddd;
  width: 100%;
`;

const OuterHr = styled.hr`
  border: none;
  border-top: 1px solid var(--color-two);
  width: 100%;
  margin: 0;
  padding: 0;
`;

const FuncOption = styled(Link)`
  padding: 10px 20px;
  transition-duration: 0.6ms;
  line-height: 1.4;
  position: relative;
  white-space: nowrap;
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-four);
  text-decoration: none;
`;

function Header() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, user, isAuthenticated } = useAuth();

  if (loading) return <Loading />;

  return (
    <>
      <GlobalStyle />
      <Container>
        <LogoContainer>
          <Logo />
          <LogoLink to="/">
            <LogoText>Lumevo</LogoText>
          </LogoLink>
        </LogoContainer>
        {location.pathname !== "/payment" ? (
          <>
            <NavLinks>
              <Option
                to="/"
                className={location.pathname === "/" ? "active" : ""}
              >
                Home
              </Option>
              {isAuthenticated && (
                <Option
                  to="/user"
                  className={location.pathname === "/user" ? "active" : ""}
                >
                  My Dashboard
                </Option>
              )}
              {/* <Option
                to="/achievements"
                className={
                  location.pathname === "/achievements" ? "active" : ""
                }
              >
                Achievements
              </Option> */}
              <Option
                to="/about-us"
                className={location.pathname === "/about-us" ? "active" : ""}
              >
                About Us
              </Option>
              <Option
                to="/contact-us"
                className={location.pathname === "/contact-us" ? "active" : ""}
              >
                Contact Us
              </Option>
            </NavLinks>
            {isAuthenticated ? (
              <LoggedButtons>
                <Image src={User} />
                <H1>{`${user.profile.firstName} ${user.profile.lastName}`}</H1>
                <Arrow className="dropdown-arrow" />
                <Functionalities>
                  {user.role[0] === "admin" ? (
                    <FuncOption to="/update-data">Update Data</FuncOption>
                  ) : (
                    <FuncOption to="/my-profile">My Profile</FuncOption>
                  )}
                  <Hr />
                  <FuncOption to="/logout">Logout</FuncOption>
                </Functionalities>
              </LoggedButtons>
            ) : (
              <AuthButtons>
                <Link to="/signup">
                  <Button>Sign Up</Button>
                </Link>
                <Link to="/signin">
                  <Button>Sign In</Button>
                </Link>
              </AuthButtons>
            )}
          </>
        ) : (
          <Link
            style={{ textDecoration: "none", color: "var(--color-three)" }}
            to="/my-orders"
          >
            cancel
          </Link>
        )}
      </Container>
      <OuterHr />
    </>
  );
}

export default Header;
