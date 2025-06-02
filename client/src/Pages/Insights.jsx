import React, { useState, useEffect } from "react";
import GlobalStyle from "../utils/Theme";
import styled from "styled-components";
import Header from "../Components/Header";
import { useDispatch, useSelector } from "react-redux";
import { setData } from "../redux/DataSlice";
import axios from "axios";
import { api } from "../utils/useAxiosInstance";

const DivContainer = styled.div`
  background-color: var(--color-four);
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  display: flex; /* Set up a flexbox container */
`;

const LeftContainer = styled.div`
  flex: 7;
  padding: 30px;
`;

const RightContainer = styled.div`
  flex: 3;
  padding: 30px;
  background-color: var(--color-five);
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  color: #1a2130;

  h1 {
    font-size: 2rem;
    text-align: center;
  }

  h2 {
    font-size: 1.5rem;
    text-align: start;
    margin: 0;
  }

  li {
    font-size: 16px;
    font-weight: 500;
  }
`;

const RankingOptions = styled.div`
  background-color: var(--color-five);
  margin-top: 50px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

function Insights() {
  const dispatch = useDispatch();
  const [countryName, setCountryName] = useState("");
  const [courseName, setCourseName] = useState("");
  const server = process.env.REACT_APP_API_SERVER;

  const { coursesList, countriesList } = useSelector((state) => state.data);

  useEffect(() => {
    const getCCList = async () => {
      try {
        console.log(coursesList.length, countriesList.length);
        if (coursesList.length === 0 || countriesList.length === 0) {
          const result = await api.get(`/get/get-cc-list`);
          dispatch(
            setData({
              countriesList: result.data.countriesList,
              coursesList: result.data.coursesList,
            })
          );
        }
      } catch (err) {
        console.log(err);
      }
    };

    getCCList();
  });

  useEffect(() => {});

  return (
    <>
      <GlobalStyle />
      <Header />
      <DivContainer>
        <LeftContainer>
          <TextContainer>
            <h1>Explore the Top Ranked Universities in the World</h1>
            <h2>University Rankings 2025: Key Insights</h2>
            <ul>
              <li>
                Oxford holds on to the top spot for the ninth consecutive year,
                bolstered by significant improvements in industry engagement and
                teaching
              </li>
              <li>
                MIT rises to second place, overtaking Stanford, which drops to
                sixth
              </li>
              <li>
                China edges closer to the top 10, further boosting its global
                research influence
              </li>
              <li>
                Australia’s top five universities all slip down the rankings,
                due to declining reputation and international outlook
              </li>
              <li>
                Three new countries join the top 200 - Brazil, Saudi Arabia and
                the United Arab Emirates - highlighting the rise of emerging
                markets in higher education
              </li>
            </ul>
          </TextContainer>
          <RankingOptions>
            <label>Show me Ranking of Universitites</label>
          </RankingOptions>
        </LeftContainer>

        <RightContainer>
          <TextContainer>
            <h1>Latest News</h1>
            <ul>
              <li>New research on AI's impact on higher education published</li>
              <li>Global education trends to watch in 2025</li>
              <li>Top universities investing in sustainable practices</li>
              <li>
                How universities are adapting to the rise of online learning
              </li>
              <li>Global collaborations shaping the future of research</li>
            </ul>
          </TextContainer>
        </RightContainer>
      </DivContainer>
    </>
  );
}

export default Insights;
