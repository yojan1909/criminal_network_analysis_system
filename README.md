# criminal_network_analysis_system
[index.html](https://github.com/user-attachments/files/33699331/index.html)
<!DOCTYPE html>

<html class="dark" lang="en"><head><meta charset="utf-8"/><meta content="width=device-width, initial-scale=1.0" name="viewport"/><title>Nexus Command Center - Daily Investigator Dashboard</title><link href="https://fonts.googleapis.com" rel="preconnect"/><link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/><link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&amp;family=Inter:wght@400;500;600&amp;family=JetBrains+Mono:wght@400;500;600&amp;display=swap" rel="stylesheet"/><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/><style>@layer base{html,body{margin:0;padding:0;}body{overscroll-behavior:none;}main>:first-child{margin-top:0!important;}main>:last-child{margin-bottom:0!important;}}::-webkit-scrollbar{display:none;}</style><script src="https://cdn.tailwindcss.com"></script><script id="tailwind-config">tailwind.config={darkMode:"class",theme:{extend:{"colors":{"on-secondary-fixed-variant":"#004e5a","on-background":"#e0e2ea","on-tertiary-fixed-variant":"#004c69","on-secondary-fixed":"#001f25","on-primary-container":"#00424f","tertiary-fixed":"#c4e7ff","on-secondary":"#00363e","secondary":"#5de6ff","secondary-fixed":"#a2eeff","primary-container":"#06b6d4","secondary-fixed-dim":"#2fd9f4","surface-container":"#1c2025","error-container":"#93000a","on-primary-fixed-variant":"#004e5c","inverse-on-surface":"#2d3136","primary-fixed":"#acedff","surface-variant":"#31353b","on-secondary-container":"#00515d","error":"#ffb4ab","surface-container-lowest":"#0a0e13","outline":"#869397","surface-container-high":"#262a30","on-error-container":"#ffdad6","surface-container-low":"#181c21","background":"#101419","surface-container-highest":"#31353b","tertiary-container":"#23b2ec","surface":"#101419","secondary-container":"#00cbe6","on-tertiary":"#00354a","surface-dim":"#101419","on-tertiary-container":"#00415a","tertiary-fixed-dim":"#7bd0ff","on-error":"#690005","on-primary-fixed":"#001f26","on-tertiary-fixed":"#001e2c","on-surface-variant":"#bcc9cd","primary-fixed-dim":"#4cd7f6","tertiary":"#7bd0ff","inverse-primary":"#00687a","on-surface":"#e0e2ea","outline-variant":"#3d494c","surface-tint":"#4cd7f6","inverse-surface":"#e0e2ea","primary":"#4cd7f6","on-primary":"#003640","surface-bright":"#36393f"},"borderRadius":{"DEFAULT":"0.125rem","lg":"0.25rem","xl":"0.5rem","full":"0.75rem"},"spacing":{"space-lg":"1rem","space-xs":"0.25rem","rail-expanded":"16rem","space-xl":"1.5rem","gutter-tablet":"0.75rem","space-md":"0.75rem","space-2xs":"0.125rem","space-2xl":"2rem","rail-width":"4.5rem","space-sm":"0.5rem","gutter-desktop":"1rem","gutter-mobile":"0.5rem"},"fontFamily":{"data-mono-md":["JetBrains Mono"],"headline-lg-mobile":["IBM Plex Sans"],"headline-sm":["IBM Plex Sans"],"label-md":["Inter"],"headline-md":["IBM Plex Sans"],"data-mono-sm":["JetBrains Mono"],"body-lg":["Inter"],"body-md":["Inter"],"display-lg":["IBM Plex Sans"],"headline-lg":["IBM Plex Sans"],"body-sm":["Inter"],"data-mono-lg":["JetBrains Mono"]},"fontSize":{"data-mono-md":["12px",{"lineHeight":"16px","fontWeight":"500"}],"headline-lg-mobile":["20px",{"lineHeight":"28px","letterSpacing":"-0.01em","fontWeight":"600"}],"headline-sm":["15px",{"lineHeight":"20px","fontWeight":"600"}],"label-md":["11px",{"lineHeight":"14px","letterSpacing":"0.04em","fontWeight":"600"}],"headline-md":["18px",{"lineHeight":"24px","letterSpacing":"-0.01em","fontWeight":"600"}],"data-mono-sm":["11px",{"lineHeight":"14px","fontWeight":"400"}],"body-lg":["15px",{"lineHeight":"22px","fontWeight":"400"}],"body-md":["13px",{"lineHeight":"18px","fontWeight":"400"}],"display-lg":["32px",{"lineHeight":"40px","letterSpacing":"-0.02em","fontWeight":"600"}],"headline-lg":["24px",{"lineHeight":"32px","letterSpacing":"-0.015em","fontWeight":"600"}],"body-sm":["12px",{"lineHeight":"16px","fontWeight":"400"}],"data-mono-lg":["14px",{"lineHeight":"20px","fontWeight":"500"}]}}}};</script><link rel=stylesheet href=assets/css/nexus-shared.css/>
</head><body class="bg-background font-body-md text-on-surface antialiased selection:bg-primary selection:text-on-primary min-h-screen"><aside class="fixed left-0 top-0 h-full w-64 bg-surface-container-lowest border-r border-outline-variant/30 z-50 flex flex-col justify-between select-none">
  <div class="flex flex-col">
    <div class="h-14 px-space-md border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-lowest/80">
      <a href="index.html" class="flex items-center gap-space-sm hover:opacity-90 transition-opacity">
        <div class="w-8 h-8 rounded border border-outline-variant/40 bg-surface-container flex items-center justify-center overflow-hidden p-1">
          <img src="assets/images/mark.svg" alt="Nexus Mark" class="w-full h-full object-contain" />
        </div>
        <div class="flex flex-col">
          <span class="font-headline-sm text-headline-sm tracking-wider uppercase text-on-surface font-bold">NEXUS</span>
          <span class="font-data-mono-sm text-data-mono-sm text-on-surface-variant">SYS.CORE.ID</span>
        </div>
      </a>
      <div class="px-space-xs py-space-2xs rounded bg-surface-container border border-outline-variant/30 text-primary font-data-mono-sm text-data-mono-sm">v4.8</div>
    </div>
    <div class="px-space-md py-space-xs border-b border-outline-variant/20 flex items-center justify-between bg-surface-container-low/40">
      <span class="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Operational Units</span>
      <span class="font-data-mono-sm text-data-mono-sm text-outline">SEC-ENC</span>
    </div>
    <nav class="flex flex-col py-space-xs px-space-xs space-y-space-2xs" data-active-classes="bg-surface-container text-primary font-bold border-l-2 border-primary">
      <a aria-current="page" class="flex items-center justify-between px-space-sm py-space-xs rounded transition-colors bg-surface-container text-primary font-bold border-l-2 border-primary" data-path="command-center" href="index.html">
  <div class="flex items-center gap-space-sm">
    <span class="material-symbols-outlined text-[18px]">space_dashboard</span>
    <span class="font-body-md text-body-md">Command Center</span>
  </div>
  
</a>
<a class="flex items-center justify-between px-space-sm py-space-xs rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="network-graph-explorer" href="network-explorer.html">
  <div class="flex items-center gap-space-sm">
    <span class="material-symbols-outlined text-[18px]">grain</span>
    <span class="font-body-md text-body-md">Network Graph Explorer</span>
  </div>
  
</a>
<a class="flex items-center justify-between px-space-sm py-space-xs rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="entity-profiles" href="entity-profiles.html">
  <div class="flex items-center gap-space-sm">
    <span class="material-symbols-outlined text-[18px]">badge</span>
    <span class="font-body-md text-body-md">Entity Profiles</span>
  </div>
  
</a>
<a class="flex items-center justify-between px-space-sm py-space-xs rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="case-workspaces" href="case-workspaces.html">
  <div class="flex items-center gap-space-sm">
    <span class="material-symbols-outlined text-[18px]">folder_supervised</span>
    <span class="font-body-md text-body-md">Case Workspaces</span>
  </div>
  <span class="px-space-xs py-space-2xs rounded bg-surface-container-high text-secondary font-data-mono-sm text-data-mono-sm">14 Active</span>
</a>
<a class="flex items-center justify-between px-space-sm py-space-xs rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="alerts-patterns" href="alerts-patterns.html">
  <div class="flex items-center gap-space-sm">
    <span class="material-symbols-outlined text-[18px]">notification_important</span>
    <span class="font-body-md text-body-md">Alerts & Patterns</span>
  </div>
  <span class="flex items-center gap-1 px-space-xs py-space-2xs rounded bg-error-container/30 border border-error/20 text-error font-data-mono-sm text-data-mono-sm"><span class="w-1.5 h-1.5 rounded-full bg-error animate-pulse"></span>3 Crit</span>
</a>
<a class="flex items-center justify-between px-space-sm py-space-xs rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="cross-case-search" href="cross-case-search.html">
  <div class="flex items-center gap-space-sm">
    <span class="material-symbols-outlined text-[18px]">manage_search</span>
    <span class="font-body-md text-body-md">Cross-Case Search</span>
  </div>
  
</a>
<a class="flex items-center justify-between px-space-sm py-space-xs rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="report-generator" href="report-generator.html">
  <div class="flex items-center gap-space-sm">
    <span class="material-symbols-outlined text-[18px]">description</span>
    <span class="font-body-md text-body-md">Report Generator</span>
  </div>
  
</a>
    </nav>
  </div>
  <div class="flex flex-col border-t border-outline-variant/30 bg-surface-container-lowest">
    <div class="p-space-sm bg-surface-container-low/60 border-b border-outline-variant/20">
      <div class="flex items-center justify-between mb-space-2xs">
        <span class="font-label-md text-label-md uppercase tracking-wider text-outline">CLEARANCE: LVL 4</span>
        <span class="flex items-center gap-1 font-data-mono-sm text-data-mono-sm text-primary"><span class="w-1.5 h-1.5 rounded-full bg-secondary animate-ping"></span>18ms</span>
      </div>
      <div class="font-data-mono-sm text-data-mono-sm text-on-surface-variant truncate">TOP SECRET / SCI</div>
    </div>
    <div class="p-space-sm flex items-center justify-between">
      <div class="flex items-center gap-space-sm">
        <div class="relative">
          <img alt="Analyst Vance" class="w-8 h-8 rounded-full object-cover border border-outline-variant/60" src="assets/images/analyst-vance.png" />
          <span class="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-secondary-container border border-surface-container-lowest"></span>
        </div>
        <div class="flex flex-col">
          <span class="font-headline-sm text-headline-sm text-on-surface leading-none">Analyst M. Vance</span>
          <span class="font-data-mono-sm text-data-mono-sm text-outline">ID: AN-89241</span>
        </div>
      </div>
      <button class="p-space-xs rounded bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors" title="Lock Terminal" type="button" onclick="window.openLockTerminalModal ? window.openLockTerminalModal() : (window.showTerminalLockScreen && window.showTerminalLockScreen())">
        <span class="material-symbols-outlined text-[18px]">lock</span>
      </button>
    </div>
  </div>
</aside><div class="pl-64 flex flex-col min-h-screen"><header class="fixed top-0 left-64 right-0 h-14 bg-surface-container-lowest/90 backdrop-blur border-b border-outline-variant/30 z-40 px-gutter-desktop flex items-center justify-between"><div class="flex items-center gap-space-md flex-1 max-w-2xl"><div class="relative w-full flex items-center"><span class="material-symbols-outlined absolute left-3 text-outline text-[18px]">search</span><input class="w-full h-9 pl-9 pr-14 bg-surface-container-low border border-outline-variant/40 rounded text-body-sm font-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:bg-surface-container-lowest transition-colors" placeholder="Search entities, SSNs, phone numbers, plate IDs, case dossiers (Ctrl + K)" type="text"/><span class="absolute right-2 font-data-mono-sm text-data-mono-sm text-outline border border-outline-variant/30 rounded px-1.5 py-0.5 bg-surface-container">⌘K</span></div></div><div class="flex items-center gap-space-lg"><div class="hidden xl:flex items-center gap-space-md border-x border-outline-variant/20 px-space-md"><div class="flex flex-col"><span class="font-label-md text-label-md text-outline uppercase">STREAM</span><span class="font-data-mono-sm text-data-mono-sm text-secondary flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-secondary"></span>REALTIME FEDERATED</span></div><div class="flex flex-col"><span class="font-label-md text-label-md text-outline uppercase">INGEST</span><span class="font-data-mono-sm text-data-mono-sm text-on-surface">4,892 ev/min</span></div><div class="flex flex-col"><span class="font-label-md text-label-md text-outline uppercase">LAST SYNC</span><span class="font-data-mono-sm text-data-mono-sm text-on-surface">00:01:14 UTC</span></div></div><div class="flex items-center gap-space-sm"><button class="flex items-center gap-space-xs px-space-sm h-8 rounded bg-primary text-on-primary font-headline-sm text-body-sm font-semibold hover:bg-secondary transition-colors" type="button"><span class="material-symbols-outlined text-[16px]">add</span><span>Case File</span></button><button class="flex items-center gap-space-xs px-space-sm h-8 rounded bg-surface-container border border-outline-variant/40 text-on-surface font-body-sm hover:border-primary hover:text-primary transition-colors" type="button"><span class="material-symbols-outlined text-error text-[16px]">flag</span><span>Flag</span></button><button class="relative p-space-xs rounded bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors" type="button"><span class="material-symbols-outlined text-[20px]">notifications</span><span class="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary"></span></button><div class="pl-space-xs border-l border-outline-variant/30 flex items-center"><img alt="Profile" class="w-8 h-8 rounded-full object-cover border border-outline-variant/40" src="assets/images/img_b701ffc00e.jpg"/></div></div></div></header><main class="w-full pt-14 bg-background min-h-[calc(100vh-3.5rem)] flex flex-col p-gutter-desktop"><div class="flex flex-col w-full space-y-space-md">
<!-- Operational Briefing Header Strip -->
<div class="flex flex-wrap items-center justify-between gap-space-sm bg-surface-container-low px-space-md py-space-sm rounded-xl">
<div class="flex items-center gap-space-sm min-w-0">
<span class="flex h-2.5 w-2.5 rounded-full bg-primary animate-pulse"></span>
<div class="flex items-baseline gap-space-xs">
<span class="font-headline-md text-headline-md text-on-surface uppercase tracking-tight font-semibold">Morning Tactical Briefing</span>
<span class="font-data-mono-sm text-data-mono-sm text-primary">/ DAILY CYCLE 04</span>
</div>
<span class="hidden md:inline-block px-space-xs py-space-2xs rounded bg-surface-container-high text-on-surface-variant font-data-mono-sm text-data-mono-sm">
        FED-NODE: US-EAST-09
      </span>
      <a href="command-center-exec.html" class="hidden sm:inline-flex items-center gap-1 px-space-xs py-space-2xs rounded bg-surface-container hover:bg-surface-container-high text-primary font-data-mono-sm text-data-mono-sm transition-colors" title="Switch to Executive Console"><span class="material-symbols-outlined text-[14px]">analytics</span> Exec View</a>
</div>
<div class="flex items-center gap-space-sm">
<div class="flex items-center gap-space-xs px-space-sm py-space-2xs rounded bg-surface-container font-data-mono-sm text-data-mono-sm text-on-surface-variant">
<span class="material-symbols-outlined text-[15px] text-outline">schedule</span>
<span id="tactical-clock">09:44:18 UTC</span>
</div>
<button class="flex items-center gap-space-xs px-space-sm py-space-2xs rounded bg-surface-container hover:bg-surface-container-high text-primary font-headline-sm text-body-sm transition-colors" type="button">
<span class="material-symbols-outlined text-[16px]">sync</span>
<span>Re-Index Feeds</span>
</button>
<button class="flex items-center gap-space-xs px-space-sm py-space-2xs rounded bg-primary text-on-primary font-headline-sm text-body-sm font-semibold hover:bg-secondary transition-colors" type="button">
<span class="material-symbols-outlined text-[16px]">print</span>
<span>Briefing Pack</span>
</button>
</div>
</div>
<!-- 1. TOP KPI SUMMARY ROW (4-COLUMN GRID) -->
<section class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md">
<!-- Active Cases -->
<div class="flex flex-col justify-between bg-surface-container-low p-space-md rounded-xl shadow-sm hover:bg-surface-container transition-colors">
<div class="flex items-start justify-between">
<div class="flex flex-col">
<span class="font-label-md text-label-md uppercase tracking-wider text-outline">Active Cases</span>
<span class="font-data-mono-sm text-data-mono-sm text-on-surface-variant">PRIORITY DOSSIERS</span>
</div>
<div class="flex items-center gap-1 px-space-xs py-space-2xs rounded bg-primary-container/20 text-primary font-data-mono-sm text-data-mono-sm">
<span class="material-symbols-outlined text-[14px]">trending_up</span>
<span>+3 WTD</span>
</div>
</div>
<div class="flex items-baseline justify-between mt-space-sm">
<div class="font-display-lg text-display-lg text-on-surface font-semibold tracking-tight">24</div>
<!-- Sparkline Trend Chart -->
<svg class="w-20 h-7 text-primary" fill="none" viewbox="0 0 80 28">
<path d="M2 24 L18 19 L34 22 L50 11 L66 14 L78 3" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
<path d="M2 24 L18 19 L34 22 L50 11 L66 14 L78 3 L78 28 L2 28 Z" fill="currentColor" fill-opacity="0.08"></path>
</svg>
</div>
<div class="mt-space-sm pt-space-xs flex items-center justify-between text-on-surface-variant font-data-mono-sm text-data-mono-sm bg-surface-container-lowest/60 px-space-xs py-space-2xs rounded">
<span class="flex items-center gap-1 text-secondary">
<span class="w-1.5 h-1.5 rounded-full bg-secondary"></span>
          8 under active surveillance
        </span>
<span class="text-outline">SYS.77</span>
</div>
</div>
<!-- Entities Tracked -->
<div class="flex flex-col justify-between bg-surface-container-low p-space-md rounded-xl shadow-sm hover:bg-surface-container transition-colors">
<div class="flex items-start justify-between">
<div class="flex flex-col">
<span class="font-label-md text-label-md uppercase tracking-wider text-outline">Entities Tracked</span>
<span class="font-data-mono-sm text-data-mono-sm text-on-surface-variant">CROSS-JURISDICTION</span>
</div>
<div class="flex items-center gap-1 px-space-xs py-space-2xs rounded bg-primary-container/20 text-primary font-data-mono-sm text-data-mono-sm">
<span class="material-symbols-outlined text-[14px]">arrow_upward</span>
<span>+42 FED</span>
</div>
</div>
<div class="flex items-baseline justify-between mt-space-sm">
<div class="font-display-lg text-display-lg text-on-surface font-semibold tracking-tight">1,428</div>
<!-- Mini Bar Volume Vector -->
<div class="flex items-end gap-1 h-7">
<div class="w-2 h-3 bg-outline-variant rounded-xs"></div>
<div class="w-2 h-4 bg-outline rounded-xs"></div>
<div class="w-2 h-5 bg-secondary-container rounded-xs"></div>
<div class="w-2 h-7 bg-primary rounded-xs"></div>
</div>
</div>
<div class="mt-space-sm pt-space-xs flex items-center justify-between text-on-surface-variant font-data-mono-sm text-data-mono-sm bg-surface-container-lowest/60 px-space-xs py-space-2xs rounded">
<span class="truncate text-on-surface">312 POIs • 840 Orgs • 276 Assets</span>
</div>
</div>
<!-- Pending Review -->
<div class="flex flex-col justify-between bg-surface-container-low p-space-md rounded-xl shadow-sm hover:bg-surface-container transition-colors">
<div class="flex items-start justify-between">
<div class="flex flex-col">
<span class="font-label-md text-label-md uppercase tracking-wider text-outline">Pending Review</span>
<span class="font-data-mono-sm text-data-mono-sm text-on-surface-variant">TRIAGE INBOX</span>
</div>
<div class="flex items-center gap-1 px-space-xs py-space-2xs rounded bg-surface-container-high text-tertiary font-data-mono-sm text-data-mono-sm">
<span class="material-symbols-outlined text-[14px]">trending_down</span>
<span>-4 CLEARED</span>
</div>
</div>
<div class="flex items-baseline justify-between mt-space-sm">
<div class="font-display-lg text-display-lg text-on-surface font-semibold tracking-tight">18</div>
<!-- Progress Ring Radial -->
<div class="relative w-8 h-8 flex items-center justify-center">
<svg class="w-8 h-8 transform -rotate-90" viewbox="0 0 36 36">
<path class="text-surface-variant" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="3.5"></path>
<path class="text-secondary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-dasharray="64, 100" stroke-linecap="round" stroke-width="3.5"></path>
</svg>
<span class="absolute font-data-mono-sm text-[10px] text-on-surface-variant">64%</span>
</div>
</div>
<div class="mt-space-sm pt-space-xs flex items-center justify-between text-on-surface-variant font-data-mono-sm text-data-mono-sm bg-surface-container-lowest/60 px-space-xs py-space-2xs rounded">
<span class="truncate text-tertiary-fixed-dim">6 wire cross-references pending</span>
<span class="text-outline">T-Q4</span>
</div>
</div>
<!-- Open Alerts -->
<div class="flex flex-col justify-between bg-surface-container-low p-space-md rounded-xl shadow-sm hover:bg-surface-container transition-colors">
<div class="flex items-start justify-between">
<div class="flex flex-col">
<span class="font-label-md text-label-md uppercase tracking-wider text-outline">Open Alerts</span>
<span class="font-data-mono-sm text-data-mono-sm text-on-surface-variant">IMMEDIATE ATTN</span>
</div>
<div class="flex items-center gap-1 px-space-xs py-space-2xs rounded bg-error-container/30 text-error font-data-mono-sm text-data-mono-sm">
<span class="w-1.5 h-1.5 rounded-full bg-error animate-pulse"></span>
<span>+2 CRIT</span>
</div>
</div>
<div class="flex items-baseline justify-between mt-space-sm">
<div class="font-display-lg text-display-lg text-error font-semibold tracking-tight">07</div>
<div class="px-space-xs py-space-2xs rounded bg-error-container/40 text-on-error-container font-data-mono-sm text-data-mono-sm flex items-center gap-1">
<span class="material-symbols-outlined text-[14px]">warning</span>
<span>HIGH THREAT</span>
</div>
</div>
<div class="mt-space-sm pt-space-xs flex items-center justify-between text-on-surface-variant font-data-mono-sm text-data-mono-sm bg-surface-container-lowest/60 px-space-xs py-space-2xs rounded">
<span class="text-error truncate">3 warrants / geofence hits</span>
<span class="text-outline">QUEUE #1</span>
</div>
</div>
</section>
<!-- 2. MIDDLE TWO-COLUMN OPERATIONAL SECTION -->
<section class="grid grid-cols-1 lg:grid-cols-12 gap-space-md items-start">
<!-- Left Column (approx 58-60% width): Recent Activity Feed -->
<div class="lg:col-span-7 flex flex-col bg-surface-container-low rounded-xl shadow-sm overflow-hidden">
<!-- Section Header -->
<div class="h-11 px-space-md bg-surface-container flex items-center justify-between">
<div class="flex items-center gap-space-sm">
<span class="material-symbols-outlined text-[18px] text-primary">dynamic_feed</span>
<span class="font-headline-sm text-headline-sm text-on-surface font-semibold">Investigator Activity Ledger</span>
<span class="px-space-xs py-space-2xs rounded bg-surface-container-high font-data-mono-sm text-data-mono-sm text-on-surface-variant">REALTIME STREAM</span>
</div>
<div class="flex items-center gap-space-xs text-on-surface-variant font-data-mono-sm text-data-mono-sm">
<button class="px-space-xs py-space-2xs rounded bg-surface-container-low hover:text-on-surface transition-colors" type="button">All Types</button>
<button class="px-space-xs py-space-2xs rounded bg-surface-container-low hover:text-on-surface transition-colors" type="button">Filter</button>
</div>
</div>
<!-- Feed Rows -->
<div class="divide-y divide-surface-container" data-recent-activity>
<!-- Activity 1: Entity Merge -->
<div class="p-space-md hover:bg-surface-container/60 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-space-sm">
<div class="flex items-start gap-space-sm min-w-0">
<div class="w-8 h-8 rounded bg-primary-container/20 flex items-center justify-center shrink-0">
<span class="material-symbols-outlined text-primary text-[18px]">merge_type</span>
</div>
<div class="flex flex-col min-w-0">
<div class="flex flex-wrap items-center gap-space-xs mb-space-2xs">
<span class="px-space-xs py-space-2xs rounded bg-primary-container/20 text-primary font-data-mono-sm text-data-mono-sm">ENTITY MERGE</span>
<span class="font-data-mono-sm text-data-mono-sm text-outline">REF: MERGE-94021</span>
</div>
<p class="font-body-md text-body-md text-on-surface">
                Unified duplicate record: <a class="text-primary hover:underline font-semibold" href="#">Viktor Reznov</a> alias 
                <span class="text-secondary font-mono">"The Architect"</span> (ID: <span class="font-data-mono-sm text-data-mono-sm text-on-surface-variant">P-9042</span>) merged with NCIC record <span class="font-data-mono-sm text-data-mono-sm text-secondary font-semibold">#88129</span>.
              </p>
<div class="flex items-center gap-space-sm mt-space-xs text-on-surface-variant font-data-mono-sm text-data-mono-sm">
<span class="flex items-center gap-1">
<span class="material-symbols-outlined text-[14px]">account_tree</span>
                  24 Associated Sub-nodes
                </span>
<span>•</span>
<span class="text-outline">Autonomous Resolution Engine</span>
</div>
</div>
</div>
<div class="flex sm:flex-col items-center sm:items-end justify-between shrink-0 gap-space-xs">
<span class="font-data-mono-sm text-data-mono-sm text-on-surface-variant bg-surface-container px-space-xs py-space-2xs rounded">09:41:22 UTC</span>
<button class="text-primary hover:text-secondary font-label-md text-label-md flex items-center gap-0.5" type="button">
<span>Inspect</span>
<span class="material-symbols-outlined text-[13px]">arrow_forward</span>
</button>
</div>
</div>
<!-- Activity 2: Financial Extraction -->
<div class="p-space-md hover:bg-surface-container/60 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-space-sm">
<div class="flex items-start gap-space-sm min-w-0">
<div class="w-8 h-8 rounded bg-secondary-container/20 flex items-center justify-center shrink-0">
<span class="material-symbols-outlined text-secondary text-[18px]">account_balance</span>
</div>
<div class="flex flex-col min-w-0">
<div class="flex flex-wrap items-center gap-space-xs mb-space-2xs">
<span class="px-space-xs py-space-2xs rounded bg-secondary-container/20 text-secondary font-data-mono-sm text-data-mono-sm">FINANCIAL EXTRACTION</span>
<span class="font-data-mono-sm text-data-mono-sm text-outline">SWIFT.INGEST</span>
</div>
<p class="font-body-md text-body-md text-on-surface">
                Automated SWIFT wire ledger extracted from <a class="text-primary hover:underline font-semibold" href="#">Kestrel Holdings</a> sub-account <span class="font-data-mono-sm text-data-mono-sm text-secondary font-semibold">#4091-B</span>. Total aggregate velocity: <span class="text-on-surface font-semibold">$3,420,000 USD</span>.
              </p>
<div class="flex items-center gap-space-sm mt-space-xs text-on-surface-variant font-data-mono-sm text-data-mono-sm">
<span class="text-tertiary-fixed-dim">Correspondent: Deutsche Nord Bank (CY)</span>
<span>•</span>
<span class="text-outline">FinCEN Target Flag</span>
</div>
</div>
</div>
<div class="flex sm:flex-col items-center sm:items-end justify-between shrink-0 gap-space-xs">
<span class="font-data-mono-sm text-data-mono-sm text-on-surface-variant bg-surface-container px-space-xs py-space-2xs rounded">08:15:04 UTC</span>
<button class="text-primary hover:text-secondary font-label-md text-label-md flex items-center gap-0.5" type="button">
<span>Inspect</span>
<span class="material-symbols-outlined text-[13px]">arrow_forward</span>
</button>
</div>
</div>
<!-- Activity 3: Communication Intercept -->
<div class="p-space-md hover:bg-surface-container/60 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-space-sm">
<div class="flex items-start gap-space-sm min-w-0">
<div class="w-8 h-8 rounded bg-surface-container-high flex items-center justify-center shrink-0">
<span class="material-symbols-outlined text-tertiary text-[18px]">cell_tower</span>
</div>
<div class="flex flex-col min-w-0">
<div class="flex flex-wrap items-center gap-space-xs mb-space-2xs">
<span class="px-space-xs py-space-2xs rounded bg-surface-container-high text-tertiary font-data-mono-sm text-data-mono-sm">COMMUNICATION INTERCEPT</span>
<span class="font-data-mono-sm text-data-mono-sm text-error">SIGINT TOWER 14</span>
</div>
<p class="font-body-md text-body-md text-on-surface">
                Burner telemetry match <span class="font-data-mono-sm text-data-mono-sm text-primary font-semibold">IMEI-89421</span> linked to <a class="text-primary hover:underline font-semibold" href="#">Antwerp Terminal Sector 9</a>. Device active on encrypted peer network.
              </p>
<div class="flex items-center gap-space-sm mt-space-xs text-on-surface-variant font-data-mono-sm text-data-mono-sm">
<span class="flex items-center gap-1 text-on-surface">
<span class="material-symbols-outlined text-[14px] text-outline">location_on</span>
                  51.2194° N, 4.4025° E
                </span>
<span>•</span>
<span class="text-outline">Base Cell: BXL-992</span>
</div>
</div>
</div>
<div class="flex sm:flex-col items-center sm:items-end justify-between shrink-0 gap-space-xs">
<span class="font-data-mono-sm text-data-mono-sm text-on-surface-variant bg-surface-container px-space-xs py-space-2xs rounded">07:32:50 UTC</span>
<button class="text-primary hover:text-secondary font-label-md text-label-md flex items-center gap-0.5" type="button">
<span>Inspect</span>
<span class="material-symbols-outlined text-[13px]">arrow_forward</span>
</button>
</div>
</div>
<!-- Activity 4: Case Note Added -->
<div class="p-space-md hover:bg-surface-container/60 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-space-sm">
<div class="flex items-start gap-space-sm min-w-0">
<div class="w-8 h-8 rounded bg-surface-container-high flex items-center justify-center shrink-0">
<span class="material-symbols-outlined text-outline text-[18px]">edit_note</span>
</div>
<div class="flex flex-col min-w-0">
<div class="flex flex-wrap items-center gap-space-xs mb-space-2xs">
<span class="px-space-xs py-space-2xs rounded bg-surface-container-high text-on-surface-variant font-data-mono-sm text-data-mono-sm">CASE NOTE ADDED</span>
<span class="font-data-mono-sm text-data-mono-sm text-outline">MANUAL ENTRY</span>
</div>
<p class="font-body-md text-body-md text-on-surface">
                Investigator <span class="text-on-surface font-semibold">Vance, M.</span> updated surveillance log for <a class="text-primary hover:underline font-semibold" href="#">Operation Blackthorn</a>: Primary suspect observed attending private dry-dock meeting with cargo logistics coordinator.
              </p>
<div class="flex items-center gap-space-sm mt-space-xs text-on-surface-variant font-data-mono-sm text-data-mono-sm">
<span class="text-on-surface-variant">Attachments: 4 Still Frames (Infrared)</span>
<span>•</span>
<span class="text-outline">Classified Level 3</span>
</div>
</div>
</div>
<div class="flex sm:flex-col items-center sm:items-end justify-between shrink-0 gap-space-xs">
<span class="font-data-mono-sm text-data-mono-sm text-on-surface-variant bg-surface-container px-space-xs py-space-2xs rounded">06:12:11 UTC</span>
<button class="text-primary hover:text-secondary font-label-md text-label-md flex items-center gap-0.5" type="button">
<span>Inspect</span>
<span class="material-symbols-outlined text-[13px]">arrow_forward</span>
</button>
</div>
</div>
</div>
<!-- Feed Footer -->
<div class="p-space-sm bg-surface-container flex items-center justify-between font-data-mono-sm text-data-mono-sm text-on-surface-variant">
<span>Showing 4 of 188 events in active window</span>
<a class="text-primary hover:text-secondary font-label-md text-label-md uppercase tracking-wider" href="#">Expand Full Audit Ledger →</a>
</div>
</div>
<!-- Right Column (approx 40-42% width): Priority Alerts -->
<div class="lg:col-span-5 flex flex-col bg-surface-container-low rounded-xl shadow-sm overflow-hidden">
<!-- Section Header -->
<div class="h-11 px-space-md bg-surface-container flex items-center justify-between">
<div class="flex items-center gap-space-sm">
<span class="material-symbols-outlined text-[18px] text-error">crisis_alert</span>
<span class="font-headline-sm text-headline-sm text-on-surface font-semibold">Priority Alerts</span>
<span class="px-space-xs py-space-2xs rounded bg-error-container/30 text-error font-data-mono-sm text-data-mono-sm">4 ACTION REQUIRED</span>
</div>
<button class="text-outline hover:text-on-surface transition-colors" title="Alert Filter" type="button">
<span class="material-symbols-outlined text-[18px]">tune</span>
</button>
</div>
<!-- Alerts List -->
<div class="p-space-md space-y-space-md" data-priority-alerts>
<!-- Real-Time FBI Top Ten Alert: Ruja Ignatova -->
<div class="p-space-md rounded-lg bg-surface-container hover:bg-surface-container-high transition-all border border-error/40 relative overflow-hidden">
<div class="flex items-start justify-between gap-space-xs">
<div class="flex items-center gap-space-xs">
<span class="flex items-center gap-1 px-space-xs py-space-2xs rounded bg-error-container/60 text-error font-data-mono-sm text-data-mono-sm font-bold">
<span class="w-1.5 h-1.5 rounded-full bg-error animate-ping"></span>
FBI TOP 10
</span>
<span class="font-data-mono-sm text-data-mono-sm text-amber-400 font-bold">$5,000,000 BOUNTY</span>
<span class="font-data-mono-sm text-data-mono-sm text-primary font-semibold">ALT-FBI-01</span>
</div>
<span class="font-data-mono-sm text-data-mono-sm text-secondary flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>LIVE</span>
</div>
<div class="flex items-center gap-space-sm mt-space-xs">
<img src="https://www.fbi.gov/wanted/topten/ruja-ignatova/@@images/image" class="w-10 h-10 rounded-full object-cover border-2 border-error shrink-0" onerror="this.src='assets/images/analyst-vance.png'"/>
<div>
<h4 class="font-headline-sm text-headline-sm text-on-surface font-semibold">
Ruja Ignatova ("Cryptoqueen")
</h4>
<span class="font-data-mono-sm text-data-mono-sm text-outline">POI-FBI-7661467 • OneCoin Wire Structuring</span>
</div>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-space-2xs">
Target wanted by FBI for massive global cryptocurrency fraud scheme. Multiple offshore shell routing dispatches flagged within active Baltic syndicate accounts.
</p>
<div class="flex items-center justify-between mt-space-sm pt-space-xs border-t border-outline-variant/20">
<div class="flex items-center gap-space-xs font-data-mono-sm text-data-mono-sm text-amber-400">
<span class="material-symbols-outlined text-[14px]">local_police</span>
<span>Extradition Warrant Active</span>
</div>
<a href="entity-profiles.html?id=POI-FBI-7661467" class="px-space-sm py-1 rounded bg-primary text-on-primary font-headline-sm text-body-sm font-semibold hover:bg-secondary transition-colors inline-flex items-center gap-1">
<span class="material-symbols-outlined text-[14px]">badge</span>
Pivot Dossier
</a>
</div>
</div>
<!-- Alert 1: Structuring -->
<div class="p-space-md rounded-lg bg-surface-container hover:bg-surface-container-high transition-all">
<div class="flex items-start justify-between gap-space-xs">
<div class="flex items-center gap-space-xs">
<span class="flex items-center gap-1 px-space-xs py-space-2xs rounded bg-error-container/40 text-on-error-container font-data-mono-sm text-data-mono-sm font-semibold">
<span class="w-1.5 h-1.5 rounded-full bg-error animate-ping"></span>
                CRITICAL
              </span>
<span class="font-data-mono-sm text-data-mono-sm text-primary font-semibold">ALT-8821</span>
</div>
<span class="font-data-mono-sm text-data-mono-sm text-outline">T-minus 14m</span>
</div>
<h4 class="font-headline-sm text-headline-sm text-on-surface font-semibold mt-space-xs">
            Rapid Fund Dispersion &amp; Structuring
          </h4>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-space-2xs">
            6 simultaneous wire transfers strictly under the $10,000 reporting threshold dispatched to offshore shell accounts within 45 minutes.
          </p>
<div class="flex items-center justify-between mt-space-sm pt-space-xs">
<div class="flex items-center gap-space-xs font-data-mono-sm text-data-mono-sm text-outline">
<span class="material-symbols-outlined text-[14px]">radar</span>
<span>Pattern: SMURF-ALPHA</span>
</div>
<button class="px-space-sm py-1 rounded bg-primary text-on-primary font-headline-sm text-body-sm font-semibold hover:bg-secondary transition-colors" type="button">
              Review Alert
            </button>
</div>
</div>
<!-- Alert 2: Geofence Breach -->
<div class="p-space-md rounded-lg bg-surface-container hover:bg-surface-container-high transition-all">
<div class="flex items-start justify-between gap-space-xs">
<div class="flex items-center gap-space-xs">
<span class="flex items-center gap-1 px-space-xs py-space-2xs rounded bg-error-container/40 text-on-error-container font-data-mono-sm text-data-mono-sm font-semibold">
<span class="w-1.5 h-1.5 rounded-full bg-error"></span>
                CRITICAL
              </span>
<span class="font-data-mono-sm text-data-mono-sm text-primary font-semibold">ALT-8819</span>
</div>
<span class="font-data-mono-sm text-data-mono-sm text-outline">T-minus 38m</span>
</div>
<h4 class="font-headline-sm text-headline-sm text-on-surface font-semibold mt-space-xs">
            Geofence Breach &amp; Vessel Convergence
          </h4>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-space-2xs">
            Monitored Vessel <span class="text-secondary font-mono">Baltic-X</span> docked within 500m of flagged Warehouse WH-12 during restricted curfew hours.
          </p>
<div class="flex items-center justify-between mt-space-sm pt-space-xs">
<div class="flex items-center gap-space-xs font-data-mono-sm text-data-mono-sm text-outline">
<span class="material-symbols-outlined text-[14px]">anchor</span>
<span>AIS: 271044912</span>
</div>
<button class="px-space-sm py-1 rounded bg-primary text-on-primary font-headline-sm text-body-sm font-semibold hover:bg-secondary transition-colors" type="button">
              Review Alert
            </button>
</div>
</div>
<!-- Alert 3: Sanctions Entity Match -->
<div class="p-space-md rounded-lg bg-surface-container hover:bg-surface-container-high transition-all">
<div class="flex items-start justify-between gap-space-xs">
<div class="flex items-center gap-space-xs">
<span class="px-space-xs py-space-2xs rounded bg-secondary-container/20 text-secondary font-data-mono-sm text-data-mono-sm font-semibold">
                HIGH THREAT
              </span>
<span class="font-data-mono-sm text-data-mono-sm text-primary font-semibold">ALT-8804</span>
</div>
<span class="font-data-mono-sm text-data-mono-sm text-outline">1h 05m ago</span>
</div>
<h4 class="font-headline-sm text-headline-sm text-on-surface font-semibold mt-space-xs">
            Sanction List Entity Alias Match
          </h4>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-space-2xs">
            New corporate registration in Limassol matched 88% fuzzy score with blocked entity <span class="text-on-surface font-mono font-semibold">BVI Shell #099</span>.
          </p>
<div class="flex items-center justify-between mt-space-sm pt-space-xs">
<div class="flex items-center gap-space-xs font-data-mono-sm text-data-mono-sm text-outline">
<span class="material-symbols-outlined text-[14px]">domain</span>
<span>OFAC SDN List Cross</span>
</div>
<button class="px-space-sm py-1 rounded bg-surface-container-high hover:bg-surface-container-highest text-on-surface hover:text-primary font-headline-sm text-body-sm transition-colors" type="button">
              Review Alert
            </button>
</div>
</div>
<!-- Alert 4: Burner Flip -->
<div class="p-space-md rounded-lg bg-surface-container hover:bg-surface-container-high transition-all">
<div class="flex items-start justify-between gap-space-xs">
<div class="flex items-center gap-space-xs">
<span class="px-space-xs py-space-2xs rounded bg-secondary-container/20 text-secondary font-data-mono-sm text-data-mono-sm font-semibold">
                HIGH THREAT
              </span>
<span class="font-data-mono-sm text-data-mono-sm text-primary font-semibold">ALT-8798</span>
</div>
<span class="font-data-mono-sm text-data-mono-sm text-outline">1h 42m ago</span>
</div>
<h4 class="font-headline-sm text-headline-sm text-on-surface font-semibold mt-space-xs">
            Burner Telemetry Node Flip
          </h4>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-space-2xs">
            3 burner devices in Frankfurt network switched cellular base towers concurrently. High probability of synchronized evasive movement.
          </p>
<div class="flex items-center justify-between mt-space-sm pt-space-xs">
<div class="flex items-center gap-space-xs font-data-mono-sm text-data-mono-sm text-outline">
<span class="material-symbols-outlined text-[14px]">hub</span>
<span>Cluster: FRA-WEST</span>
</div>
<button class="px-space-sm py-1 rounded bg-surface-container-high hover:bg-surface-container-highest text-on-surface hover:text-primary font-headline-sm text-body-sm transition-colors" type="button">
              Review Alert
            </button>
</div>
</div>
</div>
</div>
</section>
<!-- 3. BOTTOM SECTION: QUICK CASE ACCESS GRID -->
<section class="flex flex-col space-y-space-sm pt-space-xs">
<div class="flex items-center justify-between">
<div class="flex items-center gap-space-sm">
<span class="material-symbols-outlined text-primary text-[20px]">folder_special</span>
<h3 class="font-headline-md text-headline-md text-on-surface font-semibold">Quick Case Workspaces</h3>
<span class="font-data-mono-sm text-data-mono-sm text-on-surface-variant">ACTIVE HIGH-PRIORITY (4)</span>
</div>
<a class="text-primary hover:text-secondary font-label-md text-label-md uppercase tracking-wider flex items-center gap-1" href="#">
<span>View All 24 Case Files</span>
<span class="material-symbols-outlined text-[14px]">chevron_right</span>
</a>
</div>
<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-md" data-case-cards>
<!-- Case 1: Operation Blackthorn -->
<div class="group flex flex-col justify-between bg-surface-container-low p-space-md rounded-xl shadow-sm hover:bg-surface-container transition-all">
<div>
<div class="flex items-start justify-between gap-space-xs">
<span class="font-data-mono-sm text-data-mono-sm text-primary font-bold"><a href="case-workspaces.html" class="text-primary hover:underline">CS-2024-8841</a></span>
<span class="flex items-center gap-1 px-space-xs py-space-2xs rounded bg-error-container/40 text-on-error-container font-data-mono-sm text-[10px] font-bold">
<span class="w-1.5 h-1.5 rounded-full bg-error"></span>
              ACTIVE CRITICAL
            </span>
</div>
<h4 class="font-headline-sm text-headline-sm text-on-surface font-bold mt-space-sm group-hover:text-primary transition-colors">
            Operation Blackthorn
          </h4>
<span class="font-body-sm text-body-sm text-outline block mt-0.5">
            Transnational Arms &amp; Sanction Evasion
          </span>
<div class="mt-space-md flex flex-col space-y-space-xs font-data-mono-sm text-data-mono-sm bg-surface-container-lowest/80 p-space-sm rounded">
<div class="flex items-center justify-between text-on-surface-variant">
<span>Linked Entities:</span>
<span class="text-secondary font-semibold">48 Targets</span>
</div>
<div class="flex items-center justify-between text-on-surface-variant">
<span>Case Lead:</span>
<span class="text-on-surface">Vance, M.</span>
</div>
<div class="flex items-center justify-between text-on-surface-variant">
<span>Last Touch:</span>
<span class="text-primary">4m ago</span>
</div>
</div>
</div>
<div class="mt-space-md pt-space-xs grid grid-cols-2 gap-space-xs">
<button class="px-space-xs py-1.5 rounded bg-primary text-on-primary font-headline-sm text-body-sm font-semibold hover:bg-secondary transition-colors text-center" type="button">
            Workspace
          </button>
<button class="flex items-center justify-center gap-1 px-space-xs py-1.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-headline-sm text-body-sm transition-colors text-center" type="button">
<span class="material-symbols-outlined text-[14px]">grain</span>
<span>Graph</span>
</button>
</div>
</div>
<!-- Case 2: Sovereign Trust Laundering -->
<div class="group flex flex-col justify-between bg-surface-container-low p-space-md rounded-xl shadow-sm hover:bg-surface-container transition-all">
<div>
<div class="flex items-start justify-between gap-space-xs">
<span class="font-data-mono-sm text-data-mono-sm text-primary font-bold">CS-2024-7910</span>
<span class="flex items-center gap-1 px-space-xs py-space-2xs rounded bg-surface-container-high text-secondary font-data-mono-sm text-[10px] font-bold">
<span class="w-1.5 h-1.5 rounded-full bg-secondary"></span>
              ACTIVE ELEVATED
            </span>
</div>
<h4 class="font-headline-sm text-headline-sm text-on-surface font-bold mt-space-sm group-hover:text-primary transition-colors">
            Sovereign Trust Laundering
          </h4>
<span class="font-body-sm text-body-sm text-outline block mt-0.5">
            Layered Offshore Real Estate Capital
          </span>
<div class="mt-space-md flex flex-col space-y-space-xs font-data-mono-sm text-data-mono-sm bg-surface-container-lowest/80 p-space-sm rounded">
<div class="flex items-center justify-between text-on-surface-variant">
<span>Linked Entities:</span>
<span class="text-secondary font-semibold">114 Targets</span>
</div>
<div class="flex items-center justify-between text-on-surface-variant">
<span>Case Lead:</span>
<span class="text-on-surface">Chen, D.</span>
</div>
<div class="flex items-center justify-between text-on-surface-variant">
<span>Last Touch:</span>
<span class="text-primary">18m ago</span>
</div>
</div>
</div>
<div class="mt-space-md pt-space-xs grid grid-cols-2 gap-space-xs">
<button class="px-space-xs py-1.5 rounded bg-primary text-on-primary font-headline-sm text-body-sm font-semibold hover:bg-secondary transition-colors text-center" type="button">
            Workspace
          </button>
<button class="flex items-center justify-center gap-1 px-space-xs py-1.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-headline-sm text-body-sm transition-colors text-center" type="button">
<span class="material-symbols-outlined text-[14px]">grain</span>
<span>Graph</span>
</button>
</div>
</div>
<!-- Case 3: Port Authority Cargo Diversion -->
<div class="group flex flex-col justify-between bg-surface-container-low p-space-md rounded-xl shadow-sm hover:bg-surface-container transition-all">
<div>
<div class="flex items-start justify-between gap-space-xs">
<span class="font-data-mono-sm text-data-mono-sm text-primary font-bold">CS-2024-9102</span>
<span class="flex items-center gap-1 px-space-xs py-space-2xs rounded bg-surface-container-high text-tertiary font-data-mono-sm text-[10px] font-bold">
<span class="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
              MONITORING
            </span>
</div>
<h4 class="font-headline-sm text-headline-sm text-on-surface font-bold mt-space-sm group-hover:text-primary transition-colors">
            Port Cargo Diversion
          </h4>
<span class="font-body-sm text-body-sm text-outline block mt-0.5">
            Terminal B Freight Relabeling
          </span>
<div class="mt-space-md flex flex-col space-y-space-xs font-data-mono-sm text-data-mono-sm bg-surface-container-lowest/80 p-space-sm rounded">
<div class="flex items-center justify-between text-on-surface-variant">
<span>Linked Entities:</span>
<span class="text-secondary font-semibold">29 Targets</span>
</div>
<div class="flex items-center justify-between text-on-surface-variant">
<span>Case Lead:</span>
<span class="text-on-surface">Thorne, J.</span>
</div>
<div class="flex items-center justify-between text-on-surface-variant">
<span>Last Touch:</span>
<span class="text-outline">1h ago</span>
</div>
</div>
</div>
<div class="mt-space-md pt-space-xs grid grid-cols-2 gap-space-xs">
<button class="px-space-xs py-1.5 rounded bg-primary text-on-primary font-headline-sm text-body-sm font-semibold hover:bg-secondary transition-colors text-center" type="button">
            Workspace
          </button>
<button class="flex items-center justify-center gap-1 px-space-xs py-1.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-headline-sm text-body-sm transition-colors text-center" type="button">
<span class="material-symbols-outlined text-[14px]">grain</span>
<span>Graph</span>
</button>
</div>
</div>
<!-- Case 4: Vector Phantom Cyber Syndicate -->
<div class="group flex flex-col justify-between bg-surface-container-low p-space-md rounded-xl shadow-sm hover:bg-surface-container transition-all">
<div>
<div class="flex items-start justify-between gap-space-xs">
<span class="font-data-mono-sm text-data-mono-sm text-primary font-bold">CS-2024-8204</span>
<span class="flex items-center gap-1 px-space-xs py-space-2xs rounded bg-surface-container-high text-on-surface font-data-mono-sm text-[10px] font-bold">
<span class="w-1.5 h-1.5 rounded-full bg-primary"></span>
              TASK FORCE
            </span>
</div>
<h4 class="font-headline-sm text-headline-sm text-on-surface font-bold mt-space-sm group-hover:text-primary transition-colors">
            Vector Phantom Cyber
          </h4>
<span class="font-body-sm text-body-sm text-outline block mt-0.5">
            SCADA Infiltration Keyloggers
          </span>
<div class="mt-space-md flex flex-col space-y-space-xs font-data-mono-sm text-data-mono-sm bg-surface-container-lowest/80 p-space-sm rounded">
<div class="flex items-center justify-between text-on-surface-variant">
<span>Linked Entities:</span>
<span class="text-secondary font-semibold">67 Targets</span>
</div>
<div class="flex items-center justify-between text-on-surface-variant">
<span>Case Lead:</span>
<span class="text-on-surface">Sterling, R.</span>
</div>
<div class="flex items-center justify-between text-on-surface-variant">
<span>Last Touch:</span>
<span class="text-outline">2h ago</span>
</div>
</div>
</div>
<div class="mt-space-md pt-space-xs grid grid-cols-2 gap-space-xs">
<button class="px-space-xs py-1.5 rounded bg-primary text-on-primary font-headline-sm text-body-sm font-semibold hover:bg-secondary transition-colors text-center" type="button">
            Workspace
          </button>
<button class="flex items-center justify-center gap-1 px-space-xs py-1.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-headline-sm text-body-sm transition-colors text-center" type="button">
<span class="material-symbols-outlined text-[14px]">grain</span>
<span>Graph</span>
</button>
</div>
</div>
</div>
</section>
</div>
<script>
  // Tactical live clock updater
  (function updateClock() {
    const clockEl = document.getElementById('tactical-clock');
    if (!clockEl) return;
    const now = new Date();
    const h = String(now.getUTCHours()).padStart(2, '0');
    const m = String(now.getUTCMinutes()).padStart(2, '0');
    const s = String(now.getUTCSeconds()).padStart(2, '0');
    clockEl.textContent = `${h}:${m}:${s} UTC`;
    setTimeout(updateClock, 1000);
  })();
</script></main></div><script src="assets/js/nexus-core.js"></script>
<script src="assets/js/nexus-live.js"></script>
<script src="assets/js/nexus-interactions.js"></script>
</body></html>
