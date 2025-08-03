import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AbsenceModule } from './absence/absence.module';
import { User } from './user/user.entity';
import { AbsenceRequest } from './absence/absence.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'eams.db',
      entities: [User, AbsenceRequest],
      synchronize: true,
      logging: true,
    }),
    AuthModule,
    AbsenceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
