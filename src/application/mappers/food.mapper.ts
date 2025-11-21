import { Food } from "@domain/entities/food.entity";
import { FoodResponseDto } from "../dtos/food-response.dto";

export class FoodMapper {
  static toDto(food: Food): FoodResponseDto {
    return {
      id: food.id,
      name: food.name,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
      createdAt: food.createdAt.toISOString(),
      updatedAt: food.updatedAt.toISOString(),
    };
  }

  static toDtoList(foods: Food[]): FoodResponseDto[] {
    return foods.map((food) => this.toDto(food));
  }
}

