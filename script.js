/**
 * Aslam Wajith I — Portfolio Interactive Logic
 * Features: Circuit Canvas, Dynamic Typewriter, Silicon Logic Simulator,
 * Project Modals, Official Resume Viewer, and Toast Notifications.
 */

document.addEventListener('DOMContentLoaded', () => {
  initCircuitCanvas();
  initTypewriter();
  initLogicSimulator();
  initProjectModals();
  initResumeModal();
  initContactAndCopy();
  initScrollSpy();
  initMobileNav();
});

/* ==========================================================================
   1. SUBTLE CANVAS BACKGROUND
   ========================================================================== */
function initCircuitCanvas() {
  const canvas = document.getElementById('circuit-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createNodes();
  });

  const nodes = [];
  const spacing = 130;

  function createNodes() {
    nodes.length = 0;
    const cols = Math.ceil(width / spacing) + 1;
    const rows = Math.ceil(height / spacing) + 1;

    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        if (Math.random() > 0.5) {
          nodes.push({
            x: c * spacing + (Math.random() * 20 - 10),
            y: r * spacing + (Math.random() * 20 - 10),
            connections: [],
            size: Math.random() > 0.8 ? 2 : 1.2,
          });
        }
      }
    }

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = Math.abs(nodes[i].x - nodes[j].x);
        const dy = Math.abs(nodes[i].y - nodes[j].y);
        const dist = Math.hypot(dx, dy);

        if (dist < spacing * 1.4 && (dx < 35 || dy < 35 || dist < spacing)) {
          nodes[i].connections.push(nodes[j]);
        }
      }
    }
  }

  createNodes();

  let mouseX = -1000;
  let mouseY = -1000;
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function draw() {
    ctx.clearRect(0, 0, width, height);

    ctx.lineWidth = 1;
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      for (let j = 0; j < node.connections.length; j++) {
        const target = node.connections[j];
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(target.x, node.y);
        ctx.lineTo(target.x, target.y);
        ctx.stroke();
      }
    }

    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      const dist = Math.hypot(n.x - mouseX, n.y - mouseY);

      if (dist < 120) {
        ctx.fillStyle = 'rgba(0, 229, 255, 0.6)';
      } else {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
      }

      ctx.beginPath();
      ctx.arc(n.x, n.y, n.size, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  draw();
}

/* ==========================================================================
   2. DYNAMIC TYPEWRITER
   ========================================================================== */
