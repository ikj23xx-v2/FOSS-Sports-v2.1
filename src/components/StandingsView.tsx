import React from 'react';
import { StandingsEntry } from '../types';

interface StandingsViewProps {
  leagueName: string;
  entries: StandingsEntry[];
}

export const StandingsView: React.FC<StandingsViewProps> = ({
  leagueName,
  entries,
}) => {
  if (!entries || entries.length === 0) {
    return (
      <div className="py-12 text-center text-neutral-400 text-sm">
        No standings available for {leagueName} at this time.
      </div>
    );
  }

  // Group by conference/division if available
  const conferences = Array.from(new Set(entries.map((e) => e.conference || 'Overall')));

  return (
    <div className="space-y-6">
      {conferences.map((conf) => {
        const confEntries = entries.filter((e) => (e.conference || 'Overall') === conf);

        return (
          <div
            key={conf}
            className="bg-[#161618] border border-[#2A2A2E] rounded-[22px] overflow-hidden shadow-sm"
          >
            <div className="px-5 py-3 border-b border-[#2A2A2E] bg-black/40 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white font-display">
                {conf} Standings
              </h3>
              <span className="text-xs text-neutral-400 uppercase tracking-wider font-mono">
                {leagueName}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-[#2A2A2E] text-neutral-400 uppercase tracking-wider text-[10px] font-semibold">
                    <th className="py-2.5 px-4 w-12 text-center">#</th>
                    <th className="py-2.5 px-4">Club</th>
                    <th className="py-2.5 px-3 text-right">W</th>
                    <th className="py-2.5 px-3 text-right">L</th>
                    <th className="py-2.5 px-3 text-right font-mono">PCT</th>
                    <th className="py-2.5 px-3 text-right font-mono">GB</th>
                    <th className="py-2.5 px-4 text-right">STRK</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60 font-mono text-neutral-200">
                  {confEntries.map((row) => (
                    <tr
                      key={row.team.id}
                      className="hover:bg-neutral-800/40 transition-colors"
                    >
                      <td className="py-3 px-4 text-center font-bold text-neutral-400">
                        {row.rank}
                      </td>
                      <td className="py-3 px-4 font-sans font-semibold text-white">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={row.team.logo}
                            alt={row.team.name}
                            className="w-5 h-5 object-contain"
                          />
                          <span className="truncate">{row.team.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-white">
                        {row.wins}
                      </td>
                      <td className="py-3 px-3 text-right text-neutral-400">
                        {row.losses}
                      </td>
                      <td className="py-3 px-3 text-right text-neutral-300">
                        {row.winPct}
                      </td>
                      <td className="py-3 px-3 text-right text-neutral-400">
                        {row.gamesBack}
                      </td>
                      <td className="py-3 px-4 text-right text-emerald-400 font-bold">
                        {row.streak}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
};
