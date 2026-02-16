import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WEB_SITE_BASE_URL } from '../../core/constants/WEB_SITE_BASE_UTL';
import { IAllBlogsResponse } from '../../core/interfaces/IAllCategories';

interface IAddImageResponse {
  status: string;
  image: Image;
}

interface Image {
  category_id: string;
  category_image: string;
  updated_at: string;
  created_at: string;
  id: number;
}

@Injectable({
  providedIn: 'root',
})
export class BlogsService {
  constructor(private _HttpClient: HttpClient) {}

  uploadBlogImage(blogImage: FormData) {
    return this._HttpClient.post<IAddImageResponse>(
      `${WEB_SITE_BASE_URL}storeCategoryImage`,
      blogImage
    );
  }
  getBlogs() {
    return this._HttpClient.get<IAllBlogsResponse>(
      `${WEB_SITE_BASE_URL}categories`
    );
  }
}
