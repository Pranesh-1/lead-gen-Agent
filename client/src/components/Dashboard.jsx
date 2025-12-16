import React, { useState, useEffect } from 'react';
import LeadTable from './LeadTable';
import { RefreshCw, Download, Zap, Users, TrendingUp, Sparkles } from 'lucide-react';

const StatCard = ({ title, value, subtext, icon: Icon, color, trend }) => (
    <div className="relative group overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all hover:bg-white/10 hover:-translate-y-1">
        <div className={`absolute top-0 right-0 -mr-4 -mt-4 h-24 w-24 rounded-full ${color} opacity-20 blur-2xl group-hover:opacity-30 transition-opacity`}></div>
        <div className="p-6 relative z-10">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-400">{title}</p>
                    <p className="text-3xl font-bold text-white mt-1">{value}</p>
                </div>
                <div className={`rounded-xl p-3 ${color} bg-opacity-20 text-white`}>
                    <Icon className="h-6 w-6" />
                </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
                <span className="text-emerald-400 font-medium flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {subtext}
                </span>
                <span className="text-slate-500 ml-2">vs last scan</span>
            </div>
        </div>
    </div>
);

const Dashboard = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchLeads = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8000/leads?count=50');
            const data = await response.json();
            setLeads(data);
        } catch (error) {
            console.error("Failed to fetch leads", error);
        } finally {
            setLoading(false);
        }
    };

    // Simulate scan trigger
    const triggerScan = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8000/scan', { method: 'POST' });
            const result = await response.json();
            setLeads(result.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchLeads();
    }, []);

    const highProbLeads = leads.filter(l => l.score >= 80).length;
    const avgScore = leads.length > 0 ? Math.round(leads.reduce((acc, curr) => acc + curr.score, 0) / leads.length) : 0;

    const exportToCSV = () => {
        if (!leads.length) return;

        const headers = ["Rank", "Score", "Name", "Title", "Company", "Funding", "Person Location", "Company HQ", "Email", "LinkedIn"];
        const rows = leads.map((l, index) => [
            index + 1,
            l.score,
            l.person.name,
            l.person.title,
            l.person.company,
            l.company_meta.funding_stage || "",
            l.person.location_person,
            l.person.location_company,
            l.person.email,
            l.person.linkedin_url || ""
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "qualified_leads.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="min-h-screen">
            {/* Navbar / Top Bar */}
            <nav className="border-b border-white/5 bg-black/20 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-2">
                            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-2 rounded-lg">
                                <Sparkles className="h-5 w-5 text-white" />
                            </div>
                            <span className="font-bold text-xl tracking-tight text-white">Lead<span className="text-violet-400">Gen</span> Agent</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="hidden md:flex items-center gap-2 text-sm text-slate-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                System Operational
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Header Actions */}
                <div className="md:flex md:items-end md:justify-between mb-8">
                    <div className="flex-1 min-w-0">
                        <h2 className="text-3xl font-bold text-white tracking-tight sm:text-4xl">
                            Dashboard
                        </h2>
                        <p className="mt-2 text-slate-400 text-lg">
                            AI-powered ranking for 3D In-Vitro Model prospects.
                        </p>
                    </div>
                    <div className="mt-6 flex gap-3 md:mt-0 md:ml-4">
                        <button
                            onClick={triggerScan}
                            disabled={loading}
                            className="inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-medium text-white ring-1 ring-inset ring-white/10 bg-white/5 hover:bg-white/10 transition-all shadow-lg hover:shadow-xl backdrop-blur-sm disabled:opacity-50"
                        >
                            <RefreshCw className={`-ml-1 mr-2 h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
                            Run Scan
                        </button>
                        <button
                            onClick={exportToCSV}
                            className="inline-flex items-center px-5 py-2.5 rounded-xl border border-transparent text-sm font-medium text-white shadow-sm bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition-all shadow-indigo-500/20 hover:shadow-indigo-500/40"
                        >
                            <Download className="-ml-1 mr-2 h-5 w-5" />
                            Export CSV
                        </button>
                    </div>
                </div>

                {/* KPI Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-10">
                    <StatCard
                        title="Total Verified Leads"
                        value={leads.length}
                        subtext="+12%"
                        icon={Users}
                        color="bg-blue-500"
                    />
                    <StatCard
                        title="High Probability (>80%)"
                        value={highProbLeads}
                        subtext="Top Tier"
                        icon={Zap}
                        color="bg-violet-500"
                    />
                    <StatCard
                        title="Avg Engagement Score"
                        value={avgScore}
                        subtext="Rising"
                        icon={TrendingUp}
                        color="bg-emerald-500"
                    />
                </div>

                {/* Table Section */}
                {loading && leads.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32">
                        <div className="relative">
                            <div className="h-16 w-16 rounded-full border-4 border-white/10 border-t-violet-500 animate-spin"></div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                <Sparkles className="w-6 h-6 text-violet-500 animate-pulse" />
                            </div>
                        </div>
                        <p className="mt-6 text-slate-400 font-medium">Scanning network nodes...</p>
                    </div>
                ) : (
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                        <LeadTable leads={leads} />
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
