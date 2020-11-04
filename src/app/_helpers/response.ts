import { Injectable } from '@angular/core';

@Injectable()
export class ResponseDescription {
    constructor() { }

    description = {
        '000000': 'Success',
        111111: 'Failed',
        100017: 'Unauthorized Request (No token)',
        100018: 'Invalid Token.',
        100019: 'Token Expired',
        100020: 'Incomplete Parameters.',
        100021: 'Required Fields cannot be empty.',
        100022: 'Username does not exist.',
        100023: 'Incorrect Password.',
        100024: 'New and old password cannot be the same.',
        100025: 'New password cannot be blank..',
        100026: 'Old password cannot be blank.',
        100027: 'Wrong old password.',
        100028: 'Device ID is not registered to user.',
        100029: 'Invalid username for the token provided.',
        100030: 'Authentication failed.',
        100031: 'Permission Denied.',
        100032: 'Branchname and Branchid does not match.',
        100033: 'Parent username and Partnerid does not match.',
        100034: 'From date cannot be after To date.',
        100035: 'Cannot pull records more than 31 days from now.',
        100036: 'Username and Partnerid does not match.',
        100037: 'Invalid runmode.',
        100038: 'Username already exists.',
        100039: 'Partnername/Partnerid already exists.',
        100040: 'Cannot add permission to dealer to level user.',
        100041: 'Giver must be parent or parent of parent.',
        100042: 'Telco not granted to giver.',
        100043: 'Brand not granted to giver.',
        100044: 'No granted permission to giver.',
        100045: 'Wrong telco and brand combination.',
        100046: 'Insufficient Wallet Balance.',
        100047: 'Invalid Device ID.',
        100048: 'General Catch Error',
        SUCCESS: 'Success',
        FAILED: 'failed',
    };

    getDescription(respCode: any) {
        return this.description[respCode];
    }

