import type { Product, ProductColor } from "@/types/product";

type Kind = "top" | "bottom" | "shoe" | "accessory" | "beauty";

const CLOTHING_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const BOTTOM_SIZES = ["28", "30", "32", "34", "36", "38"];
const SHOE_SIZES = ["6", "7", "8", "9", "10", "11"];
const ONE_SIZE = ["One Size"];

const COLOR_LIBRARY: Record<string, ProductColor> = {
  black: { name: "Black", hex: "#111111" },
  white: { name: "White", hex: "#FFFFFF" },
  navy: { name: "Navy", hex: "#1F2A44" },
  beige: { name: "Beige", hex: "#D8C3A5" },
  olive: { name: "Olive", hex: "#556B2F" },
  grey: { name: "Grey", hex: "#8B8B8B" },
  maroon: { name: "Maroon", hex: "#6B1F2A" },
  denim: { name: "Denim Blue", hex: "#3B5998" },
  tan: { name: "Tan", hex: "#C19A6B" },
  rust: { name: "Rust", hex: "#B7410E" },
  roseGold: { name: "Rose Gold", hex: "#B76E79" },
  silver: { name: "Silver", hex: "#C0C0C0" },
  gold: { name: "Gold", hex: "#D4AF37" },
  blush: { name: "Blush Pink", hex: "#F4C2C2" },
  mustard: { name: "Mustard", hex: "#E1AD01" },
  emerald: { name: "Emerald", hex: "#0B6E4F" },
  wine: { name: "Wine", hex: "#722F37" },
};

function colors(...keys: (keyof typeof COLOR_LIBRARY)[]): ProductColor[] {
  return keys.map((k) => COLOR_LIBRARY[k]);
}

function sizesFor(kind: Kind): string[] {
  switch (kind) {
    case "top":
      return CLOTHING_SIZES;
    case "bottom":
      return BOTTOM_SIZES;
    case "shoe":
      return SHOE_SIZES;
    default:
      return ONE_SIZE;
  }
}

interface Spec {
  id: string;
  name: string;
  brand: string;
  department: Product["department"];
  category: string;
  subcategory?: string;
  kind: Kind;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  colorKeys: (keyof typeof COLOR_LIBRARY)[];
  isNew?: boolean;
  isBestSeller?: boolean;
  description: string;
  details?: string[];
  tags: string[];
}

