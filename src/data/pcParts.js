/** Metadata shown when a user selects a part in the 3D view. */
export const PC_PARTS = {
  case: {
    id: "case",
    label: "PC case",
    short: "ATX (Advanced Technology eXtended) mid-tower chassis",
    description:
      "The enclosure holds every component, manages airflow with intake and exhaust fans, and provides front-panel USB (Universal Serial Bus) and audio. Form factor must match your motherboard: ATX (Advanced Technology eXtended), Micro-ATX (compact ATX), or Mini-ITX (small form factor).",
    specs: [
      "Form factor: ATX (Advanced Technology eXtended) mid-tower (example)",
      "Motherboard support: ATX (Advanced Technology eXtended) / Micro-ATX (compact ATX) / Mini-ITX (small form factor)",
      "Clearance: check GPU (graphics processing unit) length and cooler height before buying",
    ],
  },
  motherboard: {
    id: "motherboard",
    label: "Motherboard",
    short: "Main circuit board",
    description:
      "Connects the CPU (central processing unit), RAM (random access memory), storage, and expansion cards. The chipset and socket type determine which processors and features you can use. Pick a board that matches your CPU generation and desired ports.",
    specs: [
      "Socket: must match CPU (e.g. AM5, LGA (land grid array) 1700)",
      "RAM (random access memory): DDR4 (double data rate, 4th generation) or DDR5 (double data rate, 5th generation) slots — buy matching memory",
      "Expansion: PCIe (PCI Express) slots for GPU (graphics processing unit), M.2 for NVMe (Non-Volatile Memory Express) SSDs (solid-state drives)",
    ],
  },
  cpu: {
    id: "cpu",
    label: "CPU (processor)",
    short: "Central processing unit",
    description:
      "Runs operating system and application logic. More cores help with multitasking and creative workloads; higher clock speeds help single-threaded tasks and games. On this build it sits on the motherboard under the CPU cooler (you can still see the metal heat spreader from some angles). Always pair with a compatible motherboard socket.",
    specs: [
      "Cores / threads: major driver of multi-task performance",
      "TDP (thermal design power): influences cooler choice and power draw",
      "Includes iGPU (integrated graphics processing unit) on some models — discrete GPU (graphics processing unit) optional",
    ],
  },
  cooler: {
    id: "cooler",
    label: "CPU cooler",
    short: "Keeps the processor in a safe temperature range",
    description:
      "Dissipates heat from the CPU via heatsink and fan (air) or pump and radiator for AIO (all-in-one) liquid cooling. Tower height and radiator size must fit your case.",
    specs: [
      "Types: stock air, tower air, 120–360 mm (millimeters) AIO (all-in-one)",
      "Mounting: bracket must match CPU socket",
      "Thermal paste: pre-applied or add your own",
    ],
  },
  ram: {
    id: "ram",
    label: "RAM (memory)",
    short: "Fast workspace for running programs",
    description:
      "Temporary storage the CPU uses while apps are open. Capacity (often 16–32 GB (gigabytes) for gaming) and speed (MHz (megahertz), timings) matter; use the motherboard’s QVL (qualified vendor list) for stability.",
    specs: [
      "Capacity: 16 GB (gigabytes) minimum for many games; 32 GB (gigabytes) for heavy work",
      "DDR4 vs DDR5 (double data rate 4 vs 5): dictated by motherboard",
      "Install in dual-channel pairs when possible",
    ],
  },
  gpu: {
    id: "gpu",
    label: "Graphics card (GPU)",
    short: "Renders 3D and drives displays",
    description:
      "The main performer for games and many GPU-accelerated apps. Needs adequate PSU (power supply unit) wattage and PCIe (PCI Express) power cables. Length and thickness must clear the case and other slots.",
    specs: [
      "VRAM (video RAM): more helps high resolutions and texture-heavy games",
      "Power: 8-pin / 12VHPWR (12-volt high-power connector) — match PSU (power supply unit)",
      "Display outputs: HDMI (High-Definition Multimedia Interface), DisplayPort (digital display interface) versions",
    ],
  },
  storage: {
    id: "storage",
    label: "SSD (storage)",
    short: "Fast boot and game drive",
    description:
      "NVMe (Non-Volatile Memory Express) M.2 (Next Generation Form Factor) SSDs (solid-state drives) plug directly into the motherboard for high speed. SATA (Serial ATA) SSDs (solid-state drives) or HDDs (hard disk drives) are alternatives for bulk storage. Check motherboard M.2 slot count and PCIe (PCI Express) generation.",
    specs: [
      "NVMe (Non-Volatile Memory Express) M.2 (Next Generation Form Factor): typical for OS (operating system) and games",
      "PCIe (PCI Express) 3.0 / 4.0 / 5.0 — faster generations need board support",
      "Capacity: 500 GB (gigabytes)–2 TB (terabytes) common for primary drive",
    ],
  },
  psu: {
    id: "psu",
    label: "Power supply (PSU)",
    short: "Converts wall power for all components",
    description:
      "Choose wattage headroom over your build’s estimated draw. Modular cables reduce clutter. 80 Plus ratings indicate efficiency, not build quality alone — read reviews.",
    specs: [
      "Wattage: GPU (graphics processing unit) + CPU (central processing unit) peak load + margin",
      "Certification: 80 Plus Bronze through Titanium",
      "Form factor: ATX (Advanced Technology eXtended) PSU (power supply unit) for most mid-towers",
    ],
  },
  fans: {
    id: "fans",
    label: "Case fans",
    short: "Airflow for stable temperatures",
    description:
      "Front/side intake and rear/top exhaust move cool air over components and hot air out. PWM (pulse-width modulation) fans allow finer speed control in BIOS (Basic Input/Output System) or software.",
    specs: [
      "Sizes: 120 mm (millimeters) and 140 mm (millimeters) most common",
      "Static pressure vs airflow — radiators favor pressure",
      "ARGB (addressable RGB): requires compatible headers or hub",
    ],
  },
};

export const PART_IDS = Object.keys(PC_PARTS);
