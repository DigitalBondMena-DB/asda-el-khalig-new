export interface IContactUs {
  success: string;
  contactForm: ContactForm;
}

export interface ContactForm {
  name: string;
  email: string;
  phone: string;
  message: string;
  updated_at: string;
  created_at: string;
  id: number;
}

export interface IContactData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export interface IGetAllContactUsMessages {
  contacts: IGetAllContactUsMessagesContact[];
}

export interface IGetAllContactUsMessagesContact {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
  updated_at: string;
}
