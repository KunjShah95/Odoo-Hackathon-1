"use client";

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BadgeAlert,
  BadgeCheck,
  BadgePercent,
  BarChart3,
  Box,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  CircleCheck,
  CircleDollarSign,
  Clock,
  CreditCard,
  Download,
  Eye,
  FileCheck,
  FileSpreadsheet,
  FileText,
  Filter,
  HelpCircle,
  Inbox,
  Info,
  Layers,
  LayoutDashboard,
  Loader2,
  Lock,
  Minus,
  MonitorSmartphone,
  Moon,
  Package,
  PackageCheck,
  Percent,
  Plus,
  Receipt,
  RefreshCw,
  Repeat,
  RotateCcw,
  Search,
  Send,
  Shield,
  ShieldAlert,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Sun,
  Tag,
  TrendingDown,
  TrendingUp,
  TriangleAlert,
  Truck,
  User,
  UserCheck,
  UserRound,
  Users,
  Wallet,
  Warehouse,
  X
} from "lucide-react";

type Route =
  | "login"
  | "dashboard"
  | "quotations"
  | "quote-builder"
  | "approvals"
  | "approval-detail"
  | "fulfillment"
  | "fulfillment-detail"
  | "subscriptions"
  | "billing-detail"
  | "customer-portal"
  | "invoices"
  | "invoice-detail"
  | "deal-health"
  | "reports"
  | "products"
  | "product-detail"
  | "discount-setup";

type StatusTone = "green" | "amber" | "red" | "blue" | "purple" | "neutral";

type LineItem = {
  id: string;
  product: string;
  category: string;
  qty: number;
  price: number;
  discount: number;
  cap: number;
};

type QuoteStage = "Draft" | "Pending approval" | "Approved" | "Fulfillment" | "Subscribed" | "Invoiced" | "Paid";

const routeNames: Record<Route, string> = {
  login: "Login",
  dashboard: "Dashboard",
  quotations: "Quotations",
  "quote-builder": "Quotation Detail",
  approvals: "Approvals",
  "approval-detail": "Approval Detail",
  fulfillment: "Fulfillment",
  "fulfillment-detail": "Fulfillment Detail",
  subscriptions: "Subscriptions",
  "billing-detail": "Billing",
  "customer-portal": "Customer",
  invoices: "Invoices",
  "invoice-detail": "Invoice Detail",
  "deal-health": "Deal Health",
  reports: "Reports",
  products: "Products",
  "product-detail": "Product Detail",
  "discount-setup": "Discount Setup"
};

const flowRoutes: Route[] = [
  "login",
  "dashboard",
  "quotations",
  "quote-builder",
  "approvals",
  "approval-detail",
  "fulfillment",
  "fulfillment-detail",
  "subscriptions",
  "billing-detail",
  "customer-portal",
  "invoices",
  "invoice-detail",
  "deal-health",
  "reports",
  "products",
  "product-detail",
  "discount-setup"
];

const money = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

const percent = (value: number) => `${value.toFixed(1)}%`;

type Theme = "light" | "dark" | "system";
type ToastKind = "info" | "success" | "error";

function useTheme() {
  const [theme, setTheme] = useState<Theme>("system");
  const [resolved, setResolved] = useState<"light" | "dark">("light");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("df360-theme") as Theme | null;
      if (saved === "light" || saved === "dark" || saved === "system") setTheme(saved);
    } catch {
      /* storage unavailable */
    }
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const dark = theme === "dark" || (theme === "system" && mq.matches);
      document.documentElement.classList.toggle("dark", dark);
      document.documentElement.dataset.theme = theme;
      setResolved(dark ? "dark" : "light");
    };
    apply();
    mq.addEventListener("change", apply);
    try {
      localStorage.setItem("df360-theme", theme);
    } catch {
      /* storage unavailable */
    }
    return () => mq.removeEventListener("change", apply);
  }, [theme]);

  return { theme, setTheme, resolved };
}

function ThemeToggle({ theme, onChange }: { theme: Theme; onChange: (t: Theme) => void }) {
  return (
    <div className="theme-segmented" role="radiogroup" aria-label="Theme Selection">
      <button
        type="button"
        className={`theme-seg-btn ${theme === "light" ? "active" : ""}`}
        onClick={() => onChange("light")}
        data-tip="Light Theme"
        aria-label="Switch to Light Theme"
        aria-checked={theme === "light"}
        role="radio"
      >
        <Sun size={13} aria-hidden="true" />
        <span>Light</span>
      </button>
      <button
        type="button"
        className={`theme-seg-btn ${theme === "dark" ? "active" : ""}`}
        onClick={() => onChange("dark")}
        data-tip="Dark Theme"
        aria-label="Switch to Dark Theme"
        aria-checked={theme === "dark"}
        role="radio"
      >
        <Moon size={13} aria-hidden="true" />
        <span>Dark</span>
      </button>
      <button
        type="button"
        className={`theme-seg-btn ${theme === "system" ? "active" : ""}`}
        onClick={() => onChange("system")}
        data-tip="System Default"
        aria-label="Switch to System Theme"
        aria-checked={theme === "system"}
        role="radio"
      >
        <MonitorSmartphone size={13} aria-hidden="true" />
        <span>Auto</span>
      </button>
    </div>
  );
}

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="logo">
      <svg className="logo-mark" width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="8" fill="#0f172a" />
        <path d="M7 21 L13 14.5 L17 17.5 L24 9" fill="none" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M19.5 9 H24 V13.5" fill="none" stroke="#3b82f6" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="13" cy="14.5" r="1.8" fill="#10b981" />
      </svg>
      <span className="logo-text">
        <span className="logo-name">DealFlow <span className="logo-num">360</span></span>
        {!compact && <span className="logo-tag">Enterprise Sales Platform</span>}
      </span>
    </span>
  );
}

function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: StatusTone }) {
  return <span className={`badge ${tone === "neutral" ? "" : tone}`}>{children}</span>;
}

function Button({
  children,
  onClick,
  tone,
  disabled,
  type = "button",
  testId,
  tip,
  ariaLabel
}: {
  children: React.ReactNode;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  tone?: "primary" | "danger" | "success" | "accent" | "ghost";
  disabled?: boolean;
  type?: "button" | "submit";
  testId?: string;
  tip?: string;
  ariaLabel?: string;
}) {
  return (
    <button
      className={`button ${tone ?? ""}`}
      data-testid={testId}
      data-tip={tip}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
}

function Skeleton({ width = "100%", height = 16 }: { width?: string | number; height?: string | number }) {
  return <span className="skeleton" style={{ width, height }} aria-hidden="true" />;
}

function Empty({ icon, title, hint, action }: { icon: React.ReactNode; title: string; hint: string; action?: React.ReactNode }) {
  return (
    <div className="empty" role="status">
      {icon}
      <strong>{title}</strong>
      <span className="subtle">{hint}</span>
      {action ? <div style={{ marginTop: 8 }}>{action}</div> : null}
    </div>
  );
}

function Card({
  title,
  action,
  children,
  className = ""
}: {
  title?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`card ${className}`}>
      {title ? (
        <div className="card-head">
          <h2>{title}</h2>
          {action}
        </div>
      ) : null}
      <div className="card-pad">{children}</div>
    </section>
  );
}

function PageHead({
  eyebrow,
  title,
  subtitle,
  actions
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="page-head">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="subtle">{subtitle}</p>
      </div>
      {actions ? <div className="row-actions">{actions}</div> : null}
    </div>
  );
}

