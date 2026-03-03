import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy, ArrowRight, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";

/* ─── Types ─────────────────────────────────────────── */
interface FormData {
    name: string;
    phone: string;
    email: string;
    age: string;
    gender: string;
    address: string;
    consentAccepted: boolean;
}

interface FormErrors {
    name?: string;
    phone?: string;
    email?: string;
    age?: string;
    gender?: string;
    address?: string;
    consentAccepted?: string;
}

type Step = "teaser" | "form" | "success";

/* ─── Helpers ────────────────────────────────────────── */
const slideVariants = {
    enter: { opacity: 0, x: 40 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
};

const fadeVariants = {
    enter: { opacity: 0, scale: 0.96 },
    center: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.96 },
};

/* ─── Subcomponents ──────────────────────────────────── */

function FieldError({ msg }: { msg?: string }) {
    if (!msg) return null;
    return (
        <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-1 text-red-400 text-xs mt-1"
        >
            <AlertCircle className="w-3 h-3 flex-shrink-0" />
            {msg}
        </motion.p>
    );
}

const inputClass =
    "w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-blue-500/60 focus:bg-white/[0.08] transition-all";

const labelClass = "block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider";

/* ─── Main Component ─────────────────────────────────── */
interface ChallengePopupProps {
    /** When provided, the parent can open the popup imperatively */
    externalTrigger?: boolean;
    onExternalTriggerConsumed?: () => void;
}

