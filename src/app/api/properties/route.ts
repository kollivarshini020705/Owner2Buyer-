import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Property from '@/models/Property';
import { memoryDb } from '@/lib/memoryDb';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const city = url.searchParams.get('city');
    const type = url.searchParams.get('type');
    const category = url.searchParams.get('category');
    const beds = url.searchParams.get('beds') || url.searchParams.get('bhk');
    const maxPrice = url.searchParams.get('maxPrice') || url.searchParams.get('budget');
    const search = url.searchParams.get('search') || url.searchParams.get('q');

    const conn = await dbConnect();
    if (conn) {
      const query: any = {};
      if (city) query['location.city'] = new RegExp(`^${city}$`, 'i');
      if (type) query.type = type;
      if (category && category !== 'All') query.category = category;
      if (beds && beds !== 'All') query.beds = parseInt(beds);
      if (maxPrice) query.price = { $lte: parseInt(maxPrice) };
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { 'location.address': { $regex: search, $options: 'i' } }
        ];
      }

      const list = await Property.find(query).sort({ createdAt: -1 });
      
      // Seed initial properties if database is completely empty
      if (list.length === 0 && !city && !type) {
        const seedData = memoryDb.getProperties();
        await Property.insertMany(seedData);
        const seededList = await Property.find({}).sort({ createdAt: -1 });
        return NextResponse.json(seededList);
      }
      
      return NextResponse.json(list);
    } else {
      // Memory fallback filtration
      let list = memoryDb.getProperties();

      if (city) {
        list = list.filter((p: any) => p.location.city.toLowerCase() === city.toLowerCase());
      }
      if (type) {
        list = list.filter((p: any) => p.type === type);
      }
      if (category && category !== 'All') {
        list = list.filter((p: any) => p.category === category);
      }
      if (beds && beds !== 'All') {
        list = list.filter((p: any) => p.beds === parseInt(beds));
      }
      if (maxPrice) {
        list = list.filter((p: any) => p.price <= parseInt(maxPrice));
      }
      if (search) {
        const q = search.toLowerCase();
        list = list.filter((p: any) => 
          p.title.toLowerCase().includes(q) || 
          p.description.toLowerCase().includes(q) || 
          p.location.address.toLowerCase().includes(q)
        );
      }

      return NextResponse.json(list);
    }
  } catch (err: any) {
    console.error('Get Properties API Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const { title, description, price, type, category, beds, baths, area, address, city, imageUrl, sellerId, sellerName, sellerPhone, amenities } = data;

    if (!title || !price || !type || !category || !area || !address || !city || !sellerId || !sellerName || !sellerPhone) {
      return NextResponse.json({ error: 'Please provide all required fields' }, { status: 400 });
    }

    const finalImage = imageUrl || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800';
    const coords = {
      x: Math.round(50 + Math.random() * 100),
      y: Math.round(50 + Math.random() * 100)
    };

    const conn = await dbConnect();
    if (conn) {
      const newProp = await Property.create({
        title,
        description,
        price: Number(price),
        type,
        category,
        beds: beds ? Number(beds) : 0,
        baths: baths ? Number(baths) : 0,
        area: Number(area),
        location: { city, address },
        images: [finalImage],
        sellerId,
        sellerName,
        sellerRating: 4.8,
        sellerPhone,
        amenities: amenities && amenities.length > 0 ? amenities : ['Direct Connect', 'Clear Title'],
        coords
      });

      return NextResponse.json(newProp);
    } else {
      // Memory mock fallback connection save
      const mockProp = memoryDb.addProperty({
        id: `prop_${Date.now()}`,
        title,
        description,
        price: Number(price),
        type,
        category,
        beds: beds ? Number(beds) : 0,
        baths: baths ? Number(baths) : 0,
        area: Number(area),
        location: { city, address },
        images: [finalImage],
        sellerId,
        sellerName,
        sellerRating: 4.8,
        sellerPhone,
        amenities: amenities && amenities.length > 0 ? amenities : ['Direct Connect', 'Clear Title'],
        coords
      });

      return NextResponse.json(mockProp);
    }
  } catch (err: any) {
    console.error('Post Property API Error:', err);
    return NextResponse.json({ error: err.message }, { status: 550 });
  }
}
