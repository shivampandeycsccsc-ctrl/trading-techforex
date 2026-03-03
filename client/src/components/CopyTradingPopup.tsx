import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
    X, TrendingUp, ArrowRight, CheckCircle2, Loader2, ChevronDown, Search,
    MessageCircle, Send, Phone, Mail, MapPin, User, Shield, AlertTriangle,
    DollarSign, FileText, RefreshCw, Scale, Info, ChevronRight,
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Country, State, City } from "country-state-city";

/* ─── Full International Country Calling Codes (unchanged) ─────────────── */
const COUNTRY_CODES = [
    { code: "+91", flag: "🇮🇳", name: "India" },
    { code: "+1", flag: "🇺🇸", name: "United States" },
    { code: "+44", flag: "🇬🇧", name: "United Kingdom" },
    { code: "+971", flag: "🇦🇪", name: "UAE" },
    { code: "+1", flag: "🇨🇦", name: "Canada" },
    { code: "+61", flag: "🇦🇺", name: "Australia" },
    { code: "+65", flag: "🇸🇬", name: "Singapore" },
    { code: "+49", flag: "🇩🇪", name: "Germany" },
    { code: "+33", flag: "🇫🇷", name: "France" },
    { code: "+974", flag: "🇶🇦", name: "Qatar" },
    { code: "+966", flag: "🇸🇦", name: "Saudi Arabia" },
    { code: "+968", flag: "🇴🇲", name: "Oman" },
    { code: "+965", flag: "🇰🇼", name: "Kuwait" },
    { code: "+973", flag: "🇧🇭", name: "Bahrain" },
    { code: "+27", flag: "🇿🇦", name: "South Africa" },
    { code: "+63", flag: "🇵🇭", name: "Philippines" },
    { code: "+92", flag: "🇵🇰", name: "Pakistan" },
    { code: "+880", flag: "🇧🇩", name: "Bangladesh" },
    { code: "+94", flag: "🇱🇰", name: "Sri Lanka" },
    { code: "+977", flag: "🇳🇵", name: "Nepal" },
    { code: "+60", flag: "🇲🇾", name: "Malaysia" },
    { code: "+62", flag: "🇮🇩", name: "Indonesia" },
    { code: "+66", flag: "🇹🇭", name: "Thailand" },
    { code: "+84", flag: "🇻🇳", name: "Vietnam" },
    { code: "+81", flag: "🇯🇵", name: "Japan" },
    { code: "+82", flag: "🇰🇷", name: "South Korea" },
    { code: "+86", flag: "🇨🇳", name: "China" },
    { code: "+852", flag: "🇭🇰", name: "Hong Kong" },
    { code: "+886", flag: "🇹🇼", name: "Taiwan" },
    { code: "+20", flag: "🇪🇬", name: "Egypt" },
    { code: "+234", flag: "🇳🇬", name: "Nigeria" },
    { code: "+254", flag: "🇰🇪", name: "Kenya" },
    { code: "+255", flag: "🇹🇿", name: "Tanzania" },
    { code: "+256", flag: "🇺🇬", name: "Uganda" },
    { code: "+233", flag: "🇬🇭", name: "Ghana" },
    { code: "+251", flag: "🇪🇹", name: "Ethiopia" },
    { code: "+260", flag: "🇿🇲", name: "Zambia" },
    { code: "+263", flag: "🇿🇼", name: "Zimbabwe" },
    { code: "+55", flag: "🇧🇷", name: "Brazil" },
    { code: "+52", flag: "🇲🇽", name: "Mexico" },
    { code: "+54", flag: "🇦🇷", name: "Argentina" },
    { code: "+57", flag: "🇨🇴", name: "Colombia" },
    { code: "+56", flag: "🇨🇱", name: "Chile" },
    { code: "+51", flag: "🇵🇪", name: "Peru" },
    { code: "+58", flag: "🇻🇪", name: "Venezuela" },
    { code: "+7", flag: "🇷🇺", name: "Russia" },
    { code: "+380", flag: "🇺🇦", name: "Ukraine" },
    { code: "+48", flag: "🇵🇱", name: "Poland" },
    { code: "+90", flag: "🇹🇷", name: "Turkey" },
    { code: "+39", flag: "🇮🇹", name: "Italy" },
    { code: "+34", flag: "🇪🇸", name: "Spain" },
    { code: "+31", flag: "🇳🇱", name: "Netherlands" },
    { code: "+32", flag: "🇧🇪", name: "Belgium" },
    { code: "+41", flag: "🇨🇭", name: "Switzerland" },
    { code: "+46", flag: "🇸🇪", name: "Sweden" },
    { code: "+47", flag: "🇳🇴", name: "Norway" },
    { code: "+45", flag: "🇩🇰", name: "Denmark" },
    { code: "+358", flag: "🇫🇮", name: "Finland" },
    { code: "+64", flag: "🇳🇿", name: "New Zealand" },
    { code: "+353", flag: "🇮🇪", name: "Ireland" },
    { code: "+351", flag: "🇵🇹", name: "Portugal" },
    { code: "+30", flag: "🇬🇷", name: "Greece" },
    { code: "+43", flag: "🇦🇹", name: "Austria" },
];

