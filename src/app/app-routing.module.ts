import { ngModuleJitUrl } from '@angular/compiler';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PatientComponent } from './RegisterPatient/patient/patient.component'

const routes: Routes = [
  {
    path: "PatientRegistration",
    component: PatientComponent
  }
]

@NgModule(
  {
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  }
)

export class AppRoutingModule {

}