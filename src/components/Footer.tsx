import React from 'react';
import { Globe } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tabId: string) => void;
  onOpenContact: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab, onOpenContact }) => {
  return (
    <footer className="bg-slate-100 border-t border-slate-200 mt-20 text-xs text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="font-bold text-slate-900 mb-3 text-xs uppercase tracking-wider">
              Diagnostic Tools
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onSelectTab('troubleshoot')}
                  className="hover:text-[#0067b8] transition-colors"
                >
                  Blue Screen (BSOD) Fixer
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('troubleshoot')}
                  className="hover:text-[#0067b8] transition-colors"
                >
                  Windows Update Repair
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('health')}
                  className="hover:text-[#0067b8] transition-colors"
                >
                  System Health Scanner
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('errors')}
                  className="hover:text-[#0067b8] transition-colors"
                >
                  Hex Error Code Decoder
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-3 text-xs uppercase tracking-wider">
              Hardware & Drivers
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onSelectTab('drivers')}
                  className="hover:text-[#0067b8] transition-colors"
                >
                  Surface Laptop & Pro Firmware
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('drivers')}
                  className="hover:text-[#0067b8] transition-colors"
                >
                  Intel Wireless & Bluetooth
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('drivers')}
                  className="hover:text-[#0067b8] transition-colors"
                >
                  NVIDIA & AMD GPU Drivers
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('drivers')}
                  className="hover:text-[#0067b8] transition-colors"
                >
                  Realtek High Definition Audio
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-3 text-xs uppercase tracking-wider">
              Popular Resources
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onSelectTab('knowledge')}
                  className="hover:text-[#0067b8] transition-colors"
                >
                  BitLocker Recovery Keys
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('knowledge')}
                  className="hover:text-[#0067b8] transition-colors"
                >
                  Clean Install Media Tool
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('knowledge')}
                  className="hover:text-[#0067b8] transition-colors"
                >
                  Windows 11 24H2 Requirements
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('knowledge')}
                  className="hover:text-[#0067b8] transition-colors"
                >
                  System Restore Points Guide
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-3 text-xs uppercase tracking-wider">
              Customer Support
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={onOpenContact}
                  className="hover:text-[#0067b8] transition-colors"
                >
                  Contact Helpdesk Engineer
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenContact}
                  className="hover:text-[#0067b8] transition-colors"
                >
                  Check Service Request Status
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('health')}
                  className="hover:text-[#0067b8] transition-colors"
                >
                  Download Diagnostic Logs
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-700">
            <Globe className="w-4 h-4 text-slate-500" />
            <span className="font-medium">English (United States)</span>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-slate-500">
            <button
              onClick={onOpenContact}
              className="hover:text-slate-900 transition-colors"
            >
              Contact Microsoft
            </button>
            <span>·</span>
            <span className="hover:text-slate-900 transition-colors cursor-pointer">
              Privacy & Cookies
            </span>
            <span>·</span>
            <span className="hover:text-slate-900 transition-colors cursor-pointer">
              Terms of Use
            </span>
            <span>·</span>
            <span className="hover:text-slate-900 transition-colors cursor-pointer">
              Trademarks
            </span>
            <span>·</span>
            <span>© 2026 Microsoft Corporation</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
