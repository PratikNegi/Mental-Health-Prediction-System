export default function Disclaimer({ className = "" }) {
  return (
    <p className={`text-sm leading-relaxed text-ink/75 ${className}`}>
      This tool provides an ML-based estimate for awareness purposes and is not a medical diagnosis.
    </p>
  );
}
