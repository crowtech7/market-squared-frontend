import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Post } from '../../models/post';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-myposts',
  templateUrl: './myposts.component.html',
  styleUrls: ['./myposts.component.css']
})
export class MypostsComponent implements OnInit {
  posts: Post[] = [];
  userID: number;
  isLoggedIn: Boolean;
  currentUser: Number;
  jwt: String;

  constructor(private actRoute: ActivatedRoute, 
              private userService: UserService,
              private router: Router) { }

  ngOnInit(): void {

    //Assign token to a variable (jwt)
    this.jwt = localStorage.getItem("token");

    //Determines if user is logged in or not
    this.isLoggedIn = (this.jwt) ? true : false;

    //IF USER IS LOGGED IN, PULL USER DATA FROM TOKEN
    if (this.isLoggedIn == true) {
      //Separate the payload from the other items in the token
      let jwtData = this.jwt.split('.')[1];

      //Decode token and assign decoded content to 'decodedJwtData'
      let decodedJwtJsonData = atob(jwtData);
      let decodedJwtData = JSON.parse(decodedJwtJsonData);

      //Pull User ID from decoded payload
      this.currentUser = decodedJwtData.user_id;

      // Extract ID from URL
      this.userID = parseInt(this.actRoute.snapshot.paramMap.get('id'));
      //console.log(this.userID);

      // Fetch posts corresponding to the ID
      this.userService.getMyPosts(this.userID).subscribe(response => {
        console.log(response.posts);
        this.posts = response.posts;
      });


    }
  }

  gotoUser() {
    this.router.navigate([`/profile/${this.currentUser}`]);
  }

  gotoMyPosts() {
    this.router.navigate([`/myposts/${this.currentUser}`]);
  }

  goCreate() {
    this.router.navigate([`/create/${this.currentUser}`]);
  }

  goHome() {
    this.router.navigateByUrl('/');
  }

  logoutUser() {
    localStorage.removeItem("token");
    this.router.navigateByUrl('/');
  }

}

