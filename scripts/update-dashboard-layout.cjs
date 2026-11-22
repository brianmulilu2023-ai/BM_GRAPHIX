const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'pages', 'AdminDashboard.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add mobileSidebarOpen state
const activeTabNeedle = "  const [activeTab, setActiveTab] = useState('overview');";
const activeTabReplacement = `  const [activeTab, setActiveTab] = useState('overview');\n  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);`;

if (!content.includes('mobileSidebarOpen')) {
  content = content.replace(activeTabNeedle, activeTabReplacement);
  console.log('Added mobileSidebarOpen state.');
} else {
  console.log('mobileSidebarOpen already exists.');
}

// 2. Add navGroups and tabTitles right before return (
const returnNeedle = '  return (\n    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-28 space-y-8">';
const oldHeaderAndTabsEndNeedle = `      {/* ============================================================
          TAB 1: OVERVIEW & DASHBOARD SUMMARY
          ============================================================ */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Hero Quick Action Banner */}`;

const navGroupsAndTitles = `  const navGroups = [
    {
      group: 'Core',
      items: [
        { id: 'overview', label: 'Overview', icon: Sparkles, badge: null },
        { id: 'atmosphere', label: 'Atmosphere & Branding', icon: SlidersHorizontal, badge: 'Studio', badgeColor: 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40' },
      ]
    },
    {
      group: 'Content Studio',
      items: [
        { id: 'upload', label: 'New Project', icon: FolderPlus, badge: null, highlight: true },
        { id: 'projects', label: 'Manage Projects', icon: Layers, badge: projects.length },
        { id: 'media', label: 'Media Vault', icon: ImageIcon, badge: mediaItems.length },
      ]
    },
    {
      group: 'Engagement',
      items: [
        { id: 'inquiries', label: 'Client Inquiries', icon: Inbox, badge: newInquiriesCount > 0 ? \`\${newInquiriesCount} new\` : inquiries.length, ping: newInquiriesCount > 0 },
        { id: 'comments', label: 'Comments Moderation', icon: MessageCircle, badge: allComments.length },
      ]
    },
    {
      group: 'Preferences',
      items: [
        { id: 'settings', label: 'Account & Settings', icon: Settings, badge: null },
      ]
    }
  ];

  const tabTitles = {
    overview: { title: 'Dashboard Overview', subtitle: 'At-a-glance performance, quick actions & system metrics' },
    upload: { title: 'Create New Project', subtitle: 'Publish high-resolution artwork, posters & branding campaigns' },
    projects: { title: 'Manage Projects', subtitle: \`Curate, edit, reorder & feature your \${projects.length} portfolio items\` },
    media: { title: 'Media Vault', subtitle: \`Centralized asset storage with \${mediaItems.length} optimized images & videos\` },
    inquiries: { title: 'Client Inquiries', subtitle: 'Respond to prospective clients, custom briefs & design requests' },
    comments: { title: 'Comments Moderation', subtitle: 'Review community engagement and feedback on portfolio posts' },
    atmosphere: { title: 'Atmosphere & Per-Branding Studio', subtitle: 'Live landing page visibility controls, background depth & bespoke branding presets' },
    settings: { title: 'System Settings & Profile', subtitle: 'Manage administrator credentials, contact information & portfolio defaults' }
  };

  return (
    <div className="relative z-10 max-w-[1720px] mx-auto px-3 sm:px-6 lg:px-8 pt-28 pb-24">
      {/* ============================================================
          MOBILE TOP NAVBAR (STICKY FOR QUICK ACCESS)
          ============================================================ */}
      <div className="lg:hidden flex items-center justify-between p-3.5 mb-6 rounded-2xl glass-card border border-white/10 sticky top-20 z-40 backdrop-blur-xl shadow-lg">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-[#F5D77A] active:scale-95 transition"
            aria-label="Toggle Navigation Menu"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#D4AF37]">
              <span>BM Graphix Studio</span>
            </div>
            <h2 className="text-sm font-bold text-[#F5F1E8] flex items-center gap-1.5">
              {tabTitles[activeTab]?.title || 'Dashboard'}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSyncModal(true)}
            className="w-9 h-9 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#F5D77A]"
            title="Mobile Sync"
          >
            <Smartphone className="w-4 h-4" />
          </button>
          <div className="w-9 h-9 rounded-xl overflow-hidden border border-[#D4AF37]/40 flex-shrink-0 bg-black">
            <img
              src={adminUser?.avatar || '/assets/brian-mulilu.jpg'}
              alt="Admin"
              className="w-full h-full object-cover object-[center_18%]"
            />
          </div>
        </div>
      </div>

      {/* ============================================================
          MAIN SIDEBAR + CONTENT SPLIT LAYOUT
          ============================================================ */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
        {/* ============================================================
            DESKTOP SIDEBAR NAVIGATION
            ============================================================ */}
        <aside className="hidden lg:block w-72 xl:w-80 flex-shrink-0 sticky top-28 self-start max-h-[calc(100vh-8.5rem)] overflow-y-auto scrollbar-none">
          <div className="glass-card rounded-3xl border border-white/10 p-5 space-y-6 shadow-2xl relative overflow-hidden">
            {/* Subtle luxury ambient backlight */}
            <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-[#D4AF37]/10 blur-3xl pointer-events-none" />

            {/* Profile Lockup */}
            <div className="flex items-center gap-3.5 pb-5 border-b border-white/10 relative z-10">
              <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.35)] flex-shrink-0 bg-black">
                <img
                  src={adminUser?.avatar || '/assets/brian-mulilu.jpg'}
                  alt={adminUser?.name || 'Brian Mulilu'}
                  className="w-full h-full object-cover object-[center_18%]"
                />
                <span className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-black" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#D4AF37]/15 text-[10px] font-mono text-[#F5D77A] border border-[#D4AF37]/30 mb-0.5">
                  <Sparkles className="w-2.5 h-2.5 text-[#D4AF37]" />
                  <span>Admin Console</span>
                </div>
                <h3 className="font-display font-bold text-base text-[#F5F1E8] truncate">
                  {adminUser?.name || 'Brian Mulilu'}
                </h3>
                <p className="text-[11px] text-[#8A8A8A] truncate">
                  {adminUser?.role || 'Lead Visual Designer'}
                </p>
              </div>
            </div>

            {/* Navigation Groups */}
            <nav className="space-y-5 relative z-10">
              {navGroups.map((group) => (
                <div key={group.group} className="space-y-1.5">
                  <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#737373] px-3 block">
                    {group.group}
                  </span>
                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setActiveTab(item.id)}
                          className={\`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group \${
                            isActive
                              ? 'bg-gradient-to-r from-[#D4AF37] to-[#F5D77A] text-black font-bold shadow-md shadow-[#D4AF37]/25'
                              : 'text-[#A0A0A0] hover:text-[#F5F1E8] hover:bg-white/5'
                          }\`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon
                              className={\`w-4 h-4 transition-transform group-hover:scale-110 \${
                                isActive ? 'text-black' : 'text-[#D4AF37]'
                              }\`}
                            />
                            <span className="tracking-wide">{item.label}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            {item.badge !== null && item.badge !== undefined && (
                              <span
                                className={\`px-2 py-0.5 rounded-full text-[10px] font-semibold transition \${
                                  isActive
                                    ? 'bg-black/20 text-black font-bold'
                                    : item.ping
                                    ? 'bg-[#D4AF37] text-black font-bold animate-pulse'
                                    : item.badgeColor || 'bg-white/10 text-[#8A8A8A] group-hover:text-white'
                                }\`}
                              >
                                {item.badge}
                              </span>
                            )}
                            {item.ping && !isActive && (
                              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-ping" />
                            )}
                            {isActive && <ChevronRight className="w-3.5 h-3.5 text-black" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>

            {/* Sidebar Persistent Actions */}
            <div className="pt-4 border-t border-white/10 space-y-2 relative z-10">
              <button
                onClick={() => navigate('/work')}
                className="w-full px-3.5 py-2 rounded-xl text-xs font-medium text-[#F5F1E8] bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-2.5 transition"
              >
                <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>View Live Website</span>
              </button>

              <button
                onClick={() => setShowSyncModal(true)}
                className="w-full px-3.5 py-2 rounded-xl text-xs font-semibold text-black bg-gradient-to-r from-[#D4AF37] to-[#F5D77A] hover:brightness-110 shadow-md shadow-[#D4AF37]/20 flex items-center gap-2.5 transition"
                title="Cross-Device Media Sync & Mobile Access"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile Sync & Backup</span>
              </button>

              <button
                onClick={resetDefaults}
                className="w-full px-3.5 py-2 rounded-xl text-xs font-medium text-[#8A8A8A] hover:text-[#F5F1E8] bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-2.5 transition"
                title="Reset to 10 standard portfolio projects"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Demo Data</span>
              </button>

              <button
                onClick={() => {
                  adminLogout();
                  navigate('/admin/login');
                }}
                className="w-full px-3.5 py-2 rounded-xl text-xs font-semibold text-red-400 bg-red-950/30 hover:bg-red-900/40 border border-red-500/30 flex items-center gap-2.5 transition mt-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </aside>

        {/* ============================================================
            MOBILE OFF-CANVAS SLIDE-IN DRAWER
            ============================================================ */}
        <AnimatePresence>
          {mobileSidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileSidebarOpen(false)}
                className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 lg:hidden"
              />
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 250 }}
                className="fixed top-0 left-0 bottom-0 w-[84vw] max-w-xs bg-[#110F0C] border-r border-white/10 z-50 p-5 overflow-y-auto space-y-6 lg:hidden shadow-2xl"
              >
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl overflow-hidden border border-[#D4AF37]/50 bg-black flex-shrink-0">
                      <img
                        src={adminUser?.avatar || '/assets/brian-mulilu.jpg'}
                        alt="Brian Mulilu"
                        className="w-full h-full object-cover object-[center_18%]"
                      />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-sm text-[#F5F1E8]">
                        {adminUser?.name || 'Brian Mulilu'}
                      </h3>
                      <span className="text-[10px] text-[#F5D77A] font-mono">Administrator</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setMobileSidebarOpen(false)}
                    className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#8A8A8A] hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <nav className="space-y-5">
                  {navGroups.map((group) => (
                    <div key={group.group} className="space-y-1.5">
                      <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#737373] px-3 block">
                        {group.group}
                      </span>
                      <div className="space-y-1">
                        {group.items.map((item) => {
                          const Icon = item.icon;
                          const isActive = activeTab === item.id;
                          return (
                            <button
                              key={item.id}
                              onClick={() => {
                                setActiveTab(item.id);
                                setMobileSidebarOpen(false);
                              }}
                              className={\`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all \${
                                isActive
                                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#F5D77A] text-black font-bold shadow-md shadow-[#D4AF37]/20'
                                  : 'text-[#A0A0A0] hover:text-[#F5F1E8] hover:bg-white/5'
                              }\`}
                            >
                              <div className="flex items-center gap-3">
                                <Icon className={\`w-4 h-4 \${isActive ? 'text-black' : 'text-[#D4AF37]'}\`} />
                                <span>{item.label}</span>
                              </div>
                              {item.badge !== null && item.badge !== undefined && (
                                <span
                                  className={\`px-2 py-0.5 rounded-full text-[10px] font-semibold \${
                                    isActive ? 'bg-black/20 text-black' : 'bg-white/10 text-[#8A8A8A]'
                                  }\`}
                                >
                                  {item.badge}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </nav>

                <div className="pt-4 border-t border-white/10 space-y-2">
                  <button
                    onClick={() => {
                      navigate('/work');
                      setMobileSidebarOpen(false);
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs font-medium text-[#F5F1E8] bg-white/5 border border-white/10 flex items-center gap-2"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>View Live Site</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowSyncModal(true);
                      setMobileSidebarOpen(false);
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold text-black bg-gradient-to-r from-[#D4AF37] to-[#F5D77A] flex items-center gap-2"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Mobile Sync</span>
                  </button>

                  <button
                    onClick={() => {
                      adminLogout();
                      navigate('/admin/login');
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold text-red-400 bg-red-950/40 border border-red-500/40 flex items-center gap-2 mt-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* ============================================================
            MAIN CONTENT PANE
            ============================================================ */}
        <main className="flex-1 min-w-0 w-full space-y-6">
          {/* Desktop Main Header Breadcrumbs & Quick Toolbar */}
          <div className="hidden lg:flex items-center justify-between pb-5 border-b border-white/10">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono text-[#D4AF37] mb-1">
                <span>BM Graphix Central</span>
                <ChevronRight className="w-3 h-3 text-[#737373]" />
                <span className="text-[#F5D77A]">{tabTitles[activeTab]?.title}</span>
              </div>
              <h1 className="font-display font-extrabold text-2xl xl:text-3xl text-[#F5F1E8]">
                {tabTitles[activeTab]?.title}
              </h1>
              <p className="text-xs text-[#8A8A8A] mt-0.5">
                {tabTitles[activeTab]?.subtitle}
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => navigate('/work')}
                className="px-3.5 py-2 rounded-xl text-xs font-medium text-[#F5F1E8] bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-1.5 transition"
              >
                <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>View Live Site</span>
              </button>

              <button
                onClick={() => setShowSyncModal(true)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-black bg-gradient-to-r from-[#D4AF37] to-[#F5D77A] hover:brightness-110 shadow-md shadow-[#D4AF37]/20 flex items-center gap-1.5 transition"
                title="Cross-Device Media Sync & Mobile Access"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile Sync</span>
              </button>

              <button
                onClick={() => {
                  adminLogout();
                  navigate('/admin/login');
                }}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-red-400 bg-red-950/40 hover:bg-red-900/50 border border-red-500/40 flex items-center gap-1.5 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* ============================================================
              TAB 1: OVERVIEW & DASHBOARD SUMMARY
              ============================================================ */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Executive Metrics Bar (in Overview) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                <div
                  onClick={() => setActiveTab('projects')}
                  className="p-4 sm:p-5 rounded-2xl glass-card border border-white/5 hover:border-[#D4AF37]/40 cursor-pointer transition group"
                >
                  <span className="text-[11px] uppercase tracking-wider text-[#8A8A8A] block mb-1">
                    Projects Posted
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-2xl sm:text-3xl text-[#F5F1E8] group-hover:text-[#F5D77A] transition">
                      {projects.length}
                    </span>
                    <Layers className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab('media')}
                  className="p-4 sm:p-5 rounded-2xl glass-card border border-white/5 hover:border-[#D4AF37]/40 cursor-pointer transition group"
                >
                  <span className="text-[11px] uppercase tracking-wider text-[#8A8A8A] block mb-1">
                    Media Vault Assets
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-2xl sm:text-3xl text-[#F5D77A]">
                      {mediaItems.length}
                    </span>
                    <ImageIcon className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab('inquiries')}
                  className="p-4 sm:p-5 rounded-2xl glass-card border border-white/5 hover:border-[#D4AF37]/40 cursor-pointer transition group relative overflow-hidden"
                >
                  {newInquiriesCount > 0 && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-[#D4AF37] text-black text-[9px] font-bold animate-pulse">
                      {newInquiriesCount} NEW
                    </span>
                  )}
                  <span className="text-[11px] uppercase tracking-wider text-[#8A8A8A] block mb-1">
                    Client Inquiries
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-2xl sm:text-3xl text-[#F5F1E8] group-hover:text-[#F5D77A] transition">
                      {inquiries.length}
                    </span>
                    <Inbox className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl glass-card border border-white/5">
                  <span className="text-[11px] uppercase tracking-wider text-[#8A8A8A] block mb-1">
                    Total Likes
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-2xl sm:text-3xl text-[#F5D77A]">
                      {totalLikes}
                    </span>
                    <Heart className="w-5 h-5 text-[#D4AF37] fill-[#D4AF37]" />
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab('comments')}
                  className="p-4 sm:p-5 rounded-2xl glass-card border border-white/5 hover:border-[#D4AF37]/40 cursor-pointer transition group"
                >
                  <span className="text-[11px] uppercase tracking-wider text-[#8A8A8A] block mb-1">
                    Comments
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-2xl sm:text-3xl text-[#F5F1E8] group-hover:text-[#F5D77A] transition">
                      {totalComments}
                    </span>
                    <MessageCircle className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                </div>
              </div>

              {/* Hero Quick Action Banner */}`;