/* ─── Zod Schema ─────────────────────────────────────────────────────────
   - checks remain strict (consent must be true)
   - minor improvement: age refined to numeric + empty allowed
*/
const formSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    middleName: z.string().optional(),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().min(1, "Email is required").email("Enter a valid email address"),
    countryCode: z.string().min(1, "Country code is required"),
    phone: z.string().min(1, "Phone number is required").regex(/^\d{10,}$/, "Phone must be at least 10 digits"),
    whatsappNumber: z.string().min(1, "WhatsApp number is required").regex(/^\d{10,}$/, "WhatsApp must be at least 10 digits"),
    telegramId: z.string().min(1, "Telegram ID is required").regex(/^@?[\w.-]{3,}$/, "Enter a valid Telegram ID"),
    age: z.string().optional().refine((val) => !val || (Number(val) >= 18 && Number(val) <= 120), "Age must be 18+"),
    gender: z.string().min(1, "Please select gender"),
    countryIso: z.string().min(1, "Please select a country"),
    stateIso: z.string().min(1, "Please select a state"),
    city: z.string().min(1, "Please select a city"),
    address: z.string().min(1, "Address is required"),
    riskAccepted: z.literal(true, { errorMap: () => ({ message: "You must accept the risk disclaimer" }) }),
    feeAccepted: z.literal(true, { errorMap: () => ({ message: "You must acknowledge the non-refundable fee" }) }),
    termsAccepted: z.literal(true, { errorMap: () => ({ message: "You must agree to the Terms & Conditions" }) }),
});

type FormValues = z.infer<typeof formSchema>;
type Step = "teaser" | "form" | "success";

/* ─── Animation Variants ───────────────────────────────────────────────── */
const slideVariants = { enter: { opacity: 0, x: 48 }, center: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -48 } };
const fadeVariants = { enter: { opacity: 0, scale: 0.94 }, center: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.94 } };

/* ─── Shared styles ────────────────────────────────────────────────────── */
const inputCls = "w-full bg-white/[0.03] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.04] transition-all";
const labelCls = "block text-[11px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wider";

function FieldError({ msg }: { msg?: string }) {
    if (!msg) return null;
    return <p className="text-red-400 text-[11px] mt-1 leading-tight" role="alert">{msg}</p>;
}

