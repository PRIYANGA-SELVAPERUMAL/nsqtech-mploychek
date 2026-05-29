export interface User {
  userId: string;
  name: string;
  email: string;
  role: 'General User' | 'Admin';
  department: string;
  avatar: string;
  isActive: boolean;
  joinDate?: string;
  createdAt?: string;
}
