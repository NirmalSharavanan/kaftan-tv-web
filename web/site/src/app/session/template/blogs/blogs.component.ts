import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";

import { Blog } from "app/models/Blog";
import { BlogComment } from "app/models/BlogComment";

import { BlogService } from "app/services/blog.service";
import { BlogCommentService } from "app/services/blog-comment.service";
import { AuthenticationService } from "app/services/authentication.service";
import { MessageService } from "primeng/components/common/messageservice";

@Component({
  selector: "ss-blogs",
  templateUrl: "./blogs.component.html",
  styleUrls: ["./blogs.component.scss"]
})
export class BlogsComponent implements OnInit {
  loading = true;
  fg: FormGroup;
  blog: Blog;
  blogdt: any;
  recommended_blogs: Blog[];
  comments: BlogComment[];
  isAuthenticated: boolean = false;
  commentDescription: string;
  blogId: string;

  constructor(
    fb: FormBuilder,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private sanitized: DomSanitizer,
    private authService: AuthenticationService,
    private blogservice: BlogService,
    private blogcommentservice: BlogCommentService
  ) {
    this.fg = fb.group({
      commentName: fb.control("", [Validators.required])
    });
  }

  ngOnInit() {
    this.authService.isUserAuthenticated().subscribe((isAuth: boolean) => {
      this.isAuthenticated = isAuth;
    });
    this.init();
  }

  private init() {
    this.loading = true;
    this.fg.reset();
    this.blogservice.getAllBlogs(true).subscribe((blogs: Blog[]) => {
      if (blogs && blogs.length > 0) {
        this.blog = blogs[0];
        this.blogdt = this.blog;
        if (blogs && blogs.length > 1) {
          this.recommended_blogs = blogs.filter(x => x.id != this.blog.id);
        }
      }
      this.getBlogComment();
      this.loading = false;
    });
  }

  getBlogComment() {
    this.comments = null;
    this.blogcommentservice
      .getBlog(this.blog.id)
      .subscribe((blogComments: BlogComment[]) => {
        if (blogComments && blogComments.length > 0) {
          this.comments = blogComments;
        }
      });
  }

  onSubmit() {
    this.loading = true;
    if (this.fg.get("commentName").value != "") {
      this.commentDescription = this.fg.get("commentName").value;
      this.blogcommentservice
        .addBlog(this.blog.id, this.commentDescription)
        .subscribe((value: any) => {
          if (value != null) {
            if (value.success) {
              this.messageService.add({
                severity: "info",
                summary: "Blog Comment added successfully.",
                detail: ""
              });
              this.fg.reset();
              this.getBlogComment();
            } else {
              this.messageService.add({
                severity: "error",
                summary: "Problem in adding your comment, Try after sometime.",
                detail: ""
              });
              this.fg.reset();
            }
            this.loading = false;
          }
        });
    }
  }
}