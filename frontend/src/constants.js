// Values copied exactly from the FastAPI Literal[...] definitions.
const o = (arr) => arr;

export const SECTIONS = [
  {
    title: "About you",
    hint: "Basic background.",
    fields: [
      { name: "Age", label: "Age", type: "number", int: true, min: 0, max: 120, step: 1, unit: "years" },
      { name: "Gender", label: "Gender", type: "select", options: o(["Male", "Female"]) },
      { name: "group_country", label: "Country", type: "country" },
      { name: "Academic_Level", label: "Academic level", type: "select", options: o(["Undergraduate", "Graduate", "High School"]) },
    ],
  },
  {
    title: "Digital habits",
    hint: "How you use social media.",
    fields: [
      {
        name: "Most_Used_Platform", label: "Most used platform", type: "select",
        options: o(["Facebook", "LinkedIn", "Instagram", "Snapchat", "Twitter", "YouTube", "TikTok", "LINE", "KakaoTalk", "VKontakte", "WhatsApp", "WeChat"]),
      },
      { name: "Purpose_Of_Use", label: "Main purpose of use", type: "select", options: o(["Networking", "Education", "Entertainment", "News"]) },
      { name: "Avg_Daily_Usage_Hours", label: "Daily social media use", type: "number", min: 0, max: 24, step: 0.5, unit: "hours" },
      { name: "Daily_Unlocks", label: "Phone unlocks per day", type: "number", int: true, min: 0, step: 1, unit: "times" },
    ],
  },
  {
    title: "Daily routine",
    hint: "Study, movement and sleep.",
    fields: [
      { name: "Study_Hours", label: "Study hours per day", type: "number", min: 0, max: 24, step: 0.5, unit: "hours" },
      { name: "Physical_Activity_Hours", label: "Physical activity per day", type: "number", min: 0, max: 24, step: 0.5, unit: "hours" },
      { name: "Sleep_Hours_Per_Night", label: "Sleep per night", type: "number", min: 0, max: 24, step: 0.5, unit: "hours" },
    ],
  },
  {
    title: "Stress",
    hint: "How stressed you feel in general.",
    fields: [
      { name: "Stress_Level", label: "Perceived stress level", type: "pills", options: o(["Low", "Medium", "High", "Very High"]) },
    ],
  },
];

export const ALL_FIELDS = SECTIONS.flatMap((s) => s.fields);
export const EMPTY_VALUES = Object.fromEntries(ALL_FIELDS.map((f) => [f.name, ""]));

// Suggestions only. Any country text is accepted; the backend maps unknown ones to "Other".
export const COUNTRIES = [
  "Canada", "USA", "India", "Australia", "UK", "Germany", "France", "Mexico", "Turkey",
  "Argentina", "Bangladesh", "Brazil", "China", "Egypt", "Indonesia", "Italy", "Japan",
  "Kenya", "Malaysia", "Netherlands", "Nigeria", "Pakistan", "Philippines", "Poland",
  "Russia", "Saudi Arabia", "Singapore", "South Africa", "South Korea", "Spain", "Sri Lanka",
  "Sweden", "Thailand", "UAE", "Vietnam",
];

export function validate(values) {
  const errors = {};
  for (const f of ALL_FIELDS) {
    const raw = String(values[f.name] ?? "").trim();
    if (raw === "") { errors[f.name] = "This field is required."; continue; }
    if (f.type === "select" || f.type === "pills") {
      if (!f.options.includes(raw)) errors[f.name] = "Choose one of the listed options.";
    } else if (f.type === "number") {
      const n = Number(raw);
      if (!Number.isFinite(n)) errors[f.name] = "Enter a valid number.";
      else if (f.int && !Number.isInteger(n)) errors[f.name] = "Enter a whole number.";
      else if (n < f.min) errors[f.name] = `Must be at least ${f.min}.`;
      else if (f.max !== undefined && n > f.max) errors[f.name] = `Must be at most ${f.max}.`;
    }
  }
  return errors;
}

// Builds the exact JSON body FastAPI expects.
export function buildPayload(values) {
  const payload = {};
  for (const f of ALL_FIELDS) {
    const raw = String(values[f.name]).trim();
    payload[f.name] = f.type === "number" ? Number(raw) : raw;
  }
  return payload;
}
