import { Module } from '@nestjs/common';

import { PostsController } from './controller/posts.controller';
import { PostsService } from './service/posts.service';

@Module({
  providers: [PostsService],
  controllers: [PostsController],
})
export class PostsModule {}