const startIndex = content.indexOf(returnNeedle);
const endIndex = content.indexOf(oldHeaderAndTabsEndNeedle);

if (startIndex === -1 || endIndex === -1) {
  console.error('Could not find header replacement needles!');
  console.log('startIndex:', startIndex, 'endIndex:', endIndex);
  process.exit(1);
}

const beforeHeader = content.substring(0, startIndex);
const afterHeader = content.substring(endIndex + oldHeaderAndTabsEndNeedle.length);

content = beforeHeader + navGroupsAndTitles + afterHeader;
console.log('Replaced header, navigation and overview top with sidebar layout.');

// 3. Close </main> and </div> right after activeTab === 'settings'
const settingsTabEndNeedle = `                </button>
              </div>
            </div>
          </div>
        </div>
      )}`;

const settingsIndex = content.indexOf(settingsTabEndNeedle);
if (settingsIndex === -1) {
  console.error('Could not find settings tab end needle!');
  process.exit(1);
}

const beforeSettingsEnd = content.substring(0, settingsIndex + settingsTabEndNeedle.length);
const afterSettingsEnd = content.substring(settingsIndex + settingsTabEndNeedle.length);

content = beforeSettingsEnd + `\n        </main>\n      </div>` + afterSettingsEnd;
console.log('Added </main> and </div> closing tags after settings tab.');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated AdminDashboard.jsx with Sidebar layout!');
