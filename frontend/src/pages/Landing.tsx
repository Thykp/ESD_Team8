import Hero from "@/components/blocks/Hero";
import { Navbar } from "@/components/blocks/Navbar";
import { Footer } from "@/components/blocks/Footer";
import { About } from "@/components/blocks/About";
import { Feature } from "@/components/blocks/Feature";
import Team from "@/components/blocks/Team";

const Landing: React.FC = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <div id="about">
        <About />
      </div>
      <Feature />
      <Team />
      <Footer />
    </>
  );
};

export default Landing;
