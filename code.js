var file = {}
details = document.getElementById("details")
var slotnames = [];
var slotlimits = {};
var students = [];
var slotalum = {}

var newyearslotnames = []
var newyearnewslots = []

var rejected = [];
var slotstds = {}
var slotwls = {}
var maxwl = 15; /* slot waitlist max*/

class Stud{
    constructor(name,first,second,third,current,time){
        this.name = name;
        this.first = first;
        this.second = second;
        this.third = third;
        this.current = current;
        this.time = time;
    }
    checkalum(){
        if (this.current == slotalum[this.first]){
            this.time = -1;
            this.name = 'P.' + this.name;
        }
    }

    assign(){
        if (this.time == -1) slotstds[this.first].push(this.name);

        else if (this.first != '' && slotstds[this.first].length < slotlimits[this.first]) slotstds[this.first].push(this.name);

        else if (this.second != '' && slotstds[this.second].length < slotlimits[this.second]){
            if (this.first != '' && slotwls[this.first].length < maxwl) slotwls[this.first].push(this.name);
            slotstds[this.second].push(this.name);
        }
        else if (this.third != '' && slotstds[this.third].length < slotlimits[this.third]){
            if (this.first != '' && slotwls[this.first].length < maxwl) slotwls[this.first].push(this.name);
            if (this.second != '' && slotwls[this.second].length < maxwl) slotwls[this.second].push(this.name);
            slotstds[this.third].push(this.name);
        }
        else{
            if (this.first != '' && slotwls[this.first].length < maxwl) slotwls[this.first].push(this.name);
            if (this.second != '' && slotwls[this.second].length < maxwl) slotwls[this.second].push(this.name);
            if (this.third != '' && slotwls[this.third].length < maxwl) slotwls[this.third].push(this.name);
            rejected.push(this.name);
        }
    }
}

function Upload() {
    //Reference the FileUpload element.
    var fileUpload = document.getElementById("file");

    //Validate whether File is valid Excel file.
    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xls|.xlsx)$/;
    //if (regex.test(fileUpload.value.toLowerCase())) {
    if (typeof (FileReader) != "undefined") {
        var reader = new FileReader();

        //For Browsers other than IE.
        if (reader.readAsBinaryString) {
            reader.onload = function (e) {
                ProcessExcel(e.target.result);
            };
            reader.readAsBinaryString(fileUpload.files[0]);
        } else {
            //For IE Browser.
            reader.onload = function (e) {
                var data = "";
                var bytes = new Uint8Array(e.target.result);
                for (var i = 0; i < bytes.byteLength; i++) {
                    data += String.fromCharCode(bytes[i]);
                }
                ProcessExcel(data);
            };
            reader.readAsArrayBuffer(fileUpload.files[0]);
        }
    } else {
        alert("This browser does not support HTML5.");
    }
    //} else {
    //    alert("Please upload a valid Excel file.");
    //}
};