function initTypewriter() {
  const target = document.getElementById('typewriter');
  if (!target) return;

  const roles = [
    'Aspiring Embedded & IoT Design Engineer',
    'ESP32-S3 & LoRa Hardware Prototyper',
    'VLSI & Digital Logic Practitioner',
    '3rd Year B.E. Electronics Engineering @ RIT',
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  const typeSpeed = 65;
  const deleteSpeed = 30;
  const delayBetweenWords = 1800;

  function type() {
    const currentRole = roles[roleIdx];

    if (isDeleting) {
      target.textContent = currentRole.substring(0, charIdx - 1);
      charIdx--;
    } else {
      target.textContent = currentRole.substring(0, charIdx + 1);
      charIdx++;
    }

    if (!isDeleting && charIdx === currentRole.length) {
      setTimeout(() => {
        isDeleting = true;
        type();
      }, delayBetweenWords);
      return;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      setTimeout(type, 300);
      return;
    }

    setTimeout(type, isDeleting ? deleteSpeed : typeSpeed);
  }

  type();
}

/* ==========================================================================
   3. SILICON & LOGIC GATE SIMULATOR
   ========================================================================== */
function initLogicSimulator() {
  const tabs = document.querySelectorAll('.sim-tab');
  const panes = document.querySelectorAll('.sim-content-pane');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      panes.forEach((p) => p.classList.remove('active'));

      tab.classList.add('active');
      const targetId = `sim-${tab.getAttribute('data-sim')}`;
      const targetPane = document.getElementById(targetId);
      if (targetPane) targetPane.classList.add('active');
    });
  });

  // Simulator 1: Full Adder
  const btnA = document.getElementById('btn-a');
  const btnB = document.getElementById('btn-b');
  const btnCin = document.getElementById('btn-cin');
  const outSum = document.getElementById('out-sum');
  const outCout = document.getElementById('out-cout');
  const adderStatus = document.getElementById('adder-status');

  function updateFullAdder() {
    if (!btnA || !btnB || !btnCin) return;
    const a = parseInt(btnA.getAttribute('data-val'), 10);
    const b = parseInt(btnB.getAttribute('data-val'), 10);
    const cin = parseInt(btnCin.getAttribute('data-val'), 10);

    btnA.classList.toggle('active-high', a === 1);
    btnB.classList.toggle('active-high', b === 1);
    btnCin.classList.toggle('active-high', cin === 1);

    const sum = a ^ b ^ cin;
    const cout = (a & b) | (cin & (a ^ b));

    if (outSum) outSum.textContent = sum;
    if (outCout) outCout.textContent = cout;

    if (adderStatus) {
      adderStatus.textContent = `State: A=${a}, B=${b}, Cin=${cin} → Sum=${sum}, Cout=${cout} (Binary: ${cout}${sum}_2 = Dec: ${a + b + cin})`;
    }
  }

  [btnA, btnB, btnCin].forEach((btn) => {
    if (!btn) return;
    btn.addEventListener('click', () => {
      const current = parseInt(btn.getAttribute('data-val'), 10);
      const next = current === 1 ? 0 : 1;
      btn.setAttribute('data-val', next);
      btn.textContent = next;
      updateFullAdder();
    });
  });

  updateFullAdder();

  // Simulator 2: 2-to-1 MUX
  const btnD0 = document.getElementById('btn-d0');
  const btnD1 = document.getElementById('btn-d1');
  const btnSel = document.getElementById('btn-sel');
  const outMuxY = document.getElementById('out-mux-y');
  const outMuxPath = document.getElementById('out-mux-path');
  const muxStatus = document.getElementById('mux-status');

  function updateMux() {
    if (!btnD0 || !btnD1 || !btnSel) return;
    const d0 = parseInt(btnD0.getAttribute('data-val'), 10);
    const d1 = parseInt(btnD1.getAttribute('data-val'), 10);
    const sel = parseInt(btnSel.getAttribute('data-val'), 10);

    btnD0.classList.toggle('active-high', d0 === 1);
    btnD1.classList.toggle('active-high', d1 === 1);
    btnSel.classList.toggle('active-high', sel === 1);

    const y = sel === 1 ? d1 : d0;
    const activeLine = sel === 1 ? 'D1' : 'D0';

    if (outMuxY) outMuxY.textContent = y;
    if (outMuxPath) outMuxPath.textContent = `${activeLine} → Y (val = ${y})`;
    if (muxStatus) {
      muxStatus.textContent = `Select = ${sel}: Routing Channel ${activeLine} (value: ${y}) to Output Y.`;
    }
  }

  [btnD0, btnD1, btnSel].forEach((btn) => {
    if (!btn) return;
    btn.addEventListener('click', () => {
      const current = parseInt(btn.getAttribute('data-val'), 10);
      const next = current === 1 ? 0 : 1;
      btn.setAttribute('data-val', next);
      btn.textContent = next;
      updateMux();
    });
  });

  updateMux();
}

/* ==========================================================================
   4. PROJECT DETAILS MODAL
   ========================================================================== */
