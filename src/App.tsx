import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Home from "@/pages/Home";
import BanknoteList from "@/pages/BanknoteList";
import BanknoteDetail from "@/pages/BanknoteDetail";
import CountryBrowse from "@/pages/CountryBrowse";
import YearBrowse from "@/pages/YearBrowse";
import DenominationBrowse from "@/pages/DenominationBrowse";
import Favorites from "@/pages/Favorites";
import About from "@/pages/About";
import DataSources from "@/pages/DataSources";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import Contact from "@/pages/Contact";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/banknotes" element={<BanknoteList />} />
          <Route path="/banknote/:id" element={<BanknoteDetail />} />
          <Route path="/countries" element={<CountryBrowse />} />
          <Route path="/years" element={<YearBrowse />} />
          <Route path="/denominations" element={<DenominationBrowse />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/about" element={<About />} />
          <Route path="/data-sources" element={<DataSources />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
      </Routes>
    </Router>
  );
}
