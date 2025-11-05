// Interfaces para mapear la respuesta del API real

export interface ApiUser {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  document_type: string;
  document_number: string;
  birth_date: string;
  nationality: string;
  country_phone: string;
  area_code: string;
  phone_number: string;
  email: string;
  email_verified_at: string | null;
  profile_picture: string | null;
  description: string;
  created_at: string;
  updated_at: string;
  is_active?: boolean;
  locality_id: number;
  address: string;
  street: string;
  street_number: string;
  floor: string;
  apartment: string;
  user_type_id: number;
  reviews_count: number;
  reviews_avg_value: string;
  user_type: UserType;
  activities: Activity[];
  locality: Locality;
}

export interface UserType {
  id: number;
  name: string;
  description: string;
  disabled: number;
  created_at: string | null;
  updated_at: string | null;
}

export interface Activity {
  id: number;
  name: string;
  short_code: string;
  tags: string;
  code: string;
  disabled: number;
  created_at: string | null;
  updated_at: string | null;
  pivot: {
    user_id: number;
    activity_id: number;
  };
}

export interface Locality {
  id: number;
  name: string;
  short_code: string;
  state_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  state?: State; // Opcional porque no siempre viene en el API
}

export interface State {
  id: number;
  country_id: number;
  name: string;
  codigo3166_2: string;
  deleted_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface ApiProfessionalsResponse {
  data: ApiUser[];
  // Agregar otros campos de paginación si los hay
}

export interface ApiProfessionalDetailResponse {
  data: ApiUserDetail;
}

export interface ApiUserDetail extends ApiUser {
  questions: Question[];
  reviews: Review[];
}

export interface Question {
  id: number;
  question: string;
  answer?: string;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: number;
  name: string;
  email: string;
  value: number;
  comment?: string;
  answer?: string;
  published: number;
  user_id: number;
  created_at: string;
  updated_at: string;
}
