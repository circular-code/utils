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
    nodelistToArray: function(nodelist) {
        return [].slice.call(nodelist);
    },
    // only works with primitives inside passedObject keys, the object only has one layer
    cloneFlatDataObject: function(passedObject) {
        if (!obj instanceof Object)
            return obj;
        
        var copy = obj.constructor();
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
        }
        return copy;
    },
    cloneFlatDataArray: function(arr) {
        return arr.slice(0);
    },
    // es6 only, slow
    cloneFlatObject: function(obj) {
        return Object.assign({}, obj);
    },
    // This method will fail to copy anything that is not part of the JSON spec, but it can be used for simple data
    cloneData : function(objOrArray) {
         return JSON.parse(JSON.stringify(objOrArray));
    },
    cloneObject : function(o) {
        const gdcc = "__getDeepCircularCopy__";
        if (o !== Object(o)) {
            return o; // primitive value
        }

        var set = gdcc in o,
            cache = o[gdcc],
            result;
        if (set && typeof cache == "function") {
            return cache();
        }
        // else
        o[gdcc] = function() { return result; }; // overwrite
        if (o instanceof Array) {
            result = [];
            for (var i=0; i<o.length; i++) {
                result[i] = cloneDR(o[i]);
            }
        } else {
            result = {};
            for (var prop in o)
                if (prop != gdcc)
                    result[prop] = cloneDR(o[prop]);
                else if (set)
                    result[prop] = cloneDR(cache);
        }
        if (set) {
            o[gdcc] = cache; // reset
        } else {
            delete o[gdcc]; // unset again
        }
        return result;
    },
    cloneArray: function() {
        // cloneobject deep foreach index
    },
    // workaround for chrome 1.005toFixed(2) rounds to 1.00 instead of 1.01
    roundTo: function(n, digits) {
        if (typeof digits === 'undefined')
            digits = 0;

        var multiplicator = Math.pow(10, digits);
        n = parseFloat((n * multiplicator).toFixed(11));
        return Math.round(n) / multiplicator;
    },
    regexPatterns: {
        name: /^[A-z\u00C0-\u00ff0-9-_ .]+$/,
    },
    parseQueryString: function (query) {
        var vars = query.split("&");
        var query_string = {};
        for (var i = 0; i < vars.length; i++) {
          var pair = vars[i].split("=");
          var key = decodeURIComponent(pair[0]);
          var value = decodeURIComponent(pair[1]);
          // If first entry with this name
          if (typeof query_string[key] === "undefined") {
            query_string[key] = decodeURIComponent(value);
            // If second entry with this name
          } else if (typeof query_string[key] === "string") {
            var arr = [query_string[key], decodeURIComponent(value)];
            query_string[key] = arr;
            // If third or later entry with this name
          } else {
            query_string[key].push(decodeURIComponent(value));
          }
        }
        return query_string;
    },
    percievedBrightness: function(colorObj) {
        return Math.sqrt(
            colorObj.r * colorObj.r * 0.241 +
            colorObj.g * colorObj.g * 0.691 +
            colorObj.b * colorObj.b * 0.068);
    },
    blackOrWhite: function(color) {
        return utils.percievedBrightness(color) < 130 ? 'white' : 'black';
    },
    isOdd: function(n) {
        //return n % 2 === 1;
        //abs is neccecary because modulo would otherwise return incorrect for negative numbers (e.g -5)
        return Math.abs(n % 2) === 1;
        // can not be written like this
        // return n % 2 !== 0;
	// since it will return true on floats e.g. 2.1
    },
    getCustomGlobals: function() {
        document.body.appendChild(document.createElement('div')).innerHTML='<iframe id="__getCustomGlobals__" style="display:none"></iframe>';
        for (a in window) if (!(a in window.frames[window.frames.length-1]))
            // hides function, logs rest
			if (typeof window[a] !== 'function')
            	console.log(a, window[a])
        document.body.removeChild($$('#__getCustomGlobals__')[0].parentNode)
    },
    sortByIndex: function(data, index) {

        // sort descending by index

        if (!index)
            throw new Error('Es wurde kein Index an utils.sortByIndex übgergeben');

        if (data instanceof Array) {

            return data.sort(function(a, b) {
                if (typeof a[index] === 'undefined') {
                    if (typeof b[index] === 'undefined')
                        return 0;
                    else
                        return 1;
                }
                else if (typeof b[index] === 'undefined')
                    return -1;
                return a[index] - b[index];
            });
        }
        else {
            utils.toast('Produkt konnte nicht geladen werden.');
            throw new Error('Es wurde kein gültiges Array an utils.sortByIndex übergeben.');
        }
    },
    isEmpty: function(value) {
        if (typeof value !== 'object' || value === null) {
            return utils.isEmptyValueType(value);
        } else {
            return utils.isEmptyReferenceType(value);
        }
    },
    isEmptyValueType: function (value) {
        return value === undefined || value === null || value === "";
    },
    isEmptyReferenceType: function (value) {
        for (var key in value) {
            if (value.hasOwnProperty(key))
                return false;
        }
        return true;
    },
    bytesToDescriptive: function(bytes, addition) {
        if (typeof bytes !== 'number' || bytes !== bytes)
            return '';
        if (bytes === 0)
            return '0' + (addition || '');

        var m = 1024;
        var sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        var i = Math.floor(Math.log(bytes) / Math.log(m));

        return parseFloat((bytes / Math.pow(m, i)).toFixed(1)) + ' ' + sizes[i] + (addition || '');
    },
    getReadableMimetypes: function(mimeTypesString) {
        if (typeof mimeTypesString !== 'string') {
            return '';
        }

        if (mimeTypesString.indexOf('|') > -1) {
            var mimeTypesArray = mimeTypesString.split('|');

            for (var i = 0; i < mimeTypesArray.length; i++) {
                if (mimeTypesArray[i].indexOf('/') > -1)
                    mimeTypesArray[i] = ' ' + mimeTypesArray[i].split('/')[1].toUpperCase();
                else
                    mimeTypesArray[i] = ' Invalid Mime Type';
            }
            return mimeTypesArray.join(',');
        }
        else {
            if (mimeTypesString.indexOf('/') > -1)
                return ' ' + mimeTypesString.split('/')[1].toUpperCase();
            else
                return '';
        },
    },
    convertNormalNumberToRomanNumber: function (n) {
	var romanNumbersLookup = {
	    '1': 'I',
	    '4': 'IV',
	    '5': 'V',
	    '9': 'IX',
	    '10': 'X',
	    '40': 'XL',
	    '50': 'L',
	    '90': 'XC',
	    '100': 'C',
	    '400': 'CD',
	    '500': 'D',
	    '900': 'CM',
	    '1000': 'M',
	};

	var romanNumbers = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
	var i = 0;
	var string = '';

	while (i < 13) {
		if (n - romanNumbers[i] < 0) {
			i++;
		}
		else {
			string += romanNumbersLookup[romanNumbers[i]];
			n = n - romanNumbers[i];
		}
	}
	return string;
    }
};

