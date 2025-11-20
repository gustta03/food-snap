/**
 * DTO de resposta para Food
 */
export interface FoodResponseDto {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  createdAt: string;
  updatedAt: string;
}

