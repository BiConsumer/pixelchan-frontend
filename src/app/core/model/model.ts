export interface Model {
  id: string;
  createdAt: Date;
}

export interface Category extends Model {

  id: string;
  createdAt: Date;
  name: string;
  description: string

}

export interface Topic extends Model {

  category: string;
  name: string;
  favorites: number;

}

export interface TopicCreateRequest {

  category: string
  name: string
  postContent: string

}

export interface Post extends Model {

  topic: string;
  content: string;

}

export interface PostCreateRequest {

  topic: string;
  content: string;

}

export interface CategoryDisplay {
  category: Category;
  topicDisplays: TopicDisplay[]
}

export interface TopicDisplay {
  topic: Topic;
  posts: Post[]
}
