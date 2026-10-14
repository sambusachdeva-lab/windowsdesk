import { ErrorCodeInfo, TroubleshootFlow, DriverItem, KnowledgeArticle } from '../types/support';

export const ERROR_CODES: ErrorCodeInfo[] = [
  {
    code: '0x80070005',
    name: 'ERROR_ACCESS_DENIED',
    category: 'Update',
    subsystem: 'Win32 / Component Based Servicing (CBS)',
    summary: 'Windows Update or an application installer does not have the required filesystem or registry permissions to write required files.',
    commonCauses: [
      'Third-party antivirus or endpoint security software locking system directories',
      'Corrupted Windows Update SoftwareDistribution cache permissions',
      'User account lacking local administrator privileges'
    ],
    recommendedCommand: 'net stop wuauserv && net stop bits && ren %systemroot%\\SoftwareDistribution SoftwareDistribution.bak && net start wuauserv',
    commandType: 'cmd',
    steps: [
      'Open Start, type "cmd", right-click Command Prompt and choose "Run as administrator".',
      'Temporarily disable third-party antivirus shields or firewalls during the update window.',
      'Run the SoftwareDistribution cache reset command above to rebuild update files.',
      'Execute "sfc /scannow" to restore default permissions across system binaries.'
    ]
  },
  {
    code: '0x80244018',
    name: 'WU_E_PT_HTTP_STATUS_FORBIDDEN',
    category: 'Update',
    subsystem: 'Windows Update Client / HTTP Transport',
    summary: 'The Windows Update client encountered an HTTP 403 Forbidden response when attempting to download update payloads from Microsoft CDN servers.',
    commonCauses: [
      'VPN client or corporate proxy server intercepting Microsoft update domains',
      'Incorrect DNS server failing to resolve Microsoft download endpoints',
      'Metered connection settings or corrupted firewall rules'
    ],
    recommendedCommand: 'netsh winhttp reset proxy && ipconfig /flushdns',
    commandType: 'cmd',
    steps: [
      'Disconnect from active third-party VPNs or Tor client proxies.',
      'Open elevated Command Prompt and execute the WinHTTP proxy reset command.',
      'Check Date & Time settings: Ensure "Set time automatically" is enabled.',
      'Restart the Windows Update service via "services.msc".'
    ]
  },
  {
    code: '0x800f081f',
    name: 'CBS_E_SOURCE_NOT_FOUND',
    category: 'Update',
    subsystem: 'Component Based Servicing (CBS) / DISM',
    summary: 'The source files required to complete the installation or component repair were not found in the local side-by-side (WinSxS) repository.',
    commonCauses: [
      'Corrupted Windows Component Store from abrupt reboot or disk full state',
      '.NET Framework 3.5 feature installation missing offline installation media',
      'Mismatch between installed cumulative update package and staging files'
    ],
    recommendedCommand: 'DISM /Online /Cleanup-Image /RestoreHealth',
    commandType: 'cmd',
    steps: [
      'Launch Command Prompt as Administrator.',
      'Execute the DISM RestoreHealth command to fetch clean binary payloads from Windows Update servers.',
      'Once complete, run "sfc /scannow" to verify complete system integrity.',
      'Reboot the system and retry your Windows Update or feature installation.'
    ]
  },
  {
    code: 'CRITICAL_PROCESS_DIED',
    name: 'Stop Code 0x000000EF',
    category: 'BSOD / Kernel',
    subsystem: 'Windows NT Kernel Execution Environment',
    summary: 'A critical system execution thread or process (such as csrss.exe, wininit.exe, or svchost.exe) terminated abruptly without handling exceptions.',
    commonCauses: [
      'Corrupt device drivers hooking low-level kernel routines',
      'Storage drive hardware defects or bad sectors on the primary OS volume',
      'RAM stability failures or incompatible memory timing profiles (XMP/EXPO)'
    ],
    recommendedCommand: 'chkdsk C: /f /r',
    commandType: 'cmd',
    steps: [
      'Boot into Windows Recovery Environment (WinRE) by holding Shift while selecting Restart.',
      'Select Troubleshoot > Advanced options > Startup Settings, then boot into Safe Mode with Networking.',
      'Run the disk check command (chkdsk) to repair bad storage clusters.',
      'Inspect minidump files in C:\\Windows\\Minidump using WinDbg or BlueScreenView.'
    ]
  },
  {
    code: 'IRQL_NOT_LESS_OR_EQUAL',
    name: 'Stop Code 0x0000000A',
    category: 'BSOD / Kernel',
    subsystem: 'Memory Manager / Interrupt Request Level',
    summary: 'Kernel-mode process attempted to access pageable memory at an elevated Interrupt Request Level (IRQL), typically triggered by faulty device drivers.',
    commonCauses: [
      'Outdated or corrupted third-party drivers (audio, Wi-Fi, graphics, or anti-cheat)',
      'Defective physical RAM stick or unseated memory module',
      'Aggressive CPU or memory overclocking'
    ],
    recommendedCommand: 'mdsched.exe',
    commandType: 'cmd',
    steps: [
      'Press Windows Key + R, type "mdsched.exe", and select "Restart now and check for problems".',
      'Allow Windows Memory Diagnostic to complete both test passes without interruption.',
      'Update chipset and storage controller drivers from your motherboard manufacturer.',
      'If error references a specific .sys file (e.g. nvlddmkm.sys), reinstall the corresponding driver.'
    ]
  },
  {
    code: 'WHEA_UNCORRECTABLE_ERROR',
    name: 'Stop Code 0x00000124',
    category: 'BSOD / Kernel',
    subsystem: 'Windows Hardware Error Architecture (WHEA)',
    summary: 'A fatal uncorrectable hardware error occurred, detected directly by CPU Machine Check Architecture (MCA) or PCIe controller.',
    commonCauses: [
      'CPU voltage instability, insufficient vCore, or thermal throttling exceeding safety bounds',
      'Failing NVMe SSD or damaged M.2 slot connection',
      'Outdated motherboard UEFI/BIOS firmware lacking microcode stability patches'
    ],
    steps: [
      'Check system temperatures: ensure CPU cooler is properly seated and fans are spinning.',
      'Enter BIOS/UEFI on startup and restore Optimized Defaults to clear unstable overclocks.',
      'Flash motherboard to the latest stable BIOS revision from the manufacturer website.',
      'Reseat PCIe expansion cards, RAM sticks, and NVMe drives firmly.'
    ]
  },
  {
    code: '0x803fa067',
    name: 'SL_E_PRODUCT_KEY_MISMATCH',
    category: 'Activation',
    subsystem: 'Software Licensing Service (SLS)',
    summary: 'The digital license or 25-character product key entered is incompatible with the currently installed edition of Windows (e.g., Home to Pro upgrade).',
    commonCauses: [
      'Attempting to upgrade from Windows 11 Home to Pro using an OEM key rather than Retail',
      'Microsoft Account digital license tied to previously decommissioned motherboard',
      'Server-side licensing activation server throttling during regional release'
    ],
    recommendedCommand: 'slmgr.vbs /dli',
    commandType: 'cmd',
    steps: [
      'Disconnect your PC from the internet (turn on Airplane Mode or unplug Ethernet).',
      'Open Settings > System > Activation > Change Product Key.',
      'Enter the official generic Pro upgrade key: VK7JG-NPHTM-C97JM-9MPGT-3V66T.',
      'Reboot to complete the edition switch, then reconnect to the internet to activate.'
    ]
  },
  {
    code: '0x80070422',
    name: 'ERROR_SERVICE_DISABLED',
    category: 'Update',
    subsystem: 'Service Control Manager (SCM)',
    summary: 'The service cannot be started, either because it is disabled or because it has no enabled devices associated with it.',
    commonCauses: [
      'Windows Update service or Background Intelligent Transfer Service (BITS) set to Disabled',
      'Third-party "Windows de-bloating" or privacy script that disabled core telemetry/update services',
      'Corrupted Windows registry keys under HKLM\\SYSTEM\\CurrentControlSet\\Services\\wuauserv'
    ],
    recommendedCommand: 'sc config wuauserv start= auto && sc start wuauserv',
    commandType: 'cmd',
    steps: [
      'Open elevated Command Prompt and execute the service enable command above.',
      'Press Win + R, type "services.msc" and press Enter.',
      'Locate "Background Intelligent Transfer Service" (BITS), set Startup type to "Automatic (Delayed Start)".',
      'Retry checking for updates in Windows Settings.'
    ]
  },
  {
    code: '0xc0000005',
    name: 'STATUS_ACCESS_VIOLATION',
    category: 'Filesystem',
    subsystem: 'NTSTATUS Exception Handler',
    summary: 'An application or system process attempted to read or execute memory at a virtual address for which it did not possess authorized permissions.',
    commonCauses: [
      'Corrupted DLL files inside C:\\Windows\\System32',
      'DEP (Data Execution Prevention) blocking unsigned code',
      'Faulty memory block in RAM'
    ],
    recommendedCommand: 'sfc /scannow',
    commandType: 'cmd',
    steps: [
      'Run System File Checker (sfc /scannow) to identify and automatically replace corrupted DLLs.',
      'Update Visual C++ Redistributables (2015-2022) x64 and x86 packages.',
      'Temporarily test with clean boot to isolate conflicting background software.'
    ]
  },
  {
    code: 'INACCESSIBLE_BOOT_DEVICE',
    name: 'Stop Code 0x0000007B',
    category: 'BSOD / Kernel',
    subsystem: 'Storage Port Driver / Boot Manager',
    summary: 'The Windows operating system lost communication with the primary system storage controller during boot phase.',
    commonCauses: [
      'SATA/NVMe controller mode changed between AHCI and RAID/Intel RST in BIOS',
      'Corrupted EFI boot partition BCD (Boot Configuration Data)',
      'Storage driver corruption after storage firmware flash'
    ],
    recommendedCommand: 'bootrec /fixmbr && bootrec /fixboot && bootrec /rebuildbcd',
    commandType: 'cmd',
    steps: [
      'Enter BIOS/UEFI setup. Ensure VMD/RAID controller settings match previous OS configuration.',
      'Boot from Windows 11 installation media and select "Repair your computer".',
      'Open Command Prompt in WinRE and execute the bootrec reconstruction commands.',
      'Verify the EFI system partition is marked active and intact.'
    ]
  }
];

