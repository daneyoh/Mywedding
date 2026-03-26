export type TemplateId = 'classic' | 'modern' | 'floral' | 'luxury';

export interface GalleryImage {
  id: string;
  url: string;
}

export interface InvitationImage {
  id: string;
  url: string;
}

export interface BankAccount {
  name: string;
  bank: string;
  number: string;
}

export interface InvitationData {
  groomName: string;
  brideName: string;
  groomPhone?: string;
  bridePhone?: string;
  groomParents?: string;
  brideParents?: string;
  date?: string;
  time?: string;
  location?: string;
  locationDetail?: string;
  address?: string;
  welcomeMessage?: string;
  templateId?: string;
  parkingGuideEnabled?: boolean;
  audioUrl?: string;
  images?: InvitationImage[];
  locationImages?: InvitationImage[];
  accounts?: {
    groom?: BankAccount[];
    bride?: BankAccount[];
  };
}

export interface GroundingLink {
  title: string;
  uri: string;
}