function DataTable({
  headers,
  rows
}: {
  headers: React.ReactNode[];
  rows: React.ReactNode[][];
}) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>{headers.map((header, index) => <th key={index}>{header}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Stepper({ active }: { active: number }) {
  const steps = ["Quotation Draft", "Discount Approval", "Stock Allocation", "Invoiced", "Reconciled & Paid"];
  return (
    <div className="pipeline">
      {steps.map((step, index) => (
        <span className="cluster" key={step}>
          <span className={`step ${index < active ? "done" : index === active ? "active" : ""}`}>
            <span className="dot" />
            <span>{step}</span>
          </span>
          {index < steps.length - 1 ? <span className="connector" /> : null}
        </span>
      ))}
    </div>
  );
}

function NavIcon({ route }: { route: string }) {
  const props = { size: 16, "aria-hidden": true } as const;
  switch (route) {
    case "dashboard":
      return <LayoutDashboard {...props} />;
    case "quotations":
      return <FileText {...props} />;
    case "approvals":
      return <BadgeCheck {...props} />;
    case "fulfillment":
      return <Package {...props} />;
    case "subscriptions":
      return <Repeat {...props} />;
    case "invoices":
      return <Receipt {...props} />;
    case "deal-health":
      return <Activity {...props} />;
    case "reports":
      return <BarChart3 {...props} />;
    case "products":
      return <Tag {...props} />;
    case "customer-portal":
      return <UserRound {...props} />;
    default:
      return <LayoutDashboard {...props} />;
  }
}

const sideGroups: { title: string; items: { route: Route; label: string; count?: string }[] }[] = [
  {
    title: "Operations Flow",
    items: [
      { route: "dashboard", label: "Dashboard" },
      { route: "quotations", label: "Quotations", count: "12" },
      { route: "approvals", label: "Approvals", count: "4" },
      { route: "fulfillment", label: "Fulfillment", count: "7" },
      { route: "subscriptions", label: "Subscriptions" },
      { route: "invoices", label: "Invoices", count: "1" }
    ]
  },
  {
    title: "Intelligence & Config",
    items: [
      { route: "deal-health", label: "Deal Health", count: "3" },
      { route: "reports", label: "Reports" },
      { route: "products", label: "Products" },
      { route: "customer-portal", label: "Customer Portal" }
    ]
  }
];

function AppShell({
  route,
  setRoute,
  children,
  theme,
  onThemeChange
}: {
  route: Route;
  setRoute: (route: Route, message?: string, kind?: ToastKind) => void;
  children: React.ReactNode;
  theme: Theme;
  onThemeChange: (t: Theme) => void;
}) {
  const activeTop = route === "quote-builder" ? "quotations" : route === "approval-detail" ? "approvals" : route === "fulfillment-detail" ? "fulfillment" : route === "billing-detail" ? "subscriptions" : route === "invoice-detail" ? "invoices" : route === "product-detail" || route === "discount-setup" ? "products" : route;
  const activeItem = sideGroups.flatMap((g) => g.items).find((i) => i.route === activeTop);
  const groupOf = (r: string) => (sideGroups[0].items.some((i) => i.route === r) ? sideGroups[0].title : sideGroups[1].title);
  
  const [workspace, setWorkspace] = useState("Acme Corp (NA-OPS)");
  const [isSyncing, setIsSyncing] = useState(false);

  const toggleWorkspace = () => {
    const nextWs = workspace.includes("Acme") ? "Beta Industries (EMEA)" : workspace.includes("Beta") ? "Nova Retail (Global)" : "Acme Corp (NA-OPS)";
    setWorkspace(nextWs);
    setRoute(route, `Workspace switched to ${nextWs}`, "info");
  };

  const triggerSync = () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setRoute(route, "Syncing ERP records with SAP / NetSuite...", "info");
    setTimeout(() => {
      setIsSyncing(false);
      setRoute(route, "ERP sync complete • 4,820 SKU records live", "success");
    }, 900);
  };

  const handleSignOut = () => {
    setRoute("login", "Signed out of DealFlow360", "info");
  };

  return (
    <div className="app">
      <header className="topbar">
        <div className="cluster">
          <button className="brand" onClick={() => setRoute("dashboard")} type="button" aria-label="DealFlow 360 home">
            <Logo compact />
          </button>
          <span className="crumb" aria-label="Breadcrumb location">
            {groupOf(activeTop)} <span className="crumb-sep">/</span> <strong>{activeItem?.label ?? routeNames[route]}</strong>
          </span>
        </div>
        <div className="topbar-right">
          <button
            className="badge blue topbar-action-pill"
            onClick={toggleWorkspace}
            type="button"
            data-tip="Click to Switch Account"
            aria-label={`Workspace: ${workspace}. Click to switch.`}
          >
            <Building2 size={12} aria-hidden="true" />
            <span>{workspace}</span>
            <ChevronDown size={11} aria-hidden="true" />
          </button>
          <button
            className="badge green topbar-action-pill"
            onClick={triggerSync}
            type="button"
            data-tip="Click to Refresh ERP Sync"
            aria-label="Synchronize ERP database"
          >
            {isSyncing ? <RefreshCw size={11} className="spin" aria-hidden="true" /> : <span className="pulse-dot" aria-hidden="true" />}
            <span>{isSyncing ? "Syncing..." : "Realtime ERP"}</span>
          </button>
          <ThemeToggle theme={theme} onChange={onThemeChange} />
          <button
            className="avatar-btn"
            onClick={handleSignOut}
            data-tip="Alex Chen (Click to Sign Out)"
            aria-label="User profile: Alex Chen. Click to sign out."
            type="button"
          >
            <span className="avatar">AC</span>
          </button>
        </div>
      </header>
      <div className="shell">
        <aside className="sidebar">
          <nav className="side-nav" aria-label="Primary navigation">
            {sideGroups.map((group) => (
              <div key={group.title}>
                <div className="side-title">{group.title}</div>
                {group.items.map((item) => (
                  <button
                    className={`side-link ${activeTop === item.route ? "active" : ""}`}
                    data-route={item.route}
                    aria-current={activeTop === item.route ? "page" : undefined}
                    key={item.route}
                    onClick={() => setRoute(item.route)}
                    type="button"
                  >
                    <span className="side-icon"><NavIcon route={item.route} /></span>
                    <span className="side-label">{item.label}</span>
                    {item.count ? <span className="side-count">{item.count}</span> : null}
                  </button>
                ))}
              </div>
            ))}
          </nav>
          <div className="side-foot">
            <button
              className="side-user-btn"
              onClick={handleSignOut}
              type="button"
              data-tip="Click to Sign Out"
              aria-label="Alex Chen (Sales Ops Lead). Click to sign out."
            >
              <span className="avatar" title="Alex Chen">AC</span>
              <div>
                <strong>Alex Chen</strong>
                <span className="subtle">Sales Ops Lead • Sign out</span>
              </div>
            </button>
          </div>
        </aside>
        <main className="main" data-current-route={route} id="main" tabIndex={-1}>
          <div className="page">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default function DealFlow360App() {
  const [route, setRoute] = useState<Route>(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.replace(/^#\/?/, "");
      if ((flowRoutes as string[]).includes(hash)) return hash as Route;
    }
    return "login";
  });
  const { theme, setTheme } = useTheme();
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [toast, setToast] = useState("");
  const [toastKind, setToastKind] = useState<ToastKind>("info");
  const [quoteStage, setQuoteStage] = useState<QuoteStage>("Draft");
  const [quoteView, setQuoteView] = useState<"cards" | "table">("cards");
  const [approvalFilter, setApprovalFilter] = useState("All");
  const [returnedQuotes, setReturnedQuotes] = useState<string[]>([]);
  const [approvalDecision, setApprovalDecision] = useState("Finance review pending");
  const [fulfillmentAccepted, setFulfillmentAccepted] = useState(false);
  const [subscriptionActive, setSubscriptionActive] = useState(false);
  const [invoicePaid, setInvoicePaid] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [exporting, setExporting] = useState<string | null>(null);
  const busyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [counterDiscount, setCounterDiscount] = useState("14.5");
  const [discountRulesSaved, setDiscountRulesSaved] = useState(false);
  const [productStatus, setProductStatus] = useState("Draft");
  const [searchQuery, setSearchQuery] = useState("");
  const [lines, setLines] = useState<LineItem[]>([
    { id: "lp14", product: "Laptop Pro 14", category: "Hardware", qty: 2, price: 1200, discount: 12, cap: 15 },
    { id: "setup", product: "Onsite Setup Service", category: "Services", qty: 1, price: 450, discount: 16, cap: 10 },
    { id: "warranty", product: "Extended Warranty 2-Year", category: "Warranty", qty: 1, price: 180, discount: 10, cap: 10 }
  ]);

  const totals = useMemo(() => {
    const gross = lines.reduce((sum, line) => sum + line.qty * line.price, 0);
    const net = lines.reduce((sum, line) => sum + line.qty * line.price * (1 - line.discount / 100), 0);
    const concession = gross - net;
    return { gross, net, concession, blended: gross ? (concession / gross) * 100 : 0 };
  }, [lines]);

  useEffect(() => {
    const applyHash = () => {
      const hash = window.location.hash.replace(/^#\/?/, "") as Route;
      if ((flowRoutes as string[]).includes(hash)) {
        setRoute(hash);
      }
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  const notify = useCallback((message: string, kind: ToastKind = "info") => {
    if (busyTimer.current) clearTimeout(busyTimer.current);
    setToast(message);
    setToastKind(kind);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 4200);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setToast("");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    return () => {
      if (busyTimer.current) clearTimeout(busyTimer.current);
    };
  }, []);

  const runBusy = useCallback((key: string, done: () => void, ms = 900) => {
    if (key === "sync") setSyncing(true);
    else setExporting(key);
    busyTimer.current = setTimeout(() => {
      if (key === "sync") setSyncing(false);
      else setExporting(null);
      done();
    }, ms);
  }, []);

  const navigate = (nextRoute: Route, message?: string, kind: ToastKind = "info") => {
    setRoute(nextRoute);
    if (typeof window !== "undefined") {
      try {
        const targetHash = `#/${nextRoute}`;
        if (window.location.hash !== targetHash && window.location.hash !== `#${nextRoute}`) {
          window.location.hash = `/${nextRoute}`;
        }
      } catch {
        /* hash sync is best-effort for demo deep-linking */
      }
    }
    notify(message ?? `${routeNames[nextRoute]} loaded`, kind);
  };

  const resetDemo = () => {
    setQuoteStage("Draft");
    setApprovalDecision("Finance review pending");
    setFulfillmentAccepted(false);
    setSubscriptionActive(false);
    setInvoicePaid(false);
    setDiscountRulesSaved(false);
    setProductStatus("Draft");
    setReturnedQuotes([]);
    setApprovalFilter("All");
    navigate("login", "Demo state reset to initial baseline", "info");
  };

  const updateLineDiscount = (id: string, value: string) => {
    const parsed = Number(value);
    if (Number.isNaN(parsed)) return;
    setLines((current) => current.map((line) => (line.id === id ? { ...line, discount: parsed } : line)));
  };

  const submitQuote = () => {
    setQuoteStage("Pending approval");
    setApprovalDecision("Sales Lead approved; Finance Director pending");
    setReturnedQuotes((q) => q.filter((id) => id !== "Q-1042"));
    navigate("approvals", "Q-1042 escalated to approval matrix", "success");
  };

  const approveQuote = () => {
    setQuoteStage("Approved");
    setApprovalDecision("Approved by Sales Ops & Finance Director");
    navigate("fulfillment", "Q-1042 approved. Stock reservation allocated.", "success");
  };

  const returnQuote = () => {
    setApprovalDecision("Returned to sales rep for discount adjustment");
    setReturnedQuotes((q) => (q.includes("Q-1042") ? q : [...q, "Q-1042"]));
    notify("Q-1042 returned to sales rep with feedback note", "info");
  };

  const acceptSplit = () => {
    setFulfillmentAccepted(true);
    setQuoteStage("Fulfillment");
    navigate("subscriptions", "Split fulfillment accepted. Plan initiated.", "success");
  };

  const generateInvoice = () => {
    setSubscriptionActive(true);
    setQuoteStage("Invoiced");
    navigate("invoices", "Invoice INV-1042 generated from subscription", "success");
  };

  const receivePayment = () => {
    setInvoicePaid(true);
    setQuoteStage("Paid");
    notify("Payment received via Stripe. Books reconciled.", "success");
  };

  if (route === "login") {
    return (
      <div className="login-wrap" data-current-route="login">
        <div className="login-top-bar">
          <ThemeToggle theme={theme} onChange={setTheme} />
        </div>
        <div className="login-card">
          <Card>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div className="cluster" style={{ justifyContent: "center", marginBottom: 12 }}>
                <Logo />
              </div>
              <p className="subtle">Enterprise Sales & Revenue Lifecycle Orchestration</p>
            </div>
            <div className="tabs" style={{ width: "100%", justifyContent: "center", marginBottom: 18 }}>
              <Button tone={authMode === "login" ? "primary" : undefined} onClick={() => setAuthMode("login")}>Sign In</Button>
              <Button tone={authMode === "signup" ? "primary" : undefined} onClick={() => setAuthMode("signup")}>Create Account</Button>
            </div>
            <form
              className="grid"
              onSubmit={(event: FormEvent) => {
                event.preventDefault();
                navigate("dashboard", authMode === "login" ? "Authenticated as Alex Chen (Sales Ops)" : "Enterprise sandbox initialized", "success");
              }}
            >
              <label>
                Sales Region & Team
                <select defaultValue="na-ops">
                  <option value="na-ops">North America Enterprise Sales (NA-OPS)</option>
                  <option value="emea">EMEA Revenue Operations</option>
                  <option value="global">Global Strategic Accounts</option>
                </select>
              </label>
              <label>
                Work Email
                <input defaultValue="alex.chen@acmeops.io" type="email" required />
              </label>
              <label>
                Password
                <input defaultValue="password123" type="password" required />
              </label>
              <Button
                tone="primary"
                type="submit"
                testId="login-submit"
                onClick={(e?: React.MouseEvent) => {
                  if (e) e.preventDefault();
                  navigate("dashboard", authMode === "login" ? "Authenticated as Alex Chen (Sales Ops)" : "Enterprise sandbox initialized", "success");
                }}
              >
                {authMode === "login" ? "Launch DealFlow360 Workspace" : "Provision Enterprise Account"} <ArrowRight size={15} aria-hidden="true" />
              </Button>
              <div className="notice blue">
                <div className="cluster" style={{ gap: 6 }}>
                  <ShieldCheck size={16} aria-hidden="true" />
                  <span>Enterprise SSO & SAML 2.0 Enabled</span>
                </div>
                <Badge tone="blue">SOC2 Type II</Badge>
              </div>
            </form>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <AppShell route={route} setRoute={navigate} theme={theme} onThemeChange={setTheme}>
      {route === "dashboard" && (
        <>
          <PageHead
            eyebrow="Revenue Command Center"
            title="Sales Pipeline & Operations"
            subtitle="Real-time deal health, approval workflows, margin safety, and fulfillment status."
            actions={
              <>
                <Button onClick={() => navigate("approvals")}><BadgeCheck size={15} aria-hidden="true" /> Approvals Queue</Button>
                <Button tone="primary" onClick={() => navigate("quote-builder")}><Plus size={15} aria-hidden="true" /> New Quote</Button>
              </>
            }
          />
          <FlowStrip
            quoteStage={quoteStage}
            blended={totals.blended}
            overCap={lines.some((l) => l.discount > l.cap)}
            fulfillmentAccepted={fulfillmentAccepted}
            subscriptionActive={subscriptionActive}
            invoicePaid={invoicePaid}
            counterDiscount={counterDiscount}
            onGo={(r) => navigate(r)}
          />
          <div className="grid grid-3">
            <Metric
              title="Escalated Approvals"
              value="4"
              detail="$117,800 awaiting sign-off"
              tone="amber"
              icon={<BadgeAlert size={14} aria-hidden="true" />}
              trend="+2 today"
              meter={{ pct: 65, tone: "warn" }}
              onClick={() => navigate("approvals")}
            />
            <Metric
              title="Active Pipeline"
              value="$184,500"
              detail="12 enterprise quotes active"
              tone="blue"
              icon={<FileText size={14} aria-hidden="true" />}
              trend="+14.8% vs last month"
              meter={{ pct: 82, tone: "good" }}
              onClick={() => navigate("quotations")}
            />
            <Metric
              title="At Risk / Anomalies"
              value="3 Deals"
              detail="Margin erosion & stock alerts"
              tone="red"
              icon={<ShieldAlert size={14} aria-hidden="true" />}
              trend="Action required"
              meter={{ pct: 30, tone: "bad" }}
              onClick={() => navigate("deal-health")}
            />
          </div>
          <div className="split" style={{ marginTop: 8 }}>
            <Card title="Live Deal Activity & Audit Stream" action={<Badge tone="green"><span className="pulse-dot" /> Live ERP Sync</Badge>}>
              <DataTable
                headers={["Account", "Event", "Pipeline Stage", "Timeline", "Action"]}
                rows={[
                  [
                    <strong key="a">Acme Corp<br /><span className="subtle">Q-1042 ($42,400)</span></strong>,
                    "Sales Lead approved; Finance Director pending",
                    <Badge tone="amber" key="b"><Clock size={11} /> Approval</Badge>,
                    "24m ago",
                    <Button key="btn" tone="primary" onClick={() => navigate("approval-detail")}>Inspect <ArrowRight size={13} /></Button>
                  ],
                  [
                    <strong key="a">Beta Industries<br /><span className="subtle">Q-1039 ($18,200)</span></strong>,
                    "Customer requested 12% discount counter proposal",
                    <Badge tone="blue" key="b"><UserRound size={11} /> Negotiation</Badge>,
                    "1h ago",
                    <Button key="btn" onClick={() => navigate("customer-portal")}>Portal View</Button>
                  ],
                  [
                    <strong key="a">East Coast Depot<br /><span className="subtle">ORD-8021</span></strong>,
                    "40 Docking Stations restocked into primary inventory",
                    <Badge tone="purple" key="b"><Warehouse size={11} /> Stock</Badge>,
                    "3h ago",
                    <Button key="btn" onClick={() => navigate("fulfillment")}>Fulfillment</Button>
                  ],
                  [
                    <strong key="a">Delta LLC<br /><span className="subtle">INV-1038 ($9,800)</span></strong>,
                    "Stripe automatic invoice settlement confirmed",
                    <Badge tone="green" key="b"><CheckCircle2 size={11} /> Paid</Badge>,
                    "5h ago",
                    <Button key="btn" onClick={() => navigate("invoice-detail")}>Invoice</Button>
                  ]
                ]}
              />
            </Card>
            <div className="grid">
              <Card title="Quick Actions & Config">
                <div className="grid" style={{ gap: 10 }}>
                  <Button onClick={() => navigate("discount-setup")}><SlidersHorizontal size={15} aria-hidden="true" /> Discount Governance Setup</Button>
                  <Button onClick={() => navigate("fulfillment")}><Truck size={15} aria-hidden="true" /> Warehouse Allocation Engine</Button>
                  <Button onClick={() => navigate("reports")}><Download size={15} aria-hidden="true" /> Export Revenue Reports</Button>
                  <Button onClick={() => navigate("deal-health")}><Activity size={15} aria-hidden="true" /> Deal Health Diagnostics</Button>
                </div>
              </Card>
              <Card title="Margin Protection Guard">
                <div className="grid" style={{ gap: 8 }}>
                  <div className="cluster" style={{ justifyContent: "space-between" }}>
                    <span className="subtle">Average Blended Margin</span>
                    <strong className="mono" style={{ color: "var(--green)" }}>88.4%</strong>
                  </div>
                  <div className="meter good"><span style={{ width: "88.4%" }} /></div>
                  <div className="cluster" style={{ justifyContent: "space-between", marginTop: 4 }}>
                    <span className="subtle">Max Allowed Concession</span>
                    <span className="mono">15.0%</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </>
      )}

      {route === "quotations" && (
        <>
          <PageHead
            eyebrow="Pipeline Management"
            title="Quotations"
            subtitle="Manage enterprise draft quotes, approval gating, and active contract negotiations."
            actions={
              <>
                <div className="tabs">
                  <Button tone={quoteView === "cards" ? "primary" : undefined} onClick={() => setQuoteView("cards")}>Kanban Stages</Button>
                  <Button tone={quoteView === "table" ? "primary" : undefined} onClick={() => setQuoteView("table")}>Data Table</Button>
                </div>
                <Button tone="primary" onClick={() => navigate("quote-builder")}><Plus size={15} /> New Quote</Button>
              </>
            }
          />
          {quoteView === "cards" ? (
            <div className="kanban">
              {["Draft", "Pending approval", "Approved", "Negotiation", "Confirmed"].map((stage) => (
                <div className="lane" key={stage}>
                  <div className="cluster" style={{ justifyContent: "space-between", marginBottom: 8 }}>
                    <strong>{stage}</strong>
                    <Badge tone={stage === "Pending approval" ? "amber" : stage === "Approved" ? "green" : "neutral"}>
                      {stage === quoteStage ? "Q-1042" : stage === "Draft" ? "3" : "2"}
                    </Badge>
                  </div>
                  <DealCard
                    name={stage === "Pending approval" ? "Acme Corp" : stage === "Negotiation" ? "Zenith Co" : "Nova Retail"}
                    id={stage === "Pending approval" ? "Q-1042" : "Q-1041"}
                    amount={stage === "Pending approval" ? "$42,400" : "$16,200"}
                    tone={stage === "Pending approval" ? "amber" : "blue"}
                    onOpen={() => navigate(stage === "Pending approval" ? "quote-builder" : "customer-portal")}
                  />
                  <DealCard
                    name="Beta Industries"
                    id="Q-1039"
                    amount="$18,200"
                    tone="neutral"
                    onOpen={() => navigate("quote-builder")}
                  />
                </div>
              ))}
            </div>
          ) : (
            <Card title="Quotations Pipeline Register">
              <DataTable
                headers={["Quote Reference", "Customer Account", "Stage Status", "Sales Owner", "Total Value", "Action"]}
                rows={[
                  ["Q-1042", "Acme Corp", <Badge tone="amber" key="s"><Clock size={11} /> {quoteStage}</Badge>, "M. Shah", "$42,400", <Button key="a" tone="primary" onClick={() => navigate("quote-builder")}>Edit Quote</Button>],
                  ["Q-1039", "Beta Industries", <Badge tone="blue" key="s"><UserRound size={11} /> Negotiation</Badge>, "D. Kumar", "$18,200", <Button key="a" onClick={() => navigate("customer-portal")}>Negotiate</Button>],
                  ["Q-1035", "Nova Retail", <Badge tone="green" key="s"><CheckCircle2 size={11} /> Confirmed</Badge>, "L. Patel", "$54,200", <Button key="a" onClick={() => navigate("fulfillment")}>Fulfill</Button>]
                ]}
              />
            </Card>
          )}
        </>
      )}

      {route === "quote-builder" && (
        <>
          <PageHead
            eyebrow="Quote Configurator"
            title="Quotation Q-1042 — Acme Corp"
            subtitle="Gold Tier Pricing. Automated margin guard and multi-tier approval checks."
            actions={
              <>
                <Badge tone={totals.blended > 10 ? "red" : "green"}>
                  <Percent size={11} /> {percent(totals.blended)} Blended Discount
                </Badge>
                <Button onClick={() => notify("Quote changes saved to draft", "info")}>Save Draft</Button>
                <Button tone="primary" onClick={submitQuote}>
                  <Send size={15} /> Submit for Approval
                </Button>
              </>
            }
          />
          {totals.blended > 10 ? (
            <div className="notice red">
              <div className="cluster">
                <AlertTriangle size={16} aria-hidden="true" />
                <span>Multi-level Approval Required: Services discount (16.0%) exceeds the Tier Cap (10.0%).</span>
              </div>
              <Badge tone="red">Escalation Triggered</Badge>
            </div>
          ) : (
            <div className="notice green">
              <div className="cluster">
                <CheckCircle2 size={16} aria-hidden="true" />
                <span>Standard Concession: Blended discount is within sales rep authority limit.</span>
              </div>
              <Badge tone="green">Auto-Pass Eligible</Badge>
            </div>
          )}
          <div className="split">
            <Card title="Line Items & Concession Matrix" action={<Badge tone="blue">{lines.length} Line Items</Badge>}>
              <DataTable
                headers={["Product & Category", "Qty", "List Price", "Discount %", "Tier Cap", "Net Total", "Compliance"]}
                rows={lines.map((line) => [
                  <div key="p">
                    <strong>{line.product}</strong>
                    <div className="subtle">{line.category}</div>
                  </div>,
                  <input
                    key="q"
                    min={1}
                    aria-label={`Quantity for ${line.product}`}
                    onChange={(event) => setLines((current) => current.map((item) => item.id === line.id ? { ...item, qty: Number(event.target.value) || 1 } : item))}
                    style={{ width: 68 }}
                    type="number"
                    value={line.qty}
                  />,
                  <span className="mono" key="l">{money(line.price)}</span>,
                  <input
                    key="d"
                    aria-label={`Discount percentage for ${line.product}`}
                    onChange={(event) => updateLineDiscount(line.id, event.target.value)}
                    style={{ width: 80 }}
                    type="number"
                    value={line.discount}
                  />,
                  <span className="mono" key="c">{percent(line.cap)}</span>,
                  <span className="mono" key="n" style={{ fontWeight: 600 }}>{money(line.qty * line.price * (1 - line.discount / 100))}</span>,
                  <Badge key="a" tone={line.discount > line.cap ? "red" : "green"}>
                    {line.discount > line.cap ? "Over Cap" : "Compliant"}
                  </Badge>
                ])}
              />
              <div className="notice" style={{ marginTop: 14 }}>
                <div className="cluster" style={{ gap: 16 }}>
                  <span>Gross: <strong className="mono">{money(totals.gross)}</strong></span>
                  <span>Concession: <strong className="mono" style={{ color: "var(--amber-text)" }}>{money(totals.concession)}</strong></span>
                  <span>Net Payable: <strong className="mono" style={{ color: "var(--green-text)" }}>{money(totals.net)}</strong></span>
                </div>
                <Button onClick={() => setLines((current) => [...current, { id: "care", product: "Enterprise Care Plan 2yr", category: "Subscription", qty: 1, price: 300, discount: 0, cap: 10 }])}>
                  <Plus size={14} /> Add Care Plan
                </Button>
              </div>
            </Card>
            <div className="grid">
              <Card title="Quote-to-Cash Stepper">
                <Stepper active={quoteStage === "Draft" ? 0 : quoteStage === "Pending approval" ? 1 : 2} />
                <div className="grid" style={{ gap: 8, marginTop: 12 }}>
                  <div className="cluster" style={{ justifyContent: "space-between" }}>
                    <span className="subtle">Draft State:</span>
                    <Badge tone="green">Ready</Badge>
                  </div>
                  <div className="cluster" style={{ justifyContent: "space-between" }}>
                    <span className="subtle">Manager Approval:</span>
                    <Badge tone={totals.blended > 10 ? "red" : "green"}>{totals.blended > 10 ? "Required" : "Not Required"}</Badge>
                  </div>
                  <div className="cluster" style={{ justifyContent: "space-between" }}>
                    <span className="subtle">Decision Status:</span>
                    <Badge tone={quoteStage === "Approved" ? "green" : "amber"}>{approvalDecision}</Badge>
                  </div>
                </div>
              </Card>
            </div>
          </div>
          <Card title="AI Recommended Upsells & Bundles" action={<Badge tone="blue"><Sparkles size={11} /> 3 Recommendations</Badge>}>
            <div className="grid grid-3">
              {[
                { name: "Precision Docking Station Gen 2", sub: "Compatible with Laptop Pro 14", price: "$180" },
                { name: "Enterprise Care Plan 2yr", sub: "24/7 SLA & Rapid Replacement", price: "$300/mo" },
                { name: "Ergonomic Bluetooth Mouse", sub: "High attach rate with laptops", price: "$65" }
              ].map((rec) => (
                <div className="deal-card" key={rec.name}>
                  <div className="cluster" style={{ justifyContent: "space-between" }}>
                    <strong>{rec.name}</strong>
                    <span className="mono subtle">{rec.price}</span>
                  </div>
                  <span className="subtle">{rec.sub}</span>
                  <Button tone="ghost" onClick={() => notify(`${rec.name} added to Q-1042`, "success")}>
                    <Plus size={14} /> Add to Quote
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}

      {route === "approvals" && (
        <>
          <PageHead
            eyebrow="Governance & Risk Matrix"
            title="Discount & Concession Approvals"
            subtitle="Quotes exceeding rep discount limits requiring management and finance sign-off."
            actions={
              <div className="tabs">
                {["All", "Pending", "Returned", "Approved"].map((filter) => (
                  <Button key={filter} tone={approvalFilter === filter ? "primary" : undefined} onClick={() => setApprovalFilter(filter)}>
                    {filter}
                  </Button>
                ))}
              </div>
            }
          />
          <div className="grid grid-3">
            <Metric title="Pending Sign-Off" value="$117,800" detail="4 quotes awaiting review" tone="amber" icon={<Clock size={14} />} />
            <Metric title="Average SLA Response" value="3.4 hrs" detail="Target SLA: under 6.0 hrs" tone="green" icon={<CheckCircle2 size={14} />} />
            <Metric title="Primary Exception" value="Service Discount" detail="Setup Services > 10% Cap" tone="red" icon={<AlertTriangle size={14} />} />
          </div>
          <Card
            title={`${approvalFilter} Approvals Queue`}
            action={
              <Button tone="primary" onClick={approveQuote}>
                <Check size={15} aria-hidden="true" /> Approve All
              </Button>
            }
          >
            {(() => {
              const q1042Status = returnedQuotes.includes("Q-1042") ? "Returned" : quoteStage === "Approved" || quoteStage === "Fulfillment" || quoteStage === "Subscribed" || quoteStage === "Invoiced" || quoteStage === "Paid" ? "Approved" : "Pending";
              const all: { id: string; row: React.ReactNode[]; status: string }[] = [
                {
                  id: "Q-1042",
                  status: q1042Status,
                  row: [
                    <strong key="q">Q-1042</strong>,
                    "Acme Corp",
                    <Badge tone="red" key="r">Major Deal</Badge>,
                    "Sales Ops + Finance Director",
                    <span className="mono" key="w">$42,400</span>,
                    "M. Shah / Sarah J.",
                    <Badge tone="amber" key="t">1h left</Badge>,
                    <Button key="a" tone="primary" onClick={() => navigate("approval-detail")}>Open Review <ArrowRight size={14} aria-hidden="true" /></Button>
                  ]
                },
                {
                  id: "Q-1039",
                  status: "Pending",
                  row: [
                    <strong key="q">Q-1039</strong>,
                    "Beta Industries",
                    <Badge tone="amber" key="r">Mid Tier</Badge>,
                    "Sales Team Lead",
                    <span className="mono" key="w">$18,200</span>,
                    "David K.",
                    <Badge tone="neutral" key="t">3h left</Badge>,
                    <Button key="a" onClick={() => navigate("approval-detail")}>Open Review <ArrowRight size={14} aria-hidden="true" /></Button>
                  ]
                },
                {
                  id: "Q-1044",
                  status: "Approved",
                  row: [
                    <strong key="q">Q-1044</strong>,
                    "Nova Retail",
                    <Badge tone="green" key="r">Standard</Badge>,
                    "Auto Gating",
                    <span className="mono" key="w">$5,100</span>,
                    "Liam P.",
                    <Badge tone="green" key="t">Approved</Badge>,
                    <Button key="a" onClick={() => notify("Small quote approved via automated rules", "success")}>OK</Button>
                  ]
                }
              ];
              const shown = approvalFilter === "All" ? all : all.filter((r) => r.status === approvalFilter);
              if (!shown.length) {
                return (
                  <Empty
                    icon={<Inbox size={32} aria-hidden="true" />}
                    title={`No ${approvalFilter.toLowerCase()} approval requests`}
                    hint="All items in this queue have been processed or resolved."
                    action={<Button onClick={() => setApprovalFilter("All")}>Show All Requests</Button>}
                  />
                );
              }
              return (
                <DataTable
                  headers={["Quote ID", "Account Name", "Deal Category", "Required Approvers", "Contract Value", "Deal Owner", "SLA Status", "Actions"]}
                  rows={shown.map((r) => r.row)}
                />
              );
            })()}
          </Card>
        </>
      )}

      {route === "approval-detail" && (
        <>
          <PageHead
            eyebrow="Audit & Verification"
            title="Approval Review: Quote Q-1042"
            subtitle="Verify discount thresholds, margin impact, and sign-off hierarchy for Acme Corp."
            actions={
              <>
                <Button tone="success" onClick={approveQuote}><Check size={15} aria-hidden="true" /> Approve</Button>
                <Button onClick={returnQuote}><RotateCcw size={15} /> Return for Reason</Button>
                <Button tone="danger" onClick={() => { setApprovalDecision("Rejected"); notify("Q-1042 rejected by approver", "error"); }}><X size={15} aria-hidden="true" /> Reject</Button>
              </>
            }
          />
          <div className="grid">
            <Card title="Line Item Concession Breakdown">
              <DataTable
                headers={["Line Item", "Concession Applied", "Maximum Allowed Cap", "Authorized Escalation Role"]}
                rows={[
                  ["Laptop Pro 14", "12.0%", "15.0%", <Badge tone="green" key="1">Sales Ops</Badge>],
                  ["Onsite Setup Service", "16.0%", "10.0%", <Badge tone="red" key="2">Finance Director</Badge>],
                  ["Extended Warranty 2-Year", "10.0%", "10.0%", <Badge tone="blue" key="3">Auto Compliant</Badge>]
                ]}
              />
              <div className="notice red" style={{ marginTop: 14 }}>
                <div className="cluster">
                  <ShieldAlert size={16} aria-hidden="true" />
                  <span>Onsite Setup Service discount exceeds standard policy by 6.0%. Requires Finance Director override.</span>
                </div>
                <Badge tone="red">{approvalDecision}</Badge>
              </div>
            </Card>
            <Card title="Approval Hierarchy & Audit History">
              <Stepper active={quoteStage === "Approved" ? 2 : 1} />
              <DataTable
                headers={["Approval Tier", "Approver Identity", "Timestamp", "Audit Notes"]}
                rows={[
                  ["Sales Ops Lead", "Sarah Jenkins", "Aug 29, 2:40 PM", "Approved under Gold Account Program"],
                  ["Finance Director", "Naveen Kapoor", "Awaiting Review", "Evaluating margin impact on professional services"],
                  ["Warehouse Fulfillment", "East Depot Logistics", "Pending Sign-off", "Pre-allocation staged in warehouse"]
                ]}
              />
            </Card>
          </div>
        </>
      )}

      {route === "fulfillment" && (
        <>
          <PageHead
            eyebrow="Logistics & Warehousing"
            title="Fulfillment & Stock Overview"
            subtitle="Multi-warehouse inventory allocation, split shipment rules, and packing slips."
            actions={<Button tone="primary" onClick={() => notify("Realtime inventory refreshed from ERP", "success")}><RefreshCw size={15} /> Refresh Stock</Button>}
          />
          <div className="grid grid-3">
            <Metric title="Central Warehouse" value="88% Cap" detail="Capacity utilized (Optimal)" tone="amber" icon={<Warehouse size={14} />} meter={{ pct: 88, tone: "warn" }} />
            <Metric title="Pending Shipments" value="7 Orders" detail="$162,400 total value staged" tone="blue" icon={<Truck size={14} />} />
            <Metric title="Split Required" value="1 Item" detail="Docking Station inventory fallback" tone="red" icon={<AlertTriangle size={14} />} />
          </div>
          <Card title="Staged Orders Ready for Dispatch">
            <DataTable
              headers={["Order Ref", "Customer Account", "Item Manifest", "Dispatch Origin", "Status", "Action"]}
              rows={[
                [
                  <strong key="o">Q-1042 / ORD-8021</strong>,
                  "Acme Corp",
                  "2x Laptop, 1x Setup, 1x Care Plan",
                  "Main Warehouse + East Depot",
                  <Badge tone={fulfillmentAccepted ? "green" : "amber"} key="s">
                    {fulfillmentAccepted ? <PackageCheck size={11} /> : <Clock size={11} />} {fulfillmentAccepted ? "Split Allocated" : "Awaiting Split"}
                  </Badge>,
                  <Button key="a" tone="primary" onClick={() => navigate("fulfillment-detail")}>Open Split</Button>
                ],
                [
                  <strong key="o">Q-1038 / ORD-8019</strong>,
                  "Delta LLC",
                  "10x Laptop Pro 14",
                  "Main Warehouse",
                  <Badge tone="green" key="s"><CheckCircle2 size={11} /> Ready</Badge>,
                  <Button key="a" onClick={() => notify("Pick slip sent to thermal printer", "success")}>Print Pick Slip</Button>
                ],
                [
                  <strong key="o">Q-1035 / ORD-8014</strong>,
                  "Nova Retail",
                  "5x Docking Station, 5x Mouse",
                  "East Coast Depot",
                  <Badge tone="blue" key="s"><Truck size={11} /> In Transit</Badge>,
                  <Button key="a" onClick={() => notify("Carrier tracking live window opened", "info")}>Track Shipment</Button>
                ]
              ]}
            />
          </Card>
        </>
      )}

      {route === "fulfillment-detail" && (
        <>
          <PageHead
            eyebrow="Smart Inventory Routing"
            title="Fulfillment Routing: Q-1042"
            subtitle="Multi-warehouse split allocation for Acme Corp to prevent backorders and meet SLA."
            actions={
              <>
                <Button tone="primary" onClick={acceptSplit}><PackageCheck size={15} /> Accept Suggested Split</Button>
                <Button onClick={() => notify("Manual routing editor opened", "info")}>Manual Allocation</Button>
              </>
            }
          />
          <Card title="Recommended Split Allocation">
            <DataTable
              headers={["Fulfillment Center", "Assigned Products", "Package Count", "Carrier Logistics Cost"]}
              rows={[
                ["Main Warehouse (Chicago)", "Laptop Pro 14 x2", "1 Box", "$42.00"],
                ["East Depot (New York)", "Docking Station Fallback x1", "1 Box", "$18.00"],
                ["Digital Delivery Hub", "Enterprise Care Plan 2yr", "Instant Provision", "$0.00"]
              ]}
            />
            <div className="notice green" style={{ marginTop: 14 }}>
              <div className="cluster">
                <CheckCircle2 size={16} aria-hidden="true" />
                <span>Split routing satisfies delivery date (Sep 12) without incurring out-of-stock delays.</span>
              </div>
              <Badge tone={fulfillmentAccepted ? "green" : "amber"}>{fulfillmentAccepted ? "Split Active" : "Pending Acceptance"}</Badge>
            </div>
          </Card>
        </>
      )}

      {route === "subscriptions" && (
        <>
          <PageHead
            eyebrow="Recurring Revenue Engine"
            title="Subscriptions & Care Plans"
            subtitle="Monitor recurring service contracts, MRR generation, and SLA renewal dates."
            actions={<Button tone="primary" onClick={() => navigate("billing-detail")}><Plus size={15} /> New Subscription Plan</Button>}
          />
          <Card title="Active Contracts & Service Plans">
            <DataTable
              headers={["Subscriber", "Service Plan", "Billing Cadence", "Next Renewal", "Contract State", "Action"]}
              rows={[
                [
                  <strong key="s">Acme Corp</strong>,
                  "Enterprise Care Plan 2yr",
                  "Monthly ($300/mo)",
                  "Sep 15, 2026",
                  <Badge tone={subscriptionActive ? "green" : "amber"} key="st">
                    {subscriptionActive ? "Active" : "Draft"}
                  </Badge>,
                  <Button key="a" tone="primary" onClick={() => navigate("billing-detail")}>Manage</Button>
                ],
                [
                  <strong key="s">Beta Industries</strong>,
                  "Support SLA Gold",
                  "Quarterly ($1,200/qtr)",
                  "Oct 1, 2026",
                  <Badge tone="green" key="st">Active</Badge>,
                  <Button key="a" onClick={() => navigate("billing-detail")}>Manage</Button>
                ],
                [
                  <strong key="s">Delta LLC</strong>,
                  "Cloud Infrastructure Retainer",
                  "Monthly ($500/mo)",
                  "Past Due",
                  <Badge tone="red" key="st">Payment Retry</Badge>,
                  <Button key="a" onClick={() => navigate("invoice-detail")}>View Invoice</Button>
                ]
              ]}
            />
          </Card>
        </>
      )}

      {route === "billing-detail" && (
        <>
          <PageHead
            eyebrow="Contract Billing"
            title="Billing Schedule: Acme Care Plan 2yr"
            subtitle="Automated subscription billing schedule, recurring terms, and invoice generation."
            actions={
              <>
                <Button onClick={() => { setSubscriptionActive(true); notify("Subscription terms updated", "success"); }}>Update Plan</Button>
                <Button tone="danger" onClick={() => notify("Cancellation queue triggered", "error")}>Cancel Plan</Button>
                <Button tone="primary" onClick={generateInvoice}><Receipt size={15} /> Generate Invoice</Button>
              </>
            }
          />
          <Card title="Recurring Line Items & Schedule">
            <DataTable
              headers={["Service Line", "Quantity", "Recurring Rate", "Cadence"]}
              rows={[
                ["Enterprise Care Plan 2yr", "1", "$300.00", "Monthly"],
                ["Priority Engineer SLA", "1", "$150.00", "Monthly"]
              ]}
            />
          </Card>
        </>
      )}

      {route === "customer-portal" && (
        <>
          <div className="portal-bar">
            <div className="cluster">
              <UserRound size={16} aria-hidden="true" />
              <strong>Customer Negotiation View: Q-1042</strong>
              <Badge tone="amber">Awaiting Customer Decision</Badge>
            </div>
            <div className="cluster">
              <span className="subtle">Viewing as Dave (Acme Corp Procurement)</span>
              <Button onClick={() => navigate("quote-builder")}>Switch to Rep View</Button>
            </div>
          </div>
          <PageHead
            eyebrow="Interactive Customer Review"
            title="Quotation Q-1042 — Proposal Summary"
            subtitle="Review discounted enterprise pricing or submit a counter proposal for review."
            actions={<Button tone="primary" onClick={() => notify("PDF quotation downloaded", "success")}><Download size={15} /> Download PDF</Button>}
          />
          <div className="split">
            <Card title="Current Proposal Items">
              <DataTable
                headers={["Item Description", "Qty", "List Price", "Discount %", "Net Total"]}
                rows={lines.map((line) => [
                  line.product,
                  line.qty,
                  money(line.price),
                  percent(line.discount),
                  <strong className="mono" key="n">{money(line.qty * line.price * (1 - line.discount / 100))}</strong>
                ])}
              />
            </Card>
            <Card title="Submit Counter Proposal">
              <form
                className="grid"
                onSubmit={(event) => {
                  event.preventDefault();
                  setQuoteStage("Pending approval");
                  notify(`Counter proposal submitted for ${counterDiscount}% discount`, "info");
                }}
              >
                <label>
                  Requested Discount %
                  <input onChange={(event) => setCounterDiscount(event.target.value)} value={counterDiscount} />
                </label>
                <label>
                  Desired Delivery Date
                  <input defaultValue="2026-09-12" type="date" />
                </label>
                <label>
                  Procurement Notes
                  <textarea defaultValue="Can we bundle the Docking Station at $80 and sign this week?" rows={3} />
                </label>
                <Button tone="primary" type="submit">Submit Counter Proposal</Button>
                <Button tone="success" onClick={() => { setQuoteStage("Approved"); notify("Customer accepted quote. Ready for fulfillment.", "success"); }}>
                  <Check size={15} /> Accept This Quote
                </Button>
              </form>
            </Card>
          </div>
        </>
      )}

      {route === "invoices" && (
        <>
          <PageHead
            eyebrow="Accounts Receivable"
            title="Invoices & Collections"
            subtitle="Track accounts receivable, automated reminders, and Stripe settlement statuses."
            actions={
              <>
                <Button tone="primary" onClick={generateInvoice}><Plus size={15} /> Generate Invoice</Button>
                <Button onClick={() => notify("All invoices exported to CSV", "info")}><FileSpreadsheet size={15} /> Export Sheet</Button>
              </>
            }
          />
          <Card title="Accounts Receivable Ledger">
            <DataTable
              headers={["Invoice ID", "Account", "Billed Amount", "Payment Status", "Due Date", "Actions"]}
              rows={[
                [
                  <strong key="i">INV-1042</strong>,
                  "Acme Corp",
                  <span className="mono" key="m">{money(totals.net)}</span>,
                  <Badge tone={invoicePaid ? "green" : "amber"} key="s">
                    {invoicePaid ? <CheckCircle2 size={11} /> : <Clock size={11} />} {invoicePaid ? "Settled & Paid" : "Awaiting Settlement"}
                  </Badge>,
                  "Sep 15, 2026",
                  <Button key="a" tone="primary" onClick={() => navigate("invoice-detail")}>Inspect Invoice</Button>
                ],
                [
                  <strong key="i">INV-1039</strong>,
                  "Beta Industries",
                  <span className="mono" key="m">$18,200</span>,
                  <Badge tone="red" key="s"><AlertCircle size={11} /> Overdue (3d)</Badge>,
                  "Aug 9, 2026",
                  <Button key="a" onClick={() => notify("Automated payment reminder dispatched", "success")}>Send Reminder</Button>
                ]
              ]}
            />
          </Card>
        </>
      )}

      {route === "invoice-detail" && (
        <>
          <PageHead
            eyebrow="Billing Reconciliation"
            title="Invoice INV-1042 — Acme Corp"
            subtitle="Review line-item billing, payment terms, and Stripe ERP settlement confirmation."
            actions={
              <>
                <Button onClick={() => notify("Official tax invoice PDF generated", "success")}><Download size={15} /> Save PDF</Button>
                <Button tone="success" disabled={invoicePaid} onClick={receivePayment}>
                  <CheckCircle2 size={15} /> {invoicePaid ? "Payment Settled" : "Receive Payment"}
                </Button>
              </>
            }
          />
          <Card title="Reconciliation Lifecycle">
            <Stepper active={invoicePaid ? 4 : 3} />
            <DataTable
              headers={["Invoice Reference", "Payable Total", "Current Status", "Payment Due"]}
              rows={[
                [
                  <strong key="i">INV-1042</strong>,
                  <span className="mono" key="m">{money(totals.net)}</span>,
                  <Badge tone={invoicePaid ? "green" : "amber"} key="s">
                    {invoicePaid ? "Paid & Reconciled" : "Open / Unpaid"}
                  </Badge>,
                  "Sep 15, 2026"
                ]
              ]}
            />
          </Card>
        </>
      )}

      {route === "deal-health" && (
        <>
          <PageHead
            eyebrow="AI Risk Radar"
            title="Deal Health & Anomaly Detector"
            subtitle="Automated detection of stalled negotiations, excessive margin concessions, and stock bottlenecks."
            actions={<Button tone="primary" onClick={() => notify("Account notifications dispatched to sales reps", "success")}><Send size={15} /> Ping Reps</Button>}
          />
          <div className="grid grid-3">
            <Metric title="Stalled / Gone Quiet" value="3 Deals" detail="No interaction > 14 days" tone="red" icon={<Clock size={14} />} onClick={() => navigate("customer-portal")} />
            <Metric title="Margin Erosion Risk" value="2 Deals" detail="Concessions > 15% limit" tone="amber" icon={<Percent size={14} />} onClick={() => navigate("approval-detail")} />
            <Metric title="Inventory Bottlenecks" value="1 Item" detail="Requires split dispatch" tone="blue" icon={<Warehouse size={14} />} onClick={() => navigate("fulfillment-detail")} />
          </div>
          <Card title="Prioritized Anomaly Worklist">
            <DataTable
              headers={["Deal Identifier", "Detected Risk Factor", "Sales Rep", "Remediation Action"]}
              rows={[
                ["Q-1042", "Concession over cap on Services (16%)", "M. Shah", <Button key="a" tone="primary" onClick={() => navigate("approval-detail")}>Resolve Gating</Button>],
                ["Q-1039", "No customer engagement in 14 days", "D. Kumar", <Button key="a" onClick={() => navigate("customer-portal")}>Open Portal</Button>],
                ["ORD-8021", "Docking Station shortage in primary warehouse", "East Depot", <Button key="a" onClick={() => navigate("fulfillment-detail")}>Execute Split</Button>]
              ]}
            />
          </Card>
        </>
      )}

      {route === "reports" && (
        <>
          <PageHead
            eyebrow="Executive Analytics"
            title="Revenue & Performance Reports"
            subtitle="Key metrics on quote-to-cash turnaround, approval SLA velocity, and product performance."
            actions={
              <>
                <Button onClick={() => notify("Executive PDF report compiled", "success")}><Download size={15} /> Export PDF</Button>
                <Button onClick={() => notify("CSV dataset downloaded", "success")}><FileSpreadsheet size={15} /> Export Sheet</Button>
              </>
            }
          />
          <div className="grid grid-4">
            <Metric title="Quotes Generated" value="26 Quotes" detail="Current fiscal month" tone="blue" trend="+18% MoM" onClick={() => navigate("quotations")} />
            <Metric title="Avg Approval SLA" value="3.4 Hours" detail="Down 12% from last month" tone="green" trend="Target < 6h" onClick={() => navigate("approvals")} />
            <Metric title="Top Volume Driver" value="Laptop Pro 14" detail="$72,400 active pipeline" tone="purple" onClick={() => navigate("products")} />
            <Metric title="Escalation Count" value="3 Flagged" detail="Currently in governance" tone="red" onClick={() => navigate("deal-health")} />
          </div>
        </>
      )}

      {route === "products" && (
        <>
          <PageHead
            eyebrow="Catalog Master"
            title="Product & Service Catalog"
            subtitle="Configure standard pricing, category rules, tax rates, and discount boundaries."
            actions={
              <>
                <Button tone="primary" onClick={() => navigate("product-detail")}><Plus size={15} /> New Product</Button>
                <Button onClick={() => navigate("discount-setup")}><SlidersHorizontal size={15} /> Discount Rules</Button>
              </>
            }
          />
          <div className="grid grid-3">
            <Metric title="Catalog Items" value="118 Active" detail="Across 14 categories" tone="blue" icon={<Tag size={14} />} onClick={() => navigate("product-detail")} />
            <Metric title="Pricelist Regions" value="3 Tiers" detail="USD, EUR, Global Enterprise" tone="green" icon={<Layers size={14} />} onClick={() => navigate("discount-setup")} />
            <Metric title="Configurable Bundles" value="42 Bundles" detail="Hardware + Care Attach" tone="amber" icon={<Box size={14} />} onClick={() => navigate("quote-builder")} />
          </div>
          <Card title="Products & Services Catalog">
            <DataTable
              headers={["Product Name", "Category", "Variants", "List Price", "Tax %", "Status", "Actions"]}
              rows={[
                ["Laptop Pro 14", "Hardware", "3 configurations", "$1,200", "15.0%", <Badge tone="green" key="s">Active</Badge>, <Button key="a" tone="primary" onClick={() => navigate("product-detail")}>Edit</Button>],
                ["Onsite Setup Service", "Services", "1 standard", "$450", "10.0%", <Badge tone="green" key="s">Active</Badge>, <Button key="a" onClick={() => navigate("product-detail")}>Edit</Button>],
                ["Enterprise Care Plan 2yr", "Subscription", "Monthly/Annual", "$300/mo", "0.0%", <Badge tone="blue" key="s">Active</Badge>, <Button key="a" onClick={() => navigate("billing-detail")}>Billing</Button>]
              ]}
            />
          </Card>
        </>
      )}

      {route === "product-detail" && (
        <>
          <PageHead
            eyebrow="Catalog Item Editor"
            title="Product Definition: Laptop Pro 14"
            subtitle="Configure pricing tiers, tax classifications, inventory rules, and recurring billing."
            actions={
              <>
                <Button onClick={() => navigate("discount-setup")}>Discount Rules</Button>
                <Button tone="primary" onClick={() => { setProductStatus("Active"); notify("Product catalog changes committed", "success"); }}>
                  <Check size={15} /> Save Product
                </Button>
              </>
            }
          />
          <Card title="Product Master Parameters">
            <div className="form-grid">
              <label>Product Name<input defaultValue="Laptop Pro 14" /></label>
              <label>Category<input defaultValue="Hardware" /></label>
              <label>Base Price ($)<input defaultValue="1200" type="number" /></label>
              <label>Applicable Tax (%)<input defaultValue="15" type="number" /></label>
              <label>Recurring Subscription<select defaultValue="no"><option value="no">No — One-time Purchase</option><option value="yes">Yes — Recurring Plan</option></select></label>
              <label>Available Stock on Hand<input defaultValue="42" type="number" /></label>
            </div>
            <div className="notice green" style={{ marginTop: 14 }}>
              <div className="cluster">
                <CheckCircle2 size={16} aria-hidden="true" />
                <span>Product status: {productStatus}</span>
              </div>
              <Badge tone={productStatus === "Active" ? "green" : "amber"}>{productStatus}</Badge>
            </div>
          </Card>
        </>
      )}

      {route === "discount-setup" && (
        <>
          <PageHead
            eyebrow="Governance Configuration"
            title="Discount Tiers & Approval Thresholds"
            subtitle="Configure allowable discount caps by customer tier and set automated escalation paths."
            actions={<Button tone="primary" onClick={() => { setDiscountRulesSaved(true); notify("Discount governance policies saved", "success"); }}>Save Configuration</Button>}
          />
          <div className="split">
            <Card title="Discount Caps by Customer Tier">
              <DataTable
                headers={["Customer Tier", "Maximum Allowed Discount %"]}
                rows={[
                  ["Bronze Tier", <input key="i" defaultValue="5" type="number" aria-label="Bronze cap" />],
                  ["Silver Tier", <input key="i" defaultValue="10" type="number" aria-label="Silver cap" />],
                  ["Gold Enterprise Tier", <input key="i" defaultValue="15" type="number" aria-label="Gold cap" />]
                ]}
              />
            </Card>
            <Card title="Category Specific Discount Caps">
              <DataTable
                headers={["Category", "Category Cap %"]}
                rows={[
                  ["Hardware", <input key="i" defaultValue="15" type="number" aria-label="Hardware cap" />],
                  ["Services", <input key="i" defaultValue="10" type="number" aria-label="Services cap" />],
                  ["Subscription Care", <input key="i" defaultValue="10" type="number" aria-label="Subscription cap" />]
                ]}
              />
            </Card>
          </div>
          <Card title="Approval Escalation Authority Matrix">
            <DataTable
              headers={["Concession Severity", "Governance & Escalation Path"]}
              rows={[
                ["Within Tier & Category Cap", "Auto-Approved / Direct to Quote"],
                ["Exceeds Cap by < 5%", "Sales Team Lead Approval Required"],
                ["Exceeds Cap by > 5% or Service Concession", "Sales Operations Lead + Finance Director Approval"]
              ]}
            />
            <div className="notice" style={{ marginTop: 14 }}>
              <div className="cluster">
                <ShieldCheck size={16} aria-hidden="true" />
                <span>Configuration Status: {discountRulesSaved ? "Active & Enforced in Quote Builder" : "Pending Save"}</span>
              </div>
              <Badge tone={discountRulesSaved ? "green" : "amber"}>{discountRulesSaved ? "Enforced" : "Draft"}</Badge>
            </div>
          </Card>
        </>
      )}

      <FlowAudit route={route} />
      <DemoTour route={route} quoteStage={quoteStage} onNavigate={navigate} onReset={resetDemo} />
      {toast ? (
        <div className="toast-stack" aria-live="polite">
          <div className={`toast ${toastKind}`} role="status">
            {toastKind === "success" ? <CircleCheck size={16} aria-hidden="true" /> : toastKind === "error" ? <TriangleAlert size={16} aria-hidden="true" /> : <Info size={16} aria-hidden="true" />}
            <span>{toast}</span>
            <button className="toast-close" onClick={() => setToast("")} aria-label="Dismiss message" type="button">
              <X size={14} aria-hidden="true" />
            </button>
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}

function DemoTour({ route, quoteStage, onNavigate, onReset }: { route: Route; quoteStage: QuoteStage; onNavigate: (route: Route, message?: string) => void; onReset: () => void }) {
  const index = Math.max(0, flowRoutes.indexOf(route));
  const prev = flowRoutes[index - 1];
  const next = flowRoutes[index + 1];
  return (
    <nav className="demo-tour" aria-label="Guided demo tour navigation">
      <div className="cluster">
        <Badge tone="blue">Step {index + 1} of {flowRoutes.length}</Badge>
        <strong>{routeNames[route]}</strong>
        <span className="subtle">Lifecycle Status: {quoteStage}</span>
      </div>
      <div className="cluster">
        <Button disabled={!prev} onClick={() => prev && onNavigate(prev)} ariaLabel={prev ? `Go back to ${routeNames[prev]}` : "No previous view"}>
          <ChevronLeft size={15} aria-hidden="true" /> Previous
        </Button>
        <Button disabled={!next} onClick={() => next && onNavigate(next)} tone="primary" ariaLabel={next ? `Proceed to ${routeNames[next]}` : "End of tour"}>
          Next: {next ? routeNames[next] : "Complete"} <ChevronRight size={15} aria-hidden="true" />
        </Button>
        <Button onClick={onReset} tip="Reset all demo state to start">
          <RotateCcw size={15} aria-hidden="true" /> Reset Demo
        </Button>
      </div>
    </nav>
  );
}

function Metric({
  title,
  value,
  detail,
  tone,
  meter,
  icon,
  trend,
  onClick
}: {
  title: string;
  value: string;
  detail: string;
  tone: StatusTone;
  meter?: { pct: number; tone: "good" | "warn" | "bad" };
  icon?: React.ReactNode;
  trend?: string;
  onClick?: () => void;
}) {
  return (
    <div
      className={`card metric ${onClick ? "clickable-card" : ""}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div>
        <div className="metric-head">
          <Badge tone={tone}>{icon}{title}</Badge>
          {trend ? <span className="subtle mono" style={{ fontSize: "11px", fontWeight: 600 }}>{trend}</span> : null}
        </div>
        <div className="metric-value mono">{value}</div>
        <p className="subtle">{detail}</p>
      </div>
      {meter ? (
        <div className={`meter ${meter.tone}`} role="img" aria-label={`${title}: ${Math.round(meter.pct)} percent`}>
          <span style={{ width: `${Math.min(100, Math.max(0, meter.pct))}%` }} />
        </div>
      ) : null}
    </div>
  );
}

function FlowStrip({
  quoteStage,
  blended,
  overCap,
  fulfillmentAccepted,
  subscriptionActive,
  invoicePaid,
  counterDiscount,
  onGo
}: {
  quoteStage: QuoteStage;
  blended: number;
  overCap: boolean;
  fulfillmentAccepted: boolean;
  subscriptionActive: boolean;
  invoicePaid: boolean;
  counterDiscount: string;
  onGo: (r: Route) => void;
}) {
  const approved = quoteStage === "Approved" || quoteStage === "Fulfillment" || quoteStage === "Subscribed" || quoteStage === "Invoiced" || quoteStage === "Paid";
  const shipped = quoteStage === "Fulfillment" || quoteStage === "Subscribed" || quoteStage === "Invoiced" || quoteStage === "Paid";
  const billed = subscriptionActive || quoteStage === "Invoiced" || quoteStage === "Paid";
  
  const nodes: { num: string; label: string; sub: string; state: "done" | "now" | "todo"; go: Route }[] = [
    { num: "01", label: "Quotation", sub: "Q-1042 Config", state: "done", go: "quote-builder" },
    { num: "02", label: "Discount / Risk", sub: overCap ? `${percent(blended)} (Over Cap)` : `${percent(blended)} (OK)`, state: overCap ? "now" : "done", go: "quote-builder" },
    { num: "03", label: "Approval", sub: approved ? "Approved" : quoteStage === "Pending approval" ? "In Review" : "Draft", state: approved ? "done" : quoteStage === "Pending approval" ? "now" : "todo", go: "approvals" },
    { num: "04", label: "Upsell", sub: "3 Bundles Active", state: approved ? "done" : "todo", go: "quote-builder" },
    { num: "05", label: "Fulfillment", sub: fulfillmentAccepted ? "Split Active" : shipped ? "Ready" : "Waiting", state: fulfillmentAccepted || shipped ? "done" : approved ? "now" : "todo", go: "fulfillment" },
    { num: "06", label: "Negotiation", sub: `${counterDiscount}% Counter`, state: approved ? "done" : "todo", go: "customer-portal" },
    { num: "07", label: "Billing", sub: billed ? "Plan Active" : "No Plan", state: billed ? "done" : shipped ? "now" : "todo", go: "subscriptions" },
    { num: "08", label: "Payment", sub: invoicePaid ? "Reconciled" : "Open", state: invoicePaid ? "done" : billed ? "now" : "todo", go: "invoices" }
  ];

  return (
    <div className="flow-strip" role="list" aria-label="DealFlow360 Lifecycle: Quote to Cash">
      {nodes.map((n) => (
        <button
          key={n.label}
          role="listitem"
          className={`flow-node ${n.state}`}
          onClick={() => onGo(n.go)}
          type="button"
          aria-label={`${n.num} ${n.label}: ${n.sub}`}
        >
          <div className="cluster" style={{ justifyContent: "space-between", width: "100%" }}>
            <span className="fn-step-num">{n.num}</span>
            <span className="fn-dot" aria-hidden="true" />
          </div>
          <span className="fn-label">{n.label}</span>
          <span className="fn-sub">{n.sub}</span>
        </button>
      ))}
    </div>
  );
}

function DealCard({
  name,
  id,
  amount,
  tone,
  onOpen
}: {
  name: string;
  id: string;
  amount: string;
  tone: StatusTone;
  onOpen: () => void;
}) {
  return (
    <button className="deal-card" onClick={onOpen} type="button">
      <div className="cluster" style={{ justifyContent: "space-between" }}>
        <strong>{name}</strong>
        <Badge tone={tone}>{id}</Badge>
      </div>
      <div className="mono" style={{ fontSize: "15px", fontWeight: 700 }}>{amount}</div>
      <div className="subtle">Enterprise Pricing Package</div>
    </button>
  );
}

function FlowAudit({ route }: { route: Route }) {
  return (
    <div aria-label="Prototype route coverage" data-prototype-flow={flowRoutes.join(",")} hidden>
      {route}
    </div>
  );
}
