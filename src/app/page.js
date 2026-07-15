import HeroSlider from "@/components/HeroSlider";
import TopFundedCampaigns from "@/components/TopFundedCampaigns";
import ExploreByCategory from "@/components/ExploreByCategory";
import HowItWorks from "@/components/HowItWorks";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";

export default function Home() {
  return (
    <div className="">
      <HeroSlider />
      <TopFundedCampaigns />
      <HowItWorks />
      <ExploreByCategory />
      <WhyChooseUs />
      <Testimonials />
    </div>
  );
}
