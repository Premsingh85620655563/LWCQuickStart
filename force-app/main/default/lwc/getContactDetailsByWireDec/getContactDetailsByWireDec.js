import { LightningElement , track , wire} from 'lwc';
import getContactRecords from '@salesforce/apex/getContactDetailsByWireDec.getContactRecords';
import createSaveRecords from '@salesforce/apex/getContactDetailsByWireDec.createSaveRecords';
import updateSaveRecords from '@salesforce/apex/getContactDetailsByWireDec.updateSaveRecords';
import { ShowToastEvent } from "lightning/platformShowToastEvent";

const columns = [
     { label: 'First Name' , fieldName: 'FirstName'},
     { label: 'Last Name' , fieldName: 'LastName'},
     {label: 'Email', fieldName: 'Email'},
     {label: 'Phone' , fieldName: 'Phone'}
];

export default class GetContactDetailsByWireDec extends LightningElement {

  @track ContactdataRecord = [];
  @track showNewForm = false;
  @track firstNameValue;
  @track lastNameValue;
  @track emailValue;
  @track phoneValue;
  @track selectedRows = [];

  columns = columns;

  @wire(getContactRecords)
  dataTableContact({ data, error }) {
      if (data) {
          this.ContactdataRecord = data;
      } else if (error) {
          console.log('error--->>>', error);
      }
  }
  
  handleRowSelection(event){
     this.selectedRows = event.detail.selectedRows;
  }

  handleNewClick() {
      this.showNewForm = !this.showNewForm;

      if(!this.showNewForm){
        !this.resetFormData();
      }
    
    }
    handleEditClick(){
        if(this.selectedRows.length > 1){
            this.dispatchEvent(
                new ShowToastEvent({
                   title:'error',
                   message:'Please select One Record in One Time.',
                   variant:'error'
                })
            );
        }
        
       if(this.selectedRows.length === 1){
        const selectedRecord = this.selectedRows[0];

        this.firstNameValue = selectedRecord.FirstName;
        this.lastNameValue = selectedRecord.LastName;
        this.emailValue = selectedRecord.Email;
        this.phoneValue = selectedRecord.Phone;
        this.showNewForm = true;
        console.log('Selected Record:--->',this.selectedRows[0]);
       }else{
       
    }
}

    resetFormData() {
        this.firstNameValue = '';
        this.lastNameValue = '';
        this.emailValue = '';
        this.phoneValue = '';
        }
    
    handleFirstNameChange(event) {
        this.firstNameValue = event.target.value;
        console.log('FirstName--->',this.firstNameValue);
  }

    handleLastNameChange(event){
        this.lastNameValue = event.target.value;
        console.log('LastName--->',this.lastNameValue);
  }

    handleEmailChange(event){
        this.emailValue = event.target.value;
        console.log('Email--->',this.emailValue);
 }

    handlePhoneChange(event){
        this.phoneValue = event.target.value;
        console.log('Phone--->',this.phoneValue);
 } 

 handleSaveClick() {
    const newContact = {
        FirstName: this.firstNameValue,
        LastName: this.lastNameValue,
        Email: this.emailValue,
        Phone: this.phoneValue
    };

    const updateContact = {
        Id: this.selectedRows[0].Id,
        FirstName: this.firstNameValue,
        LastName: this.lastNameValue,
        Email: this.emailValue,
        Phone: this.phoneValue
    };
    

    updateSaveRecords({updateContact:updateContact})
      .then(result =>{
        console.log('contact updated:',result);
        this.dispatchEvent(
            new ShowToastEvent({
                title:'Success',
                message:'Contact updated',
                variant : 'success'
            })
        );
      })
      this.resetFormData();
      this.showNewForm = false;
    if(updateContact.Id == Null){

  
    createSaveRecords({ newContact: newContact })
        .then(result => {
            console.log('Output Result', result);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Contact Created',
                    variant: 'success'
                })
            );
            this.resetFormData();
            this.showNewForm = false;
            this.ContactdataRecord = [...this.ContactdataRecord, result];
        })
        .catch(error => {
            console.error('Error creating contact record:', error);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'Contact not created. Please check the data and try again.',
                    variant: 'error'
                })
            );
        });
    }
}
    // .catch(error => {
    // console.error('Error creating contact record:', error);
    // this.dispatchEvent(
    // new ShowToastEvent({
    // title: "Error",
    // message: "Not Created",
    // variant: "error"
    // })
    // );
    // });
    
    
}



   


