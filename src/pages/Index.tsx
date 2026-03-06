import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import HowItWorks from '@/components/HowItWorks';
import BenefitsSection from '@/components/BenefitsSection';
import SmartAlerts from '@/components/SmartAlerts';
import CropCalendar from '@/components/CropCalendar';
import FarmingTips from '@/components/FarmingTips';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />
      <BenefitsSection />
      <SmartAlerts />
      <CropCalendar />
      <FarmingTips />
      <Footer />
    </div>
  );
};

export default Index;
