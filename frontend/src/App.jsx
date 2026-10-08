import { useRef, useState } from "react";
import Hero from "./components/Hero.jsx";
import PredictionForm from "./components/PredictionForm.jsx";
import ResultPanel from "./components/ResultPanel.jsx";
import Disclaimer from "./components/Disclaimer.jsx";
import { EMPTY_VALUES, validate, buildPayload } from "./constants.js";
import { predictScore } from "./services/api.js";

export default function App() {
  const [values, setValues] = useState(EMPTY_VALUES);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [score, setScore] = useState(null);
  const formRef = useRef(null);
  const panelRef = useRef(null);

  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  // Show an inline error only for fields the user has visited (or after a submit attempt).
  const showErrors = (vals, t) => {
    const all = validate(vals);
    setErrors(Object.fromEntries(Object.entries(all).filter(([k]) => t[k])));
    return all;
  };

  const handleChange = (name, v) => {
    const next = { ...values, [name]: v };
    setValues(next);
    showErrors(next, touched);
  };

  const handleBlur = (name) => {
    const t = { ...touched, [name]: true };
    setTouched(t);
    showErrors(values, t);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setApiError("");
    const allTouched = Object.fromEntries(Object.keys(values).map((k) => [k, true]));
    setTouched(allTouched);
    const all = showErrors(values, allTouched);
    const firstBad = Object.keys(all)[0];
    if (firstBad) {
      document.getElementById(`field-${firstBad}`)?.focus();
      return;
    }
    const payload = buildPayload(values);
    setScore(null);
    setLoading(true);
    try {
      setScore(await predictScore(payload));
      // On small screens the panel sits below the form, so bring it into view.
      if (window.innerWidth < 1024) setTimeout(() => panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setScore(null); // keep answers so they can be edited
    scrollToForm();
    setTimeout(() => document.getElementById("field-Age")?.focus(), 400);
  };

  return (
    <div className="min-h-screen">
      <Hero onStart={scrollToForm} />
      <main ref={formRef} className="mx-auto grid max-w-6xl scroll-mt-4 gap-8 px-5 pb-16 sm:px-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
        <div>
          <h2 className="mb-5 font-display text-3xl font-semibold">Tell us about your routine</h2>
          <PredictionForm
            values={values} errors={errors} loading={loading} apiError={apiError}
            onChange={handleChange} onBlur={handleBlur} onSubmit={handleSubmit}
          />
        </div>
        <div ref={panelRef} className="scroll-mt-4 lg:sticky lg:top-6 lg:mt-14">
          <ResultPanel status={loading ? "loading" : score !== null ? "success" : "idle"} score={score} onReset={handleReset} />
        </div>
      </main>
      <footer className="border-t border-haze px-5 py-8 text-center">
        <Disclaimer />
      </footer>
    </div>
  );
}
