import type { AssessmentReport, BrowserSnapshot } from '../types';
import type { ReportViewModel as ReportViewModelInternal } from './report/reportTypes';
import { buildReportViewModel as buildReportViewModelInternal } from './report/reportViewModel';


export type ReportViewModel = ReportViewModelInternal;

export function buildReportViewModel(report: AssessmentReport, snapshot: BrowserSnapshot): ReportViewModel {
  return buildReportViewModelInternal({ report, snapshot });
}

