import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { BlocksModule } from './blocks/blocks.module';
import { GatewayModule } from './blocks-wss/gateway.module';
import { ErgoPayModule } from './ergopay/ergopay.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    GatewayModule,
    ErgoPayModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
