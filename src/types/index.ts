export type Gender = "male" | "female";

/** Data yang dipakai FORM (frontend) */
export interface RegisterFormData {
  name: string;
  email: string;
  username?: string;              // optional (boleh auto dari email)
  phone: string;                  // <- dari input "Nomor Telepon"
  date_of_birth: string;          // yyyy-mm-dd
  gender: Gender;                 // "male" | "female"
  address: string;
  password: string;
  password_confirmation: string;
}

/** Payload yang diminta BACKEND (Laravel) */
export interface ApiRegisterRequest {
  nama: string;
  email: string;
  username: string;
  nomor_telepon: string;
  tanggal_lahir: string;
  jenis_kelamin: Gender;
  alamat: string;
  password: string;
  password_confirmation: string;
}

export interface User {
  id: string;
  nama: string;
  email: string;
  username: string;
  nomor_telepon?: string;
  tanggal_lahir?: string;
  jenis_kelamin?: Gender;
  alamat?: string;
  role: "user" | "admin" | "nakes" | "manajemen";
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  token: string;  // access token dari backend
  user: User;
}