function ProcessExcel(data) {
    details.style.display = "block";
    document.getElementById("sort").style.display = "block";

    var workbook = XLSX.read(data, {
        type: 'binary'
    });

    var firstSheet = workbook.SheetNames[0];

    file = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[firstSheet]);

    for (var i = 0; i<file.length; i++){
        var row = file[i];

        var name = '';
        var first = '';
        var second = '';
        var third = '';
        var current = '';

        for (let session in row) {
            if (session.toLowerCase().includes("current")){
                current = row[session].split(" (")[0];
                if (["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].includes(row[session].slice(0,3)) && !slotnames.includes(row[session])){
                    slotnames.push(row[session].split(" (")[0]);
                }
            }else if (session.toLowerCase().includes("first")){
                first = row[session].split(" (")[0];
                if (["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].includes(row[session].slice(0,3)) && !newyearslotnames.includes(row[session].split(" (")[0])){
                    newyearslotnames.push(row[session].split(" (")[0]);
                }
            }else if (session.toLowerCase().includes("second")){
                second = row[session].split(" (")[0];
                if (["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].includes(row[session].slice(0,3)) && !newyearslotnames.includes(row[session].split(" (")[0])){
                    newyearslotnames.push(row[session].split(" (")[0]);
                }
            }else if (session.toLowerCase().includes("third")){
                third = row[session].split(" (")[0];
                if (["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].includes(row[session].slice(0,3)) && !newyearslotnames.includes(row[session].split(" (")[0])){
                    newyearslotnames.push(row[session].split(" (")[0]);
                }
            }else if (session.toLowerCase().includes("name")){
                name = row[session];
            }
        }
        var student = new Stud(name,first,second,third,current,i+1);
        students.push(student);
    }

    /*for (var i = 0; i < newyearslotnames.length; i++){
        slotnotnew = false;
        for (var l = 0; l < slotnames.length; l++){
            if (newyearslotnames[i].includes(slotnames[l])){
                slotnotnew = true;
                break;
            }
            
        }
        
        if (!slotnotnew){
            slotnames.push(newyearslotnames[i]);
            newyearnewslots.push(newyearslotnames[i]);
        }

    }

    for (let slot in slotnames){
        slotnotgone = false;

        slotoption = document.createElement("tr");

        slotname = document.createElement("td");
        newslotname = document.createElement("td");
        newslotnameinput = document.createElement("select");
        limit = document.createElement("td");
        limitinput = document.createElement("input")

        limit.classList.add("limits");
        limitinput.type = "number";
        limitinput.value = 10;
        limitinput.min = "1";
        limitinput.max = "30";
        limitinput.id = "limit" + slot;

        for (var i = 0; i < newyearslotnames.length; i++){
            opt = document.createElement("option");
            opt.textContent = newyearslotnames[i];
            opt.value = newyearslotnames[i];
            newslotnameinput.appendChild(opt);

            if (newyearslotnames[i].includes(slotnames[slot])){
                slotnotgone = true;
                newslotnameinput.selectedIndex = i;
            }else{

            }
        }
        if (!newyearnewslots.includes(slotnames[slot])){
            slotname.innerHTML = slotnames[slot];
        }else{
            slotname.innerHTML = "-"
        }
        
        newslotname.appendChild(newslotnameinput);
        limit.appendChild(limitinput);

        if (!slotnotgone){
            newslotname.classList.add("slotgone");
        }

        slotoption.appendChild(slotname);
        slotoption.appendChild(newslotname);
        slotoption.appendChild(limit);

        details.appendChild(slotoption);
    }
    */

    for (let slot in newyearslotnames){
        slotnotgone = false;

        slotoption = document.createElement("tr");

        slotname = document.createElement("td");
        oldslotname = document.createElement("td");
        oldslotnameinput = document.createElement("select");
        limit = document.createElement("td");
        limitinput = document.createElement("input")

        limit.classList.add("limits");
        limitinput.type = "number";
        limitinput.value = 10;
        limitinput.min = "1";
        limitinput.max = "30";
        limitinput.id = "limit" + slot;


        opt = document.createElement("option");
        opt.textContent = "NEW";
        opt.value = "NEW";
        oldslotnameinput.appendChild(opt);
        oldslotnameinput.selectedIndex = 0;
        oldslotnameinput.id = "alum" + slot;

        /*below is code for making option dropdown for picking old slots*/
        for (var i = 0; i < slotnames.length; i++){
            opt = document.createElement("option");
            opt.textContent = slotnames[i];
            opt.value = slotnames[i];
            oldslotnameinput.appendChild(opt);

            if (newyearslotnames[slot].includes(slotnames[i])){
                oldslotnameinput.selectedIndex = i+1;
            }else{
            }
        }
        slotname.innerHTML = newyearslotnames[slot];

        if (oldslotnameinput.selectedIndex == 0){
            oldslotname.classList.add("NEW");
        }
        
        oldslotname.appendChild(oldslotnameinput);
        limit.appendChild(limitinput);

        slotoption.appendChild(slotname);
        slotoption.appendChild(oldslotname);
        slotoption.appendChild(limit);

        details.appendChild(slotoption);
    }

};

function sort(){
    for (let slot in newyearslotnames){
        slotstds[newyearslotnames[slot]] = [];
        slotwls[newyearslotnames[slot]] = [];
        var limit = document.getElementById("limit" + slot).value
        slotlimits[newyearslotnames[slot]] = limit;
        slotalum[newyearslotnames[slot]] = document.getElementById("alum" + slot).value
    }
    console.log(slotlimits);
    console.log(slotalum);

    for (let i in students){
        students[i].checkalum();
    }
    students.sort(function(a,b){
        return (a.time >= b.time) ? 1:-1;
    })
    for (let i in students){
        students[i].assign();
    }

    var html = '';
    for (let slot in newyearslotnames){
        html += '<h3>' + newyearslotnames[slot] + '</h3>'
        for (var std = 0; std < slotstds[newyearslotnames[slot]].length; std++) html += '<br>' + slotstds[newyearslotnames[slot]][std];
        html += '<br>';
        for (var std = 0; std < slotwls[newyearslotnames[slot]].length; std++) html += '<br> WLS.' + slotwls[newyearslotnames[slot]][std];
        html += '<br>';
    }
    html+= '<h3> Rejected </h3>'
    for (var std = 0; std < rejected.length; std++) html += '<br>' + rejected[std];
    document.querySelector('#results').innerHTML = html;
    document.querySelector('#results').style.height = 'auto';


}

