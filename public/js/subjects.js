function removeSubject(id, row) {
    xmlhttp = new XMLHttpRequest();

    xmlhttp.open("GET","/ajax/subjects/remove?id=" + id, true);
    xmlhttp.send();

    var i = row.parentNode.parentNode.rowIndex;
    document.getElementById("subjectTable").deleteRow(i);
}