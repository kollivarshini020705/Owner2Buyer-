import { Property, Visit, ChatMessage, initialProperties, initialMessages, initialVisits } from './mockData';

// Maintain in-memory lists as singletons across hot-reloads
let globalProperties = (global as any).globalProperties;
let globalMessages = (global as any).globalMessages;
let globalVisits = (global as any).globalVisits;
let globalUsers = (global as any).globalUsers;

if (!globalProperties) {
  globalProperties = (global as any).globalProperties = [...initialProperties];
}
if (!globalMessages) {
  globalMessages = (global as any).globalMessages = [...initialMessages];
}
if (!globalVisits) {
  globalVisits = (global as any).globalVisits = [...initialVisits];
}
if (!globalUsers) {
  globalUsers = (global as any).globalUsers = [
    {
      id: 'user_1',
      name: 'Anjali Sharma',
      email: 'anjali@owner2buyer.com',
      password: 'password123', // plain text for simple verification in mock mode
      role: 'seller',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
    },
    {
      id: 'user_2',
      name: 'Rahul Verma',
      email: 'rahul@owner2buyer.com',
      password: 'password123',
      role: 'buyer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
    }
  ];
}

export const memoryDb = {
  getProperties: () => globalProperties,
  addProperty: (prop: Property) => {
    globalProperties.push(prop);
    return prop;
  },
  getMessages: () => globalMessages,
  addMessage: (msg: ChatMessage) => {
    globalMessages.push(msg);
    return msg;
  },
  updateMessageText: (msgId: string, text: string) => {
    const msg = globalMessages.find((m: ChatMessage) => m.id === msgId);
    if (msg) {
      msg.text = text;
    }
    return msg;
  },
  getVisits: () => globalVisits,
  addVisit: (visit: Visit) => {
    globalVisits.push(visit);
    return visit;
  },
  updateVisitStatus: (visitId: string, status: 'Approved' | 'Declined') => {
    const visit = globalVisits.find((v: Visit) => v.id === visitId);
    if (visit) {
      visit.status = status;
    }
    return visit;
  },
  getUsers: () => globalUsers,
  addUser: (user: any) => {
    globalUsers.push(user);
    return user;
  }
};
