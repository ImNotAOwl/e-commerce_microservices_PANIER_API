import { Panier } from '../entity/Panier';

export interface IPanierRepository {
  addArticleInBucket(data: Panier): Promise<void>;
  getBucket(user: string): Promise<Panier[] | null>;
  getArticleInBucket(user: string, articleId: string): Promise<Panier | null>;
  deleteBucket(user: string): Promise<void>;
  deleteOneArticleInBucket(user: string, article: string): Promise<void>;
}