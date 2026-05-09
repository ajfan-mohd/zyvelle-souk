/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useLayoutEffect, useEffect, useState } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { getSupabase } from './lib/supabase';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Collections from './pages/Collections';
import CategoryPage from './pages/CategoryPage';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './admin/Dashboard';

import { ToastProvider } from './components/ui/Toaster';
import { CartProvider } from './context/CartContext';
import { SecurityProvider } from './context/SecurityContext';
import CartDrawer from './components/CartDrawer';

function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function ProtectedAdminRoute() {
  const supabase = getSupabase();

  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function checkSession() {
      const { data } = await supabase.auth.getSession();

      if (!isMounted) return;

      setIsLoggedIn(Boolean(data.session));
      setLoading(false);
    }

    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(Boolean(session));
      setLoading(false);
    });

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F5EF] text-[#2D3426]">
        Checking admin access...
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/admin/login" replace />;
  }

  return <AdminDashboard />;
}

export default function App() {
  return (
    <HelmetProvider>
      <SecurityProvider>
        <ToastProvider>
          <CartProvider>
            <BrowserRouter>
              <ScrollToTop />

              <div className="flex flex-col min-h-screen">
                <Routes>
                  {/* Public Routes */}
                  <Route
                    path="/"
                    element={
                      <>
                        <Navbar />
                        <main className="flex-grow">
                          <Home />
                        </main>
                        <Footer />
                      </>
                    }
                  />

                  <Route
                    path="/collections"
                    element={
                      <>
                        <Navbar />
                        <main className="flex-grow">
                          <Collections />
                        </main>
                        <Footer />
                      </>
                    }
                  />

                  <Route
                    path="/category/:slug"
                    element={
                      <>
                        <Navbar />
                        <main className="flex-grow">
                          <CategoryPage />
                        </main>
                        <Footer />
                      </>
                    }
                  />

                  <Route
                    path="/product/:slug"
                    element={
                      <>
                        <Navbar />
                        <main className="flex-grow">
                          <ProductDetail />
                        </main>
                        <Footer />
                      </>
                    }
                  />

                  <Route
                    path="/about"
                    element={
                      <>
                        <Navbar />
                        <main className="flex-grow">
                          <About />
                        </main>
                        <Footer />
                      </>
                    }
                  />

                  <Route
                    path="/contact"
                    element={
                      <>
                        <Navbar />
                        <main className="flex-grow">
                          <Contact />
                        </main>
                        <Footer />
                      </>
                    }
                  />

                  {/* Admin Routes */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin/*" element={<ProtectedAdminRoute />} />

                  <Route path="*" element={<NotFound />} />
                 
                </Routes>

                <CartDrawer />
              </div>
            </BrowserRouter>
          </CartProvider>
        </ToastProvider>
      </SecurityProvider>
    </HelmetProvider>
  );
}