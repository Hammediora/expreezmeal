export interface NutritionInfo {
  calories?: number
  protein?: number // in grams
  carbs?: number // in grams
  fat?: number // in grams
  fiber?: number // in grams
  sodium?: number // in mg
  sugar?: number // in grams
}

// Enhanced nutrition data for menu items
export const nutritionData: { [itemId: string]: NutritionInfo } = {
  // Shawarma nutrition
  'd51712d5-2b18-453b-b301-8f04b5c612c5': {
    calories: 450,
    protein: 28,
    carbs: 35,
    fat: 22,
    fiber: 4,
    sodium: 890,
    sugar: 3,
  },
  // Zobo nutrition
  '24794c89-fe6a-4c84-b812-1f1c461ec503': {
    calories: 25,
    protein: 0,
    carbs: 6,
    fat: 0,
    fiber: 1,
    sodium: 5,
    sugar: 5,
  },
  // Meat Pie nutrition
  '2855db19-6c55-46ec-8a8f-8ebf337c10d1': {
    calories: 320,
    protein: 15,
    carbs: 28,
    fat: 18,
    fiber: 2,
    sodium: 650,
    sugar: 2,
  },
  // The OG Combo nutrition (estimated)
  '8059cb50-eb99-4365-91a1-a892de740684': {
    calories: 575,
    protein: 30,
    carbs: 45,
    fat: 25,
    fiber: 5,
    sodium: 950,
    sugar: 8,
  },
  // Spicy Boost Box nutrition (estimated)
  'a6a321ff-a686-4635-967c-a9bb40d604f9': {
    calories: 645,
    protein: 32,
    carbs: 48,
    fat: 28,
    fiber: 6,
    sodium: 1020,
    sugar: 9,
  },
}

// Helper function to get nutrition data for a menu item
export const getNutritionData = (itemId: string): NutritionInfo | null => {
  return nutritionData[itemId] || null
}

// Helper function to check if nutrition data exists for an item
export const hasNutritionData = (itemId: string): boolean => {
  return itemId in nutritionData
}