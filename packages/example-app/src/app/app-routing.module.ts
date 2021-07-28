import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        redirectTo:'validation-messages',
        pathMatch:'full'
    },
    {
    path: 'validation-messages',
    loadChildren:  () =>
      import(
        './validation-messages-page/validation-message-page.module'
      ).then((m) => m.ValidationMessagePageModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
