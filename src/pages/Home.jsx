import React from 'react';
import SliderBanner from '../components/SliderBanner';
import FloatingMenu from '../components/FloatingMenu';
import ServicesCarousel from '../components/ServicesCarousel';
import EntrepreneursTools from '../components/EntrepreneursTools';
import ComoEnviar from '../components/ComoEnviar';
import Recomendaciones from '../components/Recomendaciones';
import HomeChatbot from '../components/HomeChatbot';

const Home = () => {
  return (
    <main>
      <SliderBanner />
      <FloatingMenu />
      <ComoEnviar />
      <ServicesCarousel />
      <EntrepreneursTools />
      <Recomendaciones />
      <HomeChatbot />
    </main>
  );
};

export default Home;