export function ChallengePopup({ externalTrigger, onExternalTriggerConsumed }: ChallengePopupProps) {
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState<Step>("teaser");
    const [form, setForm] = useState<FormData>({
        name: "", phone: "", email: "", age: "", gender: "", address: "", consentAccepted: false,
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [submitting, setSubmitting] = useState(false);

    /* ── Auto open after 5–8 seconds ── */
    useEffect(() => {
        const delay = Math.floor(Math.random() * 3000) + 5000; // 5000–8000ms
        const timer = setTimeout(() => setOpen(true), delay);
        return () => clearTimeout(timer);
    }, []);

    /* ── External (manual) trigger ── */
    useEffect(() => {
        if (externalTrigger) {
            setOpen(true);
            onExternalTriggerConsumed?.();
        }
    }, [externalTrigger, onExternalTriggerConsumed]);

    /* ── Reset state on close ── */
    const handleOpenChange = useCallback((val: boolean) => {
        setOpen(val);
        if (!val) {
            setTimeout(() => {
                setStep("teaser");
                setForm({ name: "", phone: "", email: "", age: "", gender: "", address: "", consentAccepted: false });
                setErrors({});
            }, 300);
        }
    }, []);

    /* ── Validation ── */
    const validate = (): boolean => {
        const errs: FormErrors = {};
        if (!form.name.trim()) errs.name = "Full name is required.";
        if (!form.phone.trim()) {
            errs.phone = "Phone number is required.";
        } else if (!/^\d{10,}$/.test(form.phone.replace(/\s+/g, ""))) {
            errs.phone = "Enter a valid phone number (min 10 digits).";
        }
        if (!form.email.trim()) {
            errs.email = "Email address is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            errs.email = "Enter a valid email address.";
        }
        if (!form.age) {
            errs.age = "Age is required.";
        } else if (Number(form.age) < 18) {
            errs.age = "You must be at least 18 years old.";
        }
        if (!form.gender) errs.gender = "Please select your gender.";
        if (!form.address.trim()) errs.address = "Address is required.";
        if (!form.consentAccepted) errs.consentAccepted = "You must accept the responsibility disclaimer.";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    /* ── Submit ── */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setSubmitting(true);
        try {
            const res = await fetch("/api/challenge-entry", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.name.trim(),
                    phone: form.phone.replace(/\s+/g, ""),
                    email: form.email.trim(),
                    age: Number(form.age),
                    gender: form.gender,
                    address: form.address.trim(),
                    consentAccepted: true,
                }),
            });
            if (!res.ok) throw new Error("Submission failed");
            setStep("success");
            setTimeout(() => handleOpenChange(false), 3000);
        } catch {
            setErrors({ name: "Something went wrong. Please try again." });
        } finally {
            setSubmitting(false);
        }
    };

    const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const val = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
        setForm((prev) => ({ ...prev, [field]: val }));
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    /* ── Render ── */
    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent
                className="p-0 border-0 bg-transparent shadow-none max-w-lg w-full"
                style={{ background: "transparent" }}
            >
                {/* Visually hidden title for accessibility */}
                <DialogTitle className="sr-only">Trading Challenge Registration</DialogTitle>

                <div className="relative w-full max-w-lg mx-auto rounded-2xl overflow-hidden bg-[#0d1827] border border-white/10 shadow-2xl shadow-blue-950/60">
                    {/* Glow top */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-px bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />
                    {/* Ambient orb */}
                    <div className="absolute top-[-80px] right-[-60px] w-[280px] h-[280px] bg-blue-600/10 rounded-full blur-[80px] pointer-events-none" />

                    {/* Close button */}
                    <button
                        onClick={() => handleOpenChange(false)}
                        className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.14] border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    {/* Step Router */}
                    <AnimatePresence mode="wait" initial={false}>
                        {step === "teaser" && (
                            <motion.div
                                key="teaser"
                                variants={fadeVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.28, ease: "easeOut" }}
                                className="relative z-10 flex flex-col items-center text-center px-8 py-12 sm:py-16"
                            >
                                {/* Badge */}
                                <div className="mb-6 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-yellow-400 text-[11px] font-black uppercase tracking-widest flex items-center gap-2">
                                    <Trophy className="w-3.5 h-3.5" />
                                    Live Trading Challenge
                                </div>

                                {/* Headline */}
                                <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-3">
                                    <span className="bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent">
                                        $100 to $10,000
                                    </span>
                                    <br />
                                    <br>
                                    Trading Challenge
                               </br> 
                                    </h2>

                                <p className="text-slate-400 text-base mb-10 max-w-xs">
                                    Ready to prove your trading skills? Join India's most exciting live trading challenge.
                                </p>

                                {/* Stats row */}
                                <div className="flex items-center gap-6 mb-10">
                                    {[
                                        { value: "100x", label: "Return Goal" },
                                        { value: "Live", label: "Challenge" },
                                        { value: "Free", label: "Entry" },
                                    ].map((s) => (
                                        <div key={s.label} className="text-center">
                                            <div className="text-xl font-black text-white">{s.value}</div>
                                            <div className="text-[10px] text-slate-500 uppercase tracking-wider">{s.label}</div>
                                        </div>
                                    ))}
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.04 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => setStep("form")}
                                    className="group flex items-center gap-2.5 px-10 py-4 rounded-2xl font-black text-base text-white shadow-2xl shadow-blue-900/50"
                                    style={{ background: "linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)" }}
                                >
                                    I'm Interested
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </motion.button>

                                <p className="mt-4 text-slate-600 text-xs">No fees. No hidden charges. Pure skill.</p>
                            </motion.div>
                        )}

                        {step === "form" && (
                            <motion.div
                                key="form"
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                className="relative z-10 px-6 sm:px-8 py-8"
                            >
                                {/* Header */}
                                <div className="mb-6">
                                    <div className="flex items-center gap-2 text-blue-400 text-xs font-black uppercase tracking-widest mb-2">
                                        <Trophy className="w-3.5 h-3.5" />
                                        Registration Form
                                    </div>
                                    <h3 className="text-xl sm:text-2xl font-black text-white">
                                        Join the Challenge
                                    </h3>
                                    <p className="text-slate-500 text-sm mt-1">Fill in your details to register.</p>
                                </div>

                                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                                    {/* Row: Name + Phone */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className={labelClass}>Full Name</label>
                                            <input
                                                type="text"
                                                placeholder="Rahul Sharma"
                                                value={form.name}
                                                onChange={set("name")}
                                                className={inputClass}
                                            />
                                            <FieldError msg={errors.name} />
                                        </div>
                                        <div>
                                            <label className={labelClass}>Phone Number</label>
                                            <input
                                                type="tel"
                                                placeholder="9876543210"
                                                value={form.phone}
                                                onChange={set("phone")}
                                                className={inputClass}
                                            />
                                            <FieldError msg={errors.phone} />
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className={labelClass}>Email ID</label>
                                        <input
                                            type="email"
                                            placeholder="you@example.com"
                                            value={form.email}
                                            onChange={set("email")}
                                            className={inputClass}
                                        />
                                        <FieldError msg={errors.email} />
                                    </div>

                                    {/* Row: Age + Gender */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className={labelClass}>Age</label>
                                            <input
                                                type="number"
                                                placeholder="25"
                                                min={18}
                                                max={100}
                                                value={form.age}
                                                onChange={set("age")}
                                                className={inputClass}
                                            />
                                            <FieldError msg={errors.age} />
                                        </div>
                                        <div>
                                            <label className={labelClass}>Gender</label>
                                            <select
                                                value={form.gender}
                                                onChange={set("gender")}
                                                className={`${inputClass} [&>option]:bg-[#0d1827]`}
                                            >
                                                <option value="">Select...</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                            <FieldError msg={errors.gender} />
                                        </div>
                                    </div>

                                    {/* Address */}
                                    <div>
                                        <label className={labelClass}>Address</label>
                                        <textarea
                                            rows={2}
                                            placeholder="123 Main Street, City, State"
                                            value={form.address}
                                            onChange={set("address")}
                                            className={`${inputClass} resize-none`}
                                        />
                                        <FieldError msg={errors.address} />
                                    </div>

                                    {/* Consent */}
                                    <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4">
                                        <label className="flex items-start gap-3 cursor-pointer group">
                                            <div className="relative mt-0.5 flex-shrink-0">
                                                <input
                                                    type="checkbox"
                                                    checked={form.consentAccepted}
                                                    onChange={set("consentAccepted")}
                                                    className="sr-only"
                                                />
                                                <div
                                                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${form.consentAccepted
                                                            ? "bg-blue-600 border-blue-600"
                                                            : "border-white/20 bg-white/[0.05] group-hover:border-blue-500/50"
                                                        }`}
                                                >
                                                    {form.consentAccepted && (
                                                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-slate-400 text-xs leading-relaxed">
                                                I understand that trading involves risk. Any profit or loss will be my sole
                                                responsibility. I take full responsibility for my trading decisions.
                                            </p>
                                        </label>
                                        <FieldError msg={errors.consentAccepted} />
                                    </div>

                                    {/* Submit */}
                                    <motion.button
                                        type="submit"
                                        disabled={submitting}
                                        whileHover={{ scale: submitting ? 1 : 1.02 }}
                                        whileTap={{ scale: submitting ? 1 : 0.98 }}
                                        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-black text-white text-sm shadow-lg shadow-blue-900/40 disabled:opacity-70 transition-all"
                                        style={{ background: "linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)" }}
                                    >
                                        {submitting ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Submitting…
                                            </>
                                        ) : (
                                            <>
                                                Submit Application
                                                <ArrowRight className="w-4 h-4" />
                                            </>
                                        )}
                                    </motion.button>
                                </form>
                            </motion.div>
                        )}

                        {step === "success" && (
                            <motion.div
                                key="success"
                                variants={fadeVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className="relative z-10 flex flex-col items-center text-center px-8 py-16"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 250, damping: 18, delay: 0.1 }}
                                    className="w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mb-6"
                                >
                                    <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                                </motion.div>
                                <h3 className="text-2xl font-black text-white mb-3">Application Submitted!</h3>
                                <p className="text-slate-400 text-sm max-w-xs">
                                    Our team will contact you soon. Get ready for the challenge!
                                </p>
                                <div className="mt-6 text-xs text-slate-600">This window will close automatically…</div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </DialogContent>
        </Dialog>
    );
}
