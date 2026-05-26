import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

interface ProductDetail {
  id: string;
  name: string;
  category: string;
  tagline: string;
  icon: string;
  gradient: string;
  description: string;
  features: string[];
  benefits: Array<{
    title: string;
    description: string;
  }>;
}

@Component({
  selector: 'app-product-detail',
  standalone: true,
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit {
  productId: string = '';
  product: ProductDetail | null = null;

  private products: Record<string, ProductDetail> = {
    billing: {
      id: 'billing',
      name: 'vSuite Billing',
      category: 'vSuite Finance',
      tagline: 'Smart, fast, and GST-ready billing designed for modern businesses',
      icon: 'fa-file-invoice-dollar',
      gradient: 'linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)',
      description: 'vSuite Billing is smart, fast, and GST-ready billing designed for modern businesses. Built with automation and real-time tracking to streamline your invoicing process.',
      features: [
        'GST compliant invoices - Generate GST-compliant invoices automatically',
        'UPI / QR-based payment - Accept payments via UPI and QR codes',
        'Automated reminders - Send automated payment reminders to customers',
        'AI-assisted invoice creation - Use AI to create accurate invoices quickly',
        'Real-time tracking - Track invoice status in real-time',
        'Recurring billing - Handle recurring billing automatically'
      ],
      benefits: [
        {
          title: 'GST Ready',
          description: 'Generate GST-compliant invoices automatically with all required details.'
        },
        {
          title: 'Multiple Payment Options',
          description: 'Accept payments via UPI, QR codes, and other digital payment methods.'
        },
        {
          title: 'Automated Workflows',
          description: 'Send automated payment reminders and follow-ups to reduce manual work.'
        },
        {
          title: 'AI-Powered',
          description: 'Use AI assistance to create accurate invoices quickly and efficiently.'
        }
      ]
    },
    accounting: {
      id: 'accounting',
      name: 'vSuite Accounting',
      category: 'vSuite Finance',
      tagline: 'Comprehensive accounting made simple, intelligent, and scalable',
      icon: 'fa-calculator',
      gradient: 'linear-gradient(135deg, #06b6d4 0%, #10b981 100%)',
      description: 'vSuite Accounting is comprehensive accounting made simple, intelligent, and scalable. Designed for accuracy and clarity in financial management.',
      features: [
        'Ledger & journal records - Maintain detailed ledger and journal entries',
        'Profit & loss reports - Generate comprehensive P&L reports automatically',
        'Bank reconciliation - Automate bank reconciliation processes',
        'AI-driven financial insights - Get AI-powered insights into your finances',
        'Expense tracking - Track and categorize expenses automatically',
        'GST compliance - Ensure GST compliance with automated checks'
      ],
      benefits: [
        {
          title: 'Complete Financial Management',
          description: 'Manage all aspects of accounting from ledgers to financial reports in one place.'
        },
        {
          title: 'AI-Driven Insights',
          description: 'Get intelligent insights into your financial data to make better decisions.'
        },
        {
          title: 'Automated Reconciliation',
          description: 'Automate bank reconciliation to save time and reduce errors.'
        },
        {
          title: 'GST Compliance',
          description: 'Stay compliant with GST regulations through automated compliance checks.'
        }
      ]
    },
    payroll: {
      id: 'payroll',
      name: 'vSuite Payroll',
      category: 'vSuite Workforce',
      tagline: 'Accurate, automated, and compliant payroll built for modern organizations',
      icon: 'fa-wallet',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #ec4899 100%)',
      description: 'vSuite Payroll is accurate, automated, and compliant payroll built for modern organizations with precision and speed.',
      features: [
        'Automated salary calc - Calculate salaries automatically with precision',
        'Statutory compliance - Ensure compliance with PF, ESI, TDS regulations',
        'Payslip generation - Generate detailed payslips automatically',
        'Anomaly detection - AI-powered anomaly detection for payroll errors',
        'UPI salary disbursement - Disburse salaries via UPI directly',
        'Reimbursements - Handle employee reimbursements efficiently'
      ],
      benefits: [
        {
          title: 'Automated Processing',
          description: 'Calculate salaries automatically with high precision and speed.'
        },
        {
          title: 'Statutory Compliance',
          description: 'Ensure compliance with PF, ESI, TDS and other statutory requirements.'
        },
        {
          title: 'AI Anomaly Detection',
          description: 'Detect and prevent payroll errors using AI-powered anomaly detection.'
        },
        {
          title: 'UPI Disbursement',
          description: 'Disburse salaries directly via UPI for faster payments.'
        }
      ]
    },
    hr: {
      id: 'hr',
      name: 'vSuite Human Resources',
      category: 'vSuite Workforce',
      tagline: 'Smart HR management to engage, manage, and grow your workforce',
      icon: 'fa-users-cog',
      gradient: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
      description: 'vSuite Human Resources provides smart HR management to engage, manage, and grow your workforce with improved visibility.',
      features: [
        'Employee onboarding - Streamline onboarding with automated workflows',
        'Attendance tracking - Track employee attendance accurately',
        'Performance reviews - Conduct performance reviews efficiently',
        'AI-driven hiring insights - Get AI-powered insights for hiring decisions',
        'Leave tracking - Manage leave requests and balances',
        'Workforce analytics - Get comprehensive workforce analytics'
      ],
      benefits: [
        {
          title: 'Streamlined Onboarding',
          description: 'Automate onboarding workflows to get new employees started quickly.'
        },
        {
          title: 'AI-Powered Hiring',
          description: 'Use AI insights to make better hiring decisions.'
        },
        {
          title: 'Complete Visibility',
          description: 'Get complete visibility into your workforce with comprehensive analytics.'
        },
        {
          title: 'Efficient Performance Management',
          description: 'Conduct performance reviews and track employee growth efficiently.'
        }
      ]
    },
    ecommerce: {
      id: 'ecommerce',
      name: 'vSuite E-Commerce',
      category: 'vSuite Commerce',
      tagline: 'Build, manage, and grow your online business effortlessly',
      icon: 'fa-shopping-bag',
      gradient: 'linear-gradient(135deg, #10b981 0%, #7c3aed 100%)',
      description: 'vSuite E-Commerce helps you build, manage, and grow your online business effortlessly with modern stores and exceptional shopping experiences.',
      features: [
        'Custom storefronts - Create customizable online storefronts',
        'Multi-payment support - Accept payments through multiple channels',
        'AI recommendations - Provide AI-powered product recommendations',
        'Abandoned cart recovery - Recover abandoned carts automatically',
        'Product catalog management - Manage product catalogs efficiently',
        'Seamless checkout - Provide smooth checkout experience'
      ],
      benefits: [
        {
          title: 'Customizable Storefronts',
          description: 'Create unique, branded storefronts that match your business identity.'
        },
        {
          title: 'AI Recommendations',
          description: 'Increase sales with AI-powered product recommendations.'
        },
        {
          title: 'Cart Recovery',
          description: 'Recover lost sales with automated abandoned cart recovery.'
        },
        {
          title: 'Multi-Payment Support',
          description: 'Accept payments through multiple channels for customer convenience.'
        }
      ]
    },
    processflow: {
      id: 'processflow',
      name: 'vSuite ProcessFlow',
      category: 'vSuite Logistics',
      tagline: 'Automate shipping documents from retrieval to reconciliation',
      icon: 'fa-brain',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
      description: 'vSuite ProcessFlow automates shipping documents from retrieval to reconciliation, eliminating manual effort and accelerating workflows.',
      features: [
        'Auto-download BL/Inv - Auto-download Bill of Lading and invoices',
        'Intelligent extraction - Extract data intelligently from documents',
        'Data validation - Validate data against business rules',
        'ERP integration - Integrate directly with ERP systems',
        'Vendor-wise scheduling - Schedule downloads by vendor',
        'Exception handling - Handle exceptions automatically'
      ],
      benefits: [
        {
          title: 'Eliminate Manual Effort',
          description: 'Automate document processing to eliminate manual data entry.'
        },
        {
          title: 'Intelligent Extraction',
          description: 'Extract data accurately using intelligent document processing.'
        },
        {
          title: 'ERP Integration',
          description: 'Integrate directly with ERP systems for seamless data flow.'
        },
        {
          title: 'Accelerated Workflows',
          description: 'Speed up document processing and reconciliation workflows.'
        }
      ]
    },
    finance: {
      id: 'finance',
      name: 'vSuite Finance',
      category: 'Unified Platform',
      tagline: 'Smarter Finance Starts Here',
      icon: 'fa-file-invoice-dollar',
      gradient: 'linear-gradient(135deg, #7c3aed 0%, #06b6d4 50%, #10b981 100%)',
      description: 'vSuite Finance powers your business with smarter billing, seamless accounting, and automated payroll—so you can focus on growth, not complexity.',
      features: [
        'vSuite Billing - Smart, fast, and GST-ready billing',
        'vSuite Accounting - Comprehensive accounting made simple',
        'vSuite Payroll - Accurate, automated, and compliant payroll',
        'Unified platform - One platform for all finance operations',
        'Real-time tracking - Track all financial activities in real-time',
        'AI-powered insights - Get AI-powered financial insights'
      ],
      benefits: [
        {
          title: 'Unified Platform',
          description: 'Manage all finance operations in one unified platform.'
        },
        {
          title: 'Complete Suite',
          description: 'Get billing, accounting, and payroll in one integrated solution.'
        },
        {
          title: 'AI-Powered',
          description: 'Leverage AI for smarter financial decisions and insights.'
        },
        {
          title: 'Focus on Growth',
          description: 'Automate finance operations so you can focus on business growth.'
        }
      ]
    },
    rpa: {
      id: 'rpa',
      name: 'Robotic Process Automation',
      category: 'Automation',
      tagline: 'Automate rule-based, repetitive activities without changing existing systems',
      icon: 'fa-robot',
      gradient: 'linear-gradient(135deg, #06b6d4 0%, #10b981 100%)',
      description: 'RPA enables businesses to automate rule-based, repetitive activities such as data entry, document handling, and system interactions — without changing existing systems.',
      features: [
        'Data entry automation - Automate repetitive data entry tasks',
        'Document handling - Process documents automatically',
        'System interactions - Automate interactions between systems',
        'AI-assisted bots - Use AI for semi-structured data processing',
        'Self-healing automation - Bots that adapt to UI changes',
        'Performance monitoring - Monitor bot performance with analytics'
      ],
      benefits: [
        {
          title: 'Zero Errors',
          description: 'Achieve consistent execution with zero human errors.'
        },
        {
          title: 'High-Volume Processing',
          description: 'Process high volumes of tasks at machine speed.'
        },
        {
          title: 'No System Changes',
          description: 'Automate without changing existing systems.'
        },
        {
          title: 'Full Audit Logs',
          description: 'Get complete audit logs for traceability and compliance.'
        }
      ]
    },
    ai: {
      id: 'ai',
      name: 'AI Offerings',
      category: 'AI & Intelligence',
      tagline: 'Build Intelligent. Deploy Confidently. Scale with AI.',
      icon: 'fa-brain',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #7c3aed 100%)',
      description: 'From LLM development to RAG solutions and AI automation, our AI offerings guide you through every step — turning complex models into real business value.',
      features: [
        'LLM Development - Custom LLM-based applications including chatbots and virtual assistants',
        'RAG Solutions - Retrieval-Augmented Generation combining AI with business data',
        'AI Consulting - Strategic guidance on AI adoption and implementation',
        'AI Automation - Intelligent automation combining RPA with AI',
        'Natural Language Processing - Sentiment analysis, document classification, entity extraction',
        'AI-Powered Integration - Plug AI capabilities into existing systems'
      ],
      benefits: [
        {
          title: 'Custom LLM Applications',
          description: 'Build custom LLM-based applications tailored to your business needs.'
        },
        {
          title: 'RAG Solutions',
          description: 'Combine AI models with your business data for reliable, context-rich outputs.'
        },
        {
          title: 'Strategic Guidance',
          description: 'Get expert guidance on AI adoption and implementation strategy.'
        },
        {
          title: 'Secure Deployments',
          description: 'Deploy AI capabilities securely with private deployments.'
        }
      ]
    }
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.productId = params['id'];
      this.product = this.products[this.productId] || null;
      
      if (!this.product) {
        this.router.navigate(['/']);
      }
    });
  }

  scrollToSection(sectionId: string) {
    const el = document.getElementById(sectionId);
    if (el) {
      const offset = 80;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