export const TROUBLESHOOT_FLOWS: TroubleshootFlow[] = [
  {
    id: 'bsod',
    title: 'Blue Screen & System Crash Troubleshooter',
    category: 'bsod',
    estimatedTime: '5-10 min',
    severity: 'Critical',
    summary: 'Diagnose and fix unexpected Blue Screen of Death (BSOD) stop errors, memory dump analysis, and driver crashes.',
    rootStepId: 'step_1',
    steps: {
      step_1: {
        id: 'step_1',
        question: 'When does the Blue Screen error occur?',
        description: 'Pinpointing the exact moment helps isolate whether the cause is a hardware fault, startup driver, or background application.',
        options: [
          { label: 'During boot / Windows startup', nextStepId: 'step_startup' },
          { label: 'While gaming or heavy workloads', nextStepId: 'step_heavy_load' },
          { label: 'Randomly while browsing or idle', nextStepId: 'step_random_crash' },
          { label: 'Immediately after plugging in a USB or accessory', nextStepId: 'step_usb_hardware' }
        ]
      },
      step_startup: {
        id: 'step_startup',
        question: 'Can you reach the Windows Desktop in Safe Mode?',
        description: 'Safe Mode loads Windows with minimal services and core drivers only.',
        recommendedAction: {
          label: 'Boot into Safe Mode',
          command: 'shutdown /r /o /t 0',
          details: 'Hold Shift while clicking Restart in Start Menu to access WinRE > Advanced Options > Startup Settings.'
        },
        options: [
          { label: 'Yes, desktop boots normally in Safe Mode', nextStepId: 'step_driver_clean' },
          { label: 'No, it crashes even before loading Safe Mode', nextStepId: 'step_winre_repair' }
        ]
      },
      step_driver_clean: {
        id: 'step_driver_clean',
        question: 'Recent driver or update cleanup',
        description: 'Since Safe Mode is stable, the crash is caused by a third-party driver or background service. Roll back recent updates or use Clean Boot.',
        recommendedAction: {
          label: 'Run System File Checker & Component Repair',
          command: 'DISM /Online /Cleanup-Image /RestoreHealth && sfc /scannow',
          details: 'Executes DISM to repair corrupt Windows components using Windows Update as source.'
        },
        options: [
          { label: 'The scan repaired files and resolved my issue', resolved: true },
          { label: 'Files were repaired but crashes continue', nextStepId: 'step_memory_check' }
        ]
      },
      step_heavy_load: {
        id: 'step_heavy_load',
        question: 'Check Thermal Throttling & GPU Drivers',
        description: 'Crashes under gaming or 3D rendering are usually caused by GPU driver corruption, PSU voltage drop, or overheating.',
        recommendedAction: {
          label: 'Clean GPU Driver Installation (DDU)',
          details: 'Download the official WHQL driver from NVIDIA/AMD. Check temperatures using Task Manager (Performance tab > GPU).'
        },
        options: [
          { label: 'Updating drivers resolved the crashes', resolved: true },
          { label: 'Temperatures are high (exceeding 90°C)', nextStepId: 'step_hardware_cooling' },
          { label: 'Issue still occurs under load', nextStepId: 'step_memory_check' }
        ]
      },
      step_random_crash: {
        id: 'step_random_crash',
        question: 'Run Physical Memory Diagnostic',
        description: 'Random unexplained crashes across varied applications are the classic symptom of faulty RAM modules or memory timing drift.',
        recommendedAction: {
          label: 'Launch Windows Memory Diagnostic',
          command: 'mdsched.exe',
          details: 'Press Enter to restart immediately and run the two-pass physical memory verification test.'
        },
        options: [
          { label: 'Diagnostic reported hardware errors in RAM', nextStepId: 'step_ram_defect' },
          { label: 'Diagnostic reported no memory issues', nextStepId: 'step_driver_clean' }
        ]
      },
      step_memory_check: {
        id: 'step_memory_check',
        question: 'Perform Windows Memory Diagnostic & Minidump Review',
        description: 'Check physical RAM integrity and inspect minidump crash logs located in C:\\Windows\\Minidump.',
        recommendedAction: {
          label: 'Analyze Crash Dump Files',
          command: 'dir C:\\Windows\\Minidump',
          details: 'Look for the most recent .dmp file to identify the offending driver (e.g., nvlddmkm.sys, rtwlanu.sys).'
        },
        options: [
          { label: 'Identified problem driver and updated it successfully', resolved: true },
          { label: 'Need to escalate to Microsoft Live Support', escalate: true }
        ]
      },
      step_winre_repair: {
        id: 'step_winre_repair',
        question: 'Use Windows Recovery Environment (WinRE) Startup Repair',
        description: 'Your Windows boot records or core kernel binaries are damaged.',
        recommendedAction: {
          label: 'Rebuild Boot Configuration',
          command: 'bootrec /rebuildbcd',
          details: 'Run from Command Prompt inside the Windows 11 installation USB media recovery menu.'
        },
        options: [
          { label: 'Startup Repair recovered Windows successfully', resolved: true },
          { label: 'Still unable to boot Windows', escalate: true }
        ]
      },
      step_hardware_cooling: {
        id: 'step_hardware_cooling',
        question: 'Thermal & Power Protection Shutdown',
        description: 'Your CPU or GPU is shutting down to prevent silicon degradation from thermal overload. Clean dust from vents, check fan RPM, or re-apply thermal paste.',
        options: [
          { label: 'Cleaned vents and temps returned to normal', resolved: true },
          { label: 'Still overheating - schedule hardware service', escalate: true }
        ]
      },
      step_ram_defect: {
        id: 'step_ram_defect',
        question: 'Hardware Memory Defect Detected',
        description: 'The Windows Memory Diagnostic confirmed physical memory cell corruption. Reseat the RAM sticks or test with one stick at a time.',
        options: [
          { label: 'Reseating RAM resolved the crashes', resolved: true },
          { label: 'RAM module is defective - request warranty replacement', escalate: true }
        ]
      },
      step_usb_hardware: {
        id: 'step_usb_hardware',
        question: 'External Peripheral Driver Conflict',
        description: 'Unplug the newly connected device. Check Device Manager for exclamation mark warnings under Universal Serial Bus controllers.',
        recommendedAction: {
          label: 'Open Device Manager',
          command: 'devmgmt.msc',
          details: 'Right-click the peripheral with warning and select "Uninstall device". Restart PC and reconnect.'
        },
        options: [
          { label: 'Reinstalling peripheral driver fixed it', resolved: true },
          { label: 'Still causes Blue Screen when connected', escalate: true }
        ]
      }
    }
  },
  {
    id: 'update',
    title: 'Windows Update Error & Freeze Fixer',
    category: 'update',
    estimatedTime: '3-8 min',
    severity: 'Moderate',
    summary: 'Fix updates stuck at 0% or 100%, recurring error codes (0x80070002, 0x800f081f), and corrupted download cache.',
    rootStepId: 'step_1',
    steps: {
      step_1: {
        id: 'step_1',
        question: 'What symptom are you observing in Windows Update?',
        description: 'Windows Update relies on BITS, SoftwareDistribution cache, and Component-Based Servicing.',
        options: [
          { label: 'Update download is stuck at a percentage (e.g. 0% or 61%)', nextStepId: 'step_stuck_download' },
          { label: 'Fails with a specific hex error code (0x800...)', nextStepId: 'step_error_code' },
          { label: 'PC rolls back updates: "Undoing changes made to your computer"', nextStepId: 'step_rollback' }
        ]
      },
      step_stuck_download: {
        id: 'step_stuck_download',
        question: 'Reset Windows Update Cache & Restart Services',
        description: 'Purging the local SoftwareDistribution download cache forces Windows to download pristine update packages.',
        recommendedAction: {
          label: 'Run 1-Click Update Cache Reset Script',
          command: 'net stop wuauserv && net stop bits && del /f /s /q %systemroot%\\SoftwareDistribution\\Download\\*.* && net start wuauserv && net start bits',
          details: 'Stops update services, purges incomplete payloads, and restarts clean transport queues.'
        },
        options: [
          { label: 'Update resumed and completed successfully', resolved: true },
          { label: 'Update still remains stuck', nextStepId: 'step_dism_repair' }
        ]
      },
      step_error_code: {
        id: 'step_error_code',
        question: 'Component Store Repair via DISM',
        description: 'Error codes during staging or installing indicate corrupted manifests in C:\\Windows\\WinSxS.',
        recommendedAction: {
          label: 'Run Component Store Repair',
          command: 'DISM /Online /Cleanup-Image /RestoreHealth',
          details: 'Repairs corrupted files against official Microsoft update servers.'
        },
        options: [
          { label: 'DISM restored health and update succeeded', resolved: true },
          { label: 'DISM returned an error or update still fails', nextStepId: 'step_catroot_reset' }
        ]
      },
      step_catroot_reset: {
        id: 'step_catroot_reset',
        question: 'Reset Cryptographic Catalog (catroot2)',
        description: 'Cryptographic services validate package digital signatures before installation.',
        recommendedAction: {
          label: 'Reset catroot2 cryptographic store',
          command: 'net stop cryptsvc && ren %systemroot%\\system32\\catroot2 catroot2.old && net start cryptsvc',
          details: 'Forces Windows to regenerate digital signature validation certificates.'
        },
        options: [
          { label: 'Update installed successfully after catroot2 reset', resolved: true },
          { label: 'Requires manual In-Place Upgrade or Live Support', escalate: true }
        ]
      },
      step_dism_repair: {
        id: 'step_dism_repair',
        question: 'System File Verification',
        description: 'Scan system binaries for integrity violations.',
        recommendedAction: {
          label: 'Run System File Checker',
          command: 'sfc /scannow',
          details: 'Replaces corrupt system files from local cached copy.'
        },
        options: [
          { label: 'Repaired files and update completed', resolved: true },
          { label: 'Still not installing', escalate: true }
        ]
      },
      step_rollback: {
        id: 'step_rollback',
        question: 'Check Available Disk Space & Conflicting Drivers',
        description: 'Rollbacks occur when the staged installation runs out of temporary disk space (requires at least 20 GB free) or hits driver incompatibility.',
        recommendedAction: {
          label: 'Run Disk Cleanup with System Files',
          command: 'cleanmgr.exe /sagerun:1',
          details: 'Deletes previous installation rollbacks and temporary caches.'
        },
        options: [
          { label: 'Freed up space and update installed', resolved: true },
          { label: 'Sufficient space available but rollback persists', escalate: true }
        ]
      }
    }
  },
  {
    id: 'network',
    title: 'Wi-Fi & Internet Connection Troubleshooter',
    category: 'network',
    estimatedTime: '2-5 min',
    severity: 'Moderate',
    summary: 'Fix "No Internet, secured", slow speeds, frequent Wi-Fi drops, and DNS resolution failures.',
    rootStepId: 'step_1',
    steps: {
      step_1: {
        id: 'step_1',
        question: 'What is your current network status indicator?',
        description: 'Check the network icon in your Windows taskbar system tray.',
        options: [
          { label: '"No Internet, secured" or yellow exclamation mark', nextStepId: 'step_dns_ip' },
          { label: 'Wi-Fi toggle disappears or says "No Wi-Fi networks found"', nextStepId: 'step_adapter_missing' },
          { label: 'Wi-Fi keeps disconnecting every few minutes', nextStepId: 'step_power_save' }
        ]
      },
      step_dns_ip: {
        id: 'step_dns_ip',
        question: 'Flush DNS & Reset TCP/IP Stack',
        description: 'Stale DNS records or invalid DHCP lease assignments prevent internet routing.',
        recommendedAction: {
          label: 'Run Full Network Stack Reset',
          command: 'ipconfig /flushdns && ipconfig /release && ipconfig /renew && netsh winsock reset',
          details: 'Flushes DNS resolver cache, requests new IP lease from gateway, and resets Winsock catalog.'
        },
        options: [
          { label: 'Internet connectivity restored immediately', resolved: true },
          { label: 'Still shows "No Internet"', nextStepId: 'step_change_dns' }
        ]
      },
      step_change_dns: {
        id: 'step_change_dns',
        question: 'Switch to Public High-Reliability DNS',
        description: 'Your ISP DNS server may be having an outage. Switch to Cloudflare (1.1.1.1) or Google Public DNS (8.8.8.8).',
        recommendedAction: {
          label: 'Configure DNS in Windows Settings',
          details: 'Go to Settings > Network & Internet > Wi-Fi > Hardware properties > DNS server assignment > Edit > Manual (IPv4: 1.1.1.1, Alternate: 8.8.8.8).'
        },
        options: [
          { label: 'Connection restored with new DNS', resolved: true },
          { label: 'Router gateway unreachable', escalate: true }
        ]
      },
      step_adapter_missing: {
        id: 'step_adapter_missing',
        question: 'Re-enable WLAN AutoConfig & Adapter Driver',
        description: 'If the Wi-Fi icon vanished completely, the wireless network adapter card has stalled or entered low-power sleep state.',
        recommendedAction: {
          label: 'Restart WLAN AutoConfig Service',
          command: 'net stop WlanSvc && net start WlanSvc',
          details: 'Restarts the core Windows wireless management engine.'
        },
        options: [
          { label: 'Wi-Fi networks appeared and connected', resolved: true },
          { label: 'Adapter still missing in Device Manager', escalate: true }
        ]
      },
      step_power_save: {
        id: 'step_power_save',
        question: 'Disable Wi-Fi Adapter Power Management Sleeping',
        description: 'Windows power saving can aggressively shut down the PCIe/USB wireless card to conserve battery.',
        recommendedAction: {
          label: 'Disable Power Saving on Wi-Fi Card',
          details: 'Open Device Manager > Network adapters > Right click Wi-Fi card > Properties > Power Management tab > Uncheck "Allow the computer to turn off this device to save power".'
        },
        options: [
          { label: 'Wi-Fi connection is now rock solid', resolved: true },
          { label: 'Drops still persist', escalate: true }
        ]
      }
    }
  },
  {
    id: 'audio',
    title: 'Sound, Audio & Microphone Troubleshooter',
    category: 'audio',
    estimatedTime: '2-4 min',
    severity: 'Low',
    summary: 'Fix no audio output, crackling/popping sound, microphone not picking up voice, or HDMI/Bluetooth routing.',
    rootStepId: 'step_1',
    steps: {
      step_1: {
        id: 'step_1',
        question: 'What sound issue are you experiencing?',
        description: 'Select the exact audio symptom.',
        options: [
          { label: 'No sound at all from built-in speakers or headphones', nextStepId: 'step_no_sound' },
          { label: 'Audio crackles, stutters, or pops during playback', nextStepId: 'step_crackle' },
          { label: 'Microphone is not detected or no input sound', nextStepId: 'step_mic' }
        ]
      },
      step_no_sound: {
        id: 'step_no_sound',
        question: 'Restart Windows Audio Service & Check Default Output',
        description: 'Audio services often freeze after waking from sleep or switching HDMI displays.',
        recommendedAction: {
          label: 'Restart Windows Audio Engine',
          command: 'net stop Audiosrv && net start Audiosrv',
          details: 'Restarts the core Windows Audio service and associated endpoint builder.'
        },
        options: [
          { label: 'Sound returned to normal', resolved: true },
          { label: 'No sound - check Device Manager audio drivers', nextStepId: 'step_reinstall_audio' }
        ]
      },
      step_crackle: {
        id: 'step_crackle',
        question: 'Adjust Sample Rate & Disable Audio Enhancements',
        description: 'High bitrates or third-party spatial enhancements can introduce buffer underruns.',
        recommendedAction: {
          label: 'Set Standard 24-bit 48000Hz (Studio Quality)',
          details: 'Go to Settings > System > Sound > More sound settings > Playback > Properties > Advanced > Format: 24-bit, 48000 Hz. Uncheck "Enable audio enhancements".'
        },
        options: [
          { label: 'Audio is now clear without crackle', resolved: true },
          { label: 'Still hear crackling', nextStepId: 'step_reinstall_audio' }
        ]
      },
      step_reinstall_audio: {
        id: 'step_reinstall_audio',
        question: 'Reinstall High Definition Audio Device Driver',
        description: 'Switch from third-party corrupted audio driver to the standard Microsoft In-Box driver.',
        recommendedAction: {
          label: 'Launch Device Manager',
          command: 'devmgmt.msc',
          details: 'Expand "Sound, video and game controllers", right click your audio driver > Update driver > Browse my computer > Let me pick > Select "High Definition Audio Device".'
        },
        options: [
          { label: 'Audio working perfectly now', resolved: true },
          { label: 'Still not working - escalate', escalate: true }
        ]
      },
      step_mic: {
        id: 'step_mic',
        question: 'Check Windows Microphone Privacy Permissions',
        description: 'Windows 11 blocks microphone access to desktop and store apps by default if permission is toggled off.',
        recommendedAction: {
          label: 'Open Microphone Privacy Settings',
          command: 'start ms-settings:privacy-microphone',
          details: 'Ensure "Microphone access" and "Let apps access your microphone" are both set to ON.'
        },
        options: [
          { label: 'Microphone is now capturing voice', resolved: true },
          { label: 'Microphone still silent', escalate: true }
        ]
      }
    }
  },
  {
    id: 'performance',
    title: 'PC Performance & 100% Disk Usage Fixer',
    category: 'performance',
    estimatedTime: '3-6 min',
    severity: 'Moderate',
    summary: 'Speed up sluggish PCs, resolve 100% disk usage in Task Manager, manage startup apps, and trim SSD storage.',
    rootStepId: 'step_1',
    steps: {
      step_1: {
        id: 'step_1',
        question: 'What is causing the slowdown in Task Manager?',
        description: 'Press Ctrl + Shift + Esc to open Task Manager and check the Performance tab.',
        options: [
          { label: 'Disk usage is constantly pegged at 95% - 100%', nextStepId: 'step_disk_100' },
          { label: 'CPU usage is high when idle', nextStepId: 'step_cpu_high' },
          { label: 'PC takes several minutes to boot up to desktop', nextStepId: 'step_startup_apps' }
        ]
      },
      step_disk_100: {
        id: 'step_disk_100',
        question: 'Disable SysMain (Superfetch) & Optimize SSD',
        description: 'On SATA SSDs and HDDs, SysMain indexing frequently saturates queue depth causing severe system lag.',
        recommendedAction: {
          label: 'Disable SysMain Service & Optimize Drives',
          command: 'sc config SysMain start= disabled && sc stop SysMain && defrag C: /O',
          details: 'Stops background disk thrashing and sends TRIM command to SSD.'
        },
        options: [
          { label: 'Disk usage dropped back to normal (0-5%)', resolved: true },
          { label: 'Disk still remains high', nextStepId: 'step_chkdsk' }
        ]
      },
      step_chkdsk: {
        id: 'step_chkdsk',
        question: 'Check Storage Volume for Bad Sectors',
        description: 'High disk activity with low transfer speed often indicates the drive controller attempting to reallocate degraded storage blocks.',
        recommendedAction: {
          label: 'Schedule Volume Integrity Verification',
          command: 'chkdsk C: /scan',
          details: 'Performs online snapshot scan of NTFS filesystem without requiring a reboot.'
        },
        options: [
          { label: 'Scan completed clean and performance restored', resolved: true },
          { label: 'Scan detected hardware drive degradation', escalate: true }
        ]
      },
      step_cpu_high: {
        id: 'step_cpu_high',
        question: 'Check Windows Search & Defender Background Scans',
        description: 'High idle CPU is often caused by search indexer loops or stuck antimalware scans.',
        recommendedAction: {
          label: 'Restart Windows Search & Reset Indexer',
          command: 'net stop WSearch && net start WSearch',
          details: 'Forces Windows Search indexing service to clear transient queue locks.'
        },
        options: [
          { label: 'CPU settled back down to normal', resolved: true },
          { label: 'Still experiencing high CPU usage', escalate: true }
        ]
      },
      step_startup_apps: {
        id: 'step_startup_apps',
        question: 'Disable Heavy Startup Applications',
        description: 'Third-party auto-launchers degrade boot times significantly.',
        recommendedAction: {
          label: 'Manage Startup Apps in Settings',
          command: 'start ms-settings:startupapps',
          details: 'Sort by "Startup impact" and toggle off High Impact apps that you don\'t need immediately.'
        },
        options: [
          { label: 'Boot time drastically improved', resolved: true },
          { label: 'Need further optimization', escalate: true }
        ]
      }
    }
  }
];

