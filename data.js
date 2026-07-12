/**
 * data.js
 * -----------------------------------------------------------------------
 * Sample product catalog. This is the ONLY file to replace when the real
 * data source (Google Sheets via Apps Script, or a future backend API)
 * is connected — ProductManager.init() already supports swapping the
 * loader without touching any rendering code (see products.js).
 * -----------------------------------------------------------------------
 */

const SOCOMART_PRODUCTS = [
  {
    id: "P1001", name: "AeroFit Running Shoes", brand: "Vionix", category: "Footwear",
    price: 3499, offerPrice: 2599, rating: 4.5, reviewsCount: 128, stock: 24,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80",
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&q=80"
    ],
    description: "Lightweight everyday trainers with breathable knit uppers and responsive cushioning, built for long runs and longer days.",
    features: ["Breathable knit upper", "Shock-absorbing sole", "Reflective trims", "Machine washable"],
    specs: { Material: "Knit mesh", Weight: "240g", Closure: "Lace-up", Origin: "India" },
    tags: ["trending", "featured"]
  },
  {
    id: "P1002", name: "Nimbus Wireless Earbuds", brand: "Sonar", category: "Electronics",
    price: 4999, offerPrice: 3299, rating: 4.3, reviewsCount: 342, stock: 60,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80",
      "https://images.unsplash.com/photo-1590658006821-14ca1054ff41?w=800&q=80"
    ],
    description: "Active noise-cancelling earbuds with 30-hour battery life and crystal-clear calls, in a pocket-sized charging case.",
    features: ["Active noise cancellation", "30hr total battery", "IPX5 water resistant", "Touch controls"],
    specs: { Connectivity: "Bluetooth 5.3", Battery: "30 hours", Weight: "4.5g / bud", Warranty: "1 year" },
    tags: ["trending", "offer"]
  },
  {
    id: "P1003", name: "Terra Canvas Backpack", brand: "Woodline", category: "Bags",
    price: 2299, offerPrice: 1799, rating: 4.7, reviewsCount: 89, stock: 40,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&q=80"
    ],
    description: "Durable waxed-canvas backpack with a padded 15-inch laptop sleeve, built for daily commutes and weekend trips alike.",
    features: ["15-inch laptop sleeve", "Water-resistant canvas", "Leather trims", "Hidden security pocket"],
    specs: { Capacity: "22L", Material: "Waxed canvas", Weight: "780g", Origin: "India" },
    tags: ["featured"]
  },
  {
    id: "P1004", name: "Lumen Smart Desk Lamp", brand: "Cirro", category: "Home",
    price: 1899, offerPrice: 1299, rating: 4.2, reviewsCount: 210, stock: 75,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80",
      "https://images.unsplash.com/photo-1517991104123-1d56a6e81ed9?w=800&q=80"
    ],
    description: "Touch-controlled LED lamp with 5 brightness levels and adjustable colour temperature, perfect for a focused workspace.",
    features: ["5 brightness levels", "Touch dimmer", "USB-C powered", "Foldable arm"],
    specs: { Power: "8W LED", Input: "USB-C", Modes: "3 color temps", Warranty: "18 months" },
    tags: ["offer"]
  },
  {
    id: "P1005", name: "Solstice Cotton Hoodie", brand: "Marrow", category: "Fashion",
    price: 1999, offerPrice: 1499, rating: 4.4, reviewsCount: 156, stock: 100,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80",
      "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=800&q=80"
    ],
    description: "Heavyweight brushed-cotton hoodie with a relaxed fit, ribbed cuffs, and a kangaroo pocket for cold mornings.",
    features: ["320 GSM cotton fleece", "Ribbed cuffs & hem", "Kangaroo pocket", "Pre-shrunk"],
    specs: { Material: "100% cotton", Fit: "Relaxed", Care: "Machine wash cold", Origin: "India" },
    tags: ["trending", "featured"]
  },
  {
    id: "P1006", name: "Basin Ceramic Planter Set", brand: "Loam", category: "Home",
    price: 1299, offerPrice: 949, rating: 4.6, reviewsCount: 64, stock: 30,
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&q=80",
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80"
    ],
    description: "Set of 3 matte ceramic planters with drainage holes and bamboo trays, sized for succulents and small herbs.",
    features: ["Set of 3 sizes", "Drainage hole + tray", "Matte glaze finish", "Indoor/outdoor safe"],
    specs: { Material: "Ceramic", Set: "3 pieces", Sizes: "S / M / L", Origin: "India" },
    tags: ["offer"]
  },
  {
    id: "P1007", name: "Pulse Fitness Band", brand: "Vionix", category: "Electronics",
    price: 2799, offerPrice: 1999, rating: 4.1, reviewsCount: 421, stock: 88,
    image: "https://images.unsplash.com/photo-1575311373937-8c8a5b9d9c6a?w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1575311373937-8c8a5b9d9c6a?w=800&q=80",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80"
    ],
    description: "24/7 heart-rate and sleep tracking fitness band with a 12-day battery life and 20+ workout modes.",
    features: ["24/7 heart-rate tracking", "12-day battery", "20+ workout modes", "5ATM water resistance"],
    specs: { Display: "AMOLED", Battery: "12 days", WaterRating: "5ATM", Compatibility: "Android / iOS" },
    tags: ["trending"]
  },
  {
    id: "P1008", name: "Hearth Cast-Iron Skillet", brand: "Woodline", category: "Kitchen",
    price: 1599, offerPrice: 1199, rating: 4.8, reviewsCount: 97, stock: 50,
    image: "https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?w=800&q=80",
      "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=800&q=80"
    ],
    description: "Pre-seasoned 10-inch cast-iron skillet that goes from stovetop to oven, built to last generations.",
    features: ["Pre-seasoned surface", "Oven-safe to 260°C", "Dual pour spouts", "10-inch diameter"],
    specs: { Material: "Cast iron", Diameter: "10 in", Weight: "2.1 kg", Care: "Hand wash only" },
    tags: ["featured"]
  },
  {
    id: "P1009", name: "Voyage Leather Wallet", brand: "Marrow", category: "Fashion",
    price: 1499, offerPrice: 1099, rating: 4.5, reviewsCount: 73, stock: 65,
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80",
      "https://images.unsplash.com/photo-1548863227-3af567fc3b27?w=800&q=80"
    ],
    description: "Full-grain leather bifold wallet with 6 card slots and an RFID-blocking lining that ages beautifully.",
    features: ["Full-grain leather", "RFID blocking", "6 card slots", "Slim bifold profile"],
    specs: { Material: "Full-grain leather", Slots: "6 cards + cash", Origin: "India", Warranty: "1 year" },
    tags: ["offer"]
  },
  {
    id: "P1010", name: "Halo Bluetooth Speaker", brand: "Sonar", category: "Electronics",
    price: 3299, offerPrice: 2399, rating: 4.4, reviewsCount: 188, stock: 42,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80",
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80"
    ],
    description: "360° sound Bluetooth speaker with deep bass, a 16-hour battery, and IP67 dust & water resistance.",
    features: ["360° sound", "16-hour battery", "IP67 rated", "Pair 2 for stereo"],
    specs: { Output: "20W", Battery: "16 hours", WaterRating: "IP67", Connectivity: "Bluetooth 5.2" },
    tags: ["trending", "offer"]
  },
  {
    id: "P1011", name: "Fernweh Travel Duffel", brand: "Woodline", category: "Bags",
    price: 2599, offerPrice: 1999, rating: 4.3, reviewsCount: 54, stock: 35,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80&sat=-40",
    gallery: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80&sat=-40"
    ],
    description: "Weekend-ready duffel with a separate shoe compartment and a luggage strap pass-through for easy travel.",
    features: ["Shoe compartment", "Luggage strap pass-through", "Water-resistant base", "Adjustable strap"],
    specs: { Capacity: "40L", Material: "Ripstop nylon", Weight: "650g", Origin: "India" },
    tags: []
  },
  {
    id: "P1012", name: "Ember Ceramic Mug Set", brand: "Loam", category: "Kitchen",
    price: 899, offerPrice: 649, rating: 4.6, reviewsCount: 112, stock: 90,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80"
    ],
    description: "Set of 2 hand-glazed stoneware mugs with a comfortable grip, microwave and dishwasher safe.",
    features: ["Set of 2", "Hand-glazed stoneware", "Microwave safe", "350ml capacity each"],
    specs: { Material: "Stoneware", Capacity: "350ml", Set: "2 mugs", Care: "Dishwasher safe" },
    tags: ["offer"]
  }
];
