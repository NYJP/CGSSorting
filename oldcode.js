var slotstds = []
var slotwls = []
var slotnames = [];
var slotlimits = [];
var slotnum = 0;
var rejected = [];

for (var c = 0; c<100; c++){
    slotstds.push([]);
    slotwls.push([])
}

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

document.addEventListener('DOMContentLoaded', function(){
       
    document.querySelector('form').onsubmit = function(){
        
        let flag = false;
        document.querySelectorAll('.in').forEach(function(element){
            if (element.name === 'file'){
                if (document.querySelector('#file').value === undefined){
                    flag = true;
                }
            }else if (!document.querySelector(`#${element.name}`).value.length > 0){
                flag = true;
            }
        })
        
        if(flag){
            alert('Please fill up all fields');
            return false;
        }
        
        const file = document.querySelector('#file').files[0];
        const filename = document.querySelector('#file').value;

        if (filename.substr(filename.lastIndexOf('.') + 1).toLowerCase() !== 'csv'){
            alert('Please upload a .csv file');
            return false;
        }

        slotnum = document.querySelector('#slotnum').value;
        const slotname = document.querySelector('#slotnames').value;
        const slotlimit = document.querySelector('#limits').value;
        var temp = '';
        var data = [];
        var students = [];

        for (i = 0; i < slotname.length; i++){
            if (slotname[i] === ','){
                slotnames.push(temp);
                temp = '';
            }else{
                temp += slotname[i];
            }
        }
        
        slotnames.push(temp);
        temp = '';

        if (slotnames.length != slotnum){
            alert('The number of slot names and the number of slots do not match.');
            return false;
        }

        for (i = 0; i < slotlimit.length; i++){
            if (slotlimit[i] === ','){
                slotlimits.push(temp);
                temp = '';
            }else{
                temp += slotlimit[i];
            }
        }

        slotlimits.push(temp);
        temp = '';

        if (slotlimits.length != slotnum){
            alert('The number of slot limits and the number of slots do not match.');
            return false;
        }

        var reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function(e){
            var csv = e.target.result;
            data = $.csv.toArrays(csv).slice(1);
            for (var i = 0; i<data.length; i++){
                var name = '';
                var first = 99;
                var second = 99;
                var third = 99;
                var current = -1;
                for (var x = 0; x<data[i].length; x++){
                    if (x==2) name = data[i][2];
                    else if (x==3){
                        for (var s = 0; s<slotnames.length; s++){
                            if (slotnames[s] == data[i][3]) current = s;
                        }
                    }
                    else if (data[i][x] == '1st choice') first = x-4;
                    else if (data[i][x] == '2nd choice') second = x-4;
                    else if (data[i][x] == '3rd choice') third = x-4;
                }
                var student = new Stud(name,first,second,third,current,i+1);
                students.push(student);
            }
            
            students.sort(function(a,b){
                return (a.time >= b.time) ? 1:-1;
            })
            
            for (var d = 0; d<students.length; d++){
                students[d].assign();
            }
            giveresult();
        }
        

        return false;

    }

})

function giveresult(){
    var html = '';
    for (var slot = 0; slot < slotnum; slot++){
        html += '<h3>' + slotnames[slot] + '</h3>'
        for (var std = 0; std < slotstds[slot].length; std++) html += '<br>' + slotstds[slot][std];
        html += '<br>';
        for (var std = 0; std < slotwls[slot].length; std++) html += '<br> WLS.' + slotwls[slot][std];
        html += '<br>';
    }
    html+= '<h3> Rejected </h3>'
    for (var std = 0; std < rejected.length; std++) html += '<br>' + rejected[std];
    document.querySelector('#results').innerHTML = html;
    document.querySelector('#results').style.height = 'auto';
}