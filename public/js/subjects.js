function removeSubject(id, row) {
    xmlhttp = new XMLHttpRequest();

    xmlhttp.open("GET","/ajax/subjects/remove?id=" + id, true);
    xmlhttp.send();

    var i = row.parentNode.parentNode.rowIndex;
    document.getElementById("subjectTable").deleteRow(i);
}

function ShowSubject(id) {
    var modal = document.getElementById('myModal' + id);
    modal.style.display = "block";
}

function closeModal(id) {
    var modal = document.getElementById('myModal' + id);
    modal.style.display = "none";
}
