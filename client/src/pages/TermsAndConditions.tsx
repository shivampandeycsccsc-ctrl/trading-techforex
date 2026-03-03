import { motion } from "framer-motion";
import { Shield, AlertTriangle, FileText, DollarSign, RefreshCw, Scale, Info, ChevronRight } from "lucide-react";

const sections = [
    {
        id: "entry-fee",
        icon: DollarSign,
        iconColor: "text-amber-400",
        iconBg: "bg-amber-500/10 border-amber-500/20",
        title: "1. Entry Fee — Not an Investment",
        content: [
            "The $100 (USD) participation fee charged for enrollment in the TechForex Copy Trading Challenge is strictly an ENTRY FEE. It is not an investment, deposit, or capital contribution of any kind.",
            "Payment of the entry fee does not entitle the participant to any form of profit, return on capital, guaranteed income, or financial benefit.",
            "The entry fee is collected solely for administrative processing, platform access, challenge management, and operational costs associated with running the Copy Trading Challenge.",
            "TechForex is not a fund manager, investment advisor, or registered financial institution. No investment contract is formed upon payment of the entry fee.",
        ],
    },
    {
        id: "no-refund",
        icon: RefreshCw,
        iconColor: "text-red-400",
        iconBg: "bg-red-500/10 border-red-500/20",
        title: "2. No Refund Policy",
        content: [
            "All entry fees paid for the TechForex Copy Trading Challenge are strictly non-refundable under all circumstances, including but not limited to:",
            "• Voluntary withdrawal from the challenge at any stage after registration.",
            "• Failure to meet challenge objectives or performance targets.",
            "• Technical issues, connectivity failures, or force majeure events beyond the control of TechForex.",
            "• Disqualification due to violation of challenge rules or terms.",
            "• Personal, financial, or medical circumstances of the participant.",
            "By submitting the registration form and completing payment, the participant irrevocably agrees to this no-refund policy.",
        ],
    },
    {
        id: "risk",
        icon: AlertTriangle,
        iconColor: "text-orange-400",
        iconBg: "bg-orange-500/10 border-orange-500/20",
        title: "3. Trading Risk Disclosure",
        content: [
            "Trading in Forex, commodities, indices, cryptocurrency, and other financial instruments carries a substantial risk of loss and may not be suitable for all individuals.",
            "Leverage and margin trading amplify both profits and losses. Participants may lose more than their initial capital in live trading environments.",
            "Past performance of any trading strategy, mentor, signal, or challenge participant does not guarantee or imply future results.",
            "Market volatility, geopolitical events, economic announcements, and liquidity conditions can result in unexpected losses.",
            "Participants should only engage in trading with capital they can afford to lose entirely, and are strongly advised to seek independent financial advice before participating.",
        ],
    },
    {
        id: "liability",
        icon: Shield,
        iconColor: "text-blue-400",
        iconBg: "bg-blue-500/10 border-blue-500/20",
        title: "4. Limitation of Liability",
        content: [
            "TechForex, its directors, officers, employees, affiliates, partners, and representatives shall not be held liable for any direct, indirect, incidental, special, consequential, or exemplary damages arising from:",
            "• Any trading losses incurred by the participant during or after the challenge.",
            "• Decisions made by the participant based on challenge education, mentorship, or copy trading signals.",
            "• Errors, omissions, interruptions, or delays in the platform or challenge operations.",
            "• Unauthorized access to participant accounts or data breaches beyond TechForex's reasonable control.",
            "TechForex's total liability in any matter, regardless of the cause or nature of the claim, shall not exceed the amount of the entry fee paid by the participant.",
        ],
    },
    {
        id: "responsibility",
        icon: Scale,
        iconColor: "text-emerald-400",
        iconBg: "bg-emerald-500/10 border-emerald-500/20",
        title: "5. Participant's Full Responsibility",
        content: [
            "By enrolling in the TechForex Copy Trading Challenge, the participant acknowledges and agrees that:",
            "• They are solely and fully responsible for all financial decisions, trades executed, and outcomes resulting from their participation.",
            "• They have read, understood, and agreed to all terms and conditions prior to registration.",
            "• They are of legal age (18 years or older) and legally permitted to participate in trading activities in their jurisdiction.",
            "• They will not hold TechForex, its team, mentors, or partners responsible for any personal financial losses, including losses incurred following advice, signals, or strategies provided during the challenge.",
            "• They are aware that copy trading results can vary significantly between accounts due to execution speed, slippage, brokerage conditions, and other factors.",
        ],
    },
    {
        id: "modifications",
        icon: Info,
        iconColor: "text-purple-400",
        iconBg: "bg-purple-500/10 border-purple-500/20",
        title: "6. Platform Right to Modify Rules",
        content: [
            "TechForex reserves the exclusive right to modify, amend, suspend, or terminate any aspect of the Copy Trading Challenge at any time, with or without prior notice, including:",
            "• Challenge rules, objectives, evaluation criteria, and performance benchmarks.",
            "• Prize structure, reward mechanisms, and challenge duration.",
            "• Eligibility requirements and participation terms.",
            "• Platform features, tools, and educational resources provided during the challenge.",
            "Any modifications will be communicated through official TechForex channels. Continued participation following any modification constitutes acceptance of the updated terms.",
        ],
    },
    {
        id: "general",
        icon: FileText,
        iconColor: "text-cyan-400",
        iconBg: "bg-cyan-500/10 border-cyan-500/20",
        title: "7. General Terms",
        content: [
            "These Terms & Conditions constitute the entire agreement between TechForex and the participant with respect to the Copy Trading Challenge.",
            "If any provision of these Terms is held to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.",
            "TechForex reserves the right to disqualify any participant found to be engaging in fraudulent activity, market manipulation, or violation of these Terms.",
            "These Terms shall be governed by and construed in accordance with applicable laws. Any disputes arising from these Terms shall be resolved through arbitration.",
            "By completing the registration form, the participant confirms they have read, understood, and fully accepted all Terms & Conditions stated herein.",
        ],
    },
];

