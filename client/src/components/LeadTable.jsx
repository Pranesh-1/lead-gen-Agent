import React, { useState, useMemo } from 'react';
import { ArrowUpDown, Search, MapPin, Building2, User, FileText, FlaskConical, ExternalLink } from 'lucide-react';

const LeadTable = ({ leads }) => {
    const [sortConfig, setSortConfig] = useState({ key: 'score', direction: 'desc' });
    const [filterText, setFilterText] = useState('');

    const sortedLeads = useMemo(() => {
        let sortableLeads = [...leads];
        if (filterText) {
            sortableLeads = sortableLeads.filter(lead =>
                lead.person.name.toLowerCase().includes(filterText.toLowerCase()) ||
                lead.person.title.toLowerCase().includes(filterText.toLowerCase()) ||
                lead.person.company.toLowerCase().includes(filterText.toLowerCase()) ||
                lead.person.location_person.toLowerCase().includes(filterText.toLowerCase())
            );
        }
        if (sortConfig.key) {
            sortableLeads.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableLeads;
    }, [leads, sortConfig, filterText]);

    const requestSort = (key) => {
        let direction = 'desc';
        if (sortConfig.key === key && sortConfig.direction === 'desc') {
            direction = 'asc';
        }
        setSortConfig({ key, direction });
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10 shadow-[0_0_10px_rgba(16,185,129,0.2)]';
        if (score >= 50) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
        return 'text-slate-400 border-slate-500/30 bg-slate-500/10';
    };

    return (
        <div>
            {/* Table Controls */}
            <div className="p-6 border-b border-white/10 flex flex-col md:flex-row gap-4 justify-between items-center bg-white/[0.02]">
                <div>
                    <h3 className="text-lg font-semibold text-white">Candidates</h3>
                </div>

                <div className="relative w-full md:w-96 group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-slate-400 group-focus-within:text-violet-400 transition-colors" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2.5 border border-white/10 rounded-xl bg-black/20 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-transparent sm:text-sm transition-all shadow-inner"
                        placeholder="Search candidates..."
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                    <thead className="bg-white/[0.02]">
                        <tr>
                            <th scope="col" className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors" onClick={() => requestSort('score')}>
                                <div className="flex items-center gap-2">
                                    Prob
                                    <ArrowUpDown className="w-3 h-3" />
                                </div>
                            </th>
                            <th scope="col" className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Candidate</th>
                            <th scope="col" className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Role & Company</th>
                            <th scope="col" className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Location</th>
                            <th scope="col" className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Signals</th>
                            <th scope="col" className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {sortedLeads.map((lead) => (
                            <tr key={lead.person.id} className="hover:bg-white/[0.03] transition-colors group">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className={`inline-flex items-center justify-center w-12 h-8 rounded-lg text-sm font-bold border ${getScoreColor(lead.score)}`}>
                                        {lead.score}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-500/20 ring-2 ring-black/20">
                                                {lead.person.name.charAt(0)}
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-white group-hover:text-violet-300 transition-colors">{lead.person.name}</div>
                                            <div className="text-xs text-slate-500">{lead.person.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-slate-300">{lead.person.title}</div>
                                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                                        <Building2 className="w-3 h-3" />
                                        {lead.person.company}
                                        {lead.company_meta.funding_stage && (
                                            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border ${lead.company_meta.funding_stage === 'Series B' || lead.company_meta.funding_stage === 'Series A'
                                                    ? 'bg-violet-500/10 text-violet-400 border-violet-500/20'
                                                    : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                                                }`}>
                                                {lead.company_meta.funding_stage}
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-slate-400 flex items-center gap-1.5">
                                        <MapPin className="w-3.5 h-3.5 opacity-70" />
                                        {lead.person.location_person}
                                    </div>
                                    {lead.person.location_person !== lead.person.location_company && (
                                        <div className="text-[11px] text-slate-600 mt-1 ml-5">
                                            HQ: {lead.person.location_company}
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-wrap gap-1.5">
                                        {lead.rank_reasons.slice(0, 2).map((reason, idx) => (
                                            <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-white/5 text-slate-300 border border-white/10">
                                                {reason.split('(')[0]} {/* Truncate score text for cleaner look */}
                                            </span>
                                        ))}
                                        {lead.rank_reasons.length > 2 && (
                                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-white/5 text-slate-500">
                                                +{lead.rank_reasons.length - 2}
                                            </span>
                                        )}
                                        {lead.person_meta.has_recent_paper && (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-[0_0_8px_rgba(168,85,247,0.1)]" title={lead.person_meta.paper_title}>
                                                <FileText className="w-3 h-3 mr-1" /> Published
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex items-center justify-end gap-3">
                                        {lead.person.linkedin_url && (
                                            <a href={lead.person.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-400 transition-colors">
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                        )}
                                        <button className="text-violet-400 hover:text-violet-300 font-medium hover:underline">
                                            Contact
                                        </button>

                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="px-6 py-4 border-t border-white/10 bg-white/[0.02]">
                <div className="text-xs text-slate-500">
                    Showing top <span className="font-medium text-slate-300">{sortedLeads.length}</span> qualified prospects
                </div>
            </div>
        </div>
    );
};

export default LeadTable;
