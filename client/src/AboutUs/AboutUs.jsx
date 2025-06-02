import React from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import AboutUsElement from "./AboutUsElement";
import growBetter from "../assets/grow-better.webp";
import ourStory from "../assets/our-story.webp";
import AboutUs2 from "./AboutUs2";
import Image1 from "../assets/Hellow.webp";

function AboutUs() {
  const description0 =
    "Lumevo is a student-led initiative from SSN College of Engineering, offering professional Statement of Purpose (SOP) and Letter of Recommendation (LOR) services. We are committed to helping individuals create impactful, personalized documents that enhance their academic and career prospects.";
  const description1 =
    "At Lumevo, our mission is to empower students and professionals by providing exceptional SOP and LOR services that highlight their unique stories and strengths. We strive to make every document a powerful representation of the individual's journey, helping them achieve their academic and career ambitions with confidence.";
  const description2 =
    "In 2024, driven by their own experiences with the competitive academic application process, a group of dedicated students from SSN College of Engineering set out to create a service that would simplify and enhance the preparation of Statements of Purpose (SOPs) and Letters of Recommendation (LORs). Understanding that applicants needed more than generic templates—they needed personalized, impactful narratives—the team founded Lumevo. Our goal is to help students and professionals present their best selves through well-crafted, authentic documents that open doors to academic and career opportunities.";
  return (
    <div>
      <Header />
      <AboutUsElement
        direction="row-reverse"
        image={Image1}
        heading="About Us:"
        description={description0}
      />
      <AboutUsElement
        direction="row"
        image={growBetter}
        heading="Our Mission:"
        description={description1}
      />
      <AboutUsElement
        direction="row-reverse"
        image={ourStory}
        heading="Our Story:"
        description={description2}
      />
      <AboutUs2 />
      <Footer />
    </div>
  );
}

export default AboutUs;
