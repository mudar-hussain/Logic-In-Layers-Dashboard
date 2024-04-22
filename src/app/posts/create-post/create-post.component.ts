import { Component, OnInit } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Post } from 'src/app/models/post';
import { CategoriesService } from 'src/app/services/categories.service';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css'],
})
export class CreatePostComponent implements OnInit {
  permalink: string = '';
  postImgPlaceHolder: any = './assets/img/placeholder-image.png';
  imgSrc: any = this.postImgPlaceHolder;
  selectedImg: any = null;
  editPostForm: any;
  categoryList!: Observable<any>;
  editPostId: string = '';
  createPostForm: FormGroup;
  formStatus: string = 'Create';

  constructor(
    private categoryService: CategoriesService,
    private postService: PostsService,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe((val) => {
      this.editPostId = val['id'] || '';
    });

    this.createPostForm = new FormGroup({
      title: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
      ]),
      permalink: new FormControl(
        { value: '', disabled: true },
        Validators.required
      ),
      excerpt: new FormControl('', [
        Validators.required,
        Validators.minLength(50),
      ]),
      category: new FormControl('', Validators.required),
      postImg: new FormControl(''),
      content: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.categoryList = this.categoryService.getCategories();
    if (this.editPostId?.length != 0) {
      this.formStatus = 'Edit';
      this.postService.getPostById(this.editPostId).then((val) => {
        this.editPostForm = val.data();
        this.createPostForm.get('title')?.setValue(this.editPostForm.title);
        this.createPostForm
          .get('permalink')
          ?.setValue(this.editPostForm.permalink);
        this.permalink = this.editPostForm.title.trim().replace(/\s/g, '-');
        this.createPostForm.get('excerpt')?.setValue(this.editPostForm.excerpt);
        this.createPostForm
          .get('category')
          ?.setValue(
            `${this.editPostForm.category.categoryId}~#~${this.editPostForm.category.category}`
          );
        this.imgSrc = this.editPostForm.postImgPath;
        this.selectedImg = null;
        this.createPostForm.get('content')?.setValue(this.editPostForm.content);
      });
    } else {
      this.deleteImg();
    }
  }

  updatePermalink(event: any) {
    const title = event.target.value;
    this.permalink = title.trim().replace(/\s/g, '-');
  }

  showImgPreview(event: any) {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imgSrc = e.target?.result;
    };
    reader.readAsDataURL(event.target.files[0]);
    this.selectedImg = event.target.files[0];
  }

  get createPostFormControls() {
    return this.createPostForm.controls;
  }

  onSubmit() {
    if (this.formStatus == 'Create') {
      this.createPost();
    } else {
      this.updatePost();
    }
  }

  createPost() {
    const categoryData = this.createPostForm.value.category.split('~#~');

    this.postService.uploadFile(this.selectedImg).then((postImgUrl) => {
      const postData: Post = {
        title: this.createPostForm.value.title,
        permalink: this.permalink,
        category: {
          categoryId: categoryData[0],
          category: categoryData[1],
        },
        postImgPath: postImgUrl,
        excerpt: this.createPostForm.value.excerpt,
        content: this.createPostForm.value.content,
        isFeatured: false,
        views: 0,
        status: 'New',
        createdAt: Timestamp.fromDate(new Date()),
      };
      this.postService.addPost(postData);
      this.resetPostCreateForm();
    });
  }

  updatePost() {
    const categoryData = this.createPostForm.value.category.split('~#~');
    const postData: Post = {
      title: this.createPostForm.value.title,
      permalink: this.permalink,
      category: {
        categoryId: categoryData[0],
        category: categoryData[1],
      },
      postImgPath: '',
      excerpt: this.createPostForm.value.excerpt,
      content: this.createPostForm.value.content,
      isFeatured: this.editPostForm.isFeatured,
      views: this.editPostForm.views,
      status: 'Edited',
      createdAt: this.editPostForm.createdAt,
    };
    if (this.selectedImg != null) {
      this.postService.uploadFile(this.selectedImg).then((postImgUrl) => {
        postData.postImgPath = postImgUrl;
        this.postService.updatePost(this.editPostId, postData);
      });
    } else {
      postData.postImgPath = this.editPostForm.postImgPath;
      this.postService.updatePost(this.editPostId, postData);
    }

    this.resetPostCreateForm();
  }

  resetPostCreateForm() {
    this.createPostForm.reset();
    this.deleteImg();
  }

  deleteImg() {
    this.imgSrc = this.postImgPlaceHolder;
    this.selectedImg = null;
  }
}
