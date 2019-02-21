import { Component, OnInit } from '@angular/core';
import { ConfigService } from '@sunbird/shared';
import { ActivatedRoute, Router } from '@angular/router';
import { PublicDataService, LearnerService, UserService } from '@sunbird/core';
import * as _ from 'lodash';
import { SignupService } from '../../module/signup';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-public-preview-page',
  templateUrl: './public-preview-page.component.html',
  styleUrls: ['./public-preview-page.component.css']
})
export class PublicPreviewPageComponent implements OnInit {
  contentId;
  courseDetails = [];
  safeUrl;
  resources = [];
  creator;
  public baseUrl: string;
  courseDescription;
  showPromo = true;
  resourceType;
  showLoginModal = false;
  constructor(
    public activatedRoute: ActivatedRoute,
    public configService: ConfigService,
    public publicDataService: PublicDataService,
    public learnerService: LearnerService,
    public signupService: SignupService,
    public sanitizer: DomSanitizer,
    public route: Router,
    public userService: UserService
  ) {}

  ngOnInit() {
    this.contentId = this.activatedRoute.snapshot.params.collectionId;
    this.getCourseDetails();
  }
  getCourseDetails() {
    const req = {
      url: `${this.configService.urlConFig.URLS.COURSE.HIERARCHY}/${
        this.contentId
      }`
    };
    this.publicDataService.get(req).subscribe(data => {
      if (data.result.content.hasOwnProperty('children')) {
        const childrenIds = data.result.content.children;
        console.log(data.result.content.createdBy);
        console.log(data.result);
        this.creator = data.result.content.creator;
        this.resourceType = data.result.content.resourceType;
        this.courseDescription = data.result.content.description;
        _.forOwn(childrenIds, childrenvalue => {
          this.getChildren(childrenvalue);
        });
      }
    });
  }
  getChildren(sessiondetails) {
    // console.log(sessiondetails);
    _.forOwn(sessiondetails, (children, key) => {
      if (key === 'children') {
        _.forOwn(children, value => {
          if (key === 'children') {
            this.getChildren(value);
            if (value.hasOwnProperty('children')) {
              if (value.children.length === 0) {
                if (value.mimeType === 'video/x-youtube' || value.mimeType === 'video/mp4' || value.mimeType === 'application/pdf') {
                this.courseDetails.push(value);
                // console.log(this.courseDetails);
                } else {
                  this.resources.push(value);
                  // console.log(this.resources);
                }
              }
            } else if (value.hasOwnProperty('artifactUrl')) {
              if (value.mimeType === 'video/x-youtube' || value.mimeType === 'video/mp4'  || value.mimeType === 'application/pdf') {
                this.courseDetails.push(value);
                // console.log(this.courseDetails);
                } else {
                  this.resources.push(value);
                  // console.log(this.resources);
                }
            }
          }
        });
      }
    });
  }
  public fetchUrl(session) {
    this.showPromo = false;
    console.log(session.artifactUrl);
    let previewUrl;
    const url = session.artifactUrl.slice(17);
    if (session.mimeType === 'video/x-youtube') {
      console.log(_.includes(session.artifactUrl, 'watch'));
      if (_.includes(session.artifactUrl, 'watch')) {
        previewUrl = session.artifactUrl.replace('watch?v=', 'embed/');
        console.log(previewUrl);
      } else {
        previewUrl = 'https://www.youtube.com/embed/' + url;
        console.log(previewUrl);
      }
    } else {
      previewUrl = session.artifactUrl;
      console.log(previewUrl);
    }
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(previewUrl);

  }

  getBatchDetails() {
    if (!this.userService.loggedIn && this.resourceType === 'Course') {
      this.showLoginModal = true;
      this.baseUrl = '/' + 'learn' + '/' + 'course' + '/' + this.contentId;
    }
  }


}
