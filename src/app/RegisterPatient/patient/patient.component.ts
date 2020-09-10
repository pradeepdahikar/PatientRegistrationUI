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
  _newDate: string = "";
  _patients: any = null;
  _form: FormGroup;
  _patient: Patient;
  _response: any = null;

  constructor(private _httpClinet: HttpClient,
    private datePipe: DatePipe,
    private fb: FormBuilder) {
    this.getStates();
    this._newDate = this.datePipe.transform(this._date, 'yyyy-MM-dd');
    this.createForm();
    this._patient = { Name: "", SurName: '', Gender: '', CityId: 0, DOB: null };
  }

  ngOnInit() {

  }

  getStates() {
    this._httpClinet.get("http://localhost:50672/api/States")
      .subscribe(
        response => {
          this._states = response;
        },
        (error: any) => { console.log(error) }
      )
  }

  getCities(stateId: number) {
    this._httpClinet.get("http://localhost:50672/api/Cities/" + stateId)
      .subscribe(
        response => {
          this._cities = response;
        }
      )
  }

  getPatients() {
    debugger;
    this._httpClinet.get("http://localhost:50672/api/GetPatient")
      .subscribe(
        response => {
          this._patients = response;
        }
      )
  }

  createForm() {
    this._form = this.fb.group({
      Name: ['', Validators.required],
      SurName: ['', [Validators.required, Validators.minLength(4)]],
      DOB: [''],
      Gender: [''],
      State: [''],
      City: ['']
    });
  }
  
  SavePatientData() {
    this._patient.Name = this._form.controls['Name'].value;
    this._patient.SurName = this._form.controls['SurName'].value;
    this._patient.DOB = this._form.controls['DOB'].value;
    this._patient.Gender = this._form.controls['Gender'].value;
    this._patient.CityId = this._form.controls['City'].value;
    let _body = JSON.stringify(this._patient);
    const _headers = new HttpHeaders().set('content-type', 'application/json');
    let options = {
      headers: _headers
    };
    debugger;
    this._httpClinet.post("http://localhost:50672/api/SavePatient",_body,options)
      .subscribe(
        data => {
          this._response = data;
        }
      );
  }

}
