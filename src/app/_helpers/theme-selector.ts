import { Injectable } from '@angular/core';

@Injectable()
export class SelectTheme {

    public title = ['Telco e-Load','Gaming Pins','ePins','Market Place', 'Bills Payment','Remittance','Travel and Booking',
    'Loans','Government Billers','Report History'];
    public url = ['/e-load','/gaming-pins','/e-pins','/market-place','/bills-payment','/remittance','/travel-and-booking',
    '/travel-and-booking','/government-billers','/report-history'];
    public icon = ['../assets/img/menu-icons/mobile.svg', '../assets/img/menu-icons/controller.svg',
    '../assets/img/menu-icons/poptv.png', '../assets/img/menu-icons/store.svg', '../assets/img/menu-icons/bills.svg', '../assets/img/menu-icons/remittance.svg', 
    '../assets/img/menu-icons/travel.svg', '../assets/img/menu-icons/loan.svg', '../assets/img/menu-icons/government.svg', 
    '../assets/img/menu-icons/report.svg'];

    constructor() { }

    getLogo(type) {
        let themeData = {};
        if(type === 'theme-peso'){
            themeData['banner'] = 'assets/img/peso_logo_banner.png';
            themeData['filename'] = 'device_id_PESO(do_not_delete_or_move).xlsx'
            return themeData;
        } else if(type === 'theme-clickstore'){
            themeData['banner'] = 'assets/img/Click_Store.png';
            themeData['filename'] = 'device_id_CLICKSTORE(do_not_delete_or_move).xlsx'
            return themeData;
        } else if(type === 'theme-vitalize') {
            themeData['banner'] = 'assets/img/vitalize-logo.jpg';
            themeData['filename'] = 'device_id_VITALIZE(do_not_delete_or_move).xlsx'
            return themeData;
        }
    }

    historyMenu(theme) {
        let menu = [];
        if(theme === 'theme-peso'){
            menu = [
                {title : 'Sales History', val : 'sales', activated: true},
                {title : 'Wallet History', val : 'wallet', activated: true},
                {title : 'Bills Payment History', val : 'bills', activated: true},
                {title : 'ePins History', val : 'epins', activated: true}
            ]
            return menu;
        } else if(theme === 'theme-clickstore'){
            menu = [
                {title : 'Sales History', val : 'sales', activated: true},
                {title : 'Wallet History', val : 'wallet', activated: true},
                {title : 'Bills Payment History', val : 'bills', activated: false},
                {title : 'ePins History', val : 'epins', activated: false}
            ]
            return menu;
        } else if(theme === 'theme-vitalize') {
            menu = [
                {title : 'Sales History', val : 'sales', id: 1, activated: true},
                {title : 'Wallet History', val : 'wallet', id: 2, activated: true},
                {title : 'Bills Payment History', val : 'bills', id: 3, activated: false},
                {title : 'ePins History', val : 'epins', id: 4, activated: false}
            ]
            return menu;
        }
    }
    homeMenu(theme){
        let menu = [];
        let grey = [];
        let activated = [];
        if(theme === 'theme-peso'){
            grey = [false,true,true,false,true,true,true,true,true,false];
            activated = [true,true,true,true,true,true,true,true,true,true];
        } else if(theme === 'theme-clickstore'){
            grey = [false,true,true,false,true,true,true,true,true,false];
            activated = [true,true,true,true,true,true,true,true,true,true];
        } else if(theme === 'theme-vitalize') {
            grey = [false,true,true,true,true,true,true,true,true,false];
            activated = [true,false,false,false,false,false,false,false,false,true];
        }
        for(let i = 0; i <= 8; i++){
            if(activated[i] == true) {
                let obj = {
                    title: this.title[i],
                    url: this.url[i],
                    icon: this.icon[i],
                    grey: grey[i],
                };
                menu.push(obj);
            }
        }
        return menu;
    }
}
