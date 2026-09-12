export type TransactionStatus = "successful" | "pending" | "failed" | "reversed";

export type Transaction = {
  id: string;
  reference: string;
  /** ISO timestamp. */
  occurredAt: string;
  /** Pre-formatted for display so the server and client always agree. */
  dateLabel: string;
  timeLabel: string;
  amount: number;
  amountLabel: string;
  currency: string;
  status: TransactionStatus;
  method: string;
  channel: string;
  terminalId: string | null;
  merchantReference: string;
  authorizationReference: string;
  settlementStatus: "settled" | "pending" | "not_settled";
  settlementDateLabel: string | null;
};

export type ActivityBucket = {
  key: string;
  label: string;
  /** Shown on the axis; some buckets hide their label when space is tight. */
  axisLabel: string;
  count: number;
  value: number;
  valueLabel: string;
};

export type StatusBreakdown = {
  status: TransactionStatus;
  count: number;
  share: number;
};

export type MerchantAccount = {
  merchantId: string;
  businessName: string;
  tradingName: string;
  status: "active" | "review" | "suspended";
  merchantSince: string;
  serviceType: string;
  category: string;
  businessType: string;
  registrationNumber: string;
  taxId: string;
  address: string;
  branch: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  settlementBank: string;
  settlementAccountMasked: string;
  settlementCurrency: string;
  settlementFrequency: string;
  lastLogin: string;
  twoFactorEnabled: boolean;
  activeSessions: number;
  passwordUpdated: string;
};

export type Terminal = {
  id: string;
  label: string;
  status: "active" | "inactive";
  location: string;
  deviceType: string;
  lastActivity: string;
};

export type Notice = {
  id: string;
  title: string;
  body: string;
  timeLabel: string;
  tone: "info" | "attention";
};

export type DashboardTotals = {
  count: number;
  value: number;
  valueLabel: string;
  successful: number;
  failed: number;
  pending: number;
  reversed: number;
  averageLabel: string;
};

export type DashboardData = {
  totals: DashboardTotals;
  /** Percentage change against the previous comparable period. */
  change: { count: number; value: number } | null;
  activity: ActivityBucket[];
  breakdown: StatusBreakdown[];
  recent: Transaction[];
  account: MerchantAccount;
  terminals: Terminal[];
  notices: Notice[];
};

export type TransactionQuery = {
  search: string;
  status: TransactionStatus | "all";
  method: string;
  channel: string;
  minAmount: number | null;
  maxAmount: number | null;
  page: number;
  pageSize: number;
};

export type TransactionPage = {
  rows: Transaction[];
  total: number;
  totalValueLabel: string;
  page: number;
  pageCount: number;
  pageSize: number;
  methods: string[];
  channels: string[];
};

/** Every data block can be loading, successful, empty or failed. */
export type DataResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };
