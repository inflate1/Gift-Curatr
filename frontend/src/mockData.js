// Mock data for GiftCuratr MVP
export const mockGiftRecommendations = [
  {
    id: 1,
    asin: "B08N5WRWNW",
    title: "Echo Dot (4th Gen) Smart Speaker with Alexa",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1543512214-318c7553f230?w=400&h=400&fit=crop",
    description: "Smart speaker with premium sound and voice control",
    category: "Electronics",
    rating: 4.5,
    reviewCount: 45620
  },
  {
    id: 2,
    asin: "B07FZ8S74R",
    title: "Hydroflask Water Bottle - 32oz",
    price: 44.95,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop",
    description: "Insulated stainless steel water bottle",
    category: "Sports & Outdoors",
    rating: 4.7,
    reviewCount: 12450
  },
  {
    id: 3,
    asin: "B0863TXGM3",
    title: "Wireless Bluetooth Headphones",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    description: "Noise-cancelling over-ear headphones",
    category: "Electronics",
    rating: 4.3,
    reviewCount: 8930
  },
  {
    id: 4,
    asin: "B09JQMJSXY",
    title: "Cozy Knit Throw Blanket",
    price: 56.99,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
    description: "Soft chunky knit blanket for home comfort",
    category: "Home & Garden",
    rating: 4.6,
    reviewCount: 2340
  },
  {
    id: 5,
    asin: "B08HLZXQCH",
    title: "Premium Coffee Bean Grinder",
    price: 95.00,
    image: "https://images.unsplash.com/photo-1504627298434-2119874ac3d4?w=400&h=400&fit=crop",
    description: "Burr grinder for perfect coffee every time",
    category: "Kitchen & Dining",
    rating: 4.4,
    reviewCount: 5670
  },
  {
    id: 6,
    asin: "B07XTQZJ6X",
    title: "Leather Crossbody Bag",
    price: 72.50,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
    description: "Genuine leather crossbody bag with adjustable strap",
    category: "Fashion",
    rating: 4.2,
    reviewCount: 3450
  },
  {
    id: 7,
    asin: "B09KMVNY7Z",
    title: "Aromatherapy Essential Oil Diffuser",
    price: 65.99,
    image: "https://images.unsplash.com/photo-1610725664285-7c57e6eeac3f?w=400&h=400&fit=crop",
    description: "Ultrasonic diffuser with 7-color LED lights",
    category: "Health & Beauty",
    rating: 4.5,
    reviewCount: 7890
  },
  {
    id: 8,
    asin: "B08GKQZXTY",
    title: "Gourmet Chocolate Gift Set",
    price: 84.99,
    image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&h=400&fit=crop",
    description: "Artisan dark chocolate collection in gift box",
    category: "Food & Beverages",
    rating: 4.8,
    reviewCount: 1230
  },
  {
    id: 9,
    asin: "B07HQMH7XR",
    title: "Succulent Plant Care Kit",
    price: 52.99,
    image: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&h=400&fit=crop",
    description: "Complete kit with tools and mini succulents",
    category: "Home & Garden",
    rating: 4.3,
    reviewCount: 4560
  },
  {
    id: 10,
    asin: "B09RTXM8PQ",
    title: "Yoga Mat with Alignment Lines",
    price: 68.00,
    image: "https://images.unsplash.com/photo-1506629905496-f1f5dfe2e3b8?w=400&h=400&fit=crop",
    description: "Premium eco-friendly yoga mat with carrying strap",
    category: "Sports & Outdoors",
    rating: 4.6,
    reviewCount: 6780
  }
];

export const chatQuestions = [
  {
    id: 1,
    question: "What's your relationship to the gift recipient?",
    options: [
      "Family member",
      "Close friend",
      "Colleague",
      "Romantic partner",
      "Acquaintance"
    ]
  },
  {
    id: 2,
    question: "What are their main hobbies or interests?",
    options: [
      "Technology & gadgets",
      "Fitness & wellness",
      "Home & cooking",
      "Arts & crafts",
      "Reading & learning",
      "Music & entertainment",
      "Travel & adventure",
      "Fashion & beauty"
    ]
  },
  {
    id: 3,
    question: "What's your budget range?",
    options: [
      "$25-50",
      "$50-100",
      "$100-200",
      "$200+"
    ]
  }
];

export const occasionTypes = [
  "Birthday",
  "Holiday",
  "Anniversary",
  "Graduation",
  "Thank you",
  "Just because"
];

// Helper function to generate timestamp 23 hours from now
export const generateExpiryTimestamp = () => {
  return Date.now() + (23 * 60 * 60 * 1000); // 23 hours in milliseconds
};

// Helper function to simulate price refresh with small delta
export const generateRefreshedPrice = (originalPrice) => {
  const variation = (Math.random() - 0.5) * 6; // ±$3 variation
  return Math.max(originalPrice + variation, originalPrice * 0.8); // Ensure price doesn't go below 80% of original
};

// Helper function to check if item is expired
export const isItemExpired = (timestamp) => {
  return Date.now() > timestamp;
};