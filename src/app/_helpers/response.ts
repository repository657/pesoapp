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
    };

    getDescription(respCode: any) {
        return this.description[respCode];
    }
}
