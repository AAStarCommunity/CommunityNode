import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TerminusModule } from '@nestjs/terminus';
import { WallectModule } from './modules/wallet/module';
import { Wallet } from './entities/wallect.entity';

@Module({
  providers: [],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV}`, `.env`],
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.db',
      autoLoadEntities: true,
      entities: [Wallet],
      synchronize: true,
    }),
    TerminusModule,
    WallectModule,
  ],
  controllers: [],
})
export class AppModule {}
