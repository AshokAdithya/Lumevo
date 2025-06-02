import React from "react";
import styled from "styled-components";
import Features from "../Components/Features";
import sop from "../assets/sop.png";
import visa from "../assets/visa.png";
import lor from "../assets/lor.png";
import resume from "../assets/resume.png";
import secret from "../assets/secret.png";
import expert from "../assets/expert.png";
import GlobalStyle from "../utils/Theme";

const FeaturesContainer = styled.div`
  margin: 30px 20px;
  padding: 0px 60px;
  overflow-x: hidden;

  @media (max-width: 768px) {
    padding: 0px 20px;
  }
`;

const WhyWe = styled.div`
  background: var(--color-five);
  padding: 20px;
  margin: 0px auto;
  width: fit-content;
  text-align: center;
  max-width: 700px;
  border-radius: 20px;
  border: 2px solid var(--color-three);
`;

const WhyWeTitle = styled.h1`
  color: var(--color-two);
  font-size: 25px;
  font-weight: 800;

  &::after {
    content: "";
    display: block;
    width: 60px;
    height: 2px;
    background-color: var(--color-two);
    opacity: 0.5;
    margin: 10px auto;
  }

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const WhyWeDescription = styled.p`
  font-size: 14px;
  font-weight: 400;
  color: var(--color-two);

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const FeaturesWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 50px;
  margin-top: 50px;
  width: 100%;
`;

function Home2() {
  return (
    <>
      <GlobalStyle />
      <FeaturesContainer>
        <WhyWe>
          <WhyWeTitle>
            Why We're Unbeatable and Unmatchable in <br /> Crafting Captivating
            SOPs and LORs?
          </WhyWeTitle>
          <WhyWeDescription>
            We're not just another website we're your dedicated partners in
            crafting captivating Statements of Purpose (SOPs) and Letters of
            Recommendation (LORs) to propel you towards success in securing
            admissions to prestigious universities abroad.
          </WhyWeDescription>
        </WhyWe>
        <FeaturesWrapper>
          <Features
            image={sop}
            heading={"Personalized SOP crafting"}
            description={
              "Whether refining existing content or crafting a new narrative, our expert team aligns your story seamlessly with your goals for your program or opportunity. Gain confidence as we polish or create a tailored statement for you."
            }
          />
          <Features
            image={lor}
            heading={"Tailored LoR Writing"}
            description={
              "Elevate your application with personalized LoR writing. Our experts craft authentic recommendations highlighting your strengths, whether refining existing content or creating anew. Trust us for effective candidacy enhancement."
            }
          />
          <Features
            image={expert}
            heading={"Expert Writing Team"}
            description={
              "Our seasoned writers, with years of experience and attention to detail, craft tailored content that elevates your application. With expertise across diverse fields, they ensure your documents impress admissions committees or employers."
            }
          />
          <Features
            image={secret}
            heading={"Confidentiality Assurance"}
            description={
              "We prioritize your privacy, employing strict security measures to safeguard your personal and academic information with encrypted protocols and confidentiality agreements. Trust us for data protection."
            }
          />
          <Features
            image={visa}
            heading={"Visa SOP Assistance"}
            description={
              "Navigating the intricacies of visa applications is made seamless with our Visa SOP Assistance. Our expert team crafts tailored Statements of Purpose to strengthen your visa application and increase your chances of success."
            }
          />
          <Features
            image={resume}
            heading={"Resume Development"}
            description={
              "Boost your career prospects with our Personalized Resume Development service. Our skilled team designs customized resumes showcasing your unique strengths and achievements, ensuring your application stands out authentically."
            }
          />
        </FeaturesWrapper>
      </FeaturesContainer>
    </>
  );
}

export default Home2;
