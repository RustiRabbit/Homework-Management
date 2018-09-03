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