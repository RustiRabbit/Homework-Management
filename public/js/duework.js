function tickDuework(id, cb) {
    console.log("Checkbox ID: " + id + ". Checkbox Value: " + cb.checked);
    xmlhttp = new XMLHttpRequest();

    xmlhttp.open("GET","/ajax/duework/change?id=" + id + "&value=" + cb.checked, true);
    xmlhttp.send();
 
}

function removeDueWork(id, row) {
    console.log("Remove DueWork: " + id);

    xmlhttp = new XMLHttpRequest();

    xmlhttp.open("GET","/ajax/duework/remove?id=" + id, true);
    xmlhttp.send();

    //Delete Row    
    var i = row.parentNode.parentNode.rowIndex;
    document.getElementById("dueworkTable").deleteRow(i);
}

function changeDueWork(id, label, duedate, row) {
    var modal = document.getElementById('myModal' + id);
    modal.style.display = "";
    console.log("Change DueWork. ID: " + id + ". Label: " + label + ". DueDate: " + duedate);
    
    xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        if (this.status == 200) {
           // Typical action to be performed when the document is ready:
           location.reload();
        }
    };

    xmlhttp.open("GET", "/ajax/duework/edit?id=" + encodeURIComponent(id) + "&label=" + encodeURIComponent(label) + "&duedate=" + encodeURIComponent(moment(duedate).format("MM/DD/YY")), true);
    xmlhttp.send();

    
}

function ShowDueWork(id) {
    var modal = document.getElementById('myModal' + id);
    modal.style.display = "block";
}

function closeModal(id) {
    var modal = document.getElementById('myModal' + id);
    modal.style.display = "none";
}
