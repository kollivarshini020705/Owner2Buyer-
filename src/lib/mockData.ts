export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  type: 'sale' | 'rent';
  category: 'Apartment' | 'Villa' | 'Duplex' | 'Land' | 'Shop';
  beds: number;
  baths: number;
  area: number;
  location: { city: string; address: string };
  images: string[];
  sellerId: string;
  sellerName: string;
  sellerRating: number;
  sellerPhone: string;
  amenities: string[];
  coords: { x: number; y: number };
}

export interface Visit {
  id: string;
  propertyId: string;
  buyerId: string;
  buyerName: string;
  date: string;
  status: 'Pending Approval' | 'Approved' | 'Declined';
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
}

export const initialProperties: Property[] = [
  {
    id: 'prop_1',
    title: 'Luxury 3BHK Villa in Gachibowli',
    description: 'Beautiful, broker-free independent villa in Gachibowli. Offers 3 spacious bedrooms, modular kitchen, and private garden area. Located in a premium gated community with 24/7 security. Zero broker charges.',
    price: 24500000,
    type: 'sale',
    category: 'Villa',
    beds: 3,
    baths: 4,
    area: 3200,
    location: { city: 'Hyderabad', address: 'Villas Phase 1, Near DLF Cybercity, Gachibowli' },
    images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800'],
    sellerId: 'user_1',
    sellerName: 'Anjali Sharma',
    sellerRating: 4.8,
    sellerPhone: '9876543210',
    amenities: ['Private Garden', 'Gated Community', 'Swimming Pool', 'Gym'],
    coords: { x: 75, y: 85 }
  },
  {
    id: 'prop_2',
    title: 'Modern 2BHK Apartment in Hitech City',
    description: 'Fully furnished, high-floor flat in Silicon Heights, walking distance to IT hubs. Modular kitchen, spacious balcony, direct owner verification.',
    price: 45000,
    type: 'rent',
    category: 'Apartment',
    beds: 2,
    baths: 2,
    area: 1250,
    location: { city: 'Hyderabad', address: 'Block C, Silicon Heights, Hitech City' },
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
    sellerId: 'user_1',
    sellerName: 'Anjali Sharma',
    sellerRating: 4.8,
    sellerPhone: '9876543210',
    amenities: ['Fully Furnished', 'Gym', 'High Speed Elevators'],
    coords: { x: 125, y: 65 }
  },
  {
    id: 'prop_3',
    title: 'Ultra Luxury 4BHK Duplex in Jubilee Hills',
    description: 'Jubilee Hills double-height duplex apartment, marble flooring, private elevator, VRV air conditioning. Scenic views of KBR National Park.',
    price: 78000000,
    type: 'sale',
    category: 'Duplex',
    beds: 4,
    baths: 5,
    area: 4800,
    location: { city: 'Hyderabad', address: 'Jubilee Enclave, Road No 36, Jubilee Hills' },
    images: ['https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800'],
    sellerId: 'user_3',
    sellerName: 'Vikram Reddy',
    sellerRating: 4.5,
    sellerPhone: '7654321098',
    amenities: ['Home Theatre', 'KBR Park View', 'Private Elevator'],
    coords: { x: 155, y: 130 }
  },
  {
    id: 'prop_4',
    title: 'Cozy 1BHK Flat in Indiranagar',
    description: 'Quiet, premium apartment in the heart of Indiranagar. Easy access to cafes and metro stations. Perfect for working professionals.',
    price: 28000,
    type: 'rent',
    category: 'Apartment',
    beds: 1,
    baths: 1,
    area: 750,
    location: { city: 'Bangalore', address: '12th Main Road, HAL 2nd Stage, Indiranagar' },
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
    sellerId: 'user_4',
    sellerName: 'Karthik Rao',
    sellerRating: 4.7,
    sellerPhone: '8765432109',
    amenities: ['Power Backup', 'Security', 'Internet Line'],
    coords: { x: 50, y: 60 }
  },
  {
    id: 'prop_5',
    title: 'Sleek 3BHK Penthouse in Whitefield',
    description: 'Spacious duplex penthouse overlooking ITPL campus. Huge terrace garden, premium wooden flooring, fully air-conditioned, direct listing.',
    price: 38000000,
    type: 'sale',
    category: 'Duplex',
    beds: 3,
    baths: 3,
    area: 2900,
    location: { city: 'Bangalore', address: 'ITPL Main Road, Hope Farm Junction, Whitefield' },
    images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'],
    sellerId: 'user_4',
    sellerName: 'Karthik Rao',
    sellerRating: 4.7,
    sellerPhone: '8765432109',
    amenities: ['Terrace Garden', 'Clubhouse Access', '2 Car Parks'],
    coords: { x: 135, y: 110 }
  }
];

export const initialMessages: ChatMessage[] = [
  {
    id: 'msg_1',
    senderId: 'user_2',
    receiverId: 'user_1',
    text: 'Hi Anjali, is this modern 2BHK flat in Hitech City still available? I would like to negotiate the rent agreement terms.',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'msg_2',
    senderId: 'user_1',
    receiverId: 'user_2',
    text: 'Hello Rahul! Yes, the apartment is available. I can lease it out broker-free. We can draft the agreement terms directly inside this thread.',
    timestamp: new Date(Date.now() - 3600000 * 1.8).toISOString()
  }
];

export const initialVisits: Visit[] = [
  {
    id: 'visit_1',
    propertyId: 'prop_1',
    buyerId: 'user_2',
    buyerName: 'Rahul Verma',
    date: 'June 15, 2026 at 11:00 AM',
    status: 'Pending Approval'
  }
];
