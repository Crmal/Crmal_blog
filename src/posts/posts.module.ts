import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';

import { PostsController } from './controller/posts.controller';
import { Post } from './entity/post.entity';
import { PostFactory } from './service/Factory/post.factory';
import { PostsService } from './service/posts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), UserModule],
  providers: [PostsService, PostFactory],
  controllers: [PostsController],
})
export class PostsModule {}
