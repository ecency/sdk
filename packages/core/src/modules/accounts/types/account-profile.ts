export interface AccountProfile {
  about?: string;
  cover_image?: string;
  location?: string;
  name?: string;
  profile_image?: string;
  website?: string;
  pinned?: string;

  // Community's default beneficiary settings
  beneficiary?: {
    account: string;
    weight: number;
  };
}
