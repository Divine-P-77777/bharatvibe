import { Upload, Image, Video, Book, MapPin, Utensils } from 'lucide-react';
export const heroSlides = [
  {
    id: 1,
    image: "/cultures/bihu.jpeg", // Replace with actual image URL or public folder image
    title: "Dance of the Northeast",
    subtitle: "Celebrate Bihu’s rhythm & vibrant colors of Assam",
  },
  {
    id: 2,
    image: "/places/Golden_Temple.jpg",
    title: "Golden Harmony",
    subtitle: "Experience peace at Amritsar’s shimmering heart",
  },
  {
    id: 3,
    image: "/places/Kerala-Backwaters-2.jpg",
    title: "God’s Own Country",
    subtitle: "Sail through Kerala’s soul-soothing backwaters",
  },
  {
    id: 4,
    image: "/cultures/Holi-V.png",
    title: "Festival of Colors",
    subtitle: "Dive into the wild joy of Holi in Vrindavan",
  },
  {
    id: 5,
    image: "/places/Ladakh.jpg",
    title: "Mystic Himalayas",
    subtitle: "Breathe in the silence of Ladakh’s peaks",
  },
  {
    id: 6,
    image: "/cultures/Kathakali.jpg",
    title: "Theatrical Traditions",
    subtitle: "Witness the grandeur of Kathakali in Kerala",
  },
  {
    id: 7,
    image: "/places/RajasthanFort.jpg",
    title: "Desert Royalty",
    subtitle: "Explore ancient forts under desert skies",
  },
];

  

  export const states = [
    "Maharashtra",
    "Kerala",
    "Rajasthan",
    "Goa",
    "Tamil Nadu",
    "Karnataka",
    "Uttar Pradesh"
  ];
  
  export const dummyLocations = [
    {
      id: "1",
      title: "Buddha Park- Sikkim",
      image: "/places/BudhT.jpg",
      rating: 5,
      guideAvailable: true,
    },
    {
      id: "2",
      title: "Varanasi Ghat",
      image: "/places/Varanasi.png",
      rating: 4,
      guideAvailable: false,
    },
    {
      id: "3",
      title: "Seven Sister Waterfall",
      image: "/places/sevenswaterfall.webp",
      rating: 5,
      guideAvailable: true,
    },
    {
      id: "4",
      title: "Goa Beaches",
      image: "/places/GoaBeach.png",
      rating: 4,
      guideAvailable: true,
    },
    {
      id: "5",
      title: "Kamakhaya Temple - Assam",
      image: "/places/KYQT.png",
      rating: 4,
      guideAvailable: true,
    }
  ];
  



export const cuisines = ["North Indian", "South Indian", "Street Food", "Mughlai", "Coastal"];
export const regions = ["Punjab", "Rajasthan", "Kerala", "Bengal", "Northeast"];

// Example food data structure in constants/index.ts
export const dummyFoods = [
  {
    id: "1",
    title: "Hyderabadi Biryani",
    image: "https://i.pinimg.com/736x/f7/37/80/f7378044a24585b1394ae95247c4f442.jpg",
    rating: 4.8,
    spiceLevel: 4,
    cuisineType: "Mughlai"
  },
  {
    id: "2",
    title: "Masala Dosa",
    image: "https://i.pinimg.com/736x/e8/dc/7f/e8dc7f0b59b8602ba30621dee3c6291c.jpg",
    rating: 4.7,
    spiceLevel: 2,
    cuisineType: "South Indian"
  },
  {
    id: "3",
    title: "Butter Chicken",
    image: "https://i.pinimg.com/736x/17/5c/4f/175c4f2e830dff6daf97c6a4bcf616e7.jpg",
    rating: 4.9,
    spiceLevel: 3,
    cuisineType: "North Indian"
  },
  {
    id: "4",
    title: "Pani Puri",
    image: "https://i.pinimg.com/originals/15/60/2c/15602c657d9787397cba07ee27878b96.jpg",
    rating: 4.6,
    spiceLevel: 3,
    cuisineType: "Street Food"
  },
  {
    id: "5",
    title: "Idli",
    image: "https://i.pinimg.com/736x/be/d5/e6/bed5e60e5c8367e51316479b2f51af85.jpg",
    rating: 4.7,
    spiceLevel: 4,
    cuisineType: "Tamil  Nadu"
  }
];

