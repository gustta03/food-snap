import { Food } from "../entities/food.entity";

export interface IFoodRepository {
  findById(id: string): Promise<Food | null>;
  findAll(): Promise<Food[]>;
  save(food: Food): Promise<Food>;
  update(food: Food): Promise<Food>;
  delete(id: string): Promise<void>;
  findByName(name: string): Promise<Food | null>;
}

