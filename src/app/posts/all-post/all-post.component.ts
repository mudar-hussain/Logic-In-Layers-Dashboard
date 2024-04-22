import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-all-post',
  templateUrl: './all-post.component.html',
  styleUrls: ['./all-post.component.css'],
})
export class AllPostComponent implements OnInit {
  postList!: Observable<any>;
  postImgPlaceHolder: any = './assets/img/placeholder-image.png';

  constructor(private postService: PostsService) {}

  ngOnInit(): void {
    this.postList = this.postService.getAllPosts();
  }

  deletePost(postId: string, postImgUrl: string) {
    this.postService.deletePost(postId, postImgUrl);
  }

  updatePostFeatured(postId: string, isFeaturedValue: boolean) {
    this.postService.updatePostFeatured(postId, !isFeaturedValue);
  }
}
