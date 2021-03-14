import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { environment } from '../environments/environment';
import p from '../../package.json';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent {

  version = p.version;
  environment = environment;
  
  public appPages = [];

  constructor(
    private router: Router,
    public navCtrl: NavController,
    public authService: AuthService
  ) {
    this.authService.onAuthChange.subscribe(() => this.initializeApp())
    this.authService.onRefresh.subscribe(() => this.setAppPages())
    this.initializeApp();
  }

  async initializeApp() {
    await this.authService.init();
    this.setAppPages();
    console.log("this.router.url: ", this.router.url);
    if (this.router.url == "/start"
    || this.router.url == "/login"
    || this.router.url == "/login?login=true") {
      // Do Nothing...
    } else if (this.appPages.length > 0) {
      this.navCtrl.navigateRoot(this.appPages[0].url);
    } else {
      if(this.router.url == "/") {
        this.navCtrl.navigateRoot("start");
      }
    }
  }

  setAppPages() {
    this.appPages = [];
    this.authService.user.groups.forEach((group) => {
      this.appPages.push({
        title: group.name,
        url: `p/${group.slug}`,
        icon: group.icon
      })
    });
  }

}
