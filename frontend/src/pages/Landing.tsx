import Hero from "@/components/blocks/Hero";
import { Navbar } from "@/components/blocks/Navbar";
import { Footer } from "@/components/blocks/Footer";
import { About } from "@/components/blocks/About";
import { Feature } from "@/components/blocks/Feature";
import LogoCloud from "@/components/blocks/LogoCloud";
import { DotPatternLinearGradient } from "@/components/blocks/DotPatternLinearGradient";
import Team from "@/components/blocks/Team";

const Landing: React.FC = () => {
  return (
    <div className="relative min-h-screen">
      <DotPatternLinearGradient />

      {/* Main Content */}
      <Navbar />
      <Hero />
      <LogoCloud />
      <div id="about">
        <About />
      </div>
      <Feature />
      <Team />
      <Footer />
    </div>
  );
};
export default Landing;
