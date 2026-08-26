import React from 'react';
import { BookOpen, Award, CheckCircle2, HeartPulse, ShieldCheck, ExternalLink, HelpCircle } from 'lucide-react';
import { RESEARCH_PAPERS, SYSTEM_LIMITATIONS_COMPARISON, SDG_ALIGNMENT } from '../data/researchData';

export const ResearchSDGView: React.FC = () => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-medium border border-emerald-500/30">
            <Award className="w-3.5 h-3.5" /> Academic Evaluation & SDG Alignment
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
            Research Foundation & UN SDG Alignment
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            NutriSwasth AI bridges the gap between theoretical AI nutrition research (AINR) and real-world cultural adaptation for the Indian population.
          </p>
        </div>
      </div>

      {/* College Rubric Compliance Grid */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <h2 className="text-base font-bold text-slate-900 font-display">Academic Evaluation Rubric Compliance</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/60 space-y-1">
            <div className="text-xs font-bold text-emerald-900">1. Problem Domain</div>
            <p className="text-[11px] text-slate-600 leading-snug">
              Identifies dietary gap in India (lifestyle diseases, Western bias in diet apps).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/60 space-y-1">
            <div className="text-xs font-bold text-emerald-900">2. Research Depth</div>
            <p className="text-[11px] text-slate-600 leading-snug">
              Supported by 7 peer-reviewed papers (Frontiers in Nutrition, IEEE, etc.).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/60 space-y-1">
            <div className="text-xs font-bold text-emerald-900">3. Solution Originality</div>
            <p className="text-[11px] text-slate-600 leading-snug">
              Adapts AINR with Indian regional foods, routine context & lifestyle risk support.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/60 space-y-1">
            <div className="text-xs font-bold text-emerald-900">4. Software Quality</div>
            <p className="text-[11px] text-slate-600 leading-snug">
              Full-stack Express + React application with Gemini AI & speech voice integration.
            </p>
          </div>
        </div>
      </div>

      {/* Global AINR vs NutriSwasth AI Comparison Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 font-display">Section 5: Limitations of Reference System vs NutriSwasth AI</h2>
          <p className="text-xs text-slate-500">Why NutriSwasth AI is significantly superior for Indian users</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="p-3 font-bold text-slate-700">Dimension</th>
                <th className="p-3 font-bold text-slate-500">Reference Global AINR System</th>
                <th className="p-3 font-bold text-emerald-800 bg-emerald-50/80">NutriSwasth AI (Proposed)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {SYSTEM_LIMITATIONS_COMPARISON.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="p-3 font-semibold text-slate-900">{row.dimension}</td>
                  <td className="p-3 text-slate-500">{row.globalAINR}</td>
                  <td className="p-3 text-emerald-900 font-medium bg-emerald-50/30">{row.nutriSwasthAI}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Literature References List */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-600" />
          <h2 className="text-lg font-bold text-slate-900 font-display">Section 4: Supporting Academic Literature</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {RESEARCH_PAPERS.map((paper, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-400 font-mono text-[11px]">
                <span>{paper.authors}</span>
                <span>({paper.year})</span>
              </div>
              <h3 className="font-bold text-slate-800 text-xs leading-snug">"{paper.title}"</h3>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                <strong className="text-emerald-800">Key Takeaway: </strong>
                {paper.contribution}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* UN Sustainable Development Goals (SDG Alignment) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 font-display">Section 9: UN SDG Relevance</h2>
          <p className="text-xs text-slate-500">Addressing global sustainability targets through digital health innovation in India</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SDG_ALIGNMENT.map((sdg) => (
            <div
              key={sdg.sdgNumber}
              className="p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div
                  className="w-12 h-12 rounded-2xl text-white font-bold text-lg flex items-center justify-center shadow-md"
                  style={{ backgroundColor: sdg.color }}
                >
                  SDG {sdg.sdgNumber}
                </div>
                <h3 className="text-base font-bold text-slate-900 font-display">{sdg.sdgTitle}</h3>

                <ul className="space-y-2 text-xs text-slate-600">
                  {sdg.impactPoints.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
