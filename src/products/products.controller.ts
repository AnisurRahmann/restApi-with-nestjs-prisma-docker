import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { ApiCreatedResponse, ApiOkResponse } from "@nestjs/swagger";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ProductEntity } from "./entities/product.entity";
import { ProductsService } from "./products.service";

@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiCreatedResponse({ type: ProductEntity })
  async create(@Body() createProductDto: CreateProductDto) {
    return new ProductEntity(
      await this.productsService.create(createProductDto)
    );
  }

  @Get()
  @ApiOkResponse({ type: [ProductEntity] })
  async findAll() {
    const products = await this.productsService.findAll();
    return products.map((product) => new ProductEntity(product));
  }

  @Get("drafts")
  @ApiOkResponse({ type: [ProductEntity] })
  async findDrafts() {
    const drafts = await this.productsService.findDrafts();
    return drafts.map((product) => new ProductEntity(product));
  }

  @Get(":id")
  @ApiOkResponse({ type: ProductEntity })
  async findOne(@Param("id") id: string) {
    return new ProductEntity(await this.productsService.findOne(id));
  }

  @Get('page')
  async findPage(){
    return this.productsService.findPage()
  }

  @Patch(":id")
  @ApiCreatedResponse({ type: ProductEntity })
  async update(
    @Param("id") id: string,
    @Body() updateProductDto: UpdateProductDto
  ) {
    return new ProductEntity(
      await this.productsService.update(id, updateProductDto)
    );
  }

  @Delete(":id")
  @ApiOkResponse({ type: ProductEntity })
  async remove(@Param("id") id: string) {
    return new ProductEntity(await this.productsService.remove(id));
  }
}
