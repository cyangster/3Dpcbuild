/** Metadata shown when a user selects a part in the 3D view. */
export const PC_PARTS = {
  case: {
    id: "case",
    label: "PC case",
    short: "ATX mid-tower chassis",
    description:
      "The enclosure holds every component, manages airflow with intake and exhaust fans, and provides front-panel USB and audio. Size (ATX, Micro-ATX, Mini-ITX) must match your motherboard.",
    specs: [
      "Form factor: ATX mid-tower (example)",
      "Motherboard support: ATX / Micro-ATX / Mini-ITX",
      "Clearance: check GPU length & cooler height before buying",
    ],
  },
  motherboard: {
    id: "motherboard",
    label: "Motherboard",
    short: "Main circuit board",
    description:
      "Connects the CPU, RAM, storage, and expansion cards. The chipset and socket type determine which processors and features you can use. Pick a board that matches your CPU generation and desired ports.",
    specs: [
      "Socket: must match CPU (e.g. AM5, LGA 1700)",
      "RAM: DDR4 or DDR5 slots — buy matching memory",
      "Expansion: PCIe slots for GPU, M.2 for NVMe SSDs",
    ],
  },
  cpu: {
    id: "cpu",
    label: "CPU (processor)",
    short: "Central processing unit",
    description:
      "Runs operating system and application logic. More cores help with multitasking and creative workloads; higher clock speeds help single-threaded tasks and games. Always pair with a compatible motherboard socket.",
    specs: [
      "Cores / threads: major driver of multi-task performance",
      "TDP: influences cooler choice and power draw",
      "Includes iGPU on some models — discrete GPU optional",
    ],
  },
  cooler: {
    id: "cooler",
    label: "CPU cooler",
    short: "Keeps the processor in a safe temperature range",
    description:
      "Dissipates heat from the CPU via heatsink and fan (air) or pump and radiator (AIO liquid). Tower height and radiator size must fit your case.",
    specs: [
      "Types: stock air, tower air, 120–360 mm AIO",
      "Mounting: bracket must match CPU socket",
      "Thermal paste: pre-applied or add your own",
    ],
  },
  ram: {
    id: "ram",
    label: "RAM (memory)",
    short: "Fast workspace for running programs",
    description:
      "Temporary storage the CPU uses while apps are open. Capacity (often 16–32 GB for gaming) and speed (MHz, timings) matter; use the motherboard’s qualified vendor list (QVL) for stability.",
    specs: [
      "Capacity: 16 GB minimum for many games; 32 GB for heavy work",
      "DDR4 vs DDR5: dictated by motherboard",
      "Install in dual-channel pairs when possible",
    ],
  },
  gpu: {
    id: "gpu",
    label: "Graphics card (GPU)",
    short: "Renders 3D and drives displays",
    description:
      "The main performer for games and many GPU-accelerated apps. Needs adequate PSU wattage and PCIe power cables. Length and thickness must clear the case and other slots.",
    specs: [
      "VRAM: more helps high resolutions and texture-heavy games",
      "Power: 8-pin / 12VHPWR — match PSU",
      "Display outputs: HDMI, DisplayPort versions",
    ],
  },
  storage: {
    id: "storage",
    label: "SSD (storage)",
    short: "Fast boot and game drive",
    description:
      "NVMe M.2 SSDs plug directly into the motherboard for high speed. SATA SSDs or HDDs are alternatives for bulk storage. Check motherboard M.2 slot count and PCIe generation.",
    specs: [
      "NVMe M.2: typical for OS and games",
      "PCIe 3.0 / 4.0 / 5.0 — faster generations need board support",
      "Capacity: 500 GB–2 TB common for primary drive",
    ],
  },
  psu: {
    id: "psu",
    label: "Power supply (PSU)",
    short: "Converts wall power for all components",
    description:
      "Choose wattage headroom over your build’s estimated draw. Modular cables reduce clutter. 80 Plus ratings indicate efficiency, not build quality alone — read reviews.",
    specs: [
      "Wattage: GPU + CPU peak load + margin",
      "Certification: 80 Plus Bronze through Titanium",
      "Form factor: ATX PSU for most mid-towers",
    ],
  },
  fans: {
    id: "fans",
    label: "Case fans",
    short: "Airflow for stable temperatures",
    description:
      "Front/side intake and rear/top exhaust move cool air over components and hot air out. PWM fans allow finer speed control in BIOS or software.",
    specs: [
      "Sizes: 120 mm and 140 mm most common",
      "Static pressure vs airflow — radiators favor pressure",
      "ARGB: requires compatible headers or hub",
    ],
  },
};

export const PART_IDS = Object.keys(PC_PARTS);
