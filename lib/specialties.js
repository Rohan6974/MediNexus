import {
  HeartPulse,
  Stethoscope,
  Bone,
  Eye,
  Baby,
  Brain,
  Flower2,
  Target,
  Milestone,
  Microscope,
  Timer,
  Thermometer,
  Activity,
  CircleDot,
} from "lucide-react";
export const SPECIALTIES = [
  {
    name: "General Medicine",
    icon: <Stethoscope className="h-5 w-5 text-emerald-400" />,
    diseases: ["Fever", "Hypertension", "Diabetes", "Common Cold", "Fatigue"],
  },
  {
    name: "Cardiology",
    icon: <HeartPulse className="h-5 w-5 text-emerald-400" />,
    diseases: ["Heart Attack", "Arrhythmia", "Coronary Artery Disease", "Heart Failure", "Hypertension"],
  },
  {
    name: "Dermatology",
    icon: <CircleDot className="h-5 w-5 text-emerald-400" />,
    diseases: ["Acne", "Eczema", "Psoriasis", "Skin Allergies", "Fungal Infections"],
  },
  {
    name: "Endocrinology",
    icon: <Timer className="h-5 w-5 text-emerald-400" />,
    diseases: ["Diabetes", "Thyroid Disorders", "Polycystic Ovary Syndrome (PCOS)", "Cushing's Syndrome", "Addison's Disease"],
  },
  {
    name: "Gastroenterology",
    icon: <Thermometer className="h-5 w-5 text-emerald-400" />,
    diseases: ["Gastritis", "Irritable Bowel Syndrome (IBS)", "Hepatitis", "Ulcer", "Acid Reflux"],
  },
  {
    name: "Neurology",
    icon: <Brain className="h-5 w-5 text-emerald-400" />,
    diseases: ["Epilepsy", "Migraine", "Stroke", "Parkinson's Disease", "Multiple Sclerosis"],
  },
  {
    name: "Obstetrics & Gynecology",
    icon: <Flower2 className="h-5 w-5 text-emerald-400" />,
    diseases: ["Pregnancy", "PCOS", "Endometriosis", "Menstrual Disorders", "UTIs"],
  },
  {
    name: "Oncology",
    icon: <Target className="h-5 w-5 text-emerald-400" />,
    diseases: ["Breast Cancer", "Lung Cancer", "Leukemia", "Lymphoma", "Prostate Cancer"],
  },
  {
    name: "Ophthalmology",
    icon: <Eye className="h-5 w-5 text-emerald-400" />,
    diseases: ["Cataract", "Glaucoma", "Conjunctivitis", "Macular Degeneration", "Dry Eye"],
  },
  {
    name: "Orthopedics",
    icon: <Bone className="h-5 w-5 text-emerald-400" />,
    diseases: ["Fractures", "Arthritis", "Osteoporosis", "Back Pain", "Sports Injuries"],
  },
  {
    name: "Pediatrics",
    icon: <Baby className="h-5 w-5 text-emerald-400" />,
    diseases: ["Measles", "Chickenpox", "Common Cold", "Asthma in Children", "Growth Disorders"],
  },
  {
    name: "Psychiatry",
    icon: <Brain className="h-5 w-5 text-emerald-400" />,
    diseases: ["Depression", "Anxiety", "Schizophrenia", "Bipolar Disorder", "OCD"],
  },
  {
    name: "Pulmonology",
    icon: <Activity className="h-5 w-5 text-emerald-400" />,
    diseases: ["Asthma", "COPD", "Bronchitis", "Pneumonia", "Tuberculosis"],
  },
  {
    name: "Radiology",
    icon: <CircleDot className="h-5 w-5 text-emerald-400" />,
    diseases: ["Imaging Services", "Fractures", "Tumors", "Infections", "Internal Bleeding"],
  },
  {
    name: "Urology",
    icon: <Milestone className="h-5 w-5 text-emerald-400" />,
    diseases: ["Kidney Stones", "UTIs", "Prostate Problems", "Bladder Infections", "Urinary Incontinence"],
  },
  {
    name: "Other",
    icon: <Microscope className="h-5 w-5 text-emerald-400" />,
    diseases: ["Rare Conditions", "Uncategorized Illnesses", "Genetic Disorders", "Autoimmune Diseases"],
  },
];
