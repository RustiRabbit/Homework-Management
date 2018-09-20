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

function changeSubjects(id, subjectname) {
    var modal = document.getElementById('myModal' + id);
    modal.style.display = "";
    
    xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        if (this.status == 200) {
           // Typical action to be performed when the document is ready:
           location.reload();
        }
    };

    xmlhttp.open("GET", "/ajax/subjects/edit?id=" + encodeURIComponent(id) + "&subjectname=" + encodeURIComponent(subjectname), true);
    xmlhttp.send();

    
}
