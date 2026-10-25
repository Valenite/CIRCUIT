import React from 'react';
import type { CircuitComponent } from '../types/circuit';
import { COMPONENT_TEMPLATES } from '../constants/components';
import { X, Download } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  components: CircuitComponent[];
}

export const BomModal: React.FC<Props> = ({ isOpen, onClose, components }) => {
  if (!isOpen) return null;

  // Group by type and value
  const grouped: Record<
    string,
    {
      title: string;
      category: string;
      value: string;
      count: number;
      designators: string[];
    }
  > = {};

  components.forEach((c) => {
    const tmpl = COMPONENT_TEMPLATES[c.type];
    let val = '-';
    if (c.type === 'resistor') val = `${c.properties.resistance || 220} Ω`;
    else if (c.type === 'potentiometer') val = `${c.properties.resistance || 10000} Ω`;
    else if (c.type === 'battery_9v' || c.type === 'battery_dc') val = `${c.properties.voltage || 9} V`;
    else if (c.type === 'led') val = `${c.properties.ledColor || 'Red'}`;

    const key = `${c.type}_${val}`;
    if (!grouped[key]) {
      grouped[key] = {
        title: tmpl.title,
        category: tmpl.category,
        value: val,
        count: 0,
        designators: [],
      };
    }
    grouped[key].count += 1;
    grouped[key].designators.push(c.name || c.id);
  });

  const items = Object.values(grouped);

  const exportCsv = () => {
    const headers = 'Item,Component,Category,Value/Spec,Quantity,Designators\n';
    const rows = items
      .map(
        (it, idx) =>
          `"${idx + 1}","${it.title}","${it.category}","${it.value}","${it.count}","${it.designators.join('; ')}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'circuitcraft-bom.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div>
            <h2 className="text-base font-bold text-white">Bill of Materials (BOM)</h2>
            <p className="text-xs text-slate-400">Component inventory list and specifications</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-sm">
              Your circuit is empty. Add components to view the Bill of Materials.
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase font-semibold">
                  <th className="pb-3 px-2">#</th>
                  <th className="pb-3 px-2">Component</th>
                  <th className="pb-3 px-2">Category</th>
                  <th className="pb-3 px-2">Value / Spec</th>
                  <th className="pb-3 px-2 text-center">Qty</th>
                  <th className="pb-3 px-2">Designators</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {items.map((it, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 text-slate-200">
                    <td className="py-2.5 px-2 text-slate-500">{idx + 1}</td>
                    <td className="py-2.5 px-2 font-medium text-white">{it.title}</td>
                    <td className="py-2.5 px-2 text-slate-400">{it.category}</td>
                    <td className="py-2.5 px-2 font-mono text-sky-400">{it.value}</td>
                    <td className="py-2.5 px-2 text-center font-bold">{it.count}</td>
                    <td className="py-2.5 px-2 text-slate-400 font-mono text-[11px]">
                      {it.designators.join(', ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Total Unique Parts: {items.length} | Total Count: {components.length}
          </span>
          <div className="flex space-x-2">
            <button
              onClick={exportCsv}
              disabled={items.length === 0}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-md transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
