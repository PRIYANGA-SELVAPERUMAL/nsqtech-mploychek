export interface CheckItem {
  type: string;
  status: string;
  remarks: string;
}

export interface VerificationRecord {
  recordId: string;
  candidateName: string;
  position: string;
  status: 'Pending' | 'In Progress' | 'Verified' | 'Flagged' | 'Rejected';
  submittedDate: string;
  completedDate?: string;
  assignedTo: string;
  createdBy: string;
  checks: CheckItem[];
  priority: 'Low' | 'Medium' | 'High';
  company: string;
}
