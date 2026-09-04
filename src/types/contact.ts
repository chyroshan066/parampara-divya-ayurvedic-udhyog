export interface ContactMessage {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  subject: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
}