function initProjectModals() {
  const modal = document.getElementById('project-modal');
  const modalTitle = document.getElementById('proj-modal-title');
  const modalTag = document.getElementById('proj-modal-tag');
  const modalContent = document.getElementById('proj-modal-content');
  const closeBtn = document.getElementById('close-project-modal');

  const projectsData = {
    '01': {
      title: 'Disaster Management System',
      tag: 'ESP32-S3 &bull; LoRa &bull; Edge AI',
      html: `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <p style="font-size:0.95rem; line-height:1.6; color:#cbd5e1;">
            <strong>ZERODAY SYNDICATE | 4 Specialized Disaster Nodes &amp; National Command Hub</strong><br />
            An integrated multi-hazard monitoring and early warning system engineered for environmental threats including floods, forest fires, air pollution, and weather extremes.
          </p>
          <div style="background:#080b11; border:1px solid rgba(255,255,255,0.08); padding:16px; border-radius:8px;">
            <h4 style="color:#00e5ff; margin-bottom:8px; font-size:1rem;">Technical Specifications</h4>
            <ul style="padding-left:18px; font-size:0.88rem; color:#94a3b8; line-height:1.6;">
              <li><strong>Microcontroller:</strong> ESP32-S3 with dual-core processing &amp; edge sensor fusion.</li>
              <li><strong>4 Dedicated Nodes:</strong> Water-level, Fire/smoke, Air Quality, and Soil/weather telemetry.</li>
              <li><strong>LoRa Sub-1GHz:</strong> Long-range communication for zero-cellular disaster emergency zones.</li>
              <li><strong>Local Edge Intelligence:</strong> Autonomous alerts and local buzzer trigger without server lag.</li>
              <li><strong>Live Cloud Hub:</strong> Hosted on Vercel with real-time public telemetry graphs.</li>
            </ul>
          </div>
          <div style="display:flex; gap:12px; margin-top:8px;">
            <a href="https://disaster-management-eta-one.vercel.app/" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
              Open Command Hub Dashboard &rarr;
            </a>
          </div>
        </div>
      `,
    },
    '02': {
      title: 'FireGuard AI',
      tag: 'C &bull; Python &bull; Verilog HDL &bull; AI Fire Safety',
      html: `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <p style="font-size:0.95rem; line-height:1.6; color:#cbd5e1;">
            An intelligent wildfire monitoring and emergency response platform for real-time fire-risk detection, prediction, and automated alerts.
          </p>
          <div style="background:#080b11; border:1px solid rgba(255,255,255,0.08); padding:16px; border-radius:8px;">
            <h4 style="color:#a855f7; margin-bottom:8px; font-size:1rem;">Highlights</h4>
            <ul style="padding-left:18px; font-size:0.88rem; color:#94a3b8; line-height:1.6;">
              <li>Multi-spectrum infrared flame and particulate smoke sensor integration.</li>
              <li>AI anomaly filtering to avoid false alarms from temperature spikes.</li>
              <li>Sub-second emergency notifications sent to safety personnel.</li>
            </ul>
          </div>
        </div>
      `,
    },
    '03': {
      title: 'CampusMate AI',
      tag: 'Embedded &bull; AI &bull; Campus Automation',
      html: `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <p style="font-size:0.95rem; line-height:1.6; color:#cbd5e1;">
            An AI-powered campus assistance application designed for visitor registration, automated approval workflows, QR-based turnstile access, queue management, and campus navigation.
          </p>
          <div style="background:#080b11; border:1px solid rgba(255,255,255,0.08); padding:16px; border-radius:8px;">
            <h4 style="color:#10b981; margin-bottom:8px; font-size:1rem;">Features</h4>
            <ul style="padding-left:18px; font-size:0.88rem; color:#94a3b8; line-height:1.6;">
              <li>Dynamic QR code generation for physical turnstile gate access.</li>
              <li>Real-time admin authorization portal with instant verification.</li>
              <li>Queue load balancing for administrative counters and interactive navigation.</li>
            </ul>
          </div>
        </div>
      `,
    },
    '04': {
      title: 'NeerMitra — AI-Powered Smart Agriculture Platform',
      tag: 'Project Lead &bull; 4 National Awards &bull; www.neermitra.com',
      html: `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <p style="font-size:0.95rem; line-height:1.6; color:#cbd5e1;">
            An award-winning agriculture platform integrating crop selection, disease identification, weather, soil insights, and agricultural resources.
          </p>
          <div style="background:#080b11; border:1px solid rgba(255,255,255,0.08); padding:16px; border-radius:8px;">
            <h4 style="color:#00e5ff; margin-bottom:8px; font-size:1rem;">Key Achievements</h4>
            <ul style="padding-left:18px; font-size:0.88rem; color:#94a3b8; line-height:1.6;">
              <li><strong>Crop Doctor:</strong> Computer vision image analysis for early crop disease identification.</li>
              <li><strong>Crop Planner:</strong> Predictive crop selection based on soil nutrients and seasonal data.</li>
              <li><strong>Smart Dashboard:</strong> Soil-moisture telemetry and precision irrigation advice.</li>
              <li><strong>Awards:</strong> Presented at 5+ national-level symposiums, earning 4 national awards.</li>
            </ul>
          </div>
          <div style="display:flex; gap:12px; margin-top:8px;">
            <a href="http://www.neermitra.com" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
              Visit www.neermitra.com &rarr;
            </a>
          </div>
        </div>
      `,
    },
  };

  document.querySelectorAll('.project-modal-trigger').forEach((btn) => {
    btn.addEventListener('click', () => {
      const projId = btn.getAttribute('data-project');
      const data = projectsData[projId];
      if (data && modal) {
        modalTitle.textContent = data.title;
        modalTag.innerHTML = data.tag;
        modalContent.innerHTML = data.html;
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('show');
      document.body.style.overflow = '';
    });
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
      }
    });
  }
}

