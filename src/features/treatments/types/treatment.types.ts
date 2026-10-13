export type TreatmentKind = 'oral' | 'topical';

/** What the treatment is, as far as skincare conflicts are concerned */
export type TreatmentActive =
  | 'isotretinoin'
  | 'tretinoin'
  | 'adapalene'
  | 'antibiotic'
  | 'spironolactone'
  | 'other';

export type TreatmentFrequency = 'daily' | 'weekdays' | 'every_other_day';

export type TreatmentDoseStatus = 'taken' | 'skipped';

export interface Treatment {
  id: string;
  name: string;
  kind: TreatmentKind;
  activeKey: TreatmentActive;
  /** Free text the user copies from their prescription; GlowLog never suggests a dose */
  doseNote?: string;
  frequency: TreatmentFrequency;
  /** Days of the week for 'weekdays', as Date.getDay() values (0 = Sunday) */
  weekdays: number[];
  /** Dose times as "HH:MM", sorted */
  times: string[];
  startDate: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD, inclusive
  reminderEnabled: boolean;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TreatmentLog {
  id: string;
  treatmentId: string;
  date: string; // YYYY-MM-DD
  slot: string; // "HH:MM", one of the treatment's times
  status: TreatmentDoseStatus;
  loggedAt: string;
}

export interface CreateTreatmentInput {
  name: string;
  kind: TreatmentKind;
  activeKey: TreatmentActive;
  doseNote?: string;
  frequency: TreatmentFrequency;
  weekdays: number[];
  times: string[];
  startDate: string;
  endDate?: string;
  reminderEnabled: boolean;
}

export type UpdateTreatmentInput = Partial<CreateTreatmentInput> & { archived?: boolean };

/** One scheduled dose on a given day */
export interface TreatmentDose {
  treatment: Treatment;
  slot: string;
  status?: TreatmentDoseStatus;
}
