import { Elysia } from "elysia";
import { IFoodRepository } from "@domain/repositories/food.repository";
import { MongoDBFoodRepository } from "../repositories/mongodb-food.repository";
import { CreateFoodUseCase } from "@application/use-cases/create-food.use-case";
import { GetFoodUseCase } from "@application/use-cases/get-food.use-case";
import { ListFoodsUseCase } from "@application/use-cases/list-foods.use-case";
import { UpdateFoodUseCase } from "@application/use-cases/update-food.use-case";
import { DeleteFoodUseCase } from "@application/use-cases/delete-food.use-case";
import { FoodController } from "@presentation/controllers/food.controller";
import { createFoodRoutes } from "@presentation/routes/food.routes";

/**
 * Container central de injeção de dependências
 * Segue o fluxo: Repository -> Use Case -> Controller -> Elysia
 * 
 * Responsabilidades:
 * - Criar e gerenciar instâncias de repositórios
 * - Injetar repositórios nos use cases
 * - Injetar use cases nos controllers
 * - Configurar e retornar rotas do Elysia
 */
export class Container {
  // ========== REPOSITORIES ==========
  private static foodRepository: IFoodRepository;

  // ========== USE CASES ==========
  private static createFoodUseCase: CreateFoodUseCase;
  private static getFoodUseCase: GetFoodUseCase;
  private static listFoodsUseCase: ListFoodsUseCase;
  private static updateFoodUseCase: UpdateFoodUseCase;
  private static deleteFoodUseCase: DeleteFoodUseCase;

  // ========== CONTROLLERS ==========
  private static foodController: FoodController;

  // ========== INITIALIZATION ==========
  private static initialized = false;

  /**
   * Inicializa todas as dependências seguindo o fluxo:
   * Repository -> Use Case -> Controller
   */
  static initialize(): void {
    if (this.initialized) {
      return;
    }

    // 1. Criar Repositórios
    this.initializeRepositories();

    // 2. Criar Use Cases (injetando repositórios)
    this.initializeUseCases();

    // 3. Criar Controllers (injetando use cases)
    this.initializeControllers();

    this.initialized = true;
  }

  /**
   * Passo 1: Inicializar Repositórios
   */
  private static initializeRepositories(): void {
    this.foodRepository = new MongoDBFoodRepository();
  }

  /**
   * Passo 2: Inicializar Use Cases
   * Injeta os repositórios nos use cases
   */
  private static initializeUseCases(): void {
    this.createFoodUseCase = new CreateFoodUseCase(this.foodRepository);
    this.getFoodUseCase = new GetFoodUseCase(this.foodRepository);
    this.listFoodsUseCase = new ListFoodsUseCase(this.foodRepository);
    this.updateFoodUseCase = new UpdateFoodUseCase(this.foodRepository);
    this.deleteFoodUseCase = new DeleteFoodUseCase(this.foodRepository);
  }

  /**
   * Passo 3: Inicializar Controllers
   * Injeta os use cases nos controllers
   */
  private static initializeControllers(): void {
    this.foodController = new FoodController(
      this.createFoodUseCase,
      this.getFoodUseCase,
      this.listFoodsUseCase,
      this.updateFoodUseCase,
      this.deleteFoodUseCase
    );
  }

  // ========== GETTERS ==========

  /**
   * Retorna o repositório de Food
   */
  static getFoodRepository(): IFoodRepository {
    this.ensureInitialized();
    return this.foodRepository;
  }

  /**
   * Retorna o controller de Food
   */
  static getFoodController(): FoodController {
    this.ensureInitialized();
    return this.foodController;
  }

  /**
   * Retorna as rotas do Elysia configuradas
   * Passo 4: Repository -> Use Case -> Controller -> Elysia
   */
  static getFoodRoutes() {
    this.ensureInitialized();
    return createFoodRoutes(this.foodController);
  }

  // ========== HELPER METHODS ==========

  /**
   * Garante que o container foi inicializado
   */
  private static ensureInitialized(): void {
    if (!this.initialized) {
      this.initialize();
    }
  }

  /**
   * Reseta o container (útil para testes)
   */
  static reset(): void {
    this.initialized = false;
    // @ts-ignore - Limpar referências
    this.foodRepository = undefined;
    this.createFoodUseCase = undefined;
    this.getFoodUseCase = undefined;
    this.listFoodsUseCase = undefined;
    this.updateFoodUseCase = undefined;
    this.deleteFoodUseCase = undefined;
    this.foodController = undefined;
  }
}
