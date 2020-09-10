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
      SurName: ['', [Validators.required, Validators.minLength(4)]],
      DOB: [''],
      Gender: [''],
      State: [''],
      City: ['']
    });
  }

  SavePatientData() {
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
    debugger;
    this._httpClinet.post("http://localhost:50672/api/Patient", patient, options)
      .subscribe(
        data => {
          debugger;
          this._response = data;
        }
      );
  }

}
