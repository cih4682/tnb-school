import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Values } from "@/components/sections/Values";
import { VideoFeature } from "@/components/sections/VideoFeature";
import { Counter } from "@/components/sections/Counter";
import { RoomGallery } from "@/components/sections/RoomGallery";
import { Testimonials } from "@/components/sections/Testimonials";
import { Pricing } from "@/components/sections/Pricing";
import { AiCourse } from "@/components/sections/AiCourse";
import { CustomForm } from "@/components/sections/CustomForm";
import { FAQ } from "@/components/sections/FAQ";
import { Footer } from "@/components/sections/Footer";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Values />
      <VideoFeature />
      <Counter />
      <RoomGallery />
      <Testimonials />
      <Pricing />
      <AiCourse />
      <CustomForm />
      <FAQ />
      <Footer />
    </main>
  );
}