export default function TermsAndConditions() {
    return (
        <div className="min-h-screen bg-[#060e18] text-white">
            {/* Hero Banner */}
            <div className="relative overflow-hidden bg-gradient-to-b from-[#0b1623] to-[#060e18] border-b border-white/[0.06]">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
                    <div className="absolute -top-40 left-1/4 w-96 h-96 bg-emerald-600/5 rounded-full blur-[120px]" />
                    <div className="absolute -top-40 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-[120px]" />
                </div>
                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-6">
                            <Shield className="w-3.5 h-3.5" />
                            Legal Document
                        </div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 leading-tight">
                            Terms &{" "}
                            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                                Conditions
                            </span>
                        </h1>
                        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                            Copy Trading Challenge — Participant Agreement
                        </p>
                        <p className="text-slate-600 text-xs mt-4">
                            Last updated: March 2026 &nbsp;·&nbsp; Effective immediately upon registration
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Important Notice Banner */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="flex items-start gap-4 p-5 rounded-2xl bg-amber-500/[0.07] border border-amber-500/25"
                >
                    <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-amber-300 font-bold text-sm mb-1">Important Notice</p>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Please read these Terms & Conditions carefully before registering for the TechForex Copy Trading
                            Challenge. By completing registration and payment, you confirm that you have read, understood, and
                            agree to all terms stated below. The $100 entry fee is <strong className="text-white">non-refundable</strong>{" "}
                            and does <strong className="text-white">not</strong> constitute an investment.
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Sections */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
                {sections.map((section, idx) => {
                    const Icon = section.icon;
                    return (
                        <motion.div
                            key={section.id}
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 + idx * 0.07 }}
                            className="rounded-2xl bg-white/[0.03] border border-white/[0.07] overflow-hidden hover:border-white/[0.12] transition-colors"
                        >
                            {/* Section Header */}
                            <div className="flex items-center gap-4 px-6 py-5 border-b border-white/[0.06]">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${section.iconBg}`}>
                                    <Icon className={`w-5 h-5 ${section.iconColor}`} />
                                </div>
                                <h2 className="text-base sm:text-lg font-bold text-white">{section.title}</h2>
                            </div>
                            {/* Section Body */}
                            <div className="px-6 py-5 space-y-3">
                                {section.content.map((para, i) => (
                                    <div key={i} className="flex items-start gap-2.5">
                                        {!para.startsWith("•") && (
                                            <ChevronRight className="w-3.5 h-3.5 text-slate-600 flex-shrink-0 mt-1" />
                                        )}
                                        <p
                                            className={`text-slate-400 text-sm leading-relaxed ${para.startsWith("•") ? "pl-4" : ""}`}
                                        >
                                            {para}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    );
                })}

                {/* Footer Agreement */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    className="rounded-2xl p-6 text-center"
                    style={{ background: "linear-gradient(135deg, rgba(5,150,105,0.08) 0%, rgba(14,165,233,0.08) 100%)", border: "1px solid rgba(5,150,105,0.2)" }}
                >
                    <Shield className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
                    <p className="text-white font-bold text-base mb-2">Agreement Acknowledgement</p>
                    <p className="text-slate-400 text-sm leading-relaxed max-w-lg mx-auto">
                        By registering for the TechForex Copy Trading Challenge, you confirm that you are 18 years of age or
                        older, have read and understood these Terms & Conditions in their entirety, and agree to be bound by
                        them.
                    </p>
                    <p className="text-slate-600 text-xs mt-4">
                        For queries, contact us through the official TechForex contact page.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
