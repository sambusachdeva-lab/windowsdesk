import React, { useState } from 'react';
import { 
  Download, 
  Terminal, 
  Copy, 
  Check, 
  Laptop, 
  Cpu, 
  Wifi, 
  Volume2, 
  SlidersHorizontal, 
  ShieldCheck,
  FileCheck2,
  ExternalLink 
} from 'lucide-react';
import { DRIVER_CATALOG } from '../data/supportData';
import { DriverItem } from '../types/support';

export const DriverCatalog: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedOS, setSelectedOS] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedWingetId, setCopiedWingetId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadCompleteId, setDownloadCompleteId] = useState<string | null>(null);

  const categories = ['All', 'Surface Firmware', 'Graphics', 'Network', 'Audio', 'Chipset'];
  const osOptions = ['All', 'Windows 11 (24H2 / 23H2)', 'Windows 10 / 11', 'Windows 11 (ARM64)'];

  const filteredDrivers = DRIVER_CATALOG.filter((drv) => {
    const matchesCat = selectedCategory === 'All' || drv.category === selectedCategory;
    const matchesOS = selectedOS === 'All' || drv.os === selectedOS;
    const matchesSearch =
      drv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drv.deviceModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drv.version.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesOS && matchesSearch;
  });

  const handleCopyWinget = (wingetId: string) => {
    const command = `winget install --id ${wingetId} -e --accept-package-agreements --accept-source-agreements`;
    navigator.clipboard.writeText(command);
    setCopiedWingetId(wingetId);
    setTimeout(() => setCopiedWingetId(null), 2000);
  };

  const handleSimulateDownload = (id: string, name: string) => {
    setDownloadingId(id);
    setTimeout(() => {
      setDownloadingId(null);
      setDownloadCompleteId(id);
      setTimeout(() => setDownloadCompleteId(null), 3000);
    }, 1500);
  };

  return (
    <div className="space-y-8">
      {/* Driver Spotlight Banner */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          <div className="p-6 sm:p-8 lg:col-span-7">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#0067b8] uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Microsoft Hardware WHQL Certified Drivers</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Drivers, Firmware & BIOS Updates
            </h2>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed max-w-xl">
              Download certified drivers for Surface devices, Intel Core, AMD Ryzen, NVIDIA RTX, and Qualcomm Snapdragon X Elite PCs. All packages are cryptographically signed.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <FileCheck2 className="w-4 h-4 text-emerald-600" /> Windows Hardware Lab Kit Tested
              </span>
              <span aria-hidden="true">·</span>
              <span>SHA256 Verification Available</span>
            </div>
          </div>

          <div className="lg:col-span-5 h-48 lg:h-full relative overflow-hidden bg-slate-100">
            <img
              src="/src/assets/images/surface_laptop_support_1792021386182.jpg"
              alt="Surface Laptop running driver diagnostic verification"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent lg:block hidden" />
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search & OS Dropdown */}
        <div className="flex items-center gap-3">
          <select
            value={selectedOS}
            onChange={(e) => setSelectedOS(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 text-slate-700 focus:outline-none focus:border-[#0067b8]"
          >
            {osOptions.map((os) => (
              <option key={os} value={os}>
                {os === 'All' ? 'All Operating Systems' : os}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search driver by model..."
            className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:border-[#0067b8] w-48"
          />
        </div>
      </div>

      {/* Driver List */}
      <div className="space-y-3">
        {filteredDrivers.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl border border-slate-200 text-slate-500 text-sm">
            No driver packages match your current filter settings.
          </div>
        ) : (
          filteredDrivers.map((drv) => (
            <div
              key={drv.id}
              className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 hover:border-slate-300 transition-all shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              {/* Left Info */}
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="font-semibold text-slate-900">{drv.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{drv.os}</span>
                  <span aria-hidden="true">·</span>
                  <span>Released {drv.releaseDate}</span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 truncate">
                  {drv.name}
                </h3>

                <div className="text-xs text-slate-600">
                  Supported Hardware: <span className="font-medium text-slate-800">{drv.deviceModel}</span>
                </div>

                <div className="flex items-center gap-3 pt-1 text-xs font-mono text-slate-500">
                  <span>Version: <strong className="text-slate-800">{drv.version}</strong></span>
                  <span>Size: <strong className="text-slate-800">{drv.size}</strong></span>
                  <span className="hidden sm:inline truncate max-w-xs text-slate-400">
                    SHA256: {drv.checksum.substring(0, 16)}...
                  </span>
                </div>
              </div>

              {/* Right Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                {drv.wingetId && (
                  <button
                    onClick={() => handleCopyWinget(drv.wingetId!)}
                    title="Copy Winget package manager install command"
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors border border-slate-200"
                  >
                    {copiedWingetId === drv.wingetId ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Command Copied</span>
                      </>
                    ) : (
                      <>
                        <Terminal className="w-3.5 h-3.5" />
                        <span>Copy Winget</span>
                      </>
                    )}
                  </button>
                )}

                <button
                  onClick={() => handleSimulateDownload(drv.id, drv.name)}
                  disabled={downloadingId === drv.id}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-[#0067b8] hover:bg-[#005a9e] text-white rounded-lg transition-colors shadow-xs"
                >
                  {downloadingId === drv.id ? (
                    <span>Downloading Package...</span>
                  ) : downloadCompleteId === drv.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-white" />
                      <span>Package Ready</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Package</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