function SectionLabel({ icon: Icon, label, color = "text-slate-500" }: { icon: React.ComponentType<any>; label: string; color?: string }) {
    return (
        <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${color} pt-1 pb-0.5`}>
            <Icon className="w-3 h-3" />{label}
        </div>
    );
}

/* ─── Searchable Select (portal-based to escape overflow:hidden) ───────────
   - adds ids for accessibility and keyboard-friendly search focus
*/
function SearchableSelect({
    id,
    value, onChange, options, placeholder, disabled, error,
}: {
    id?: string;
    value: string;
    onChange: (v: string) => void;
    options: { value: string; label: string }[];
    placeholder: string;
    disabled?: boolean;
    error?: string;
}) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [rect, setRect] = useState<DOMRect | null>(null);
    const btnRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const selected = options.find(o => o.value === value);
    const filtered = options.filter(o => o.label.toLowerCase().includes(search.toLowerCase()));

    const openMenu = () => {
        if (disabled) return;
        setRect(btnRef.current?.getBoundingClientRect() ?? null);
        setOpen(p => !p);
        // reset search when opening
        if (!open) setSearch("");
    };

    // Close on outside click
    useEffect(() => {
        if (!open) return;
        function handle(e: MouseEvent) {
            if (
                menuRef.current && !menuRef.current.contains(e.target as Node) &&
                btnRef.current && !btnRef.current.contains(e.target as Node)
            ) setOpen(false);
        }
        document.addEventListener("mousedown", handle);
        return () => document.removeEventListener("mousedown", handle);
    }, [open]);

    // Update rect on scroll/resize while open
    useEffect(() => {
        if (!open) return;
        const update = () => setRect(btnRef.current?.getBoundingClientRect() ?? null);
        window.addEventListener("scroll", update, true);
        window.addEventListener("resize", update);
        return () => {
            window.removeEventListener("scroll", update, true);
            window.removeEventListener("resize", update);
        };
    }, [open]);

    return (
        <div className="relative">
            <button
                id={id}
                aria-haspopup="listbox"
                aria-expanded={open}
                ref={btnRef}
                type="button"
                disabled={disabled}
                onClick={openMenu}
                className={`flex items-center justify-between w-full bg-white/[0.03] border ${error ? "border-red-500/50" : "border-white/10"
                    } rounded-xl px-3.5 py-2.5 text-sm focus:outline-none transition-all ${disabled ? "opacity-40 cursor-not-allowed" : "hover:border-white/20 cursor-pointer"
                    }`}
            >
                <span className={selected ? "text-white" : "text-slate-600"}>{selected?.label || placeholder}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
            </button>

            {open && rect && createPortal(
                <div
                    ref={menuRef}
                    style={{
                        position: "fixed",
                        top: Math.min(rect.bottom + 8, window.innerHeight - 60),
                        left: Math.max(8, rect.left),
                        width: rect.width,
                        zIndex: 9999,
                    }}
                    className="bg-[#0e1c30] border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                    role="dialog"
                    aria-modal="true"
                >
                    <div className="p-2 border-b border-white/10">
                        <div className="flex items-center gap-2 bg-white/[0.03] rounded-lg px-2.5 py-1.5">
                            <Search className="w-3 h-3 text-slate-500 flex-shrink-0" />
                            <input
                                aria-label="Search options"
                                autoFocus
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search..."
                                className="bg-transparent text-white text-xs outline-none flex-1 placeholder:text-slate-600"
                            />
                        </div>
                    </div>
                    <div className="max-h-56 overflow-y-auto">
                        {filtered.length === 0 ? (
                            <div className="px-3 py-3 text-slate-600 text-xs text-center">No results</div>
                        ) : filtered.map(o => (
                            <button
                                key={o.value}
                                type="button"
                                onClick={() => { onChange(o.value); setOpen(false); setSearch(""); }}
                                className={`flex w-full px-3.5 py-2 text-sm hover:bg-white/[0.04] text-left transition-colors ${o.value === value ? "text-white bg-white/[0.05]" : "text-slate-300"
                                    }`}
                                role="option"
                                aria-selected={o.value === value}
                            >
                                {o.label}
                            </button>
                        ))}
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}

/* ─── Country Code Picker (portal-based) ────────────────────────────────
   - same UX but safer widths and keyboard-friendly numeric entry
*/
function CountryCodePicker({ value, onChange, error }: { value: string; onChange: (v: string) => void; error?: string }) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [rect, setRect] = useState<DOMRect | null>(null);
    const btnRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const selected = COUNTRY_CODES.find(c => c.code === value) || COUNTRY_CODES[0];
    const filtered = COUNTRY_CODES.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) || c.code.includes(search)
    );

    const openMenu = () => {
        setRect(btnRef.current?.getBoundingClientRect() ?? null);
        setOpen(p => !p);
        if (!open) setSearch("");
    };

    useEffect(() => {
        if (!open) return;
        function handle(e: MouseEvent) {
            if (
                menuRef.current && !menuRef.current.contains(e.target as Node) &&
                btnRef.current && !btnRef.current.contains(e.target as Node)
            ) setOpen(false);
        }
        document.addEventListener("mousedown", handle);
        return () => document.removeEventListener("mousedown", handle);
    }, [open]);

    useEffect(() => {
        if (!open) return;
        const update = () => setRect(btnRef.current?.getBoundingClientRect() ?? null);
        window.addEventListener("scroll", update, true);
        window.addEventListener("resize", update);
        return () => {
            window.removeEventListener("scroll", update, true);
            window.removeEventListener("resize", update);
        };
    }, [open]);

    return (
        <div className="relative">
            <button
                ref={btnRef}
                type="button"
                onClick={openMenu}
                className={`flex items-center gap-1.5 bg-white/[0.03] border ${error ? "border-red-500/50" : "border-white/10"
                    } rounded-xl px-3 py-2.5 text-white text-sm w-full focus:outline-none focus:border-blue-500/50 transition-all`}
                aria-haspopup="listbox"
                aria-expanded={open}
            >
                <span>{selected?.flag}</span>
                <span className="font-medium">{value || "+91"}</span>
                <ChevronDown className="w-3 h-3 text-slate-500 ml-auto" />
            </button>

            {open && rect && createPortal(
                <div
                    ref={menuRef}
                    style={{
                        position: "fixed",
                        top: Math.min(rect.bottom + 8, window.innerHeight - 60),
                        left: Math.max(8, rect.left),
                        width: Math.max(rect.width, 220),
                        zIndex: 9999,
                    }}
                    className="bg-[#0e1c30] border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                >
                    <div className="p-2 border-b border-white/10">
                        <div className="flex items-center gap-2 bg-white/[0.03] rounded-lg px-2 py-1.5">
                            <Search className="w-3 h-3 text-slate-500" />
                            <input
                                aria-label="Search country codes"
                                autoFocus
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search..."
                                className="bg-transparent text-white text-xs outline-none flex-1 placeholder:text-slate-600"
                            />
                        </div>
                    </div>
                    <div className="max-h-56 overflow-y-auto">
                        {filtered.map((c, i) => (
                            <button
                                key={`${c.code}-${c.name}-${i}`}
                                type="button"
                                onClick={() => { onChange(c.code); setOpen(false); setSearch(""); }}
                                className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-white/[0.04] text-left transition-colors"
                            >
                                <span>{c.flag}</span>
                                <span className="text-slate-300">{c.name}</span>
                                <span className="text-slate-500 ml-auto text-xs">{c.code}</span>
                            </button>
                        ))}
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}

/* ─── Custom Checkbox ───────────────────────────────────────────────────── */
function ConsentCheckbox({ checked, onToggle, accentClass, checkBgClass, children, error }: {
    checked: boolean; onToggle: () => void; accentClass: string; checkBgClass: string;
    children: React.ReactNode; error?: string;
}) {
    return (
        <div>
            <div className={`flex items-start gap-3 p-3.5 rounded-xl border transition-colors ${checked ? accentClass : "bg-white/[0.03] border-white/10"}`}>
                {/* Only the square toggles */}
                <button
                    type="button"
                    onClick={onToggle}
                    aria-pressed={checked}
                    className={`mt-0.5 w-5 h-5 flex-shrink-0 rounded-md border-2 flex items-center justify-center transition-all cursor-pointer hover:opacity-80 ${checked ? checkBgClass : "border-white/20 hover:border-white/40"}`}
                >
                    {checked && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                </button>
                <div className="text-slate-400 text-xs leading-relaxed">{children}</div>
            </div>
            {error && <FieldError msg={error} />}
        </div>
    );
}

/* ─── Terms Modal ──────────────────────────────────────────────────────── */
const termsSections = [
    { icon: DollarSign, color: "text-amber-400", bg: "bg-amber-500/10", title: "1. Entry Fee — Not an Investment", content: ["The $100 (USD) participation fee is strictly an ENTRY FEE — not an investment, deposit, or capital contribution.", "Payment does not entitle the participant to any profit, return, or guaranteed income.", "TechForex is not a fund manager, investment advisor, or registered financial institution."] },
    { icon: RefreshCw, color: "text-red-400", bg: "bg-red-500/10", title: "2. No Refund Policy", content: ["All entry fees are strictly non-refundable under all circumstances, including voluntary withdrawal, failure to meet targets, technical issues, disqualification, or personal circumstances.", "By submitting the registration form, the participant irrevocably agrees to this no-refund policy."] },
    { icon: AlertTriangle, color: "text-orange-400", bg: "bg-orange-500/10", title: "3. Trading Risk Disclosure", content: ["Trading Forex, commodities, indices, and other instruments carries substantial risk of loss and may not be suitable for all individuals.", "Leverage amplifies both profits and losses. Past performance does not guarantee future results.", "Participants should only trade with capital they can afford to lose."] },
    { icon: Shield, color: "text-blue-400", bg: "bg-blue-500/10", title: "4. Limitation of Liability", content: ["TechForex and its affiliates shall not be liable for any trading losses, decisions made based on challenge education, platform errors, or unauthorized access.", "TechForex's total liability shall not exceed the amount of the entry fee paid."] },
    { icon: Scale, color: "text-emerald-400", bg: "bg-emerald-500/10", title: "5. Participant's Full Responsibility", content: ["The participant is solely responsible for all financial decisions and outcomes.", "They confirm they are 18+ years old, legally permitted to trade in their jurisdiction, and will not hold TechForex responsible for any losses."] },
    { icon: Info, color: "text-purple-400", bg: "bg-purple-500/10", title: "6. Platform Right to Modify Rules", content: ["TechForex reserves the right to modify, amend, suspend, or terminate any aspect of the challenge at any time.", "Continued participation after modifications constitutes acceptance of updated terms."] },
    { icon: FileText, color: "text-cyan-400", bg: "bg-cyan-500/10", title: "7. General Terms", content: ["These Terms constitute the entire agreement between TechForex and the participant.", "TechForex may disqualify participants engaging in fraudulent activity or violations.", "These Terms are governed by applicable laws; disputes shall be resolved through arbitration."] },
];

function TermsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
    if (!open) return null;
    return createPortal(
        <div className="fixed inset-0 flex items-end sm:items-center justify-center p-0 sm:p-4" style={{ zIndex: 10000 }}>
            <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 24 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="relative w-full sm:max-w-2xl bg-[#0b1623] border border-white/10 sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col"
                style={{ maxHeight: "90dvh", height: "auto" }}
            >
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07] flex-shrink-0">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                            <Shield className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-white font-black text-sm">Terms &amp; Conditions</p>
                            <p className="text-slate-500 text-[10px]">Copy Trading Challenge — Participant Agreement</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all"
                        aria-label="Close terms"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="overflow-y-auto flex-1 px-5 py-5 space-y-4">
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/[0.07] border border-amber-500/20">
                        <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                        <p className="text-slate-400 text-xs leading-relaxed">
                            The <strong className="text-white">$100 entry fee is non-refundable</strong> and does <strong className="text-white">not</strong> constitute an investment. Please read carefully before registering.
                        </p>
                    </div>

                    {termsSections.map((s, idx) => {
                        const Icon = s.icon;
                        return (
                            <div key={idx} className="rounded-xl bg-white/[0.02] border border-white/[0.06] overflow-hidden">
                                <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06]">
                                    <div className={`w-7 h-7 rounded-lg ${s.bg} flex items-center justify-center flex-shrink-0`}>
                                        <Icon className={`w-3.5 h-3.5 ${s.color}`} />
                                    </div>
                                    <p className="text-white font-bold text-sm">{s.title}</p>
                                </div>
                                <div className="px-4 py-3 space-y-2">
                                    {s.content.map((para, i) => (
                                        <div key={i} className="flex items-start gap-2">
                                            <ChevronRight className="w-3 h-3 text-slate-600 flex-shrink-0 mt-0.5" />
                                            <p className="text-slate-400 text-xs leading-relaxed">{para}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}

                    <div className="rounded-xl p-5 text-center" style={{ background: "linear-gradient(135deg,rgba(5,150,105,0.08),rgba(14,165,233,0.08))", border: "1px solid rgba(5,150,105,0.2)" }}>
                        <Shield className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                        <p className="text-white font-bold text-sm mb-1">Agreement Acknowledgement</p>
                        <p className="text-slate-400 text-xs leading-relaxed">By registering, you confirm you are 18+, have read and understood these Terms, and agree to be bound by them.</p>
                    </div>
                </div>

                <div className="px-5 py-4 border-t border-white/[0.07] flex-shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full py-3 rounded-xl font-black text-white text-sm transition-all hover:opacity-90"
                        style={{ background: "linear-gradient(135deg, #059669 0%, #0ea5e9 100%)" }}
                    >
                        I Understand — Close
                    </button>
                </div>
            </motion.div>
        </div>,
        document.body
    );
}

/* ─── Main Component ───────────────────────────────────────────────────── */
interface CopyTradingPopupProps {
    externalTrigger?: boolean;
    onExternalTriggerConsumed?: () => void;
}

export function CopyTradingPopup({ externalTrigger, onExternalTriggerConsumed }: CopyTradingPopupProps) {
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState<Step>("teaser");
    const [termsOpen, setTermsOpen] = useState(false);
    const [submissionError, setSubmissionError] = useState<string | null>(null);

    /* Build country options from country-state-city */
    const countryOptions = Country.getAllCountries().map(c => ({ value: c.isoCode, label: `${c.name}` }));

    const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting }, reset } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        shouldUnregister: false,
        defaultValues: {
            firstName: "", middleName: "", lastName: "",
            email: "", countryCode: "+91", phone: "",
            whatsappNumber: "", telegramId: "",
            age: "", gender: "", countryIso: "",
            stateIso: "", city: "", address: "",
            // make them booleans so checkboxes have proper controlled state
            riskAccepted: false as any,
            feeAccepted: false as any,
            termsAccepted: false as any,
        },
    });

    const selectedCountryIso = watch("countryIso");
    const selectedStateIso = watch("stateIso");
    const selectedCountryCode = watch("countryCode");
    const riskAccepted = watch("riskAccepted");
    const feeAccepted = watch("feeAccepted");
    const termsAccepted = watch("termsAccepted");

    const stateOptions = selectedCountryIso
        ? State.getStatesOfCountry(selectedCountryIso).map(s => ({ value: s.isoCode, label: s.name }))
        : [];

    const cityOptions = (selectedCountryIso && selectedStateIso)
        ? City.getCitiesOfState(selectedCountryIso, selectedStateIso).map(c => ({ value: c.name, label: c.name }))
        : [];

    /* ── optional auto-open (6s) retained but safe — can remove if undesired ── */
    useEffect(() => {
        const t = setTimeout(() => setOpen(true), 6000);
        return () => clearTimeout(t);
    }, []);

    /* ── external trigger ── */
    useEffect(() => {
        if (externalTrigger) { setOpen(true); onExternalTriggerConsumed?.(); }
    }, [externalTrigger, onExternalTriggerConsumed]);

    const handleOpenChange = useCallback((val: boolean) => {
        setOpen(val);
        if (!val) {
            setTimeout(() => {
                setStep("teaser");
                reset();
                setSubmissionError(null);
            }, 300);
        }
    }, [reset]);

    const onSubmit = async (data: FormValues) => {
        setSubmissionError(null);
        try {
            // Resolve human-friendly country/state names if available
            const selectedCountryName = Country.getCountryByCode ? Country.getCountryByCode(data.countryIso)?.name || data.countryIso : data.countryIso;
            const selectedStateName = State.getStateByCodeAndCountry ? State.getStateByCodeAndCountry(data.stateIso, data.countryIso)?.name || data.stateIso : data.stateIso;

            const payload = {
                ...data,
                age: data.age ? Number(data.age) : null,
                country: selectedCountryName,
                state: selectedStateName,
                riskAccepted: true,
                feeAccepted: true,
                termsAccepted: true,
            };

            const res = await fetch("/api/copy-challenge-entry", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const txt = await res.text().catch(() => null);
                throw new Error(txt || "Submission failed");
            }

            setStep("success");
            // Close after a short delay to allow success UI to show
            setTimeout(() => handleOpenChange(false), 2400);
        } catch (err: any) {
            setSubmissionError(err?.message || "Submission failed. Please try again.");
        }
    };

    const openTerms = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setTermsOpen(true);
    };

    /* helper: sanitize numeric fields (phone, whatsapp) to digits only */
    const sanitizeDigits = (val: string) => val.replace(/\D/g, "");

    return (
        <>
            <AnimatePresence>
                {termsOpen && <TermsModal open={termsOpen} onClose={() => setTermsOpen(false)} />}
            </AnimatePresence>

            <Dialog open={open} onOpenChange={handleOpenChange}>
                <DialogContent className="p-0 border-0 bg-transparent shadow-none max-w-xl w-full">
                    <DialogTitle className="sr-only">Copy Trading Challenge Registration</DialogTitle>

                    <div className="relative w-full max-w-xl mx-auto rounded-2xl overflow-hidden bg-[#0b1623] border border-white/10 shadow-2xl shadow-blue-950/70 sm:mx-4">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent" />
                        <div className="absolute -top-20 -right-16 w-64 h-64 bg-emerald-600/10 rounded-full blur-[80px] pointer-events-none" />
                        <div className="absolute -bottom-20 -left-16 w-64 h-64 bg-blue-600/8 rounded-full blur-[80px] pointer-events-none" />

                        <button
                            onClick={() => handleOpenChange(false)}
                            className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.14] border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all"
                            aria-label="Close"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <AnimatePresence mode="wait" initial={false}>

                            {/* ── Teaser ── */}
                            {step === "teaser" && (
                                <motion.div key="teaser" variants={fadeVariants} initial="enter" animate="center" exit="exit"
                                    transition={{ duration: 0.28, ease: "easeOut" }}
                                    className="relative z-10 flex flex-col items-center text-center px-6 py-10 sm:py-14"
                                >
                                    <div className="flex items-center gap-3 mb-6 text-[10px] font-bold uppercase tracking-widest text-slate-600">
                                        <span className="flex items-center gap-1 text-emerald-500"><TrendingUp className="w-3 h-3" /> Copy Trading Challenge</span>
                                        <span className="w-px h-3 bg-white/10" />
                                        <span className="flex items-center gap-1 text-amber-500"><DollarSign className="w-3 h-3" /> 100 Entry</span>
                                        <span className="w-px h-3 bg-white/10" />
                                        <span className="flex items-center gap-1 text-blue-400"><Shield className="w-3 h-3" /> Mentored</span>
                                    </div>

                                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4 shadow-lg shadow-emerald-900/30">
                                        <TrendingUp className="w-8 h-8 text-emerald-400" />
                                    </div>

                                    <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-2 max-w-xs sm:max-w-sm">
                                        Are You Ready to Improve Your{" "}
                                        <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Wealth Trading Journey?</span>
                                    </h2>

                                    <p className="text-slate-400 text-sm mb-4 max-w-xs">Join India's First Time Exciting Copy Trading Challenge</p>

                                    <div className="flex items-center gap-2 mb-6 px-4 py-2.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 font-black text-sm">
                                        💰 100$ to 10000$ Trading challenge
                                    </div>

                                    <div className="flex flex-wrap items-center justify-center gap-6 mb-6">
                                        {[{ v: "Live", l: "Challenge" }, { v: "100x", l: "Profit Goal" }, { v: "Expert", l: "Mentors" }].map(s => (
                                            <div key={s.l} className="text-center">
                                                <div className="text-xl font-black text-white">{s.v}</div>
                                                <div className="text-[10px] text-slate-500 uppercase tracking-wider">{s.l}</div>
                                            </div>
                                        ))}
                                    </div>

                                    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                                        onClick={() => setStep("form")}
                                        className="flex items-center gap-2.5 px-8 py-3 rounded-2xl font-black text-base text-white shadow-2xl shadow-emerald-900/40"
                                        style={{ background: "linear-gradient(135deg, #059669 0%, #0ea5e9 100%)" }}
                                    >
                                        I'm Interested <ArrowRight className="w-4 h-4" />
                                    </motion.button>
                                    <p className="mt-3 text-slate-600 text-xs max-w-sm">
                                        By registering you agree to our{" "}
                                        <button type="button" onClick={openTerms} className="text-emerald-500 hover:text-emerald-400 underline underline-offset-2 transition-colors">
                                            Terms and Conditions
                                        </button>
                                    </p>
                                </motion.div>
                            )}

                            {/* ── Form ── */}
                            {step === "form" && (
                                <motion.div key="form" variants={slideVariants} initial="enter" animate="center" exit="exit"
                                    transition={{ duration: 0.3, ease: "easeOut" }} className="relative z-10"
                                >
                                    <div className="px-5 pt-6 pb-4 border-b border-white/[0.07]">
                                        <div className="flex items-center gap-2 text-emerald-400 text-xs font-black uppercase tracking-widest mb-1">
                                            <TrendingUp className="w-3.5 h-3.5" /> Copy Trading Challenge
                                        </div>
                                        <h3 className="text-lg font-black text-white">Complete Your Registration</h3>
                                    </div>

                                    <div className="overflow-y-auto max-h-[70vh] px-5 py-5">
                                        <form id="copy-form" onSubmit={handleSubmit(onSubmit)} noValidate>
                                            <div className="space-y-4">

                                                <SectionLabel icon={User} label="Personal Information" color="text-blue-400" />

                                                {/* Name */}
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                    <div>
                                                        <label htmlFor="firstName" className={labelCls}>First *</label>
                                                        <input id="firstName" {...register("firstName")} type="text" placeholder="Rahul" className={inputCls} />
                                                        <FieldError msg={errors.firstName?.message} />
                                                    </div>
                                                    <div>
                                                        <label htmlFor="middleName" className={labelCls}>Middle <span className="text-slate-600 normal-case font-normal">(opt)</span></label>
                                                        <input id="middleName" {...register("middleName")} type="text" placeholder="Kumar" className={inputCls} />
                                                    </div>
                                                    <div>
                                                        <label htmlFor="lastName" className={labelCls}>Last *</label>
                                                        <input id="lastName" {...register("lastName")} type="text" placeholder="Sharma" className={inputCls} />
                                                        <FieldError msg={errors.lastName?.message} />
                                                    </div>
                                                </div>

                                                {/* Email */}
                                                <div>
                                                    <label htmlFor="email" className={labelCls}><span className="flex items-center gap-1.5"><Mail className="w-3 h-3 inline" /> Email *</span></label>
                                                    <input id="email" {...register("email")} type="email" placeholder="yourname@gmail.com" className={inputCls} />
                                                    <FieldError msg={errors.email?.message} />
                                                </div>

                                                <SectionLabel icon={Phone} label="Contact Details" color="text-emerald-400" />

                                                {/* Phone */}
                                                <div>
                                                    <label className={labelCls}>Phone Number *</label>
                                                    <div className="flex gap-2">
                                                        <div className="w-36 flex-shrink-0">
                                                            <CountryCodePicker value={selectedCountryCode} onChange={v => setValue("countryCode", v)} error={errors.countryCode?.message} />
                                                        </div>
                                                        <div className="flex-1">
                                                            <input
                                                                {...register("phone")}
                                                                id="phone"
                                                                type="tel"
                                                                placeholder="9876543210"
                                                                inputMode="numeric"
                                                                pattern="\d*"
                                                                className={inputCls}
                                                                onKeyDown={(e) => {
                                                                    // allow navigation keys, backspace, ctrl/cmd shortcuts
                                                                    if (["Backspace", "ArrowLeft", "ArrowRight", "Tab", "Delete"].includes(e.key)) return;
                                                                    if (!/^[0-9]$/.test(e.key)) e.preventDefault();
                                                                }}
                                                                onChange={(e) => {
                                                                    const vv = sanitizeDigits(e.target.value);
                                                                    setValue("phone", vv, { shouldValidate: true, shouldDirty: true });
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <FieldError msg={errors.countryCode?.message || errors.phone?.message} />
                                                </div>

                                                {/* WhatsApp */}
                                                <div>
                                                    <label htmlFor="whatsappNumber" className={labelCls}><span className="flex items-center gap-1.5"><MessageCircle className="w-3 h-3 inline" /> WhatsApp *</span></label>
                                                    <input
                                                        id="whatsappNumber"
                                                        {...register("whatsappNumber")}
                                                        type="tel"
                                                        placeholder="9876543210"
                                                        inputMode="numeric"
                                                        className={inputCls}
                                                        onKeyDown={(e) => {
                                                            if (["Backspace", "ArrowLeft", "ArrowRight", "Tab", "Delete"].includes(e.key)) return;
                                                            if (!/^[0-9]$/.test(e.key)) e.preventDefault();
                                                        }}
                                                        onChange={(e) => {
                                                            const vv = sanitizeDigits(e.target.value);
                                                            setValue("whatsappNumber", vv, { shouldValidate: true, shouldDirty: true });
                                                        }}
                                                    />
                                                    <FieldError msg={errors.whatsappNumber?.message} />
                                                </div>

                                                {/* Telegram */}
                                                <div>
                                                    <label htmlFor="telegramId" className={labelCls}><span className="flex items-center gap-1.5"><Send className="w-3 h-3 inline" /> Telegram ID *</span></label>
                                                    <input id="telegramId" {...register("telegramId")} type="text" placeholder="@yourusername" className={inputCls} />
                                                    <FieldError msg={errors.telegramId?.message} />
                                                </div>

                                                {/* Age + Gender */}
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    <div>
                                                        <label htmlFor="age" className={labelCls}>Age <span className="text-slate-600 normal-case font-normal">(optional)</span></label>
                                                        <input id="age" {...register("age")} type="number" placeholder="18+" min={18} max={120} className={inputCls} />
                                                        <FieldError msg={errors.age?.message} />
                                                    </div>
                                                    <div>
                                                        <label className={labelCls}>Gender *</label>
                                                        <SearchableSelect
                                                            id="gender"
                                                            value={watch("gender")}
                                                            onChange={v => setValue("gender", v)}
                                                            options={[{ value: "Male", label: "Male" }, { value: "Female", label: "Female" }, { value: "Other", label: "Other" }]}
                                                            placeholder="Select..."
                                                            error={errors.gender?.message}
                                                        />
                                                        <FieldError msg={errors.gender?.message} />
                                                    </div>
                                                </div>

                                                <SectionLabel icon={MapPin} label="Location" color="text-purple-400" />

                                                {/* Country */}
                                                <div>
                                                    <label className={labelCls}>Country *</label>
                                                    <SearchableSelect
                                                        id="countryIso"
                                                        value={selectedCountryIso}
                                                        onChange={v => { setValue("countryIso", v); setValue("stateIso", ""); setValue("city", ""); }}
                                                        options={countryOptions}
                                                        placeholder="Select Country..."
                                                        error={errors.countryIso?.message}
                                                    />
                                                    <FieldError msg={errors.countryIso?.message} />
                                                </div>

                                                {/* State + City */}
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    <div>
                                                        <label className={labelCls}>State *</label>
                                                        <SearchableSelect
                                                            id="stateIso"
                                                            value={selectedStateIso}
                                                            onChange={v => { setValue("stateIso", v); setValue("city", ""); }}
                                                            options={stateOptions}
                                                            placeholder="Select State..."
                                                            disabled={!selectedCountryIso}
                                                            error={errors.stateIso?.message}
                                                        />
                                                        <FieldError msg={errors.stateIso?.message} />
                                                    </div>
                                                    <div>
                                                        <label className={labelCls}>City *</label>
                                                        <SearchableSelect
                                                            id="city"
                                                            value={watch("city")}
                                                            onChange={v => setValue("city", v)}
                                                            options={cityOptions}
                                                            placeholder="Select City..."
                                                            disabled={!selectedStateIso}
                                                            error={errors.city?.message}
                                                        />
                                                        <FieldError msg={errors.city?.message} />
                                                    </div>
                                                </div>

                                                {/* Address */}
                                                <div>
                                                    <label htmlFor="address" className={labelCls}>Address *</label>
                                                    <textarea id="address" {...register("address")} rows={2} placeholder="Street, Area..." className={`${inputCls} resize-none`} />
                                                    <FieldError msg={errors.address?.message} />
                                                </div>

                                                {/* Warning — above checkboxes */}
                                                <div className="flex items-start gap-3 px-4 py-3 rounded-lg bg-red-500/[0.06] border border-red-500/20 text-red-400">
                                                    <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                                    <p className="text-xs leading-relaxed">
                                                        Entry fee is non-refundable. Trading involves financial risk. Please read the terms carefully before proceeding.
                                                    </p>
                                                </div>

                                                <SectionLabel icon={Shield} label="Agreement & Consent" color="text-amber-400" />

                                                <div className="space-y-3 pt-0.5">
                                                    <ConsentCheckbox
                                                        checked={!!riskAccepted}
                                                        onToggle={() => setValue("riskAccepted", !riskAccepted)}
                                                        accentClass="bg-emerald-500/5 border-emerald-500/25"
                                                        checkBgClass="bg-emerald-600 border-emerald-600"
                                                        error={errors.riskAccepted?.message}
                                                    >
                                                        I understand the risk factors and am fully responsible for my trading activity.
                                                    </ConsentCheckbox>

                                                    <ConsentCheckbox
                                                        checked={!!feeAccepted}
                                                        onToggle={() => setValue("feeAccepted", !feeAccepted)}
                                                        accentClass="bg-amber-500/5 border-amber-500/25"
                                                        checkBgClass="bg-amber-500 border-amber-500"
                                                        error={errors.feeAccepted?.message}
                                                    >
                                                        I understand the $100 is an entry fee and is non-refundable.
                                                    </ConsentCheckbox>

                                                    <ConsentCheckbox
                                                        checked={!!termsAccepted}
                                                        onToggle={() => setValue("termsAccepted", !termsAccepted)}
                                                        accentClass="bg-blue-500/5 border-blue-500/25"
                                                        checkBgClass="bg-blue-600 border-blue-600"
                                                        error={errors.termsAccepted?.message}
                                                    >
                                                        I agree to the{" "}
                                                        <button type="button" onClick={openTerms} className="text-blue-400 hover:text-blue-300 underline underline-offset-2 font-semibold transition-colors">
                                                            Terms &amp; Conditions
                                                        </button>
                                                    </ConsentCheckbox>
                                                </div>

                                                {submissionError && <div className="text-red-400 text-sm pt-2">{submissionError}</div>}
                                            </div>
                                        </form>
                                    </div>

                                    {/* Sticky footer */}
                                    <div className="px-5 pb-5 pt-4 border-t border-white/[0.07]">
                                        <motion.button
                                            form="copy-form" type="submit" disabled={isSubmitting}
                                            whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                                            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                                            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-black text-white text-sm shadow-lg shadow-emerald-900/40 disabled:opacity-60 transition-all"
                                            style={{ background: "linear-gradient(135deg, #059669 0%, #0ea5e9 100%)" }}
                                        >
                                            {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" />Submitting…</> : <>Submit Application <ArrowRight className="w-4 h-4" /></>}
                                        </motion.button>
                                    </div>
                                </motion.div>
                            )}

                            {/* ── Success ── */}
                            {step === "success" && (
                                <motion.div key="success" variants={fadeVariants} initial="enter" animate="center" exit="exit"
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                    className="relative z-10 flex flex-col items-center text-center px-8 py-12"
                                >
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 250, damping: 18, delay: 0.1 }}
                                        className="w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mb-6"
                                    >
                                        <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                                    </motion.div>
                                    <h3 className="text-2xl font-black text-white mb-3">Application Submitted!</h3>
                                    <p className="text-slate-400 text-sm max-w-xs">Our team will contact you soon. Get ready for the challenge!</p>
                                    <div className="mt-6 text-xs text-slate-600">This window will close automatically…</div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