function discountOf(price: number, originalPrice?: number): number | undefined {
  if (!originalPrice || originalPrice <= price) return undefined;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const specs: Spec[] = [
  // ----- MEN: T-Shirts -----
  {
    id: "men-tshirt-01",
    name: "Oversized Fit Printed Mesh T-Shirt",
    brand: "NOVA Men",
    department: "men",
    category: "t-shirts",
    kind: "top",
    price: 1299,
    originalPrice: 1999,
    rating: 4.5,
    reviewCount: 236,
    colorKeys: ["navy", "black", "white"],
    isNew: true,
    description:
      "Elevate your casual wardrobe with our oversized fit printed T-shirt. Crafted from premium cotton mesh for maximum comfort with a relaxed-fit silhouette.",
    tags: ["tshirt", "casual", "oversized", "printed"],
  },
  {
    id: "men-tshirt-02",
    name: "Classic Crew Neck Tee",
    brand: "Urban Threads",
    department: "men",
    category: "t-shirts",
    kind: "top",
    price: 799,
    originalPrice: 999,
    rating: 4.3,
    reviewCount: 154,
    colorKeys: ["white", "black", "grey"],
    isBestSeller: true,
    description:
      "A wardrobe essential. Soft combed-cotton crew neck tee with a clean regular fit that pairs with everything.",
    tags: ["tshirt", "essential", "basics"],
  },
  // ----- MEN: Shirts -----
  {
    id: "men-shirt-01",
    name: "Slim Fit Oxford Shirt",
    brand: "Urban Threads",
    department: "men",
    category: "shirts",
    kind: "top",
    price: 1799,
    originalPrice: 2499,
    rating: 4.6,
    reviewCount: 98,
    colorKeys: ["white", "beige", "navy"],
    description:
      "A tailored oxford shirt woven from breathable cotton, finished with a structured collar for smart-casual occasions.",
    tags: ["shirt", "oxford", "formal-casual"],
  },
  {
    id: "men-shirt-02",
    name: "Linen Blend Casual Shirt",
    brand: "NOVA Men",
    department: "men",
    category: "shirts",
    kind: "top",
    price: 1599,
    rating: 4.2,
    reviewCount: 61,
    colorKeys: ["olive", "tan", "white"],
    isNew: true,
    description:
      "Lightweight linen-cotton blend shirt designed for warm-weather comfort with a relaxed, breathable drape.",
    tags: ["shirt", "linen", "summer"],
  },
  // ----- MEN: Jackets -----
  {
    id: "men-jacket-01",
    name: "Bomber Jacket",
    brand: "Chrono",
    department: "men",
    category: "jackets",
    kind: "top",
    price: 2999,
    originalPrice: 3999,
    rating: 4.4,
    reviewCount: 87,
    colorKeys: ["black", "olive"],
    isBestSeller: true,
    description:
      "A street-ready bomber jacket with ribbed cuffs and hem, water-resistant shell and quilted lining for cool-weather layering.",
    tags: ["jacket", "bomber", "outerwear"],
  },
  {
    id: "men-jacket-02",
    name: "Denim Trucker Jacket",
    brand: "Denim Co.",
    department: "men",
    category: "jackets",
    kind: "top",
    price: 2499,
    originalPrice: 3199,
    rating: 4.3,
    reviewCount: 72,
    colorKeys: ["denim", "black"],
    description:
      "A timeless trucker jacket in rigid denim with a classic button-front and chest pockets.",
    tags: ["jacket", "denim", "outerwear"],
  },
  // ----- MEN: Jeans -----
  {
    id: "men-jeans-01",
    name: "Slim Tapered Jeans",
    brand: "Denim Co.",
    department: "men",
    category: "jeans",
    kind: "bottom",
    price: 1999,
    originalPrice: 2799,
    rating: 4.5,
    reviewCount: 143,
    colorKeys: ["denim", "black"],
    isBestSeller: true,
    description:
      "Stretch-infused slim tapered jeans that hold their shape all day while keeping you comfortable.",
    tags: ["jeans", "slim", "denim"],
  },
  {
    id: "men-jeans-02",
    name: "Straight Fit Jeans",
    brand: "NOVA Men",
    department: "men",
    category: "jeans",
    kind: "bottom",
    price: 1799,
    rating: 4.1,
    reviewCount: 54,
    colorKeys: ["denim", "grey"],
    description:
      "A relaxed straight-fit jean cut from durable cotton denim for everyday wear.",
    tags: ["jeans", "straight", "denim"],
  },
  // ----- MEN: Trousers -----
  {
    id: "men-trouser-01",
    name: "Chino Trousers",
    brand: "Urban Threads",
    department: "men",
    category: "trousers",
    kind: "bottom",
    price: 1499,
    originalPrice: 1999,
    rating: 4.4,
    reviewCount: 76,
    colorKeys: ["beige", "olive", "navy"],
    description:
      "Classic cotton-twill chinos with a tapered leg — smart enough for the office, relaxed enough for weekends.",
    tags: ["trousers", "chino", "casual"],
  },
  {
    id: "men-trouser-02",
    name: "Relaxed Fit Trousers",
    brand: "NOVA Men",
    department: "men",
    category: "trousers",
    kind: "bottom",
    price: 1399,
    rating: 4.0,
    reviewCount: 39,
    colorKeys: ["grey", "black"],
    isNew: true,
    description:
      "Roomy relaxed-fit trousers in soft brushed cotton, built for all-day comfort.",
    tags: ["trousers", "relaxed", "casual"],
  },
  // ----- MEN: Formal Pants -----
  {
    id: "men-formal-pants-01",
    name: "Formal Slim Pants",
    brand: "Urban Threads",
    department: "men",
    category: "formal-pants",
    kind: "bottom",
    price: 1899,
    originalPrice: 2399,
    rating: 4.5,
    reviewCount: 65,
    colorKeys: ["black", "navy", "grey"],
    description:
      "Sharp slim-fit formal pants tailored from a fine wool-blend with a crisp, wrinkle-resistant finish.",
    tags: ["formal", "pants", "office"],
  },
  {
    id: "men-formal-pants-02",
    name: "Pleated Formal Trousers",
    brand: "Chrono",
    department: "men",
    category: "formal-pants",
    kind: "bottom",
    price: 2099,
    rating: 4.2,
    reviewCount: 28,
    colorKeys: ["navy", "black"],
    description:
      "Pleated-front formal trousers with a tailored break, designed for a polished silhouette.",
    tags: ["formal", "pants", "pleated"],
  },
  // ----- MEN: Casual Shoes -----
  {
    id: "men-casual-shoes-01",
    name: "Canvas Low-Top Sneakers",
    brand: "StrideFit",
    department: "men",
    category: "casual-shoes",
    kind: "shoe",
    price: 1699,
    originalPrice: 2199,
    rating: 4.3,
    reviewCount: 112,
    colorKeys: ["white", "black"],
    isBestSeller: true,
    description:
      "Everyday canvas sneakers with a cushioned footbed and rubber outsole for all-day comfort.",
    tags: ["shoes", "sneakers", "casual"],
  },
  {
    id: "men-casual-shoes-02",
    name: "Suede Slip-On Loafers",
    brand: "StrideFit",
    department: "men",
    category: "casual-shoes",
    kind: "shoe",
    price: 2299,
    rating: 4.1,
    reviewCount: 47,
    colorKeys: ["tan", "black"],
    description:
      "Soft suede slip-on loafers with a lightweight sole — smart-casual comfort in one step.",
    tags: ["shoes", "loafers", "casual"],
  },
  // ----- MEN: Formal Shoes -----
  {
    id: "men-formal-shoes-01",
    name: "Leather Oxford Shoes",
    brand: "Chrono",
    department: "men",
    category: "formal-shoes",
    kind: "shoe",
    price: 3499,
    originalPrice: 4499,
    rating: 4.6,
    reviewCount: 58,
    colorKeys: ["black", "tan"],
    description:
      "Handcrafted genuine-leather Oxford shoes with a classic cap-toe design for formal occasions.",
    tags: ["shoes", "oxford", "formal"],
  },
  {
    id: "men-formal-shoes-02",
    name: "Derby Formal Shoes",
    brand: "Chrono",
    department: "men",
    category: "formal-shoes",
    kind: "shoe",
    price: 2999,
    rating: 4.3,
    reviewCount: 33,
    colorKeys: ["black", "maroon"],
    description:
      "Classic derby shoes in polished leather with a comfortable cushioned insole.",
    tags: ["shoes", "derby", "formal"],
  },
  // ----- MEN: Sports Shoes -----
  {
    id: "men-sports-shoes-01",
    name: "Air Cushion Running Shoes",
    brand: "StrideFit",
    department: "men",
    category: "sports-shoes",
    kind: "shoe",
    price: 3299,
    originalPrice: 4199,
    rating: 4.5,
    reviewCount: 189,
    colorKeys: ["black", "white", "grey"],
    isBestSeller: true,
    description:
      "Responsive air-cushioned running shoes engineered for long-distance comfort and breathability.",
    tags: ["shoes", "running", "sports"],
  },
  {
    id: "men-sports-shoes-02",
    name: "Training Shoes",
    brand: "StrideFit",
    department: "men",
    category: "sports-shoes",
    kind: "shoe",
    price: 2799,
    rating: 4.2,
    reviewCount: 71,
    colorKeys: ["black", "grey"],
    isNew: true,
    description:
      "Multi-purpose training shoes with lateral support for high-intensity workouts.",
    tags: ["shoes", "training", "sports"],
  },
  // ----- MEN: Watches -----
  {
    id: "men-watch-01",
    name: "Chronograph Steel Watch",
    brand: "Chrono",
    department: "men",
    category: "watches",
    kind: "accessory",
    price: 4999,
    originalPrice: 6999,
    rating: 4.7,
    reviewCount: 203,
    colorKeys: ["silver", "black"],
    isBestSeller: true,
    description:
      "A precision chronograph watch with a stainless-steel case, scratch-resistant crystal and genuine leather strap.",
    tags: ["watch", "chronograph", "accessories"],
  },
  {
    id: "men-watch-02",
    name: "Minimalist Steel Watch",
    brand: "Chrono",
    department: "men",
    category: "watches",
    kind: "accessory",
    price: 2999,
    rating: 4.4,
    reviewCount: 88,
    colorKeys: ["silver", "gold"],
    description:
      "Clean-dial minimalist watch with a slim stainless-steel case, built for everyday wear.",
    tags: ["watch", "minimalist", "accessories"],
  },
  // ----- MEN: Sunglasses -----
  {
    id: "men-sunglasses-01",
    name: "Aviator Sunglasses",
    brand: "NOVA Men",
    department: "men",
    category: "sunglasses",
    kind: "accessory",
    price: 1899,
    originalPrice: 2499,
    rating: 4.4,
    reviewCount: 113,
    colorKeys: ["gold", "black"],
    description:
      "Timeless aviator sunglasses with polarized lenses and UV400 protection.",
    tags: ["sunglasses", "aviator", "accessories"],
  },
  {
    id: "men-sunglasses-02",
    name: "Classic Wayfarer Sunglasses",
    brand: "NOVA Men",
    department: "men",
    category: "sunglasses",
    kind: "accessory",
    price: 1599,
    rating: 4.2,
    reviewCount: 64,
    colorKeys: ["black", "tan"],
    isNew: true,
    description:
      "Bold wayfarer-frame sunglasses with scratch-resistant, UV-protected lenses.",
    tags: ["sunglasses", "wayfarer", "accessories"],
  },

  // ----- WOMEN: Tops -----
  {
    id: "women-top-01",
    name: "Ruched Bodycon Top",
    brand: "Aria",
    department: "women",
    category: "tops",
    kind: "top",
    price: 1199,
    originalPrice: 1699,
    rating: 4.5,
    reviewCount: 167,
    colorKeys: ["black", "wine", "blush"],
    isBestSeller: true,
    description:
      "A figure-flattering ruched bodycon top in soft stretch fabric, perfect for evenings out.",
    tags: ["top", "bodycon", "evening"],
  },
  {
    id: "women-top-02",
    name: "Puff Sleeve Blouse",
    brand: "Threadcraft",
    department: "women",
    category: "tops",
    kind: "top",
    price: 999,
    rating: 4.3,
    reviewCount: 92,
    colorKeys: ["white", "mustard", "blush"],
    isNew: true,
    description:
      "A romantic puff-sleeve blouse in lightweight crepe with a flattering tie-waist.",
    tags: ["top", "blouse", "puff-sleeve"],
  },
  // ----- WOMEN: Jeans -----
  {
    id: "women-jeans-01",
    name: "High-Rise Skinny Jeans",
    brand: "Denim Co.",
    department: "women",
    category: "jeans",
    kind: "bottom",
    price: 1899,
    originalPrice: 2599,
    rating: 4.5,
    reviewCount: 178,
    colorKeys: ["denim", "black"],
    isBestSeller: true,
    description:
      "High-rise skinny jeans with 4-way stretch for a second-skin fit that moves with you.",
    tags: ["jeans", "skinny", "denim"],
  },
  {
    id: "women-jeans-02",
    name: "Wide Leg Jeans",
    brand: "Aria",
    department: "women",
    category: "jeans",
    kind: "bottom",
    price: 2099,
    rating: 4.2,
    reviewCount: 55,
    colorKeys: ["denim", "white"],
    isNew: true,
    description:
      "Statement wide-leg jeans with a high waist and clean, straight-through leg line.",
    tags: ["jeans", "wide-leg", "denim"],
  },
  // ----- WOMEN: Leggings -----
  {
    id: "women-leggings-01",
    name: "High Waist Leggings",
    brand: "NOVA Women",
    department: "women",
    category: "leggings",
    kind: "bottom",
    price: 899,
    originalPrice: 1199,
    rating: 4.4,
    reviewCount: 205,
    colorKeys: ["black", "navy", "grey"],
    isBestSeller: true,
    description:
      "Squat-proof high-waist leggings in buttery-soft four-way stretch fabric.",
    tags: ["leggings", "activewear", "basics"],
  },
  {
    id: "women-leggings-02",
    name: "Seamless Leggings",
    brand: "NOVA Women",
    department: "women",
    category: "leggings",
    kind: "bottom",
    price: 1099,
    rating: 4.3,
    reviewCount: 84,
    colorKeys: ["black", "olive"],
    description:
      "Seamless knit leggings that contour and breathe through every workout.",
    tags: ["leggings", "seamless", "activewear"],
  },
  // ----- WOMEN: Kurta Sets -----
  {
    id: "women-kurta-01",
    name: "Embroidered Kurta Set",
    brand: "Threadcraft",
    department: "women",
    category: "kurta-sets",
    kind: "top",
    price: 2499,
    originalPrice: 3499,
    rating: 4.6,
    reviewCount: 96,
    colorKeys: ["maroon", "mustard", "emerald"],
    description:
      "An intricately embroidered kurta and palazzo set in breathable cotton, complete with a dupatta.",
    tags: ["kurta", "ethnic", "set"],
  },
  {
    id: "women-kurta-02",
    name: "Printed Anarkali Set",
    brand: "Threadcraft",
    department: "women",
    category: "kurta-sets",
    kind: "top",
    price: 2199,
    rating: 4.4,
    reviewCount: 61,
    colorKeys: ["blush", "navy"],
    isNew: true,
    description:
      "Flowing floor-length Anarkali set with a floral print and flared silhouette.",
    tags: ["kurta", "anarkali", "ethnic"],
  },
  // ----- WOMEN: Sarees -----
  {
    id: "women-saree-01",
    name: "Banarasi Silk Saree",
    brand: "Threadcraft",
    department: "women",
    category: "sarees",
    kind: "top",
    price: 4999,
    originalPrice: 6999,
    rating: 4.7,
    reviewCount: 74,
    colorKeys: ["maroon", "gold"],
    isBestSeller: true,
    description:
      "A handwoven Banarasi silk saree with intricate zari work, paired with an unstitched blouse piece.",
    tags: ["saree", "silk", "ethnic"],
  },
  {
    id: "women-saree-02",
    name: "Georgette Printed Saree",
    brand: "Aria",
    department: "women",
    category: "sarees",
    kind: "top",
    price: 1999,
    rating: 4.2,
    reviewCount: 42,
    colorKeys: ["emerald", "blush"],
    description:
      "Lightweight georgette saree with a delicate floral print — effortless drape for day events.",
    tags: ["saree", "georgette", "printed"],
  },
  // ----- WOMEN: Jumpsuits & More -----
  {
    id: "women-jumpsuit-01",
    name: "Belted Jumpsuit",
    brand: "Aria",
    department: "women",
    category: "jumpsuits",
    kind: "top",
    price: 2299,
    originalPrice: 2999,
    rating: 4.3,
    reviewCount: 58,
    colorKeys: ["black", "olive"],
    description:
      "A tailored belted jumpsuit with wide-leg trousers and a flattering cinched waist.",
    tags: ["jumpsuit", "co-ord", "evening"],
  },
  {
    id: "women-jumpsuit-02",
    name: "Wide Leg Playsuit",
    brand: "NOVA Women",
    department: "women",
    category: "jumpsuits",
    kind: "top",
    price: 1699,
    rating: 4.1,
    reviewCount: 31,
    colorKeys: ["white", "blush"],
    isNew: true,
    description:
      "A breezy wide-leg playsuit in soft viscose, finished with adjustable shoulder straps.",
    tags: ["playsuit", "jumpsuit", "summer"],
  },
  // ----- WOMEN: Handbags -----
  {
    id: "women-handbag-01",
    name: "Structured Tote Bag",
    brand: "Luxe Weave",
    department: "women",
    category: "handbags",
    kind: "accessory",
    price: 2999,
    originalPrice: 3999,
    rating: 4.6,
    reviewCount: 121,
    colorKeys: ["black", "tan"],
    isBestSeller: true,
    description:
      "A structured tote in vegan leather with reinforced handles and a spacious interior.",
    tags: ["handbag", "tote", "accessories"],
  },
  {
    id: "women-handbag-02",
    name: "Quilted Sling Bag",
    brand: "Luxe Weave",
    department: "women",
    category: "handbags",
    kind: "accessory",
    price: 1999,
    rating: 4.3,
    reviewCount: 67,
    colorKeys: ["blush", "black"],
    description:
      "A quilted sling bag with a chain strap — a versatile everyday companion.",
    tags: ["handbag", "sling", "accessories"],
  },
  // ----- WOMEN: Sunglasses -----
  {
    id: "women-sunglasses-01",
    name: "Cat Eye Sunglasses",
    brand: "NOVA Women",
    department: "women",
    category: "sunglasses",
    kind: "accessory",
    price: 1799,
    originalPrice: 2299,
    rating: 4.4,
    reviewCount: 89,
    colorKeys: ["black", "tan"],
    description:
      "Retro-inspired cat eye sunglasses with gradient, UV-protected lenses.",
    tags: ["sunglasses", "cat-eye", "accessories"],
  },
  {
    id: "women-sunglasses-02",
    name: "Round Tinted Sunglasses",
    brand: "NOVA Women",
    department: "women",
    category: "sunglasses",
    kind: "accessory",
    price: 1499,
    rating: 4.1,
    reviewCount: 37,
    colorKeys: ["gold", "silver"],
    isNew: true,
    description:
      "Vintage round-frame sunglasses with a tinted lens and slim metal arms.",
    tags: ["sunglasses", "round", "accessories"],
  },
  // ----- WOMEN: Watches -----
  {
    id: "women-watch-01",
    name: "Rose Gold Analog Watch",
    brand: "Chrono",
    department: "women",
    category: "watches",
    kind: "accessory",
    price: 3499,
    originalPrice: 4499,
    rating: 4.6,
    reviewCount: 102,
    colorKeys: ["roseGold", "white"],
    isBestSeller: true,
    description:
      "An elegant analog watch in rose gold with a mother-of-pearl dial and mesh strap.",
    tags: ["watch", "rose-gold", "accessories"],
  },
  {
    id: "women-watch-02",
    name: "Minimalist Mesh Watch",
    brand: "Chrono",
    department: "women",
    category: "watches",
    kind: "accessory",
    price: 2499,
    rating: 4.2,
    reviewCount: 44,
    colorKeys: ["silver", "gold"],
    description:
      "A slim minimalist watch with a mesh strap and clean sunburst dial.",
    tags: ["watch", "minimalist", "accessories"],
  },
  // ----- WOMEN: Footwear -----
  {
    id: "women-footwear-01",
    name: "Block Heel Sandals",
    brand: "NOVA Women",
    department: "women",
    category: "footwear",
    kind: "shoe",
    price: 1999,
    originalPrice: 2599,
    rating: 4.4,
    reviewCount: 96,
    colorKeys: ["tan", "black"],
    isBestSeller: true,
    description:
      "Comfortable block-heel sandals with a cushioned footbed, perfect for all-day wear.",
    tags: ["footwear", "heels", "sandals"],
  },
  {
    id: "women-footwear-02",
    name: "Classic Ballet Flats",
    brand: "NOVA Women",
    department: "women",
    category: "footwear",
    kind: "shoe",
    price: 1299,
    rating: 4.1,
    reviewCount: 53,
    colorKeys: ["black", "blush", "tan"],
    description:
      "Soft ballet flats in supple faux leather with a flexible, lightweight sole.",
    tags: ["footwear", "flats", "casual"],
  },
  // ----- WOMEN: Activewear -----
  {
    id: "women-activewear-01",
    name: "Seamless Sports Bra",
    brand: "NOVA Women",
    department: "women",
    category: "activewear",
    kind: "top",
    price: 899,
    originalPrice: 1199,
    rating: 4.5,
    reviewCount: 187,
    colorKeys: ["black", "blush", "olive"],
    isBestSeller: true,
    description:
      "Medium-support seamless sports bra with moisture-wicking fabric for high-intensity training.",
    tags: ["activewear", "sports-bra", "gym"],
  },
  {
    id: "women-activewear-02",
    name: "High Waist Training Tights",
    brand: "NOVA Women",
    department: "women",
    category: "activewear",
    kind: "bottom",
    price: 1299,
    rating: 4.3,
    reviewCount: 79,
    colorKeys: ["black", "navy"],
    isNew: true,
    description:
      "Compressive high-waist training tights with a hidden pocket for on-the-go workouts.",
    tags: ["activewear", "tights", "gym"],
  },

  // ----- BEAUTY: Skincare -----
  {
    id: "beauty-skincare-01",
    name: "Vitamin C Brightening Serum",
    brand: "GlowLab",
    department: "beauty",
    category: "skincare",
    kind: "beauty",
    price: 799,
    originalPrice: 999,
    rating: 4.6,
    reviewCount: 342,
    colorKeys: [],
    isBestSeller: true,
    description:
      "A 20% vitamin C serum that brightens dull skin, fades dark spots and boosts radiance.",
    tags: ["skincare", "serum", "brightening"],
  },
  {
    id: "beauty-skincare-02",
    name: "Hydrating Gel Moisturizer",
    brand: "PureDerm",
    department: "beauty",
    category: "skincare",
    kind: "beauty",
    price: 649,
    rating: 4.4,
    reviewCount: 198,
    colorKeys: [],
    description:
      "A lightweight, oil-free gel moisturizer with hyaluronic acid for 24-hour hydration.",
    tags: ["skincare", "moisturizer", "hydrating"],
  },
  // ----- BEAUTY: Haircare -----
  {
    id: "beauty-haircare-01",
    name: "Argan Oil Hair Serum",
    brand: "GlowLab",
    department: "beauty",
    category: "haircare",
    kind: "beauty",
    price: 549,
    originalPrice: 749,
    rating: 4.3,
    reviewCount: 156,
    colorKeys: [],
    description:
      "Nourishing argan oil serum that tames frizz and adds shine without weighing hair down.",
    tags: ["haircare", "serum", "frizz-control"],
  },
  {
    id: "beauty-haircare-02",
    name: "Keratin Repair Shampoo",
    brand: "PureDerm",
    department: "beauty",
    category: "haircare",
    kind: "beauty",
    price: 449,
    rating: 4.2,
    reviewCount: 121,
    colorKeys: [],
    isNew: true,
    description:
      "A sulfate-free keratin shampoo that repairs damage and strengthens hair from root to tip.",
    tags: ["haircare", "shampoo", "repair"],
  },
  // ----- BEAUTY: Makeup -----
  {
    id: "beauty-makeup-01",
    name: "Matte Liquid Lipstick",
    brand: "GlowLab",
    department: "beauty",
    category: "makeup",
    kind: "beauty",
    price: 399,
    originalPrice: 599,
    rating: 4.5,
    reviewCount: 267,
    colorKeys: ["wine", "blush", "rust"],
    isBestSeller: true,
    description:
      "Long-wearing matte liquid lipstick with a lightweight, non-drying formula.",
    tags: ["makeup", "lipstick", "matte"],
  },
  {
    id: "beauty-makeup-02",
    name: "Long Wear Liquid Foundation",
    brand: "PureDerm",
    department: "beauty",
    category: "makeup",
    kind: "beauty",
    price: 899,
    rating: 4.3,
    reviewCount: 143,
    colorKeys: [],
    description:
      "Buildable, full-coverage foundation with a natural matte finish that lasts all day.",
    tags: ["makeup", "foundation", "long-wear"],
  },
  // ----- BEAUTY: Fragrance -----
  {
    id: "beauty-fragrance-01",
    name: "Eau De Parfum — Citrus Bloom",
    brand: "GlowLab",
    department: "beauty",
    category: "fragrance",
    kind: "beauty",
    price: 1499,
    originalPrice: 1999,
    rating: 4.6,
    reviewCount: 89,
    colorKeys: [],
    description:
      "A fresh citrus-floral eau de parfum with notes of bergamot, jasmine and soft musk.",
    tags: ["fragrance", "perfume", "citrus"],
  },
  {
    id: "beauty-fragrance-02",
    name: "Musk Woody Perfume",
    brand: "PureDerm",
    department: "beauty",
    category: "fragrance",
    kind: "beauty",
    price: 1299,
    rating: 4.2,
    reviewCount: 47,
    colorKeys: [],
    isNew: true,
    description:
      "A warm, woody musk fragrance with sandalwood and amber base notes for evening wear.",
    tags: ["fragrance", "perfume", "woody"],
  },
  // ----- BEAUTY: Hair Styling Devices -----
  {
    id: "beauty-device-01",
    name: "Ceramic Hair Straightener",
    brand: "GlowLab",
    department: "beauty",
    category: "hair-styling-devices",
    kind: "beauty",
    price: 1999,
    originalPrice: 2699,
    rating: 4.4,
    reviewCount: 132,
    colorKeys: ["black", "gold"],
    isBestSeller: true,
    description:
      "Ceramic-plated hair straightener with adjustable heat settings for salon-smooth results.",
    tags: ["device", "straightener", "styling"],
  },
  {
    id: "beauty-device-02",
    name: "Ionic Hair Dryer",
    brand: "PureDerm",
    department: "beauty",
    category: "hair-styling-devices",
    kind: "beauty",
    price: 1799,
    rating: 4.1,
    reviewCount: 58,
    colorKeys: ["black"],
    description:
      "Fast-drying ionic hair dryer that reduces frizz and locks in shine.",
    tags: ["device", "hair-dryer", "styling"],
  },
  // ----- BEAUTY: Korean Beauty -----
  {
    id: "beauty-kbeauty-01",
    name: "Snail Mucin Repair Essence",
    brand: "K-Glow",
    department: "beauty",
    category: "korean-beauty",
    kind: "beauty",
    price: 899,
    originalPrice: 1199,
    rating: 4.7,
    reviewCount: 276,
    colorKeys: [],
    isBestSeller: true,
    description:
      "A cult-favorite 96% snail mucin essence that repairs, hydrates and smooths skin texture.",
    tags: ["korean-beauty", "essence", "repair"],
  },
  {
    id: "beauty-kbeauty-02",
    name: "Centella Calming Cream",
    brand: "K-Glow",
    department: "beauty",
    category: "korean-beauty",
    kind: "beauty",
    price: 749,
    rating: 4.5,
    reviewCount: 164,
    colorKeys: [],
    isNew: true,
    description:
      "A soothing centella asiatica cream that calms redness and strengthens the skin barrier.",
    tags: ["korean-beauty", "cream", "calming"],
  },
];

export const products: Product[] = specs.map((s) => {
  const slug = slugify(s.name);
  return {
    id: s.id,
    slug,
    name: s.name,
    brand: s.brand,
    department: s.department,
    category: s.category,
    subcategory: s.subcategory,
    description: s.description,
    details: s.details,
    price: s.price,
    originalPrice: s.originalPrice,
    discountPercentage: discountOf(s.price, s.originalPrice),
    rating: s.rating,
    reviewCount: s.reviewCount,
    images: [],
    colors: colors(...s.colorKeys),
    sizes: sizesFor(s.kind),
    stock: 25,
    isNew: Boolean(s.isNew),
    isBestSeller: Boolean(s.isBestSeller),
    tags: s.tags,
  };
});

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByDepartment(department: string): Product[] {
  return products.filter((p) => p.department === department);
}

export function getProductsByCategory(
  department: string,
  category: string
): Product[] {
  return products.filter(
    (p) => p.department === department && p.category === category
  );
}

export function getNewArrivals(limit?: number): Product[] {
  const items = products.filter((p) => p.isNew);
  return limit ? items.slice(0, limit) : items;
}

export function getBestSellers(limit?: number): Product[] {
  const items = products.filter((p) => p.isBestSeller);
  return limit ? items.slice(0, limit) : items;
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter(
      (p) =>
        p.id !== product.id &&
        p.department === product.department &&
        p.category === product.category
    )
    .slice(0, limit);
}

export function searchProducts(query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return products.filter((p) =>
    [p.name, p.brand, p.category, p.department, ...p.tags]
      .join(" ")
      .toLowerCase()
      .includes(q)
  );
}
