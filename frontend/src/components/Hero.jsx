import { ArrowDown } from "lucide-react";
import Disclaimer from "./Disclaimer.jsx";

export default function Hero({ onStart }) {
  return (
    <header className="rise mx-auto max-w-6xl px-5 pb-10 pt-12 sm:px-8 md:pt-16">
      <h1 className="max-w-3xl font-display text-4xl font-semibold leading-tight sm:text-5xl">
        Mental Health Score Predictor
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink/80">
        Understand how your digital habits, academic routine, lifestyle, and stress factors relate to your
        model-predicted mental health score.
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-4">
        <button
          onClick={onStart}
          className="inline-flex items-center gap-2 rounded-full bg-sea px-7 py-3.5 font-semibold text-white shadow-sm transition-colors hover:bg-seadark"
        >
          Check My Score <ArrowDown size={18} aria-hidden="true" />
        </button>
        <Disclaimer className="max-w-md border-l-2 border-sea pl-4" />
      </div>
    </header>
  );
}
