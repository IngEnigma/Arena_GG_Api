import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
    try {
      console.log('Prisma Conectado a la base de datos.');
    } catch (error) {
      console.error('Error al conectar a la base de datos:', error);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    try {
      console.log('Prisma Desconectado de la base de datos.');
    } catch (error) {
      console.error('Error al desconectar de la base de datos:', error);
    }
  }
}
