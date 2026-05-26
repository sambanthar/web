import { Component, signal, HostListener, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';

interface ProductSubModule {
  name: string;
  tagline: string;
  desc: string;
  features: string[];
}

interface VSuiteProduct {
  id: string;
  name: string;
  category: 'finance' | 'workforce' | 'commerce' | 'logistics' | 'automation' | 'ai';
  tagline: string;
  icon: string;
  gradient: string;
  details: string;
  modules: ProductSubModule[];
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements AfterViewInit, OnDestroy {
  // Signals
  protected readonly isScrolled = signal(false);
  protected readonly menuOpen = signal(false);
  protected readonly activeSection = signal('home');
  protected readonly activeProductTab = signal('finance');
  protected readonly typedText = signal('');
  protected readonly showGlow = signal(false);
  protected readonly cursorX = signal(0);
  protected readonly cursorY = signal(0);
  protected readonly scrollProgressWidth = signal('0%');
  protected readonly isLoaderVisible = signal(true);
  protected readonly showSuccessMessage = signal(false);
  protected readonly isSubmitting = signal(false);
  protected readonly submitText = signal('Request Free Demo');
  protected readonly selectedProductTitle = signal('');

  // Stats Counters
  protected readonly projectsCount = signal(0);
  protected readonly clientsCount = signal(0);
  protected readonly codeCount = signal(0);
  protected readonly automationBotsCount = signal(0);
  private countersStarted = false;

  @ViewChild('particlesCanvas') particlesCanvas!: ElementRef<HTMLCanvasElement>;
  private particleAnimId?: number;
  private typedTextTimeout?: any;

  // --- BRAND SPECIFIC DATA: vSUITE PRODUCT LINE ---
  protected readonly vSuiteProducts: VSuiteProduct[] = [
    {
      id: 'finance',
      name: 'vSuite Finance',
      category: 'finance',
      tagline: 'Unified Finance Workspace for Modern Businesses',
      icon: 'fa-file-invoice-dollar',
      gradient: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
      details: 'From invoice automation to GST filing and real-time cash flow forecasting — one integrated platform to manage every aspect of your business finances with confidence.',
      modules: [
        {
          name: 'vSuite Billing',
          tagline: 'Smart Billing Software for Modern Businesses',
          desc: 'vSuite Billing helps teams reduce manual follow-ups, prepare GST records faster, and keep every transaction visible from a single cloud workspace.',
          features: [
            'Invoice Automation: Auto-generate, send, and track invoices with smart payment reminders.',
            'Review daily and monthly sales performance with finance-ready summaries.',
            'Flag duplicate entries, unusual invoice amounts, and anomalous payment patterns before month-end.'
          ]
        },
        {
          name: 'vSuite Accounting',
          tagline: 'Everything you need to manage your business finances efficiently',
          desc: 'vSuite Accounting gives teams clarity on every transaction, automates routine bookkeeping, and generates compliance-ready reports.',
          features: [
            'Use intelligent automation to reduce repetitive finance work and ensure bookkeeping accuracy.',
            'Complete bank reconciliation automation to keep ledgers clear of discrepancies.',
            'Generate clean GST filing records and compliance-ready reports automatically.'
          ]
        }
      ]
    },
    {
      id: 'workforce',
      name: 'vSuite Workforce',
      category: 'workforce',
      tagline: 'Simplify Payroll. Empower Your Workforce.',
      icon: 'fa-users-cog',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #ec4899 100%)',
      details: 'From automated payroll and compliance tracking to performance reviews and employee self-service — one platform to manage your entire workforce with absolute confidence.',
      modules: [
        {
          name: 'vSuite PayRoll',
          tagline: 'Automate Salary Processing & Regulatory Compliance',
          desc: 'vSuite PayRoll automates salary processing, ensures complete statutory compliance, and streamlines employee payments securely.',
          features: [
            'Saves time through secure, end-to-end automated monthly payroll calculations.',
            'Deliver itemized payslips on time every month with automated bank integrations.',
            'Automate taxes, PF, ESI deductions, and complete local compliance reports.'
          ]
        },
        {
          name: 'vSuite HR',
          tagline: 'Build Engaged, Productive Teams from Hire to Retire',
          desc: 'vSuite HR streamlines everything from onboarding to performance tracking, enabling you to build a culture of growth, efficiency, and continuous engagement.',
          features: [
            'Recruitment Pipeline: Source, screen, and onboard talent faster with structured offer letter automation.',
            'Seamless data flow between HR, payroll, and finance systems to reduce administrative overhead.',
            'Centralized portal for employee self-service, leave planning, and performance management.'
          ]
        }
      ]
    },
    {
      id: 'commerce',
      name: 'vSuite Commerce',
      category: 'commerce',
      tagline: 'Sell More. Faster. Smarter Commerce.',
      icon: 'fa-shopping-bag',
      gradient: 'linear-gradient(135deg, #10b981 0%, #6366f1 100%)',
      details: 'From multi-channel storefronts to AI-powered recommendations and real-time inventory sync — one unified platform to run, grow, and scale your entire commerce operation.',
      modules: [
        {
          name: 'vSuite E-Commerce',
          tagline: 'Custom Storefront Optimized for High Conversion',
          desc: 'vSuite E-Commerce provides a robust, customizable storefront and checkout experience optimized for high conversions, empowering you to sell physical, digital, and B2B products globally.',
          features: [
            'Sell physical goods, digital assets, courses, and software licenses natively on one platform.',
            'Manage product catalogs, orders, and customer databases from a single unified dashboard.',
            'Integrated multi-channel payment processors with high-conversion one-click checkout flows.'
          ]
        }
      ]
    },
    {
      id: 'logistics',
      name: 'vSuite Logistics',
      category: 'logistics',
      tagline: 'Intelligent Document Processing for Logistics',
      icon: 'fa-truck-loading',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
      details: 'Cut delivery costs, eliminate document validation delays, and gain full shipment visibility — powered by intelligent automation working 24/7.',
      modules: [
        {
          name: 'vSuite ProcessFlow',
          tagline: 'AI-Driven OCR Document Automation Engine',
          desc: 'vSuite ProcessFlow harnesses AI-driven OCR to instantly extract, validate, and synchronize data from Bills of Lading, invoices, and receipts, directly connecting your operational documents to your core ERP/WMS.',
          features: [
            'Document Automation: Auto-generate waybills, e-PODs, invoices, and customs sheets with zero manual entry.',
            'Eliminate processing bottlenecks, reduce operational costs, and accelerate turnaround times.',
            'Scale document ingestion seamlessly with logistics volume surges without adding manual headcount.'
          ]
        }
      ]
    },
    {
      id: 'automation',
      name: 'vSuite RPA Platform',
      category: 'automation',
      tagline: 'Automate Repetitive Tasks. Free Your Workforce.',
      icon: 'fa-robot',
      gradient: 'linear-gradient(135deg, #06b6d4 0%, #10b981 100%)',
      details: 'vSuite RPA deploys intelligent software bots that handle rule-based, high-volume tasks — so your teams can focus on strategic work that truly drives business value.',
      modules: [
        {
          name: 'vSuite RPA Platform',
          tagline: 'Complete Process Mapping and Automation Bot Deployment',
          desc: 'A complete robotic automation platform built to eliminate manual effort and drive operational excellence across every business function.',
          features: [
            'A structured three-phase approach that maps, builds, and deploys bots with minimal disruption.',
            'Analyse existing workflows to discover high-ROI candidate paths for bot replication.',
            'Configure software bots using low-code tools integrated with HR, Finance, and CRM systems.'
          ]
        }
      ]
    },
    {
      id: 'ai',
      name: 'Vishva AI Automation',
      category: 'ai',
      tagline: 'Enterprise-Grade AI Automation Platform',
      icon: 'fa-brain',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #6366f1 100%)',
      details: 'Purpose-built for organizations that need reliable, explainable automation beyond what traditional RPA can deliver — utilizing LLMs and modern neural nets.',
      modules: [
        {
          name: 'Intelligent AI Automation',
          tagline: 'Beyond Rule-Based Bots. Truly Intelligent Automation.',
          desc: 'Process complex PDFs, unstructured emails, scanned images, and free text that traditional RPA automation tools cannot, with high precision and zero manual preprocessing.',
          features: [
            'Use Case Discovery: Identify high-impact AI opportunities across finance, HR, and operations.',
            'Proof of Concept (PoC): Rapidly prototype and validate AI solutions to de-risk investments.',
            'Built-in connectors and low-code setups cut deployment time down from months to weeks.'
          ]
        }
      ]
    }
  ];

  ngAfterViewInit() {
    setTimeout(() => {
      this.isLoaderVisible.set(false);
    }, 1500);

    this.initParticles();
    this.initTypedText();
    this.initIntersectionObservers();
  }

  ngOnDestroy() {
    if (this.particleAnimId) cancelAnimationFrame(this.particleAnimId);
    if (this.typedTextTimeout) clearTimeout(this.typedTextTimeout);
  }

  // --- WINDOW SCROLL AND RESIZE EVENTS ---
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollY = window.scrollY;
    this.isScrolled.set(scrollY > 50);

    // Track active navigation link
    const sections = ['home', 'products', 'about', 'stats', 'contact'];
    let current = 'home';
    for (const sectionId of sections) {
      const el = document.getElementById(sectionId);
      if (el && scrollY >= el.offsetTop - 150) {
        current = sectionId;
      }
    }
    this.activeSection.set(current);

    // Update Top Progress Bar Width
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
    this.scrollProgressWidth.set(progress + '%');
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    if (window.innerWidth >= 1024) {
      this.showGlow.set(true);
      this.cursorX.set(e.clientX);
      this.cursorY.set(e.clientY);
    } else {
      this.showGlow.set(false);
    }
  }

  // --- COMPONENT LOGIC & ACTIONS ---
  protected selectProductTab(tabId: string) {
    this.activeProductTab.set(tabId);
    // Navigate to product detail page
    // For now, keep the tab functionality but also add option to go to detail page
    const el = document.getElementById('product-display-panel');
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }

  protected selectProductForHero(product: VSuiteProduct) {
    this.selectedProductTitle.set(product.name);
    this.activeProductTab.set(product.id);
    // Scroll to product display panel to show the product details
    const productPanel = document.getElementById('product-display-panel');
    if (productPanel) {
      const navbar = document.querySelector('.navbar') as HTMLElement;
      const navbarHeight = navbar ? navbar.offsetHeight : 80;
      const panelRect = productPanel.getBoundingClientRect();
      const scrollTop = window.scrollY + panelRect.top - navbarHeight - 20;
      
      window.scrollTo({ top: scrollTop, behavior: 'smooth' });
      
      // Add focus effect to product panel after scroll completes
      setTimeout(() => {
        productPanel.classList.add('product-focused');
        setTimeout(() => {
          productPanel.classList.remove('product-focused');
        }, 2000);
      }, 500);
    }
  }

  protected resetHeroTitle() {
    this.selectedProductTitle.set('');
  }

  protected goToProductDetail(productId: string) {
    // Navigate to product detail page
    window.location.href = `/product/${productId}`;
  }

  protected getActiveProduct(): VSuiteProduct {
    return this.vSuiteProducts.find(p => p.id === this.activeProductTab()) || this.vSuiteProducts[0];
  }

  protected toggleMenu() {
    this.menuOpen.update(v => !v);
  }

  protected closeMenu() {
    this.menuOpen.set(false);
  }

  protected scrollTo(sectionId: string) {
    const el = document.getElementById(sectionId);
    if (el) {
      this.closeMenu();
      const offset = 80;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }

  protected onCardMouseMove(e: MouseEvent, el: HTMLElement) {
    if (window.innerWidth < 1024) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const tiltX = (y / rect.height) * 5;
    const tiltY = -(x / rect.width) * 5;
    el.style.transform = `perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
  }

  protected onCardMouseLeave(el: HTMLElement) {
    el.style.transform = '';
  }

  protected submitContactForm(e: Event) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    if (!form.checkValidity()) return;

    this.isSubmitting.set(true);
    this.submitText.set('Scheduling demo...');

    setTimeout(() => {
      this.isSubmitting.set(false);
      this.submitText.set('Request Free Demo');
      this.showSuccessMessage.set(true);
      form.reset();
      setTimeout(() => this.showSuccessMessage.set(false), 5000);
    }, 2000);
  }

  // --- AUTO-TYPED HERO ACTION ---
  private initTypedText() {
    const phrases = [
      'vSuite Business Tools',
      'AI-Powered Automation',
      'Intelligent RPA Bots',
      'Unified Finance Cloud',
      'Next-Gen HR & Payroll'
    ];
    let pi = 0;
    let ci = 0;
    let deleting = false;

    const type = () => {
      const phrase = phrases[pi];
      if (!deleting) {
        this.typedText.set(phrase.substring(0, ci + 1));
        ci++;
        if (ci === phrase.length) {
          deleting = true;
          this.typedTextTimeout = setTimeout(type, 2000);
          return;
        }
      } else {
        this.typedText.set(phrase.substring(0, ci - 1));
        ci--;
        if (ci === 0) {
          deleting = false;
          pi = (pi + 1) % phrases.length;
        }
      }
      this.typedTextTimeout = setTimeout(type, deleting ? 50 : 80);
    };

    this.typedTextTimeout = setTimeout(type, 1000);
  }

  // --- STAT COUNTER INITIALIZER ---
  private initIntersectionObservers() {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          const delay = el.dataset['delay'] ? parseInt(el.dataset['delay']) : 0;
          setTimeout(() => el.classList.add('visible'), delay);
          revealObserver.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    setTimeout(() => {
      const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
      revealElements.forEach(el => revealObserver.observe(el));
    }, 100);

    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !this.countersStarted) {
        this.countersStarted = true;
        this.runCounterAnimation();
        statsObserver.disconnect();
      }
    }, { threshold: 0.2 });

    setTimeout(() => {
      const statsEl = document.getElementById('stats');
      if (statsEl) statsObserver.observe(statsEl);
    }, 100);
  }

  private runCounterAnimation() {
    const animate = (target: number, currentValSetter: (val: number) => void) => {
      const duration = 2200;
      const startTime = performance.now();

      const update = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        currentValSetter(Math.floor(eased * target));

        if (progress < 1) requestAnimationFrame(update);
        else currentValSetter(target);
      };
      requestAnimationFrame(update);
    };

    animate(350, val => this.projectsCount.set(val));
    animate(180, val => this.clientsCount.set(val));
    animate(1500000, val => this.codeCount.set(val));
    animate(48, val => this.automationBotsCount.set(val));
  }

  protected formatCounterValue(val: number) {
    if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M';
    if (val >= 1000) return (val / 1000).toFixed(0) + 'K';
    return val.toString();
  }

  // --- PARTICLES ENGINE ---
  private initParticles() {
    const canvas = this.particlesCanvas?.nativeElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = (canvas.width = canvas.offsetWidth);
    let H = (canvas.height = canvas.offsetHeight);

    interface Particle {
      x: number;
      y: number;
      r: number;
      vx: number;
      vy: number;
      alpha: number;
      color: string;
      update: () => void;
      draw: () => void;
      reset: () => void;
    }

    const particles: Particle[] = [];
    const colors = ['99,102,241', '6,182,212', '139,92,246', '16,185,129'];

    const createParticle = (): Particle => {
      const p = {
        x: 0,
        y: 0,
        r: 0,
        vx: 0,
        vy: 0,
        alpha: 0,
        color: '',
        reset() {
          this.x = Math.random() * W;
          this.y = Math.random() * H;
          this.r = Math.random() * 2 + 0.5;
          this.vx = (Math.random() - 0.5) * 0.4;
          this.vy = (Math.random() - 0.5) * 0.4;
          this.alpha = Math.random() * 0.5 + 0.1;
          this.color = colors[Math.floor(Math.random() * colors.length)];
        },
        update() {
          this.x += this.vx;
          this.y += this.vy;
          if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
        },
        draw() {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
          ctx.fill();
        }
      };
      p.reset();
      return p;
    };

    const count = Math.min(80, Math.floor((W * H) / 12000));
    for (let i = 0; i < count; i++) {
      particles.push(createParticle());
    }

    const connectParticles = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(99,102,241,${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      connectParticles();
      this.particleAnimId = requestAnimationFrame(animate);
    };

    const resize = () => {
      if (!canvas) return;
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', resize);
    animate();
  }
}