export const DRIVER_CATALOG: DriverItem[] = [
  {
    id: 'drv-surface-pro11',
    name: 'Surface Pro (11th Edition) & Laptop (7th Edition) Driver & Firmware Pack',
    category: 'Surface Firmware',
    deviceModel: 'Surface Pro 11 / Laptop 7 (Snapdragon X Elite / Plus)',
    version: 'v1.44.139.0',
    releaseDate: 'October 2026',
    size: '648 MB',
    os: 'Windows 11 (ARM64)',
    wingetId: 'Microsoft.Surface.FirmwareUpdate',
    checksum: 'E8A1F92B3C4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F'
  },
  {
    id: 'drv-surface-pro9',
    name: 'Surface Pro 9 (Intel) Drivers and Firmware Update',
    category: 'Surface Firmware',
    deviceModel: 'Surface Pro 9 Intel Core 12th Gen',
    version: 'v14.12.240.0',
    releaseDate: 'September 2026',
    size: '890 MB',
    os: 'Windows 11 (24H2 / 23H2)',
    wingetId: 'Microsoft.SurfacePro9.Firmware',
    checksum: 'A4C7E290BF12998471DCD09832104598FECA8712'
  },
  {
    id: 'drv-intel-wifi',
    name: 'Intel Wi-Fi 7 / Wi-Fi 6E Wireless Adapter Drivers',
    category: 'Network',
    deviceModel: 'Intel BE200, AX211, AX210, AX201, AX200',
    version: 'v23.90.0.4 (WHQL)',
    releaseDate: 'October 2026',
    size: '54 MB',
    os: 'Windows 11 (24H2 / 23H2)',
    wingetId: 'Intel.IntelWirelessSoftware',
    checksum: '71B983FA81039AC044819DF7810A981440EF18A2'
  },
  {
    id: 'drv-realtek-audio',
    name: 'Realtek High Definition Audio Driver (UAD / DCH)',
    category: 'Audio',
    deviceModel: 'Realtek ALC892, ALC897, ALC1200, ALC1220, ALC4080',
    version: 'v6.0.9685.1',
    releaseDate: 'September 2026',
    size: '38 MB',
    os: 'Windows 10 / 11',
    wingetId: 'Realtek.HighDefinitionAudioDriver',
    checksum: '4901ACD84128410FBA9418290EA048510EF90A41'
  },
  {
    id: 'drv-nvidia-studio',
    name: 'NVIDIA Studio & Game Ready Display Driver',
    category: 'Graphics',
    deviceModel: 'GeForce RTX 4090, 4080, 4070, 4060, 30-Series',
    version: 'v565.90 (WHQL)',
    releaseDate: 'October 2026',
    size: '640 MB',
    os: 'Windows 11 (24H2 / 23H2)',
    wingetId: 'Nvidia.GeForceExperience',
    checksum: 'B019EFA9841029410F09819230581029481A0284'
  },
  {
    id: 'drv-amd-chipset',
    name: 'AMD Ryzen Chipset Drivers & Power Plan',
    category: 'Chipset',
    deviceModel: 'AMD Socket AM5 (X670, B650, A620) & AM4 (X570, B550)',
    version: 'v6.07.22.037',
    releaseDate: 'August 2026',
    size: '68 MB',
    os: 'Windows 10 / 11',
    wingetId: 'AMD.RyzenChipsetDrivers',
    checksum: '10985A04981CBA09841804910248019AB0182419'
  }
];

