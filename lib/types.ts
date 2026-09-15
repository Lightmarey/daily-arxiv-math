import type { PublicTrackingConfig } from './config';

export type AiStatus = 'explicit' | 'no_disclosure_observed' | 'not_checked';
export type PriorityTier = 'high' | 'medium' | 'low';

export interface ProofOutlineStep {
  claim: string;
  route: string;
  evidence: string;
}

export interface ProofOutline {
  status: 'not_reviewed' | 'reviewed' | 'not_applicable';
  steps: ProofOutlineStep[];
}

export interface VolumePoint {
  announcementDate: string;
  counts: Record<string, number | null>;
}
export interface WeeklyVolumePoint {
  weekStart: string;
  weekEnding: string;
  counts: Record<string, number | null>;
  complete: boolean;
}
export interface CategoryCoverage {
  categoryId: string;
  expectedCount: number | null;
  publishedCount: number | null;
  databasePublicationCount?: number | null;
  complete: boolean;
  requiredForCompletion: boolean;
  status: 'complete' | 'incomplete' | 'not_collected';
  completedAt?: string | null;
}
export interface CategoryHealth extends CategoryCoverage {
  latestAnnouncementDate: string | null;
  latestSuccessfulRunAt: string | null;
  sourceCursor: string | null;
  hasDailyVolume: boolean;
}
export interface HealthSnapshot {
  status: 'ok' | 'degraded';
  checkedAt: string;
  categories: CategoryHealth[];
  latestCompleteWeek: WeeklyVolumePoint | null;
  checks: { database: boolean; coverage: boolean; weeklyVolume: boolean };
}

export interface PaperReport {
  id: string;
  categoryId: string;
  configVersion: string;
  announcementDate: string;
  arxivId: string;
  version: number;
  entryKind: 'new' | 'cross_list' | 'revision';
  title: string;
  authors: string[];
  abstract: string;
  categories: string[];
  primaryCategory: string;
  arxivUrl: string;
  pdfUrl: string;
  submittedAt: string;
  updatedAt: string;
  topicId: string;
  topicLabel: string;
  progressType: string;
  workSummary: string;
  techniques: string[];
  breakthrough: string;
  limitations: string;
  analysisDepth: 'abstract' | 'full_text_sections';
  proofOutline: ProofOutline;
  aiStatus: AiStatus;
  aiEvidence?: string | null;
  aiEvidenceSource?: string | null;
  priorityScore: number;
  priorityTier: PriorityTier;
  priorityReason: string;
  lowPriorityReason?: string | null;
  revisionSummary?: string | null;
}

export type PaperSummary = Pick<
  PaperReport,
  | 'id'
  | 'categoryId'
  | 'announcementDate'
  | 'arxivId'
  | 'version'
  | 'title'
  | 'authors'
  | 'categories'
  | 'arxivUrl'
  | 'pdfUrl'
  | 'topicId'
  | 'topicLabel'
  | 'progressType'
  | 'workSummary'
  | 'analysisDepth'
  | 'aiStatus'
  | 'priorityScore'
  | 'priorityTier'
  | 'priorityReason'
>;

export interface DailyOverview {
  paperCount: number;
  mainProgress: string[];
  breakthroughPoints: Array<{
    arxivId: string;
    title: string;
    summary: string;
  }>;
  cautions: string[];
}

export interface ReportFeed {
  date: string;
  lastUpdated: string;
  categories: string[];
  coverage: CategoryCoverage[];
  reports: PaperReport[];
}
export interface DashboardData {
  latestDate: string;
  lastUpdated: string;
  config: PublicTrackingConfig;
  volumes: VolumePoint[];
  reports: PaperSummary[];
  overview: DailyOverview;
  dataMode: 'database' | 'preview' | 'loading' | 'unavailable';
  coverage: CategoryCoverage[];
}
export interface PaperAnalyses {
  arxivId: string;
  primary: PaperReport;
  analyses: PaperReport[];
}
