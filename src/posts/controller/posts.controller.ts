import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/auth.grard';
import { GetUserId } from 'src/common/dec/decorators';

import { PostCreateRequest } from '../service/dto/postCreateRequest.dto';
import { PostsService } from '../service/posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('')
  async create(@Body() postCreateRequest: PostCreateRequest, @GetUserId() userId: string) {
    return await this.postService.create(postCreateRequest, userId);
  }

  @Get(':id')
  async findOneById(@Param() postId: string) {
    return await this.postService.findOneById(postId);
  }
}
