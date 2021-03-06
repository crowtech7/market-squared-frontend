import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  currentUser: User = new User()
  userID: number;
  isUpdated: Boolean = false;

  constructor(private actRoute: ActivatedRoute, 
              private userService: UserService, 
              private router: Router) { }

  ngOnInit(): void {

    // Extract ID from URL
    this.userID = parseInt(this.actRoute.snapshot.paramMap.get('id'));
    console.log(this.userID);

    // Fetch user corresponding to the ID
    this.userService.getOneUser(this.userID).subscribe(response => {
      console.log(response);
      this.currentUser = response;
    });
  }

  gotoUser(){
    this.router.navigate([`/profile/${this.userID}`]);
  }

  gotoMyPosts(){
    this.router.navigate([`/myposts/${this.userID}`]);   
  }
  
  goHome(){
    this.router.navigateByUrl('/');
  }
  
  updateUser() {
    this.userService.updateUser(this.userID, this.currentUser).subscribe(response => {
      this.isUpdated = true;
      //console.log(this.userID);
    });
  }

  resetAlert() {
    this.isUpdated = false;
  }

  logoutUser = function () {
    localStorage.removeItem("token");
    this.router.navigateByUrl('/');
  }
}
