import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Layout from "@/components/layout/Layout";

const Home = lazy(() => import("@/pages/Home"));
const BanknoteList = lazy(() => import("@/pages/BanknoteList"));
const BanknoteDetail = lazy(() => import("@/pages/BanknoteDetail"));
const CountryBrowse = lazy(() => import("@/pages/CountryBrowse"));
const YearBrowse = lazy(() => import("@/pages/YearBrowse"));
const DenominationBrowse = lazy(() => import("@/pages/DenominationBrowse"));
const Favorites = lazy(() => import("@/pages/Favorites"));
const About = lazy(() => import("@/pages/About"));
const DataSources = lazy(() => import("@/pages/DataSources"));
const Privacy = lazy(() => import("@/pages/Privacy"));
const Terms = lazy(() => import("@/pages/Terms"));
const Contact = lazy(() => import("@/pages/Contact"));
const QuizCategorySelect = lazy(() => import("@/pages/QuizCategorySelect"));
const QuizPlay = lazy(() => import("@/pages/QuizPlay"));
const QuizResult = lazy(() => import("@/pages/QuizResult"));
const Timeline = lazy(() => import("@/pages/Timeline"));
const SecurityFeatures = lazy(() => import("@/pages/SecurityFeatures"));
const LuckyDraw = lazy(() => import("@/pages/LuckyDraw"));
const DesignElements = lazy(() => import("@/pages/DesignElements"));
const CurrencyConverter = lazy(() => import("@/pages/CurrencyConverter"));
const MyNotes = lazy(() => import("@/pages/MyNotes"));
const Tags = lazy(() => import("@/pages/Tags"));

function RouteLoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin" />
        <p className="text-gray-500 text-sm">加载中...</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Suspense fallback={<RouteLoadingFallback />}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/banknotes" element={<BanknoteList />} />
            <Route path="/banknote/:id" element={<BanknoteDetail />} />
            <Route path="/countries" element={<CountryBrowse />} />
            <Route path="/years" element={<YearBrowse />} />
            <Route path="/denominations" element={<DenominationBrowse />} />
            <Route path="/design-elements" element={<DesignElements />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/security-features" element={<SecurityFeatures />} />
            <Route path="/currency-converter" element={<CurrencyConverter />} />
            <Route path="/notes" element={<MyNotes />} />
            <Route path="/tags" element={<Tags />} />
            <Route path="/lucky-draw" element={<LuckyDraw />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/quiz" element={<QuizCategorySelect />} />
            <Route path="/quiz/play" element={<QuizPlay />} />
            <Route path="/quiz/result" element={<QuizResult />} />
            <Route path="/about" element={<About />} />
            <Route path="/data-sources" element={<DataSources />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/contact" element={<Contact />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}