// Example culture data structure
export const dummyCulture = [
  {
    id: "1",
    title: "Bharatanatyam",
    image: "/cultures/Bharatanatyam.png",
    rating: 4.8,
    traditionRegion: "Tamil Nadu",
    significance: "Classical dance form rooted in temple traditions"
  },
  {
    id: "2",
    title: "Bihu Dance",
    image: "https://i.pinimg.com/736x/0a/0b/6b/0a0b6bc1c921b7d3536df9380f4ee0e0.jpg",
    rating: 4.7,
    traditionRegion: "Assam",
    significance: "Folk dance celebrating harvest and Assamese New Year"
  },
  {
    id: "3",
    title: "Garba",
    image: "https://i.pinimg.com/736x/b8/61/01/b86101eca82888d715399e40bc721006.jpg",
    rating: 4.6,
    traditionRegion: "Gujarat",
    significance: "Folk dance performed during Navratri festival"
  },
  {
    id: "4",
    title: "Ghoomar",
    image: "https://i.pinimg.com/736x/61/61/5d/61615dcd7ae1155da054a75da73e2ede.jpg",
    rating: 4.7,
    traditionRegion: "Rajasthan",
    significance: "Traditional dance symbolizing grace and womanhood"
  },
  {
    id: "5",
    title: "Deepawali",
    image: "https://i.pinimg.com/736x/6b/d8/fb/6bd8fbd3e93b9e0766975de3a41d41a5.jpg",
    rating: 4.5,
    traditionRegion: "Ayodhya (Uttar Pradesh): ",
    significance: "New Guinness World Records - Over 3 lakh diyas lit"
  }
];



export const blogs = [
  {
    id: '1',
    image:'https://images.unsplash.com/photo-1585607344893-43a4bd91169a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Understanding Kerala Culture',
    content: 'Kerala culture is rich and unique, blending tradition with modernity...',
    slug: 'kerala-culture',
  },
  {
    id: '2',
    image:'https://images.unsplash.com/photo-1621788893417-fb8b2e03d1e7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Shri Natraj- God of Dance',
    content: 'Ancient isn’t just stones — it’s deep, emotional, and powerful...',
    slug: 'ancient-storytelling',
  },
  {
    id: '3',
    image:"https://images.unsplash.com/photo-1505932794465-147d1f1b2c97?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: 'Why Mehendi is use',
    content: 'Mehendi’s global influence has been rising due to its relatable themes...',
    slug: 'mehendi-global-love',
  },
  {
    id: '4',
    image:"https://images.unsplash.com/photo-1505932794465-147d1f1b2c97?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: 'Why Mehendi is use',
    content: 'Mehendi’s global influence has been rising due to its relatable themes...',
    slug: 'mehendi-global-love',
  },
];


export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Delhi',
  'Jammu and Kashmir', 'Ladakh', 'Puducherry'
];

export const categories = [
  { id: 'all', label: 'All' },
  { id: 'blog', label: 'Blog' },
  { id: 'culture', label: 'Culture' },
  { id: 'locations', label: 'Locations' },
  { id: 'tour_guide', label: 'Guides' },
  { id: 'foods', label: 'Food' }
];

// Post type definitions
export const POST_TYPES = [
  { id: 'culture', label: 'Culture', icon: Image },
  { id: 'locations', label: 'Locations', icon: MapPin },
  { id: 'foods', label: 'Foods', icon: Utensils },
  { id: 'tour_guide', label: 'Tour Guide', icon: Book },
  { id: 'blog', label: 'Blog', icon: Book },
];
