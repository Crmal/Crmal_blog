import { Injectable } from '@nestjs/common';

import { Post } from '../entity/post.entity';

import { PostCreateRequest } from './dto/postCreateRequest.dto';
import { PostsService } from './posts.service';

@Injectable()
export class PostsServiceStub implements Pick<PostsService, keyof PostsService> {
  private posts = [
    {
      id: 1,
      title: 'TestTitle1',
      description: 'TestDescription',
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 1,
    },
    {
      id: 2,
      title: 'TestTitle2',
      description: 'TestDescription',
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 1,
    },
    {
      id: 3,
      title: 'TestTitle3',
      description: 'TestDescription',
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 2,
    },
  ];

  async create(postCreateRequest: PostCreateRequest, userId: string): Promise<Post> {
    const dummyPost = new Post();
    dummyPost.title = postCreateRequest.title;
    dummyPost.description = postCreateRequest.description;
    return dummyPost;
  }

  async findOneById(postId: number): Promise<Post> {
    const dummyPost = new Post();
    return dummyPost;
  }
}
