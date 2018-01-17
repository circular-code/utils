"use strict";

var utils = {
    randomNumBetween: function(min, max) {
        if (typeof max === 'undefined'){
            console.log('max undefined');
            return;
        }
        if (typeof min === 'undefined'){
            min = 0;
        }
        return Math.floor(Math.random()*(max-min)+min);
    },
    generateData: function(count) {
        var i;
        var status = ['New', 'Canceled', 'Processing', 'Rejected', 'Approved', 'Work', 'Ready to Print', 'Printing', 'Printed', 'Diecut', 'Error'];
        var bereich = ['Std', 'RP', 'VK', 'EK', 'WMF', 'EST', 'DTI', 'DPT', 'DTS', 'CPC', 'MSI'];
        var batchName = ['In_Plo_ha', 'In_Hi', 'In_Da_te', 'In_Duk_nam','In_Zu','In_Ter_set','In_Dev_tx','In_In_out','In_In','In_In_in','In_Dx_tx'];
        var lack = ['Matt', 'Gloss'];
        var items = [],
            startDate = Date.parse('1/1/1975'),
            endDate = Date.parse('1/1/1992');
        for (i = 0; i < count; i++) {
            var date = new Date(randomNum(endDate,startDate));
            date.setHours(12);
            var item = {
                id: i + 1,
                Status: status[randomNum(status.length)],
                Bereich: bereich[randomNum(bereich.length)],
                BatchId:randomNum(3000,2000),
                BatchName: batchName[randomNum(batchName.length)],
                AnzahlJobs:randomNum(100),
                Auflage:randomNum(300),
                AnzahlBogen:randomNum(5000),
                Substrat: 'Ensocoat-' +randomNum(3000),
                Lack: lack[randomNum(lack.length)] + ' ' +randomNum(400000,200000),
                Erstelldatum: moment(date).format('L')
            };
            items.push(item);
        }
        return items;
     }
};

