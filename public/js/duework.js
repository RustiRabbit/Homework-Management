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

function changeDueWork(id, label, duedate) {
    var modal = document.getElementById('myModal' + id);
    modal.style.display = "";
    console.log("Change DueWork. ID: " + id + ". Label: " + $(label).value + ". DueDate: " + $(duedate).value);
}

function ShowDueWork(id) {
    var modal = document.getElementById('myModal' + id);
    modal.style.display = "block";
}

function closeModal(id) {
    var modal = document.getElementById('myModal' + id);
    modal.style.display = "none";
}
