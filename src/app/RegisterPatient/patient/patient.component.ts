import { Component, OnInit } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Patient } from '../../Classes/Patient';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms'

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})

export class PatientComponent {
  form: FormGroup;
  date: Date = new Date();
  maxDate: string = "";
  patients: any = null;
  patient: Patient;
  response: any = null;
  minDate: string ="";
  inValidData: boolean = false;
  states: any = null;
  cities: any = null;

  constructor(private _httpClinet: HttpClient,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder) {
    this.getStatesList();
    var date = new Date();
    this.maxDate = this.datePipe.transform(this.date, 'yyyy-MM-dd');
    this.minDate = this.datePipe.transform(date.setFullYear(date.getFullYear() - 100), 'yyyy-MM-dd');
    this.createForm();
  }

  getStatesList() {
    this._httpClinet.get("http://localhost:50672/api/Location/State")
      .subscribe(
        response => {
          this.states = response;
        },
        (error: any) => { console.log(error) }
      )
  }

  getCityByStateId(stateId: number) {
    this._httpClinet.get("http://localhost:50672/api/Location/City/" + stateId)
      .subscribe(
        response => {
          this.cities = response;
        }
      )
  }

  getPatientsList() {
    this._httpClinet.get("http://localhost:50672/api/Patient")
      .subscribe(
        response => {
          this.patients = response;
        }
      )
  }

  createForm() {
    this.form = this.formBuilder.group({
      Name: ['', Validators.required],
      SurName: ['', [Validators.required]],
      DOB: ['', [Validators.required]],
      Gender: ['', [Validators.required]],
      State: ['', [Validators.required]],
      City: ['', [Validators.required]]
    });
  }

  RegisterPatient() {
    if (this.form.invalid) {
      this.inValidData = true
      return;
    }
    this.inValidData = false;
    const patient = new Patient();
    patient.name = this.form.controls['Name'].value;
    patient.surName = this.form.controls['SurName'].value;
    patient.dob = this.form.controls['DOB'].value;
    patient.gender = this.form.controls['Gender'].value;
    patient.cityId = parseInt(this.form.controls['City'].value);
    const jsonHeader = new HttpHeaders().set('content-type', 'application/json');
    let _headers = {
      headers: jsonHeader
    };
    this._httpClinet.post("http://localhost:50672/api/Patient", patient, _headers)
      .subscribe(
        data => {
          this.getPatientsList();
          this.form.reset();
        },
        error => {
          alert("Patient is already registered.");
        }
      );
  }

  validateData(event: any) {
    return (event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123);
  }
}
