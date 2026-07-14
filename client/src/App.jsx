import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Public Pages (Lazy loaded for performance)
const HomePage = lazy(() => import('./pages/HomePage'));
const PhotoDetailPage = lazy(() => import('./pages/PhotoDetailPage'));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'));
const CollectionDetailPage = lazy(() => import('./pages/CollectionDetailPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const ServiceDetailPage = lazy(() => import('./pages/ServiceDetailPage'));
const BookingPage = lazy(() => import('./pages/BookingPage'));
const GalleryAuthPage = lazy(() => import('./pages/gallery/GalleryAuthPage'));
const ClientGalleryViewPage = lazy(() => import('./pages/gallery/ClientGalleryViewPage'));

// Admin Pages
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminPhotos = lazy(() => import('./pages/admin/AdminPhotosPage'));
const AdminCollections = lazy(() => import('./pages/admin/AdminCollectionsPage'));
const AdminConfig = lazy(() => import('./pages/admin/AdminConfigPage'));
const AdminServices = lazy(() => import('./pages/admin/AdminServicesPage'));
const AdminBookings = lazy(() => import('./pages/admin/AdminBookingsPage'));
const AdminClientGalleries = lazy(() => import('./pages/admin/AdminClientGalleriesPage'));

// Layouts
const MainLayout = lazy(() => import('./components/layout/MainLayout'));
const AdminLayout = lazy(() => import('./components/layout/AdminLayout'));

// Fallback loader
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// Basic Auth Guard
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('admin_token');
  if (!token) return <Navigate to="/admin/login" replace />;
  return children;
};

function App() {
  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          
          {/* Public Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="photos/:slug" element={<PhotoDetailPage />} />
            <Route path="favorites" element={<FavoritesPage />} />
            <Route path="collections/:slug" element={<CollectionDetailPage />} />
            
            {/* Phase 2: Services & Bookings */}
            <Route path="services" element={<ServicesPage />} />
            <Route path="services/:slug" element={<ServiceDetailPage />} />
            <Route path="book" element={<BookingPage />} />
            
            {/* Phase 2: Client Galleries */}
            <Route path="gallery/:slug" element={<GalleryAuthPage />} />
            <Route path="gallery/:slug/view" element={<ClientGalleryViewPage />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="photos" element={<AdminPhotos />} />
            <Route path="collections" element={<AdminCollections />} />
            <Route path="config" element={<AdminConfig />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="client-galleries" element={<AdminClientGalleries />} />
          </Route>

        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
