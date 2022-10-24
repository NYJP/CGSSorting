var data = [];

function UploadProcess() {

    var fileUpload = document.getElementById("file");
    //Validate whether File is valid Excel file.
    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xls|.xlsx)$/;
    if (regex.test(fileUpload.value.toLowerCase())) {
        if (typeof (FileReader) != "undefined") {

            var reader = new FileReader();
            reader.onload = function (e) {
                data = e.target.result;
            };
            reader.readAsBinaryString(fileUpload.files[0]);
            
        }
    } else {
        alert("Please upload a valid Excel file.");
    }
};

document.querySelector('form').onsubmit = function(){
    UploadProcess()

    var workbook = XLSX.read(data, {
        type: 'binary'
    });

    var excel = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[workbook.SheetNames[0]]);
    console.log(excel);
}