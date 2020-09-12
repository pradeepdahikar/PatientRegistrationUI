import { Component, OnInit } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Patient } from './../../Classes/CommonClasses';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms'

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})

export class PatientComponent implements OnInit {
  _states: any = null;
  _cities: any = null;
  _date: Date = new Date();
  _maxDate: string = "";
  _patients: any = null;
  _form: FormGroup;
  _patient: Patient;
  _response: any = null;
  _minDate: any = null;
  _inValidForm: boolean = false;

  constructor(private _httpClinet: HttpClient,
    private datePipe: DatePipe,
    private fb: FormBuilder) {
    this.getStates();
    this._maxDate = this.datePipe.transform(this._date, 'yyyy-MM-dd');
    var date = new Date();
    this._minDate = this.datePipe.transform(date.setFullYear(date.getFullYear() - 100), 'yyyy-MM-dd');
    console.log(date);
    this.createForm();
  }

  ngOnInit() {

  }

  getStates() {
    this._httpClinet.get("http://localhost:50672/api/Location/State")
      .subscribe(
        response => {
          this._states = response;
        },
        (error: any) => { console.log(error) }
      )
  }

  getCities(stateId: number) {
    this._httpClinet.get("http://localhost:50672/api/Location/City/" + stateId)
      .subscribe(
        response => {
          this._cities = response;
        }
      )
  }

  getPatients() {
    this._httpClinet.get("http://localhost:50672/api/Patient")
      .subscribe(
        response => {
          this._patients = response;
        }
      )
  }

  createForm() {
    this._form = this.fb.group({
      Name: ['', Validators.required],
      SurName: ['', [Validators.required]],
      DOB: ['', [Validators.required]],
      Gender: ['', [Validators.required]],
      State: ['', [Validators.required]],
      City: ['', [Validators.required]]
    });
  }

  SavePatientData() {
    debugger;
    if (this._form.invalid) {
      this._inValidForm = true
      return;
    }
    this._inValidForm = false;
    const patient = new Patient();
    patient.name = this._form.controls['Name'].value;
    patient.surName = this._form.controls['SurName'].value;
    patient.dob = this._form.controls['DOB'].value;
    patient.gender = this._form.controls['Gender'].value;
    patient.cityId = parseInt(this._form.controls['City'].value);
    const _headers = new HttpHeaders().set('content-type', 'application/json');
    let options = {
      headers: _headers
    };
    this._httpClinet.post("http://localhost:50672/api/Patient", patient, options)
      .subscribe(
        data => {
          this.getPatients();
          this._form.reset();
        },
        error=>{
          alert("Patient Details Already Exist.");
        }
      );
  }

  //Validate Data
  validateText(event: any) {
    return (event.charCode > 64 &&
      event.charCode < 91) || (event.charCode > 96 && event.charCode < 123);
  }

}
