import { findManyCursorConnection } from "@devoxa/prisma-relay-cursor-connection";
import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { ConnectionArgs } from "src/page/connection-args.dto";
import { PrismaService } from "./../prisma/prisma.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  create(createProductDto: CreateProductDto) {
    return this.prisma.product.create({ data: createProductDto });
  }

  findAll() {
    console.log("Find All");
    return this.prisma.product.findMany({
      where: {
        published: false,
      },
    });
  }

  findOne(id: string) {
    console.log("here find one");

    return this.prisma.product.findUnique({ where: { id } });
  }

  findDrafts() {
    return this.prisma.product.findMany({ where: { published: false } });
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    return this.prisma.product.update({
      where: { id: id },
      data: updateProductDto,
    });
  }

  remove(id: string) {
    return this.prisma.product.delete({ where: { id: id } });
  }

  async findPage(connectionArgs: ConnectionArgs) {
    const where: Prisma.ProductWhereInput = {
      published: true,
    };

    return findManyCursorConnection(
      (args) =>
        this.prisma.product.findMany({
          ...args,
          where: where,
        }),
      () =>
        this.prisma.product.count({
          where: where,
        }),
      connectionArgs
    );
  }
}
