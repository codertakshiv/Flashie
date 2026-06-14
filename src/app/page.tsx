import StatsSection from "@/components/StatsSection";
import HeroSection from "@/components/HeroSection";
import ProjectList from "@/components/ProjectList";
import InstructionsSection from "@/components/InstructionsSection";
import WarningSection from "@/components/WarningSection";
import SupportedBoardsSection from "@/components/SupportedBoardsSection";
import TroubleshootingSection from "@/components/TroubleshootingSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <ProjectList />
      <InstructionsSection />
      <WarningSection />
      <SupportedBoardsSection />
      <TroubleshootingSection />
    </>
  );
}
