var file = {}
details = document.getElementById("details")
var slotnames = [];
var slotlimits = {};
var students = [];

class Stud{
    constructor(name,first,second,third,current,time){
        this.name = name;
        this.first = first;
        this.second = second;
        this.third = third;
        this.current = current;
        if (first == current){
            this.time = -1;
            this.name = 'P.' + name;
        }else this.time = time;
    }

    assign(){
        if (this.time == -1) slotstds[this.current].push(this.name);
        else if (slotstds[this.first].length < slotlimits[this.first]) slotstds[this.first].push(this.name);
        else if (slotstds[this.second].length < slotlimits[this.second]){
            if (slotwls[this.first].length < 10) slotwls[this.first].push(this.name);
            slotstds[this.second].push(this.name);
        }
        else if (slotstds[this.third].length < slotlimits[this.third]){
            if (slotwls[this.first].length < 10) slotwls[this.first].push(this.name);
            if (slotwls[this.second].length < 10) slotwls[this.second].push(this.name);
            slotstds[this.third].push(this.name);
        }
        else{
            if (slotwls[this.first].length < 10) slotwls[this.first].push(this.name);
            if (slotwls[this.second].length < 10) slotwls[this.second].push(this.name);
            if (slotwls[this.third].length < 10) slotwls[this.third].push(this.name);
            rejected.push(this.name);
        }
    }
}

function Upload() {
    //Reference the FileUpload element.
    var fileUpload = document.getElementById("file");

    //Validate whether File is valid Excel file.
    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xls|.xlsx)$/;
    if (regex.test(fileUpload.value.toLowerCase())) {
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
    } else {
        alert("Please upload a valid Excel file.");
    }
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

        if (["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].includes((row["Child's current session (in 2021)"]).slice(0,3)) && !slotnames.includes(row["Child's current session (in 2021)"])){
            slotnames.push(row["Child's current session (in 2021)"]);
        }
        for (let session in row) {
            if (["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].includes(session.slice(0,3)) && !slotnames.includes(session)){
                slotnames.push(session);
            }
            if (row[session].includes("1st")){
                first = session;
            }else if (row[session].includes("2nd")){
                second = session;
            }else if (row[session].includes("3rd")){
                third = session;
            }else if (session.includes("current")){
                current = row[session];
            }else if (session.includes("name")){
                name = row[session];
            }
        }

        var student = new Stud(name,first,second,third,current,i+1);
        students.push(student);
    }

    for (let slot in slotnames){
        slotoption = document.createElement("tr");

        slotname = document.createElement("td");
        limit = document.createElement("td");
        limitinput = document.createElement("input")

        limit.classList.add("limits");
        limitinput.type = "number";
        limitinput.value = 10;
        limitinput.min = "1";
        limitinput.max = "30";
        limitinput.id = "limit" + slot;

        slotname.innerHTML = slotnames[slot];
        limit.appendChild(limitinput);

        slotoption.appendChild(slotname);
        slotoption.appendChild(limit);

        details.appendChild(slotoption);
    }

};

function sort(){
    for (let slot in slotnames){
        var limit = document.getElementById("limit" + slot).value
        slotlimits[slotnames[slot]] = limit;
    }
    console.log(slotlimits);


}