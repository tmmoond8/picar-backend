export default interface User {
  id?: number;
  name: string;
  thumbnail?: string;
  coverImg?: string;
  email: string;
  provider: string;
  snsId: string;
  description?: string;
}
