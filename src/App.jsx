import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AuthProvider from "./contexts/AuthContext";
import CitiesProvider from "./contexts/CitiesContext";

import Login from "./pages/Login";
import Form from "./components/Form";
import Pricing from "./pages/Pricing";
import Product from "./pages/Product";
import HomePage from "./pages/Homepage";
import AppLayout from "./pages/AppLayout";
import City from "./components/Cities/City";
import PageNotFound from "./pages/PageNotFound";
import CityList from "./components/Cities/CityList";
import CountryList from "./components/Countries/CountryList";
import ProtectedRoute from "./pages/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <CitiesProvider>
        <BrowserRouter>
          <Routes>
            <Route index element={<HomePage />} />
            <Route path="product" element={<Product />} />
            <Route path="pricing" element={<Pricing />} />
            <Route path="login" element={<Login />} />
            <Route
              path="app"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="cities" replace />} />
              <Route path="cities" element={<CityList />} />
              <Route path="cities/:id" element={<City />} />
              <Route path="countries" element={<CountryList />} />
              <Route path="form" element={<Form />} />
            </Route>
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
      </CitiesProvider>
    </AuthProvider>
  );
}

export default App;
