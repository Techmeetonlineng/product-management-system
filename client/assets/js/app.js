const badge = document.getElementById("statusBadge");

fetch("/health")
    .then(response => response.json())
    .then(data => {

        badge.innerHTML = "Backend Online";

        badge.classList.remove("bg-secondary");

        badge.classList.add("bg-success");

        console.log(data);

    })
    .catch(error => {

        badge.innerHTML = "Backend Offline";

        badge.classList.remove("bg-secondary");

        badge.classList.add("bg-danger");

        console.error(error);

    });