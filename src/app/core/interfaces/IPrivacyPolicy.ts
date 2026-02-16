export interface IPrivacyPolicy {
  row: IPrivacyPolicyRow;
}

export interface IPrivacyPolicyRow {
  id: number;
  privacy_title: string;
  privacy_text: string;
  created_at: string;
  updated_at: string;
}

export interface IPrivacyPolicyUpdateBody {
  privacy_title: string;
  privacy_text: string;
}
export interface IPrivacyPolicyUpdateBodyResponse {
  success: string;
}
