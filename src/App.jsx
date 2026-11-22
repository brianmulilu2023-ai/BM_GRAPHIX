import React, { useState, useEffect } from 'react';
import { ProjectProvider, useProjects } from './context/ProjectContext';
import { useTheme } from './context/ThemeContext';
import NairobiBackground from './components/NairobiBackground';
import ScrollProgressBar from './components/ScrollProgressBar';
import BackToTop from './components/BackToTop';
import Preloader from './components/Preloader';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Lightbox from './components/Lightbox';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import Toast from './components/Toast';
import PageTransition from './components/PageTransition';
import GoldParticles from './components/GoldParticles';

// Pages
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

// Real-time synchronization of background visibility & branding variables
function AtmosphereSync({ currentPath }) {
  const { siteSettings } = useProjects();

  useEffect(() => {
    if (!siteSettings) return;
    const root = document.documentElement;

    // Hero background visibility (0 to 1)
    const heroVis = typeof siteSettings.heroBgVisibility === 'number' ? siteSettings.heroBgVisibility / 100 : 0.55;
    root.style.setProperty('--hero-bg-visibility', heroVis.toString());

    // Dark overlay opacity (0 to 1)
    const overlayDark = typeof siteSettings.heroDarkOverlay === 'number' ? siteSettings.heroDarkOverlay / 100 : 0.85;
    root.style.setProperty('--hero-dark-overlay', overlayDark.toString());

    // Nairobi skyline opacity (0 to 1)
    const nairobiOp = typeof siteSettings.nairobiSkylineOpacity === 'number' ? siteSettings.nairobiSkylineOpacity / 100 : 0.14;
    root.style.setProperty('--nairobi-opacity', nairobiOp.toString());

    // Work Page: Nairobi skyline opacity (up to 100% full clarity)
    const workNairobiOp = typeof siteSettings.workNairobiSkylineOpacity === 'number' ? siteSettings.workNairobiSkylineOpacity / 100 : 0.55;
    root.style.setProperty('--work-nairobi-opacity', workNairobiOp.toString());

    // Work Page: Clarity factor (0 to 1)
    const workClarity = typeof siteSettings.workNairobiClarity === 'number' ? siteSettings.workNairobiClarity / 100 : 0.85;
    root.style.setProperty('--work-nairobi-clarity', workClarity.toString());

    // Work Page: Dark overlay
    const workDark = typeof siteSettings.workDarkOverlay === 'number' ? siteSettings.workDarkOverlay / 100 : 0.70;
    root.style.setProperty('--work-dark-overlay', workDark.toString());

    // Gold glow intensity (0 to 1)
    const glowOp = typeof siteSettings.goldGlowIntensity === 'number' ? siteSettings.goldGlowIntensity / 100 : 0.70;
    root.style.setProperty('--gold-glow-intensity', glowOp.toString());

    // Particles visibility
    const partOp = typeof siteSettings.particlesVisibility === 'number' ? siteSettings.particlesVisibility / 100 : 0.55;
    root.style.setProperty('--particles-visibility', partOp.toString());

    // Dynamic brand colors
    if (siteSettings.brandPrimaryColor) {
      root.style.setProperty('--gold-primary', siteSettings.brandPrimaryColor);
    }
    if (siteSettings.brandSecondaryColor) {
      root.style.setProperty('--gold-light', siteSettings.brandSecondaryColor);
    }
    if (siteSettings.brandDarkColor) {
      root.style.setProperty('--gold-dark', siteSettings.brandDarkColor);
    }
  }, [siteSettings, currentPath]);

  return null;
}

export default function App() {
  const { isDark } = useTheme();
  const [currentPath, setCurrentPath] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  });

  // Handle browser back/forward buttons & secret shortcut
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };

    // Secret shortcut: Ctrl + Shift + A (or Cmd + Shift + A)
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        navigate('/admin');
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentPath]);

  // Client side routing navigation function
  const navigate = (path) => {
    if (path !== currentPath) {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Route matching
  const renderPage = () => {
    const normalized = currentPath.toLowerCase().replace(/\/$/, '') || '/';

    switch (normalized) {
      case '/':
        return <Home navigate={navigate} />;
      case '/work':
      case '/portfolio':
      case '/gallery':
        return <Gallery navigate={navigate} />;
      case '/services':
        return <Services navigate={navigate} />;
      case '/about':
        return <About navigate={navigate} />;
      case '/contact':
        return <Contact navigate={navigate} />;
      case '/admin/login':
      case '/admin':
        return <AdminLogin navigate={navigate} />;
      case '/admin/dashboard':
        return <AdminDashboard navigate={navigate} />;
      default:
        return <Home navigate={navigate} />;
    }
  };

  return (
    <ProjectProvider>
      <AtmosphereSync currentPath={currentPath} />
      <div
        className="theme-root relative min-h-screen font-sans overflow-x-hidden selection:bg-[#D4AF37] selection:text-black"
        style={{
          backgroundColor: isDark ? '#0A0A0A' : '#F5F0E8',
          color: isDark ? '#F5F1E8' : '#1C1510',
          transition: 'background-color 0.4s ease, color 0.4s ease',
        }}
      >
        {/* Scroll Progress Bar */}
        <ScrollProgressBar />

        {/* Back To Top */}
        <BackToTop />

        {/* Animated Initial Preloader */}
        <Preloader />

        {/* Gold dust ambient particles */}
        <GoldParticles currentPath={currentPath} />

        {/* Nairobi Skyline + Atmospheric Parallax Background */}
        <NairobiBackground currentPath={currentPath} />

        {/* Glassmorphism Header & Navigation */}
        <Navbar currentPath={currentPath} navigate={navigate} />

        {/* Main Content Area — wrapped in page transition */}
        <main className="relative z-10 min-h-[calc(100vh-200px)]">
          <PageTransition routeKey={currentPath}>
            {renderPage()}
          </PageTransition>
        </main>

        {/* Full-Screen Interactive Lightbox */}
        <Lightbox />

        {/* Floating WhatsApp Action Button */}
        <FloatingWhatsApp />

        {/* Toast Notifications */}
        <Toast />

        {/* Footer */}
        <Footer navigate={navigate} />
      </div>
    </ProjectProvider>
  );
}