/* ==========================================================================
   5. RESUME MODAL & PRINT HANDLER
   ========================================================================== */
function initResumeModal() {
  const modal = document.getElementById('resume-modal');
  const closeBtn = document.getElementById('close-resume-modal');
  const printBtn = document.getElementById('print-resume-btn');

  const triggers = [
    document.getElementById('resume-btn'),
    document.getElementById('hero-resume-trigger'),
    document.getElementById('contact-resume-trigger'),
  ];

  triggers.forEach((btn) => {
    if (btn && modal) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
      });
    }
  });

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('show');
      document.body.style.overflow = '';
    });
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
      }
    });
  }

  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }
}

/* ==========================================================================
   6. CONTACT FORM & EMAIL COPY WITH TOAST
   ========================================================================== */
function initContactAndCopy() {
  const copyBtn = document.getElementById('copy-email-btn');
  const emailText = document.getElementById('email-text');
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');

  function showToast(message) {
    if (!toast || !toastMsg) return;
    toastMsg.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  if (copyBtn && emailText) {
    copyBtn.addEventListener('click', async () => {
      const email = emailText.textContent.trim();
      try {
        await navigator.clipboard.writeText(email);
        showToast(`Copied ${email} to clipboard!`);
        copyBtn.querySelector('.copy-text').textContent = 'Copied!';
        setTimeout(() => {
          copyBtn.querySelector('.copy-text').textContent = 'Copy';
        }, 2000);
      } catch (err) {
        const textarea = document.createElement('textarea');
        textarea.value = email;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast(`Copied ${email} to clipboard!`);
      }
    });
  }

  const contactForm = document.getElementById('portfolio-contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value;
      const email = document.getElementById('contact-email').value;
      const subject = document.getElementById('contact-subject').value;
      const msg = document.getElementById('contact-message').value;

      const mailtoUrl = `mailto:aslamwajith.vlsi@gmail.com?subject=${encodeURIComponent(
        `[Portfolio] ${subject}`
      )}&body=${encodeURIComponent(`From: ${name} (${email})\n\nMessage:\n${msg}`)}`;

      showToast('Opening your email client to send message...');
      window.open(mailtoUrl, '_blank');
      contactForm.reset();
    });
  }
}

/* ==========================================================================
   7. ACTIVE NAV SCROLL SPY & STICKY HEADER
   ========================================================================== */
function initScrollSpy() {
  const header = document.getElementById('header');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;

    if (header) {
      if (scrollPos > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

/* ==========================================================================
   8. MOBILE NAVIGATION (ANDROID & TOUCH OPTIMIZED)
   ========================================================================== */
function initMobileNav() {
  const toggle = document.getElementById('mobile-toggle');
  const nav = document.getElementById('nav-menu');
  const links = document.querySelectorAll('.nav-link');

  if (toggle && nav) {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = nav.classList.toggle('open');
      toggle.classList.toggle('active', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    links.forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        toggle.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    // Close when tapping outside on mobile
    document.addEventListener('click', (e) => {
      if (nav.classList.contains('open') && !nav.contains(e.target) && !toggle.contains(e.target)) {
        nav.classList.remove('open');
        toggle.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

    // Handle Android back button or escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        toggle.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
}

