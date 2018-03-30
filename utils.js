"use strict";

var utils = {
    randomNumBetween: function(max, min) {
        if (typeof max === 'undefined'){
            console.log('max undefined');
            return false;
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
            var date = new Date(utils.randomNumBetween(endDate, startDate));
            date.setHours(12);
            var item = {
                id: i + 1,
                Status: status[utils.randomNumBetween(status.length)],
                Bereich: bereich[utils.randomNumBetween(bereich.length)],
                BatchId: utils.randomNumBetween(3000,2000),
                BatchName: batchName[utils.randomNumBetween(batchName.length)],
                AnzahlJobs: utils.randomNumBetween(100),
                Auflage: utils.randomNumBetween(300),
                AnzahlBogen: utils.randomNumBetween(5000),
                Substrat: 'Ensocoat-' +utils.randomNumBetween(3000),
                Lack: lack[utils.randomNumBetween(lack.length)] + ' ' + utils.randomNumBetween(400000,200000),
                Erstelldatum: moment(date).format('L')
            };
            items.push(item);
        }
        return items;
     },
     /**
     * Transforms URL Strings to Javascript Object; currently only works with flat objects.
     * @param {string} urlString URL String Parameter in the form of "abc=foo&def=%5Basf%5D&xyz=5"
     * @return {object} This returns an Javascript Object like {a:"foo",def:"[asf],xyz:5"}
     */
    urlStringToObject: function(urlString) {
        var obj = JSON.parse('{"' + decodeURI(urlString).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
        return obj;
    },
    /**
     * Transforms Strings that contain Numbers into real Numbers.
     * @param {string} numberString which contains a number e.g. "5" or "5.4"
     * @return {number} This returns the number representation of the string e.g 5 or 5.4, returns false when it couldnt convert the string
     */
    stringToNumber: function(numberString) {
        if (!isNaN(numberString)) {
            return +numberString;
        }
        else {
            return false;
        }
    },
    trimAndEncode: function(obj) {

        if (typeof obj === 'object'){

            if (utils.specialTypeOf(obj) === 'array' ) {
                obj.forEach(function(elem, index) {
                    obj[index] = utils.trimAndEncode(elem);
                })
            }
            else if (utils.specialTypeOf(obj) === 'object') {
                for (var key in obj) {
                    if (obj.hasOwnProperty(key))
                        obj[key] = utils.trimAndEncode(obj[key]);
                }
            }
        }
        else if (typeof obj === 'string') {
            obj = obj.trim();
            obj = charHandler.encodeHtmlSpecialCharacters(obj);
        }

        //else if (typeof obj === 'number' || typeof obj === 'boolean' || typeof obj === 'undefined' || typeof obj === 'function' ) -> do nothing
        return obj;
    },
     decodeHtmlSpecialCharacters: function(value){
        if(value === null || typeof value === "undefined")
            return null;

        return value.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    },
    encodeHtmlSpecialCharacters: function(string) {
        return String(string).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    },
    insertAfter: function(newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    },
    specialTypeOf: function(obj) {
        return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
    },
    serialize: function (form) {
        if (!form || form.nodeName !== "FORM") {
                return;
        }
        var i, j, q = [];
        for (i = form.elements.length - 1; i >= 0; i = i - 1) {
            if (form.elements[i].name === "") {
                continue;
            }
            switch (form.elements[i].nodeName) {
                case 'INPUT':
                    switch (form.elements[i].type) {
                        case 'text':
                        case 'tel':
                        case 'email':
                        case 'hidden':
                        case 'password':
                        case 'button':
                        case 'reset':
                        case 'submit':
                            q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
                            break;
                        case 'checkbox':
                        case 'radio':
                            if (form.elements[i].checked) {
                                    q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
                            }                                               
                            break;
                    }
                    break;
                    case 'file':
                    break; 
                case 'TEXTAREA':
                        q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
                        break;
                case 'SELECT':
                    switch (form.elements[i].type) {
                        case 'select-one':
                            q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
                            break;
                        case 'select-multiple':
                            for (j = form.elements[i].options.length - 1; j >= 0; j = j - 1) {
                                if (form.elements[i].options[j].selected) {
                                        q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].options[j].value));
                                }
                            }
                            break;
                    }
                    break;
                case 'BUTTON':
                    switch (form.elements[i].type) {
                        case 'reset':
                        case 'submit':
                        case 'button':
                            q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
                            break;
                    }
                    break;
                }
            }
        return q.join("&");
    },
    /* fisher-yates shuffle */
    shuffle: function(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    },
};

