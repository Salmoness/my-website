export type AvailabilityState = 'available-external' | 'supplied' | 'missing' | 'deferred';

export type PermissionState = 'approved' | 'pending' | 'not-applicable';

export type InventoryAudience = 'employer' | 'client' | 'both';

export interface InventoryItem {
  id: string;
  label: string;
  audience: InventoryAudience;
  availability: AvailabilityState;
  permission: PermissionState;
  expectedMilestone: string;
  notes?: string;
}

export const contentAndAssetInventory: readonly InventoryItem[] = [
  {
    id: 'resume',
    label: 'Current Résumé',
    audience: 'employer',
    availability: 'available-external',
    permission: 'approved',
    expectedMilestone: 'content-loading',
    notes:
      'Current professional résumé maintained externally; content review pending final intake.',
  },
  {
    id: 'email',
    label: 'Professional Email Address',
    audience: 'both',
    availability: 'available-external',
    permission: 'approved',
    expectedMilestone: 'content-loading',
    notes: 'Professional contact address available externally.',
  },
  {
    id: 'github',
    label: 'GitHub Profile',
    audience: 'both',
    availability: 'available-external',
    permission: 'approved',
    expectedMilestone: 'content-loading',
    notes: 'Public code repository profile available externally.',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn Profile',
    audience: 'both',
    availability: 'available-external',
    permission: 'approved',
    expectedMilestone: 'content-loading',
    notes: 'Professional network profile available externally.',
  },
  {
    id: 'headshot',
    label: 'Professional Headshot',
    audience: 'both',
    availability: 'available-external',
    permission: 'approved',
    expectedMilestone: 'content-loading',
    notes: 'Candidate headshot available externally; awaiting asset intake and optimization.',
  },
  {
    id: 'screenshots',
    label: 'Project Screenshots',
    audience: 'both',
    availability: 'available-external',
    permission: 'pending',
    expectedMilestone: 'content-loading',
    notes: 'Visual project evidence available externally; requires final permission check.',
  },
  {
    id: 'client-logos',
    label: 'Client Logos',
    audience: 'client',
    availability: 'available-external',
    permission: 'pending',
    expectedMilestone: 'content-loading',
    notes: 'Brand marks available externally; requires client usage authorization.',
  },
  {
    id: 'positioning-copy',
    label: 'Professional Positioning Copy',
    audience: 'both',
    availability: 'missing',
    permission: 'not-applicable',
    expectedMilestone: 'content-loading',
    notes: 'Final positioning statement and supporting introduction remain to be supplied.',
  },
  {
    id: 'biography-copy',
    label: 'Biography Copy',
    audience: 'both',
    availability: 'missing',
    permission: 'not-applicable',
    expectedMilestone: 'content-loading',
    notes: 'Final short and expanded professional biography remain to be supplied.',
  },
  {
    id: 'page-introductions',
    label: 'Page Introduction Copy',
    audience: 'both',
    availability: 'missing',
    permission: 'not-applicable',
    expectedMilestone: 'content-loading',
  },
  {
    id: 'project-copy',
    label: 'Project Copy',
    audience: 'both',
    availability: 'missing',
    permission: 'not-applicable',
    expectedMilestone: 'content-loading',
  },
  {
    id: 'case-study-copy',
    label: 'Case Study Narratives',
    audience: 'both',
    availability: 'missing',
    permission: 'not-applicable',
    expectedMilestone: 'content-loading',
  },
  {
    id: 'service-copy',
    label: 'Service Copy',
    audience: 'client',
    availability: 'missing',
    permission: 'not-applicable',
    expectedMilestone: 'content-loading',
  },
  {
    id: 'resume-experience-copy',
    label: 'Résumé-Derived Experience Copy',
    audience: 'employer',
    availability: 'missing',
    permission: 'pending',
    expectedMilestone: 'content-loading',
    notes: 'Requires transcription and approval from the current résumé.',
  },
  {
    id: 'media-captions',
    label: 'Media Captions',
    audience: 'both',
    availability: 'missing',
    permission: 'not-applicable',
    expectedMilestone: 'content-loading',
  },
  {
    id: 'media-alternative-text',
    label: 'Media Alternative Text',
    audience: 'both',
    availability: 'missing',
    permission: 'not-applicable',
    expectedMilestone: 'content-loading',
  },
  {
    id: 'page-descriptions',
    label: 'Page Descriptions',
    audience: 'both',
    availability: 'missing',
    permission: 'not-applicable',
    expectedMilestone: 'content-loading',
  },
  {
    id: 'contact-copy',
    label: 'Contact Language',
    audience: 'both',
    availability: 'missing',
    permission: 'not-applicable',
    expectedMilestone: 'content-loading',
  },
  {
    id: 'testimonials',
    label: 'Client Testimonials',
    audience: 'client',
    availability: 'deferred',
    permission: 'not-applicable',
    expectedMilestone: 'deferred',
    notes: 'Non-blocking; deferred to future agency milestone.',
  },
  {
    id: 'personal-logo',
    label: 'Personal Logo',
    audience: 'both',
    availability: 'deferred',
    permission: 'not-applicable',
    expectedMilestone: 'deferred',
    notes: 'Non-blocking; text identity used until branded mark is introduced.',
  },
] as const;

// Summary & Query Helpers
export function getInventoryItem(id: string): InventoryItem | undefined {
  return contentAndAssetInventory.find((item) => item.id === id);
}

export function getItemsByAvailability(availability: AvailabilityState): InventoryItem[] {
  return contentAndAssetInventory.filter((item) => item.availability === availability);
}

export function getItemsByAudience(audience: InventoryAudience): InventoryItem[] {
  return contentAndAssetInventory.filter(
    (item) => item.audience === audience || item.audience === 'both',
  );
}

export function isItemBlocking(item: InventoryItem): boolean {
  if (item.availability === 'deferred') {
    return false;
  }

  return item.availability !== 'supplied' || item.permission === 'pending';
}

export function getInventorySummary() {
  return {
    total: contentAndAssetInventory.length,
    availableExternal: getItemsByAvailability('available-external').length,
    supplied: getItemsByAvailability('supplied').length,
    missing: getItemsByAvailability('missing').length,
    deferred: getItemsByAvailability('deferred').length,
    blockingCount: contentAndAssetInventory.filter(isItemBlocking).length,
  };
}
