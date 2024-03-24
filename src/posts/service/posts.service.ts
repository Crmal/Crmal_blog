import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';

import { Post } from '../entity/post.entity';

import { PostFactory } from './Factory/post.factory';
import { PostCreateRequest } from './dto/postCreateRequest.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    private postFactory: PostFactory,
    private userService: UserService,
  ) {}

  async create(postCreateRequest: PostCreateRequest, userId: string): Promise<Post> {
    const user = await this.userService.findOneById(userId);
    return this.postRepository.save(this.postFactory.create(postCreateRequest, user));
  }

  async findOneById(postId): Promise<Post> {
    return new Post();
  }
}
