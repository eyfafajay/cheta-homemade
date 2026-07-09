import type { Category, ContactSettings, Notice, Product } from "./types";

export const defaultCategories: Category[] = [
  {
    id: "cat-kek",
    name: "Kek",
    slug: "kek",
    description: "Homemade cakes for family events, birthdays, gatherings, and sweet cravings."
  },
  {
    id: "cat-desserts",
    name: "Desserts",
    slug: "desserts",
    description: "Creamy, fruity, and bite-sized desserts made for sharing."
  },
  {
    id: "cat-roti",
    name: "Roti",
    slug: "roti",
    description: "Soft homemade breads and savoury buns for everyday treats."
  },
  {
    id: "cat-craft",
    name: "Craft",
    slug: "craft",
    description: "Handmade craft items that can be added and managed by admin later."
  }
];

export const defaultProducts: Product[] = [
  {
    id: "pgm",
    categorySlug: "kek",
    name: "PGM",
    description: "Soft homemade cake available in 7 inch and 10 inch sizes.",
    isAvailable: true,
    isFeatured: true,
    options: [
      { id: "pgm-7", label: "7 inch", price: 55 },
      { id: "pgm-10", label: "10 inch", price: 110 }
    ]
  },
  {
    id: "carrot-cake",
    categorySlug: "kek",
    name: "Carrot Cake",
    description: "Moist carrot cake with a homemade taste, suitable for small celebrations.",
    isAvailable: true,
    isFeatured: true,
    options: [{ id: "carrot-7", label: "7 inch", price: 60 }]
  },
  {
    id: "rv",
    categorySlug: "kek",
    name: "RV",
    description: "Rich red velvet style cake available in two sizes.",
    isAvailable: true,
    isFeatured: false,
    options: [
      { id: "rv-7", label: "7 inch", price: 55 },
      { id: "rv-10", label: "10 inch", price: 110 }
    ]
  },
  {
    id: "vsc",
    categorySlug: "kek",
    name: "VSC",
    description: "Homemade cake with smooth texture and a premium feel.",
    isAvailable: true,
    isFeatured: false,
    options: [{ id: "vsc-8", label: "8 inch", price: 70 }]
  },
  {
    id: "kek-gula-hangus",
    categorySlug: "kek",
    name: "Kek Gula Hangus",
    description: "Classic caramelised sugar cake with a soft homemade finish.",
    isAvailable: true,
    isFeatured: false,
    options: [{ id: "gula-hangus-8", label: "8 inch", price: 35 }]
  },
  {
    id: "kek-marble",
    categorySlug: "kek",
    name: "Kek Marble",
    description: "Classic marble cake with a soft and simple flavour.",
    isAvailable: true,
    isFeatured: false,
    options: [{ id: "marble-8", label: "8 inch", price: 40 }]
  },
  {
    id: "brownies",
    categorySlug: "kek",
    name: "Brownies",
    description: "Chocolate brownies suitable for sharing and gifting.",
    isAvailable: true,
    isFeatured: true,
    options: [{ id: "brownies-8", label: "8 inch", price: 38 }]
  },
  {
    id: "congo-bar",
    categorySlug: "kek",
    name: "Congo Bar",
    description: "Sweet bar-style baked treat with a chewy texture.",
    isAvailable: true,
    isFeatured: false,
    options: [{ id: "congo-8", label: "8 inch", price: 38 }]
  },
  {
    id: "jccc",
    categorySlug: "kek",
    name: "JCCC",
    description: "Premium cake option with optional topping upgrade.",
    isAvailable: true,
    isFeatured: false,
    options: [
      { id: "jccc-8", label: "8 inch", price: 65 },
      { id: "jccc-topping", label: "On top topping", price: 95, notes: "Price range RM95–RM100" }
    ]
  },
  {
    id: "burnt-cheesecake",
    categorySlug: "kek",
    name: "Burnt Cheesecake",
    description: "Creamy burnt cheesecake with a rich baked flavour.",
    isAvailable: true,
    isFeatured: true,
    options: [{ id: "burnt-8", label: "8 inch", price: 120 }]
  },
  {
    id: "choc-cake-ganache",
    categorySlug: "kek",
    name: "Chocolate Cake with Ganache",
    description: "Chocolate cake layered with ganache for a richer finish.",
    isAvailable: true,
    isFeatured: false,
    options: [
      { id: "choc-8", label: "8 inch", price: 75 },
      { id: "choc-10", label: "10 inch", price: 120 }
    ]
  },
  {
    id: "royal-butter-cake",
    categorySlug: "kek",
    name: "Royal Butter Cake",
    description: "Butter cake available in pandan, RV, vanilla, and orange flavours.",
    isAvailable: true,
    isFeatured: false,
    options: [{ id: "royal-8", label: "8 inch", price: 55, notes: "Flavours: pandan, RV, vanilla, orange" }]
  },
  {
    id: "butter-cheese-cake",
    categorySlug: "kek",
    name: "Butter Cheese Cake",
    description: "Butter cake with cheese flavour for a richer taste.",
    isAvailable: true,
    isFeatured: false,
    options: [{ id: "butter-cheese-8", label: "8 inch", price: 90 }]
  },
  {
    id: "premium-sourcream-butter-cake",
    categorySlug: "kek",
    name: "Premium Sour Cream Butter Cake",
    description: "Premium butter cake with flavours such as chocolate Callebaut, raspberry, pandan chocolate, and paddle pop.",
    isAvailable: true,
    isFeatured: false,
    options: [{ id: "premium-8-9", label: "8–9 inch", price: 80, notes: "Flavours: chocolate Callebaut, raspberry, pandan chocolate, paddle pop" }]
  },
  {
    id: "muffin",
    categorySlug: "kek",
    name: "Muffin",
    description: "Homemade muffins packed for sharing.",
    isAvailable: true,
    isFeatured: false,
    options: [{ id: "muffin-16", label: "16 pcs", price: 40 }]
  },
  {
    id: "creampuff",
    categorySlug: "desserts",
    name: "Creampuff",
    description: "Soft cream puffs available in 12 pcs or 25 pcs packs.",
    isAvailable: true,
    isFeatured: true,
    options: [
      { id: "creampuff-25", label: "25 pcs", price: 36 },
      { id: "creampuff-12", label: "12 pcs", price: 18 }
    ]
  },
  {
    id: "cheese-tart",
    categorySlug: "desserts",
    name: "Cheese Tart",
    description: "Cheese tart with blueberry, strawberry, chocolate, or mixed flavours.",
    isAvailable: true,
    isFeatured: true,
    options: [
      { id: "cheese-blueberry", label: "Blueberry filling, 25 pcs", price: 36 },
      { id: "cheese-strawberry", label: "Strawberry filling, 25 pcs", price: 36 },
      { id: "cheese-chocolate", label: "Chocolate filling, 25 pcs", price: 45 },
      { id: "cheese-mix", label: "Mix 3 flavours, 25 pcs", price: 43 }
    ]
  },
  {
    id: "fruit-tart",
    categorySlug: "desserts",
    name: "Fruit Tart",
    description: "Colourful fruit tarts in bite-sized servings.",
    isAvailable: true,
    isFeatured: false,
    options: [{ id: "fruit-25", label: "25 pcs", price: 40 }]
  },
  {
    id: "pavlova",
    categorySlug: "desserts",
    name: "Pavlova",
    description: "Sweet pavlova available in standard size or mini bites.",
    isAvailable: true,
    isFeatured: false,
    options: [
      { id: "pavlova-standard", label: "Standard size, 16 pcs", price: 65 },
      { id: "pavlova-mini", label: "Mini bites, 25 pcs", price: 60 }
    ]
  },
  {
    id: "peach-strudel",
    categorySlug: "desserts",
    name: "Peach Strudel",
    description: "Layered peach strudel in a sharing pack.",
    isAvailable: true,
    isFeatured: false,
    options: [{ id: "peach-16", label: "16 pcs", price: 38 }]
  },
  {
    id: "roti-golok",
    categorySlug: "roti",
    name: "Roti Golok",
    description: "Homemade roti sold in packs or individual pieces.",
    isAvailable: true,
    isFeatured: true,
    options: [
      { id: "golok-6", label: "6 pcs", price: 11 },
      { id: "golok-pc", label: "Individual", price: 2, notes: "RM2 / pc" }
    ]
  },
  {
    id: "roti-kacang",
    categorySlug: "roti",
    name: "Roti Kacang",
    description: "Soft roti with kacang merah filling.",
    isAvailable: true,
    isFeatured: false,
    options: [
      { id: "kacang-6", label: "6 pcs", price: 11 },
      { id: "kacang-pc", label: "Individual", price: 1.9, notes: "RM1.90 / pc" }
    ]
  },
  {
    id: "roti-garlic",
    categorySlug: "roti",
    name: "Roti Garlic",
    description: "Savoury garlic roti for snacks or light meals.",
    isAvailable: true,
    isFeatured: false,
    options: [
      { id: "garlic-6", label: "6 pcs", price: 11 },
      { id: "garlic-pc", label: "Individual", price: 1.9, notes: "RM1.90 / pc" }
    ]
  },
  {
    id: "mini-pizza",
    categorySlug: "roti",
    name: "Mini Pizza",
    description: "Mini pizza roti, suitable for tea time or small gatherings.",
    isAvailable: true,
    isFeatured: false,
    options: [
      { id: "pizza-6", label: "6 pcs", price: 11 },
      { id: "pizza-pc", label: "Individual", price: 1.9, notes: "RM1.90 / pc" }
    ]
  },
  {
    id: "rsl",
    categorySlug: "roti",
    name: "RSL",
    description: "RSL pack available for order.",
    isAvailable: true,
    isFeatured: false,
    options: [{ id: "rsl-pack", label: "1 pack", price: 13 }]
  },
  {
    id: "handmade-craft",
    categorySlug: "craft",
    name: "Handmade Craft",
    description: "Craft items can be added here by admin later with real images and prices.",
    isAvailable: false,
    isFeatured: false,
    options: [{ id: "craft-custom", label: "Custom item", price: 0, notes: "Price will be updated later" }]
  }
];

export const defaultNotices: Notice[] = [
  {
    id: "notice-default",
    title: "Welcome to Cheta Homemade",
    message: "Pre-orders are welcome. Please contact us on WhatsApp to check availability before placing an order.",
    isActive: true
  }
];

export const defaultContactSettings: ContactSettings = {
  whatsappNumber: "60XXXXXXXXX",
  phoneNumber: "60XXXXXXXXX",
  instagramUrl: "",
  facebookUrl: "",
  pickupArea: "Pickup area will be updated soon.",
  businessHours: "Pre-order basis. Please contact us for availability.",
  orderInstructions: "Click the WhatsApp button and send us the product name you are interested in."
};
