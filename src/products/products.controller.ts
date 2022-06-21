import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import {
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  getSchemaPath,
} from "@nestjs/swagger";
import { ConnectionArgs } from "src/page/connection-args.dto";
import { Page } from "src/page/page.dto";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ProductEntity } from "./entities/product.entity";
import { ProductsService } from "./products.service";

@Controller("products")
@ApiExtraModels(Page)
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
    console.log("YAAAAAA");
    return products.map((product) => new ProductEntity(product));
  }

  @Get("drafts")
  @ApiOkResponse({ type: [ProductEntity] })
  async findDrafts() {
    const drafts = await this.productsService.findDrafts();
    return drafts.map((product) => new ProductEntity(product));
  }

  @Get("page")
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(Page) },
        {
          properties: {
            edges: {
              type: "array",
              items: {
                type: "object",
                required: ["cursor", "node"],
                properties: {
                  cursor: { type: "string" },
                  node: { type: "object", $ref: getSchemaPath(ProductEntity) },
                },
              },
            },
          },
        },
      ],
    },
  })
  async findPage(@Query() connectionArgs: ConnectionArgs) {
    return this.productsService.findPage(connectionArgs);
  }

  @Get(":id")
  @ApiOkResponse({ type: ProductEntity })
  async findOne(@Param("id") id: string) {
    return new ProductEntity(await this.productsService.findOne(id));
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