export const KNOWLEDGE_ARTICLES: KnowledgeArticle[] = [
  {
    id: 'art-bitlocker-recovery',
    title: 'Finding Your BitLocker Recovery Key in Windows 11',
    category: 'activation',
    readingTime: '3 min read',
    lastUpdated: 'Updated October 2026',
    views: 148200,
    helpfulCount: 4210,
    excerpt: 'BitLocker ensures your drive is securely encrypted. Here is how to find your 48-digit recovery key in your Microsoft Account or Azure AD.',
    sections: [
      {
        heading: '1. Check your Microsoft Account online',
        content: 'BitLocker keys are automatically backed up to your personal Microsoft Account when device encryption is enabled. Visit the official Microsoft BitLocker recovery dashboard on any mobile phone or secondary device (account.microsoft.com/devices/recoverykey) and sign in with the exact email address used to set up the PC.'
      },
      {
        heading: '2. Identifying the correct Key ID',
        content: 'Your BitLocker recovery screen displays a 8-character Key ID (e.g. "Key ID: 3B72A10F"). Compare this Key ID against the list stored in your Microsoft account to ensure you enter the matching 48-digit numerical key.'
      },
      {
        heading: '3. Work or School Accounts (Azure Active Directory / Entra)',
        content: 'If your device was registered to a company or school, the key is stored in your organization\'s Azure AD. Access myaccount.microsoft.com > Devices > View BitLocker Keys, or contact your enterprise IT administrator.',
        callout: 'Important: Microsoft Technical Support does not have access to your personal encryption keys and cannot generate, bypass, or retrieve a missing BitLocker recovery key.'
      }
    ]
  },
  {
    id: 'art-clean-install-guide',
    title: 'How to Perform a Clean Installation of Windows 11 Using USB Media',
    category: 'update',
    readingTime: '6 min read',
    lastUpdated: 'Updated September 2026',
    views: 295400,
    helpfulCount: 9140,
    excerpt: 'Complete official walkthrough to create bootable installation media, configure UEFI BIOS, format partitions, and install a pristine copy of Windows 11.',
    sections: [
      {
        heading: '1. Prerequisites & Media Creation Tool',
        content: 'You will need a USB flash drive with at least 8 GB of storage space (all existing data on the USB drive will be erased). Download the official Windows 11 Media Creation Tool from microsoft.com/software-download/windows11 and select "Create installation media for another PC".'
      },
      {
        heading: '2. Configuring UEFI / BIOS Boot Sequence',
        content: 'Insert the prepared USB flash drive into your PC. Turn on or restart your computer while repeatedly tapping the Boot Menu key (typically F12, F11, F8, or Del depending on your motherboard manufacturer). Select the UEFI USB option.'
      },
      {
        heading: '3. Partition Formatting & Installation',
        content: 'When prompted, select "Custom: Install Windows only (advanced)". Delete existing OS partitions (Drive 0 Partition 1, 2, etc.) until you see "Drive 0 Unallocated Space". Select the unallocated space and click Next. Windows installer will automatically build the required EFI, MSR, and Recovery partitions.',
        callout: 'Pro Tip: Back up all personal files, desktop documents, and photos to an external drive or OneDrive before deleting disk partitions.'
      }
    ]
  },
  {
    id: 'art-windows-11-24h2',
    title: 'Windows 11 24H2 Feature Update: Readiness & Known Compatibility',
    category: 'update',
    readingTime: '4 min read',
    lastUpdated: 'Updated October 2026',
    views: 412000,
    helpfulCount: 12480,
    excerpt: 'Everything you need to know about the Windows 11 24H2 update: system requirements, TPM 2.0 verification, Sudo for Windows, and Wi-Fi 7 features.',
    sections: [
      {
        heading: '1. Verifying Hardware Compatibility (TPM 2.0 & Secure Boot)',
        content: 'Windows 11 24H2 requires a compatible 64-bit processor (Intel 8th Gen+ or AMD Zen 2+), TPM 2.0 chip enabled in firmware, and UEFI Secure Boot.',
        terminalSnippet: 'Get-WmiObject -Namespace "Root\\CIMv2\\Security\\MicrosoftTpm" -Class Win32_Tpm | Select-Object IsEnabled_InitialValue, SpecVersion'
      },
      {
        heading: '2. What to do if Windows Update shows "Safe Safeguard Hold"',
        content: 'Microsoft uses safeguard holds to prevent devices with known incompatible drivers (e.g., outdated audio firmware or anti-cheat engines) from installing the update until vendor patches are distributed. Do not force update through registry bypasses if a safeguard hold is active.'
      }
    ]
  },
  {
    id: 'art-system-restore',
    title: 'How to Use System Restore Points in Windows 11 and 10',
    category: 'performance',
    readingTime: '3 min read',
    lastUpdated: 'Updated August 2026',
    views: 94100,
    helpfulCount: 3100,
    excerpt: 'Revert your operating system state, drivers, and registry to an earlier point in time without affecting your personal documents.',
    sections: [
      {
        heading: '1. Accessing System Restore',
        content: 'Press Win + R, type "rstrui.exe" and press Enter. Click Next to view the list of available automatic and manual restore points.'
      },
      {
        heading: '2. Scan for Affected Programs',
        content: 'Highlight a restore point and click "Scan for affected programs". This identifies any software, drivers, or updates installed after that point that will be safely removed during the restoration.'
      }
    ]
  }
];
