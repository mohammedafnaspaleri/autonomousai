import React, { useEffect } from "react";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, Routes, Route, Outlet, Link, useLocation } from "react-router-dom";
import { SiteProvider, useSite } from "@/lib/site";
import { SmoothScroll, ScrollToTop, trackVisit } from "@/components/Chrome";
import Cursor from "@/components/Cursor";
import Loader from "@/components/Loader";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import AnnouncementBar from "@/components/AnnouncementBar";
import Maintenance from "@/pages/Maintenance";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Vision from "@/pages/Vision";
import Mission from "@/pages/Mission";
import Philosophy from "@/pages/Philosophy";
import Exploring from "@/pages/Exploring";
import Product from "@/pages/Product";
import Journey from "@/pages/Journey";
import Faq from "@/pages/Faq";
import Contact from "@/pages/Contact";
import Legal from "@/pages/Legal";
import NotFound from "@/pages/NotFound";
import AdminApp from "@/admin/AdminApp";

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(err) { console.error(err); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-black text-center">
          <p className="font-display text-2xl text-white">Something went wrong</p>
          <button onClick={() => { this.setState({ hasError: false }); window.location.href = "/"; }}
            className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black">Return Home</button>
        </div>
      );
    }
    return this.props.children;
  }
}

function FullLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-4">
        <img src="/icons/icon-64.png" alt="" className="h-10 w-10 animate-pulse" />
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-zinc-500">AUTONOMOUS</p>
      </div>
    </div>
  );
}

function PublicLayout() {
  const { data, loading, error, refresh } = useSite();
  const location = useLocation();

  useEffect(() => { trackVisit(location.pathname); }, [location.pathname]);

  if (!data && loading) return <FullLoading />;
  if (!data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-black px-6 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-zinc-500">Connection lost</p>
        <p className="text-sm text-brand-muted">The site could not be reached. Please try again.</p>
        <button onClick={refresh} data-testid="site-retry-btn" className="rounded-full border border-brand-line px-6 py-2.5 text-sm text-white hover:border-blue-500">Retry</button>
      </div>
    );
  }
  if (data.maintenance?.enabled) return <Maintenance />;

  return (
    <div className="grain min-h-screen bg-black text-white">
      <AnnouncementBar />
      <Nav />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <SiteProvider>
        <BrowserRouter>
          <ErrorBoundary>
            <SmoothScroll />
            <ScrollToTop />
            <Cursor />
            <Loader />
            <Routes>
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/vision" element={<Vision />} />
                <Route path="/mission" element={<Mission />} />
                <Route path="/philosophy" element={<Philosophy />} />
                <Route path="/exploring" element={<Exploring />} />
                <Route path="/product" element={<Product />} />
                <Route path="/journey" element={<Journey />} />
                <Route path="/faq" element={<Faq />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy" element={<Legal kind="legal.privacy" />} />
                <Route path="/terms" element={<Legal kind="legal.terms" />} />
                <Route path="/cookies" element={<Legal kind="legal.cookies" />} />
                <Route path="/disclaimer" element={<Legal kind="legal.disclaimer" />} />
                <Route path="*" element={<NotFound />} />
              </Route>
              <Route path="/admin/*" element={<AdminApp />} />
            </Routes>
          </ErrorBoundary>
        </BrowserRouter>
      </SiteProvider>
    </HelmetProvider>
  );
}
