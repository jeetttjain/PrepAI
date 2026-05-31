/* ─────────────────────────────────────────────────────────────
   PrepAI Admin Command Center Controller Script
   Secure 2FA Login Gate + Shared Local Storage Database Synchronizer
   ───────────────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  lucide.createIcons();

  // Secure Master Credentials
  const MASTER_ADMIN_ID = 'admin.secure';
  const MASTER_PASSWORD = 'secure147';
  let activeRollingOTP = '000000';

  // ───────────────────────────────────────────────────────────
  // 1. DYNAMIC ROLLING 2-FACTOR OTP GENERATOR (TOTP SIMULATOR)
  // ───────────────────────────────────────────────────────────
  const generateRollingOTP = () => {
    const timeStep = 30; // 30 seconds interval
    const epoch = Math.floor(Date.now() / 1000);
    const counter = Math.floor(epoch / timeStep);
    
    // Pseudo-random deterministic TOTP dynamic calculation using Secret Seed
    const seed = 0000000000; // Inspired by director contact
    const hash = (counter * seed) % 900000 + 100000; // Guarantees a clean 6-digit integer
    return hash.toString();
  };

  const updateVirtualAuthenticator = () => {
    const epoch = Math.floor(Date.now() / 1000);
    const secondsRemaining = 30 - (epoch % 30);
    
    // Circular SVG dash-offset calculations
    const progressPercent = (secondsRemaining / 30) * 100;
    const circleBar = document.getElementById('progress-circle-bar');
    if (circleBar) {
      circleBar.setAttribute('stroke-dasharray', `${progressPercent}, 100`);
      
      // Color shifts when code is expiring (last 5s)
      if (secondsRemaining <= 5) {
        circleBar.style.stroke = 'var(--color-error)';
      } else {
        circleBar.style.stroke = 'var(--color-primary)';
      }
    }

    const countdownText = document.getElementById('countdown-text');
    if (countdownText) {
      countdownText.innerText = secondsRemaining;
    }

    // Refresh dynamic 2FA passcode at boundaries
    const newOTP = generateRollingOTP();
    if (activeRollingOTP !== newOTP) {
      activeRollingOTP = newOTP;
      const otpDisplay = document.getElementById('rolling-otp');
      if (otpDisplay) {
        // Format code into 3-3 separation for clean UI display
        otpDisplay.innerText = `${newOTP.substring(0, 3)} ${newOTP.substring(3, 6)}`;
      }
    }
  };

  // Run authenticator sync loop
  updateVirtualAuthenticator();
  setInterval(updateVirtualAuthenticator, 1000);

  // Authenticator copy dynamic code to clipboard helper
  const copyBtn = document.getElementById('copy-otp-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(activeRollingOTP).then(() => {
        // Dynamic success animation
        const icon = copyBtn.querySelector('i');
        copyBtn.style.color = 'var(--color-success)';
        copyBtn.style.borderColor = 'var(--color-success)';
        icon.setAttribute('data-lucide', 'check');
        lucide.createIcons();

        showToast('Dynamic 2FA code copied successfully!');

        setTimeout(() => {
          copyBtn.style.color = 'var(--text-muted)';
          copyBtn.style.borderColor = 'var(--border-color)';
          icon.setAttribute('data-lucide', 'copy');
          lucide.createIcons();
        }, 1500);
      });
    });
  };

  // ───────────────────────────────────────────────────────────
  // 2. VAULT CREDENTIAL CHECKS & LOGIN SUBMISSION
  // ───────────────────────────────────────────────────────────
  const loginForm = document.getElementById('login-form');
  const loginGate = document.getElementById('login-gate');
  const adminWorkspace = document.getElementById('admin-workspace');

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const inputAdminId = document.getElementById('admin-id').value.trim();
      const inputPassword = document.getElementById('master-password').value.trim();
      const inputOTP = document.getElementById('otp-passcode').value.replace(/\s+/g, '');

      if (inputAdminId !== MASTER_ADMIN_ID) {
        showToast('Authentication failed: Invalid Admin ID.', 'error');
        return;
      }

      if (inputPassword !== MASTER_PASSWORD) {
        showToast('Authentication failed: Invalid Master Password.', 'error');
        return;
      }

      if (inputOTP !== activeRollingOTP) {
        showToast('Authentication failed: Invalid 2-Factor Passcode.', 'error');
        return;
      }

      // Successful auth!
      showToast('Vault unlocked. Loading systems overrides...');
      
      loginGate.classList.remove('active');
      adminWorkspace.classList.add('active');
      
      // Load current local storage data to form
      loadSharedDatabase();
    });
  }

  // Lock admin session
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      showToast('Vault locked successfully.');
      adminWorkspace.classList.remove('active');
      loginGate.classList.add('active');
      document.getElementById('otp-passcode').value = '';
    });
  }

  // ───────────────────────────────────────────────────────────
  // 3. SECURE MUTATION MATRIX (LOCAL STORAGE ACCESS ACTIONS)
  // ───────────────────────────────────────────────────────────

  // System local storage keys
  const KEYS = {
    USER: 'prepai_user',
    USER_ALT: 'user',
    FILES: 'prepai_files',
    INTERVIEWS: 'prepai_interviews',
    CHEATSHEETS: 'prepai_cheatsheets',
    ROADMAPS: 'prepai_roadmaps',
    RESUME: 'prepai_resume_analysis',
    THEME: 'prepai_theme'
  };

  // Local helper to read key
  const readKey = (key, fallback = null) => {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  };

  // Local helper to write key
  const writeKey = (key, val) => {
    localStorage.setItem(key, JSON.stringify(val));
  };

  // Load and render active shared database inputs
  const loadSharedDatabase = () => {
    // 3.1 Profile Settings
    const activeUser = readKey(KEYS.USER) || readKey(KEYS.USER_ALT) || {
      name: 'Alex Rivera',
      email: 'alex@prepai.ai',
      role: 'Lead Developer',
      profilePic: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      subscriptionTier: 'Starter Free Tier'
    };

    document.getElementById('user-name').value = activeUser.name || 'Alex Rivera';
    document.getElementById('user-email').value = activeUser.email || 'alex@prepai.ai';
    document.getElementById('user-role').value = activeUser.role || 'Lead Developer';
    document.getElementById('user-tier').value = activeUser.subscriptionTier || 'Starter Free Tier';
    document.getElementById('avatar-preview').src = activeUser.profilePic || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80';

    // 3.2 ATS settings
    const activeAts = readKey(KEYS.RESUME) || {
      atsScore: 85,
      summary: 'ATS compatibility scanned outline findings.',
      identifiedSkills: ['React', 'TypeScript', 'Node.js'],
      missingSkills: ['System Design', 'Redis', 'Docker']
    };

    document.getElementById('ats-score-range').value = activeAts.atsScore || 85;
    document.getElementById('ats-score-badge').innerText = `${activeAts.atsScore || 85}%`;
    document.getElementById('ats-summary-text').value = activeAts.summary || '';
    
    renderSkillsTags(activeAts.identifiedSkills || [], 'strength-skills-list', 'strength');
    renderSkillsTags(activeAts.missingSkills || [], 'gap-skills-list', 'gap');

    // 3.3 File Assistant parsed docs
    renderFilesManager();
  };

  // 3.4 User profile override submit
  const profileForm = document.getElementById('profile-form');
  if (profileForm) {
    profileForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('user-name').value.trim();
      const email = document.getElementById('user-email').value.trim();
      const role = document.getElementById('user-role').value.trim();
      const subscriptionTier = document.getElementById('user-tier').value;
      const profilePic = document.getElementById('avatar-preview').src;

      const updatedUser = {
        id: 'usr_1',
        name,
        email,
        role,
        profilePic,
        subscriptionTier,
        streak: 8,
        readiness: 88,
        atsScore: parseInt(document.getElementById('ats-score-range').value)
      };

      writeKey(KEYS.USER, updatedUser);
      writeKey(KEYS.USER_ALT, updatedUser);

      showToast('Profile credentials and subscription synced successfully!');
    });
  }

  // Presets avatar picker triggers
  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const url = btn.getAttribute('data-url');
      document.getElementById('avatar-preview').src = url;
      showToast('Avatar preset loaded. Click "Override" to save.');
    });
  });

  // Custom base64 avatar picker trigger
  const avatarTrigger = document.getElementById('avatar-trigger');
  const avatarFileInput = document.getElementById('avatar-file-input');
  if (avatarTrigger && avatarFileInput) {
    avatarTrigger.addEventListener('click', () => {
      avatarFileInput.click();
    });

    avatarFileInput.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (uploadEvent) => {
          document.getElementById('avatar-preview').src = uploadEvent.target.result;
          showToast('Custom photo loaded! Click "Override" to save.');
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // 3.5 ATS slider overrides
  const atsRange = document.getElementById('ats-score-range');
  const atsBadge = document.getElementById('ats-score-badge');
  if (atsRange && atsBadge) {
    atsRange.addEventListener('input', () => {
      atsBadge.innerText = `${atsRange.value}%`;
    });
  }

  const applyAtsBtn = document.getElementById('apply-ats-btn');
  if (applyAtsBtn) {
    applyAtsBtn.addEventListener('click', () => {
      const atsScore = parseInt(document.getElementById('ats-score-range').value);
      const summary = document.getElementById('ats-summary-text').value;
      
      const strengths = gatherSkillsTags('strength-skills-list');
      const gaps = gatherSkillsTags('gap-skills-list');

      const updatedAts = {
        atsScore,
        targetRole: document.getElementById('user-role').value.trim() || 'Software Engineer',
        identifiedSkills: strengths,
        missingSkills: gaps.length > 0 ? gaps : ['No critical gaps!'],
        summary,
        tips: gaps.map((skill, idx) => ({
          title: `Optimize Matrix for "${skill}"`,
          detail: `Standalone Admin Panel configured override suggests highlighting active hands-on application of "${skill}".`
        })),
        foundLanguages: ['English'],
        missingLanguages: [],
        configuredLanguages: ['English'],
        uploadedFileName: 'Resume_Scanned_Standalone_Admin.pdf'
      };

      writeKey(KEYS.RESUME, updatedAts);
      showToast(`Resume scanned compatibility set to ${atsScore}% instantly!`);
    });
  }

  // Skill management add buttons
  const addStrengthBtn = document.getElementById('add-strength-btn');
  const addGapBtn = document.getElementById('add-gap-btn');
  const skillInput = document.getElementById('new-skill-input');

  if (addStrengthBtn && skillInput) {
    addStrengthBtn.addEventListener('click', () => {
      const skillName = skillInput.value.trim();
      if (!skillName) return;
      appendSkillTag(skillName, 'strength-skills-list', 'strength');
      skillInput.value = '';
    });
  }

  if (addGapBtn && skillInput) {
    addGapBtn.addEventListener('click', () => {
      const skillName = skillInput.value.trim();
      if (!skillName) return;
      appendSkillTag(skillName, 'gap-skills-list', 'gap');
      skillInput.value = '';
    });
  }

  // Helper render skills tags list
  function renderSkillsTags(skills, containerId, type) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    skills.forEach(sk => {
      if (sk !== 'No critical gaps!') {
        appendSkillTag(sk, containerId, type);
      }
    });
  }

  function appendSkillTag(name, containerId, type) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const tag = document.createElement('span');
    tag.className = `skill-tag ${type}`;
    tag.innerHTML = `
      <span>${name}</span>
      <button type="button" onclick="this.parentElement.remove()">✕</button>
    `;
    container.appendChild(tag);
  }

  function gatherSkillsTags(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return [];
    const tags = container.querySelectorAll('.skill-tag span');
    return Array.from(tags).map(t => t.innerText.trim());
  }

  // 3.6 Programmatic Injectors
  const injectInterviewBtn = document.getElementById('inject-interview-btn');
  if (injectInterviewBtn) {
    injectInterviewBtn.addEventListener('click', () => {
      const role = document.getElementById('user-role').value.trim() || 'Software Engineer';
      const mockInt = {
        id: 'int_standalone_' + Date.now(),
        role: role,
        level: 'Senior Level',
        type: 'Technical System Design',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        score: '96%',
        questions: [
          {
            id: 'qs_1',
            number: 'Q1',
            difficulty: 'Hard',
            question: `Explain how you would resolve recursive resolution bottlenecks in "${role}" GraphQL configurations.`,
            context: 'Resolver optimization sweeps.',
            answer: 'Implement the DataLoader utility utility pattern to batch recursive fetch pipelines into consolidated database executions.'
          }
        ]
      };

      const prev = readKey(KEYS.INTERVIEWS) || [];
      writeKey(KEYS.INTERVIEWS, [mockInt, ...prev]);
      showToast('Mock practice session injected successfully!');
    });
  }

  const injectRoadmapBtn = document.getElementById('inject-roadmap-btn');
  if (injectRoadmapBtn) {
    injectRoadmapBtn.addEventListener('click', () => {
      const role = document.getElementById('user-role').value.trim() || 'Software Engineer';
      const mockRoadmap = {
        id: 'roadmap_standalone_' + Date.now(),
        title: `${role} Standalone Mastery Path`,
        role: role,
        level: 'System Architect Mastery',
        created: new Date().toLocaleDateString(),
        phases: [
          {
            id: 'phs1',
            title: 'Phase 1: Deep Caching & Query Tuning',
            desc: 'Configure master-replica caches and queries.',
            milestones: [
              { id: 'ms1', name: 'Redis Replication Nodes', desc: 'Deploy master-replica clusters.', duration: '1 week', completed: true }
            ]
          }
        ]
      };

      const prev = readKey(KEYS.ROADMAPS) || [];
      writeKey(KEYS.ROADMAPS, [mockRoadmap, ...prev]);
      showToast('Structured roadmap injected!');
    });
  }

  const injectCheatsheetBtn = document.getElementById('inject-cheatsheet-btn');
  if (injectCheatsheetBtn) {
    injectCheatsheetBtn.addEventListener('click', () => {
      const role = document.getElementById('user-role').value.trim() || 'Software Engineer';
      const mockSheet = {
        id: 'cs_standalone_' + Date.now(),
        title: `Standalone Custom: ${role} Reference Card`,
        role: role,
        created: new Date().toLocaleDateString(),
        cards: [
          { id: 'ccd1', title: 'Performance Essentials', desc: 'Top checks.', content: '• DataLoader batch overrides\n• Redis distributed caching' }
        ]
      };

      const prev = readKey(KEYS.CHEATSHEETS) || [];
      writeKey(KEYS.CHEATSHEETS, [mockSheet, ...prev]);
      showToast('Reference reference card injected successfully!');
    });
  }

  // 3.7 Simulated System Outage
  const outageBtn = document.getElementById('simulate-outage-btn');
  let simulatedOffline = false;

  if (outageBtn) {
    outageBtn.addEventListener('click', () => {
      simulatedOffline = !simulatedOffline;
      if (simulatedOffline) {
        window.dispatchEvent(new Event('offline'));
        outageBtn.classList.add('active');
        outageBtn.innerText = 'Restore Connection';
        showToast('Outage Simulated: Global "offline" event dispatched!', 'error');
      } else {
        window.dispatchEvent(new Event('online'));
        outageBtn.classList.remove('active');
        outageBtn.innerText = 'Simulate Outage';
        showToast('Outage Restored: Global "online" state restored!');
      }
    });
  }

  // 3.8 Presets Pack Loader
  const loadFsBtn = document.getElementById('load-fs-pack-btn');
  if (loadFsBtn) {
    loadFsBtn.addEventListener('click', () => {
      // 1. Profile sync
      const profile = {
        id: 'usr_1',
        name: 'Director Jeet Jain',
        email: 'email.@gmail.com',
        role: 'Director of Engineering',
        profilePic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        subscriptionTier: 'Enterprise Hub Tier'
      };
      writeKey(KEYS.USER, profile);
      writeKey(KEYS.USER_ALT, profile);

      // 2. Resume scan sync
      const ats = {
        atsScore: 98,
        targetRole: 'Director of Engineering',
        identifiedSkills: ['React', 'Node.js', 'PostgreSQL', 'GraphQL', 'Docker', 'Redis', 'System Design', 'Kafka'],
        missingSkills: ['No critical gaps!'],
        summary: 'Your resume presents elite enterprise systems leadership credentials. Redis, microservice sagas, and DataLoader patterns conform cleanly.',
        tips: [{ title: 'Single column matrix optimization', detail: 'Clean single column templates parse fastest.' }]
      };
      writeKey(KEYS.RESUME, ats);

      // 3. Files sync
      const filesList = [
        { id: 'f_fs1', name: 'GraphQL_Batch_DataLoader.pdf', size: '1.2 MB', status: 'Ready', date: 'May 30, 2026' },
        { id: 'f_fs2', name: 'Docker_Scale_Orchestrations.docx', size: '540 KB', status: 'Ready', date: 'May 31, 2026' }
      ];
      writeKey(KEYS.FILES, filesList);

      // 4. Cheatsheet seed
      const sheetsList = [{
        id: 'cs_fs1',
        title: 'Enterprise GraphQL Optimization Cards',
        role: 'Full Stack Engineer',
        created: 'May 30, 2026',
        cards: [{ id: 'cc_fs1', title: 'Data Resolution', desc: 'DataLoader optimizations.', content: '• Implement DataLoader to consolidate recursive fetching.' }]
      }];
      writeKey(KEYS.CHEATSHEETS, sheetsList);

      showToast('Lead Full Stack developer pack loaded successfully!');
      loadSharedDatabase();
    });
  }

  const loadAiBtn = document.getElementById('load-ai-pack-btn');
  if (loadAiBtn) {
    loadAiBtn.addEventListener('click', () => {
      // 1. Profile sync
      const profile = {
        id: 'usr_1',
        name: 'AI Principal Rivera',
        email: 'alex@prepai.ai',
        role: 'Principal AI Scientist',
        profilePic: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
        subscriptionTier: 'Pro Accelerator Tier'
      };
      writeKey(KEYS.USER, profile);
      writeKey(KEYS.USER_ALT, profile);

      // 2. Resume scan sync
      const ats = {
        atsScore: 95,
        targetRole: 'Principal AI Scientist',
        identifiedSkills: ['Python', 'PyTorch', 'Large Language Models', 'RAG Pipelines', 'Vector Databases', 'HNSW Indexing'],
        missingSkills: ['CUDA Kernels', 'TensorRT'],
        summary: 'Excellent principal AI researcher credentials. Strong vector indexing architectures and embedding alignment indices.',
        tips: [{ title: 'Add CUDA optimizations', detail: 'Principal research targets scan for custom GPU memory operations.' }]
      };
      writeKey(KEYS.RESUME, ats);

      // 3. Files sync
      const filesList = [
        { id: 'f_ai1', name: 'Chroma_Vector_Index.pdf', size: '2.4 MB', status: 'Ready', date: 'May 28, 2026' }
      ];
      writeKey(KEYS.FILES, filesList);

      showToast('Principal AI Scientist developer pack loaded!');
      loadSharedDatabase();
    });
  }

  // 3.9 Factory resets sweep
  const factoryResetBtn = document.getElementById('factory-reset-btn');
  if (factoryResetBtn) {
    factoryResetBtn.addEventListener('click', () => {
      if (confirm('Are you absolutely sure you want to run a factory sandbox purge? This wipes all roadmaps, cheat sheets, files, and users from LocalStorage.')) {
        localStorage.clear();
        showToast('Factory sandbox purge complete. Syncing blank state...');
        loadSharedDatabase();
      }
    });
  }

  // 3.10 AI File manager workspace list
  function renderFilesManager() {
    const filesList = readKey(KEYS.FILES, []);
    const placeholder = document.getElementById('empty-files-placeholder');
    const view = document.getElementById('files-grid-view');
    const deleteLink = document.getElementById('clear-files-btn');

    if (!placeholder || !view || !deleteLink) return;

    if (filesList.length === 0) {
      placeholder.style.display = 'flex';
      view.style.display = 'none';
      deleteLink.classList.add('hidden');
    } else {
      placeholder.style.display = 'none';
      view.style.display = 'grid';
      deleteLink.classList.remove('hidden');

      view.innerHTML = '';
      filesList.forEach((file, idx) => {
        const card = document.createElement('div');
        card.className = 'file-card';
        card.innerHTML = `
          <div class="file-details">
            <i data-lucide="file-text"></i>
            <div class="file-meta">
              <h5>${file.name}</h5>
              <span>${file.size} • ${file.date}</span>
            </div>
          </div>
          <button type="button" class="file-delete-btn" data-id="${file.id}">
            <i data-lucide="trash-2"></i>
          </button>
        `;
        view.appendChild(card);
      });

      // Bind delete triggers
      view.querySelectorAll('.file-delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const fid = btn.getAttribute('data-id');
          const prev = readKey(KEYS.FILES, []);
          const next = prev.filter(f => f.id !== fid);
          writeKey(KEYS.FILES, next);
          showToast('Removed document from files matrix.');
          renderFilesManager();
        });
      });

      lucide.createIcons();
    }
  }

  // Wipe document cache
  const clearFilesBtn = document.getElementById('clear-files-btn');
  if (clearFilesBtn) {
    clearFilesBtn.addEventListener('click', () => {
      writeKey(KEYS.FILES, []);
      showToast('Wiped document uploads matrix cleanly.');
      renderFilesManager();
    });
  }

  // ───────────────────────────────────────────────────────────
  // 4. UTILITIES & THEMES PRESENTS SWITCH
  // ───────────────────────────────────────────────────────────

  // Dynamic Slate-Light Mode theme presets switch
  const themeSwitch = document.getElementById('theme-switch');
  const themeIcon = document.getElementById('theme-icon');

  if (themeSwitch && themeIcon) {
    // Read active theme pref on load
    const currentTheme = localStorage.getItem(KEYS.THEME) || 'dark';
    if (currentTheme === 'light') {
      document.body.classList.remove('dark-mode');
      document.body.classList.add('light-mode');
      themeIcon.setAttribute('data-lucide', 'moon');
    } else {
      document.body.classList.remove('light-mode');
      document.body.classList.add('dark-mode');
      themeIcon.setAttribute('data-lucide', 'sun');
    }
    lucide.createIcons();

    themeSwitch.addEventListener('click', () => {
      const isLight = document.body.classList.contains('light-mode');
      if (isLight) {
        document.body.classList.remove('light-mode');
        document.body.classList.add('dark-mode');
        themeIcon.setAttribute('data-lucide', 'sun');
        localStorage.setItem(KEYS.THEME, 'dark');
        
        // Broadcast theme shift to other tabs!
        document.documentElement.classList.remove('light-theme');
        document.body.classList.remove('light-theme');
      } else {
        document.body.classList.remove('dark-mode');
        document.body.classList.add('light-mode');
        themeIcon.setAttribute('data-lucide', 'moon');
        localStorage.setItem(KEYS.THEME, 'light');
        
        // Broadcast theme shift to other tabs!
        document.documentElement.classList.add('light-theme');
        document.body.classList.add('light-theme');
      }
      lucide.createIcons();
      showToast('Color theme preset applied globally!');
    });
  }

  // Custom visual toast feedback
  const showToast = (text, type = 'success') => {
    // Clean existing toasts
    const existing = document.querySelectorAll('.admin-toast');
    existing.forEach(t => t.remove());

    const toast = document.createElement('div');
    toast.className = `admin-toast ${type}`;
    toast.style.position = 'fixed';
    toast.style.bottom = '24px';
    toast.style.right = '24px';
    toast.style.padding = '12px 24px';
    toast.style.borderRadius = '12px';
    toast.style.fontSize = '12.5px';
    toast.style.fontWeight = '700';
    toast.style.zIndex = '99999';
    toast.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
    toast.style.display = 'flex';
    toast.style.alignItems = 'center';
    toast.style.gap = '8px';
    toast.style.animation = 'fadeIn 0.2s cubic-bezier(0.19, 1, 0.22, 1) forwards';

    const color = type === 'success' ? '#10b981' : '#ef4444';
    const bg = 'rgba(16, 22, 38, 0.95)';
    const border = `1px solid ${color}33`;

    toast.style.background = bg;
    toast.style.border = border;
    toast.style.color = color;

    const iconName = type === 'success' ? 'check-circle' : 'alert-circle';
    toast.innerHTML = `
      <i data-lucide="${iconName}" style="width: 16px; height: 16px;"></i>
      <span>${text}</span>
    `;

    document.body.appendChild(toast);
    lucide.createIcons();

    setTimeout(() => {
      toast.style.animation = 'fadeOut 0.2s ease forwards';
      setTimeout(() => toast.remove(), 200);
    }, 3000);
  };
});
