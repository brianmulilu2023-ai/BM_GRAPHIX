import React, { useState, useEffect } from 'react';
import { ProjectProvider } from './context/ProjectContext';
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

export default function App() {
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
      <div className="relative min-h-screen bg-[#0A0A0A] text-[#F5F1E8] font-sans overflow-x-hidden selection:bg-[#D4AF37] selection:text-black">
        {/* Scroll Progress Bar */}
        <ScrollProgressBar />

        {/* Back To Top */}
        <BackToTop />

        {/* Animated Initial Preloader */}
        <Preloader />

        {/* Gold dust ambient particles */}
        <GoldParticles />

        {/* Nairobi Skyline + Atmospheric Parallax Background */}
        <NairobiBackground />

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
