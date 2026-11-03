import Nav from './components/Nav';
import Hero from './components/Hero';
import Code from './components/Code';
import Experience from './components/Experience';
import Work from './components/Work';
import Services from './components/Services';
import Contact from './components/Contact';
import ProgressBar from './components/ProgressBar';
import SkipIntro from './components/SkipIntro';

export default function App() {
  return (
    <div>
      <ProgressBar />
      <Nav />
      <SkipIntro />
      <main>
        <Hero />
        <Code />
        <Experience />
        <Work />
        <Services />
        <Contact />
      </main>
    </div>
  );
}
