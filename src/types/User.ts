export interface Profile {
  id?: string;
  code?: string;
  name: string;
  thumbnail?: string;
  profileImage?: string;
  email: string;
  description?: string;
  group: string;
}

export default interface User extends Profile {
  provider: string;
  snsId: string;
}
