import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlgorithmGuard } from './algorithm-guard';
import { AlgorithmPageComponent } from './algorithm-page/algorithm-page.component';
import { AboutContentComponent } from './home-page/about-content/about-content.component';
import { AlgorithmContentComponent } from './home-page/algorithm-content/algorithm-content.component';
import { FeedbackContentComponent } from './home-page/feedback-content/feedback-content.component';
import { HomeContentComponent } from './home-page/home-content/home-content.component';
import { HomePageComponent } from './home-page/home-page.component';


const routes: Routes = [
  { path: '', component: HomePageComponent, children: [
    {
      path: '',
      component: HomeContentComponent
    },
    {
      path: 'about',
      component: AboutContentComponent
    },
    {
      path: 'algorithms',
      component: AlgorithmContentComponent
    },
    {
      path: 'feedback',
      component: FeedbackContentComponent
    },
  ]},
  { path: 'algorithm', component: AlgorithmPageComponent, canActivate: [AlgorithmGuard] },
  { path: '**', component: HomePageComponent },  // Wildcard route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