    getMessage(type: any, value: any) {
        let msg = '';
        if (type === 'sales') {
            // tslint:disable-next-line: max-line-length
            msg = '<span class="head-alert"><b>Transaction Ref:</b></span> <span class="body-alert">' + value.transactionid + '</span> </br>' +
            '<span class="head-alert"><b>Date:</b></span> <span class="body-alert">' + value.transactiondate + '</span> </br>' +
            '<span class="head-alert"><b>Type:</b></span> <span class="body-alert">' + value.brand + '</span> </br>' +
            '<span class="head-alert"><b>Amount:</b></span> <span class="body-alert">' + value.amount + '</span> </br>' +
            '<span class="head-alert"><b>Trace Number:</b></span> <span class="body-alert">' + value.topuptrace + '</span> </br>' +
            '<span class="head-alert"><b>Target Number:</b></span> <span class="body-alert">' + value.targetmsisdn + '</span> </br>' +
            '<span class="head-alert"><b>Product Code:</b></span> <span class="body-alert">' + value.productcode + '</span> </br>' ;
          } else if (type === 'wallet') {
            msg =
            '<span class="head-alert"><b>Date:</b></span> <span class="body-alert"> ' + value.transdate + '</span></br>' +
            '<span class="head-alert"><b>TxID:</b></span> <span class="body-alert"> ' + value.transid + '</span> </br>' +
            '<span class="head-alert"><b>Amount:</b></span> <span class="body-alert"> ' + value.amount + '</span> </br>' +
            '<span class="head-alert"><b>Sender:</b></span> <span class="body-alert"> ' + value.sender + '</span> </br>' +
            // tslint:disable-next-line: max-line-length
            '<span class="head-alert"><b>Sender Start Bal:</b></span> <span class="body-alert"> ' + value.sender_start_bal + '</span> </br>' +
            '<span class="head-alert"><b>Sender End Bal:</b></span> <span class="body-alert"> ' + value.sender_end_bal + '</span> </br>' +
            '<span class="head-alert"><b>Receiver:</b></span> <span class="body-alert"> ' + value.receiver + '</span> </br>' +
            // tslint:disable-next-line: max-line-length
            '<span class="head-alert"><b>Receiver Start Bal:</b></span> <span class="body-alert"> ' + value.receiver_start_bal + '</span> </br>' +
            // tslint:disable-next-line: max-line-length
            '<span class="head-alert"><b>Receiver End Bal:</b></span> <span class="body-alert"> ' + value.receiver_end_bal + '</span> </br>' ;
          } else if (type === 'bills') {
            msg =
            '<span class="head-alert"><b>Date:</b></span> <span class="body-alert"> ' + value.transaction_date + '</span></br>' +
            '<span class="head-alert"><b>TxID:</b></span> <span class="body-alert"> ' + value.transactionid + '</span> </br>' +
            '<span class="head-alert"><b>Amount:</b></span> <span class="body-alert"> ' + value.amount + '</span> </br>' +
            '<span class="head-alert"><b>Biller:</b></span> <span class="body-alert"> ' + value.biller_code + '</span> </br>' +
            // tslint:disable-next-line: max-line-length
            '<span class="head-alert"><b>Account No:</b></span> <span class="body-alert"> ' + value.account_number + '</span> </br>' +
            '<span class="head-alert"><b>Servicee Fee:</b></span> <span class="body-alert"> ' + value.service_fee + '</span> </br>' +
            '<span class="head-alert"><b>Receipt Validation No:</b></span> <span class="body-alert"> ' + value.receipt_validation_no + '</span> </br>' +
            // tslint:disable-next-line: max-line-length
            '<span class="head-alert"><b>Partner Name:</b></span> <span class="body-alert"> ' + value.partnername + '</span> </br>' +
            // tslint:disable-next-line: max-line-length
            '<span class="head-alert"><b>Brand:</b></span> <span class="body-alert"> ' + value.brand + '</span> </br>' ;
          } else if (type === 'epins') {
            msg =
            '<span class="head-alert"><b>Date:</b></span> <span class="body-alert"> ' + value.transactiondate + '</span></br>' +
            '<span class="head-alert"><b>TxID:</b></span> <span class="body-alert"> ' + value.transactionid + '</span> </br>' +
            '<span class="head-alert"><b>Amount:</b></span> <span class="body-alert"> ' + value.amount + '</span> </br>' +
            '<span class="head-alert"><b>Product:</b></span> <span class="body-alert"> ' + value.productcode + '</span> </br>' +
            // tslint:disable-next-line: max-line-length
            '<span class="head-alert"><b>Epins:</b></span> <span class="body-alert"> ' + value.epin + '</span> </br>' +
            '<span class="head-alert"><b>Discount Amount:</b></span> <span class="body-alert"> ' + value.discount_amount + '</span> </br>' +
            '<span class="head-alert"><b>MSISDN:</b></span> <span class="body-alert"> ' + value.msisdn + '</span> </br>' +
            // tslint:disable-next-line: max-line-length
            '<span class="head-alert"><b>Partner Name:</b></span> <span class="body-alert"> ' + value.partnername + '</span> </br>' +
            // tslint:disable-next-line: max-line-length
            '<span class="head-alert"><b>Brand:</b></span> <span class="body-alert"> ' + value.brand + '</span> </br>' ;
          }

        return msg;
    }

    getBrand(tel) {
        tel = tel.toLowerCase();
        if (tel.includes('smart')) {
            return 'smart';
        } else if (tel.includes('globe')) {
            return 'globe';
        } else if (tel.includes('sun')) {
            return 'sun';
        } else if (tel.includes('tnt')) {
            return 'tnt';
        } else if (tel.includes('tm')) {
            return 'tm';
        } else if (tel.includes('cignal')) {
            return 'cignal';
        } else if (tel.includes('meralco')) {
            return 'meralco';
        } else if (tel.includes('pldt')) {
            return 'pldt';
        } else if (tel.includes('cwilc')) {
            return 'cwilc';
        }
    }

    translateBrand(tel) {
        tel = tel.toLowerCase();
        if (tel.includes('TNT')) {
            return 'Talk and Text';
        } else {
            return tel;
        }
    }

    statusDescription(status) {
        if(status === '1') {
            return 'Loading Successful.'
        } else {
            return 'Loading Failed (code: ' + status + ')';
        }
    }

    paymentDescription(status, msg) {
        if(status === '1') {
            return msg;
        } else {
            return msg + ' (code: ' + status + ')';
        }
    }
}
