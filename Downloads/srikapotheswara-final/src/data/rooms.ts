export interface Room {
  id: string
  title: string
  client: string
  img: string
  tagline: string
  description: string[]
  features: string[]
  price: string
  priceNote: string
  sqm: string
  occupancy: string
  bed: string
}

export const rooms: Room[] = [
  {
    id: '01',
    title: '2 Sharing Room',
    client: 'Deluxe PG · LIG-608',
    img: '/images/room-2share.jpg',
    tagline: 'Spacious twin-sharing room with individual storage.',
    description: [
      'A well-appointed room for two residents, offering the perfect balance of privacy and companionship. Each resident gets their own bed, individual cupboard with lock, and dedicated study space.',
      'The room features good natural ventilation, proper lighting, and easy access to common washrooms. Located on a well-lit floor with easy access to all PG facilities.',
    ],
    features: [
      'Two single beds with quality mattresses',
      'Individual cupboard with lock for each resident',
      'Dedicated study table and chair per person',
      'Good natural lighting and ventilation',
      'Easy access to common washrooms',
      'Daily cleaning and housekeeping',
    ],
    price: '₹9,000',
    priceNote: 'per month, food extra',
    sqm: '180 sqft',
    occupancy: '2 residents',
    bed: '2 single beds',
  },
  {
    id: '02',
    title: '3 Sharing Room',
    client: 'Deluxe PG · LIG-608',
    img: '/images/room-3share.jpg',
    tagline: 'Comfortable triple-sharing with ample storage space.',
    description: [
      'A spacious room designed for three residents, offering generous personal space with individual storage. Perfect for working women and students who want an affordable yet comfortable stay.',
      'Each resident gets their own designated area with a comfortable bed, personal cupboard, and study space. The room layout ensures privacy while maintaining a friendly shared living atmosphere.',
    ],
    features: [
      'Three single beds with comfortable mattresses',
      'Individual cupboard with lock per resident',
      'Personal study table and chair each',
      'Spacious room with good airflow',
      'Nearby washroom access on each floor',
      'Regular cleaning and maintenance',
    ],
    price: '₹8,000',
    priceNote: 'per month, food extra',
    sqm: '220 sqft',
    occupancy: '3 residents',
    bed: '3 single beds',
  },
  {
    id: '03',
    title: '4 Sharing Room',
    client: 'Premium PG · Road No. 5',
    img: '/images/room-4share.jpg',
    tagline: 'Affordable quad-sharing for budget-conscious residents.',
    description: [
      'Our most popular choice among students and young professionals. This room accommodates four residents with well-organized personal spaces at an economical price point.',
      'Despite being a 4-sharing room, the layout ensures each resident has their own dedicated corner with comfortable sleeping arrangements and sufficient storage.',
    ],
    features: [
      'Four single beds with quality bedding',
      'Individual lockable cupboard per resident',
      'Shared study area with adequate seating',
      'Well-ventilated with natural light',
      'Common washrooms on every floor',
      'Daily cleaning service included',
    ],
    price: '₹7,000',
    priceNote: 'per month, food extra',
    sqm: '280 sqft',
    occupancy: '4 residents',
    bed: '4 single beds',
  },
  {
    id: '04',
    title: '5 Sharing Room',
    client: 'Premium PG · Road No. 5',
    img: '/images/room-5share.jpg',
    tagline: 'Our most budget-friendly option with full amenities.',
    description: [
      'The most economical accommodation option, designed for those who prioritize savings while enjoying all the PG amenities. Five residents share a well-planned room with organized personal spaces.',
      'Each resident has their own bed, cupboard, and designated study nook. The room is maintained with daily cleaning and offers the same facilities access as other room types.',
    ],
    features: [
      'Five single beds with comfortable bedding',
      'Individual cupboard with lock each',
      'Organized study space for all',
      'Well-ventilated common room style',
      'Washroom access on each floor',
      'Full access to all PG amenities',
    ],
    price: '₹6,000',
    priceNote: 'per month, food extra',
    sqm: '320 sqft',
    occupancy: '5 residents',
    bed: '5 single beds',
  },
  {
    id: '05',
    title: '3 Sharing Room',
    client: 'Executive PG · LIG-646',
    img: '/images/room-exec-3share.jpg',
    tagline: 'Executive-grade triple-sharing near JNTU.',
    description: [
      'Located in our Executive PG near JNTU Kukatpally, this room offers a premium living experience at a competitive price. Ideal for students and working women seeking quality accommodation.',
      'The Executive PG provides enhanced facilities including closer proximity to colleges and offices, with a quieter environment and additional common amenities.',
    ],
    features: [
      'Three single beds with premium mattresses',
      'Individual lockable storage cupboards',
      'Dedicated study space per resident',
      'Premium location near JNTU',
      '24/7 security with CCTV',
      'High-speed WiFi throughout',
    ],
    price: '₹8,000',
    priceNote: 'per month, food extra',
    sqm: '220 sqft',
    occupancy: '3 residents',
    bed: '3 single beds',
  },
  {
    id: '06',
    title: '2 Sharing Room',
    client: 'Executive PG · LIG-646',
    img: '/images/room-exec-2share.jpg',
    tagline: 'Premium twin-sharing with enhanced privacy.',
    description: [
      'The Executive PG offers a refined 2-sharing option with additional comfort and privacy. Each resident enjoys more personal space with premium furnishings and a quieter atmosphere.',
      'Located in a prime area of Kukatpally, this option is perfect for those who want a more private living arrangement with all the convenience of a well-managed PG.',
    ],
    features: [
      'Two single beds with premium bedding',
      'Large individual cupboards with locks',
      'Private study area with good lighting',
      'Premium residential location',
      'Enhanced security systems',
      'Closer to Metro and colleges',
    ],
    price: '₹9,500',
    priceNote: 'per month, food extra',
    sqm: '200 sqft',
    occupancy: '2 residents',
    bed: '2 single beds',
  },
]
