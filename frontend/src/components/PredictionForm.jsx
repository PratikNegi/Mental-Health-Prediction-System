import { AlertCircle, Check, Loader2 } from "lucide-react";
import { SECTIONS, COUNTRIES } from "../constants.js";

const base =
  "w-full rounded-xl border bg-white px-4 py-3 text-base text-ink placeholder:text-ink/40 transition-colors";

function Field({ f, value, error, onChange, onBlur }) {
  const id = `field-${f.name}`;
  const errId = `${id}-error`;
  const common = {
    id, name: f.name, value, onBlur,
    onChange: (e) => onChange(f.name, e.target.value),
    "aria-invalid": error ? "true" : "false",
    "aria-describedby": error ? errId : undefined,
    className: `${base} ${error ? "border-rose" : "border-haze"}`,
  };

  let input;
  if (f.type === "select") {
    input = (
      <select {...common}>
        <option value="">Select…</option>
        {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    );
  } else if (f.type === "pills") {
    input = (
      <div
        id={id} role="radiogroup" aria-labelledby={`${id}-label`} aria-describedby={error ? errId : undefined}
        className="grid grid-cols-2 gap-2 sm:grid-cols-4"
      >
        {f.options.map((o) => {
          const on = value === o;
          return (
            <button
              key={o} type="button" role="radio" aria-checked={on}
              onClick={() => onChange(f.name, o)} onBlur={onBlur}
              className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-3 font-semibold transition-colors ${
                on ? "border-sea bg-sea text-white" : `bg-white hover:bg-fog ${error ? "border-rose" : "border-haze"}`
              }`}
            >
              {on && <Check size={16} aria-hidden="true" />} {o}
            </button>
          );
        })}
      </div>
    );
  } else if (f.type === "country") {
    input = (
      <>
        <input {...common} type="text" list="country-list" autoComplete="country-name" placeholder="Type or pick a country" />
        <datalist id="country-list">{COUNTRIES.map((c) => <option key={c} value={c} />)}</datalist>
      </>
    );
  } else {
    input = <input {...common} type="number" inputMode="decimal" min={f.min} max={f.max} step={f.step} placeholder={f.unit} />;
  }

  const Label = f.type === "pills" ? "div" : "label";
  return (
    <div className={f.type === "pills" ? "sm:col-span-2" : ""}>
      <Label id={`${id}-label`} htmlFor={f.type === "pills" ? undefined : id} className="mb-1.5 block text-sm font-semibold">
        {f.label}
        {f.type === "number" && f.max !== undefined && (
          <span className="ml-1 font-normal text-ink/60">({f.min}–{f.max})</span>
        )}
      </Label>
      {input}
      {error && (
        <p id={errId} className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-rose">
          <AlertCircle size={15} aria-hidden="true" /> {error}
        </p>
      )}
    </div>
  );
}

export default function PredictionForm({ values, errors, onChange, onBlur, onSubmit, loading, apiError }) {
  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {SECTIONS.map((s) => (
        <fieldset key={s.title} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-haze sm:p-7">
          <legend className="sr-only">{s.title}</legend>
          <h3 className="font-display text-xl font-semibold">{s.title}</h3>
          <p className="mb-5 text-sm text-ink/65">{s.hint}</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {s.fields.map((f) => (
              <Field key={f.name} f={f} value={values[f.name]} error={errors[f.name]} onChange={onChange} onBlur={() => onBlur(f.name)} />
            ))}
          </div>
        </fieldset>
      ))}

      {apiError && (
        <div role="alert" className="flex items-start gap-3 rounded-2xl border border-rose bg-white p-4 text-rose">
          <AlertCircle className="mt-0.5 shrink-0" size={20} aria-hidden="true" />
          <p className="font-medium">{apiError}</p>
        </div>
      )}

      <button
        type="submit" disabled={loading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-sea px-8 py-4 text-lg font-semibold text-white shadow-sm transition-colors hover:bg-seadark disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {loading ? (<><Loader2 className="animate-spin" size={20} aria-hidden="true" /> Predicting…</>) : "Predict my score"}
      </button>
    </form>
  );
}
