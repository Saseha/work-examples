document.addEventListener("DOMContentLoaded", () => {
    const taskList = document.getElementById("task-list");
    const semesterCreditsInput = document.getElementById("semester-credits");
    const semesterEndInput = document.getElementById("semester-end-input");
    const daysRemainingSpan = document.getElementById("days-remaining");

    function updateDaysRemaining() {
        const semesterEndDate = new Date(semesterEndInput.value);
        const today = new Date();
        const diffDays = Math.ceil((semesterEndDate - today) / (1000 * 60 * 60 * 24));

        daysRemainingSpan.textContent = diffDays >= 0 ? `${diffDays} dní` : "Semestr skončil";
    }

    semesterEndInput.addEventListener("change", updateDaysRemaining);
    updateDaysRemaining(); // Aktualizace při načtení stránky

    document.getElementById("add-appointment").addEventListener("click", () => {
        document.getElementById("modal-backdrop").classList.add("active");
        document.getElementById("appointment-form").reset();
    });

    document.getElementById("modal-close").addEventListener("click", () => {
        document.getElementById("modal-backdrop").classList.remove("active");
    });

    document.getElementById("appointment-form").addEventListener("submit", (event) => {
        event.preventDefault();

        const inputName = document.getElementById("appointment-name").value.trim();
        const inputDateTime = document.getElementById("appointment-date-time").value;
        const inputCredits = Number(document.getElementById("appointment-credits").value);

        if (!inputName || !inputDateTime || isNaN(inputCredits) || inputCredits <= 0) {
            alert("Vyplňte prosím všechna pole správně.");
            return;
        }

        function sklonujKredity(pocet) {
            if (pocet === 1) {
                return "kredit";
            } else if (pocet >= 2 && pocet <= 4) {
                return "kredity";
            } else {
                return "kreditů";
            }
        }
        

        const taskItem = document.createElement("div");
        taskItem.className = "task-item";
        taskItem.innerHTML = `
        <input type="checkbox" class="task-checkbox" data-credits="${inputCredits}">
        <span>${inputName}</span>
        <span>${new Date(inputDateTime).toLocaleDateString("cs-CZ")}</span>
        <span>${inputCredits} ${sklonujKredity(inputCredits)}</span>
        <button class="delete-task">❌</button>
    `;
    

        taskList.appendChild(taskItem);
        updateProgress();
        document.getElementById("modal-backdrop").classList.remove("active");
    });

    taskList.addEventListener("click", (event) => {
        if (event.target.classList.contains("delete-task")) {
            event.target.closest(".task-item").remove();
            updateProgress();
        }
    });

    function updateProgress() {
        const checkboxes = document.querySelectorAll(".task-checkbox");
        const progressBar = document.getElementById("loader");
        const totalCreditsSpan = document.getElementById("total-credits").querySelector("span");
        const congratsModal = document.getElementById("congrats-modal");
        const closeModalButton = document.getElementById("close-modal");
        const checkSound = document.getElementById("check-sound");
        const congratsSound = document.getElementById("congrats-sound");
    
        let earnedCredits = 0;
        let totalCredits = Number(semesterCreditsInput.value);
    
        checkboxes.forEach(cb => {
            const taskItem = cb.closest(".task-item");
            if (cb.checked) {
                earnedCredits += Number(cb.dataset.credits);
                taskItem.classList.add("completed");
    
                // 🎵 Přehrát zvuk při zaškrtnutí checkboxu (pouze pokud ještě nebyl přehrán)
                checkSound.currentTime = 0;
                checkSound.play();
            } else {
                taskItem.classList.remove("completed");
            }
        });
    
        let percentage = Math.min((earnedCredits / totalCredits) * 100, 100);
        progressBar.value = percentage;
        totalCreditsSpan.textContent = earnedCredits;
    
        // 🎉 Pokud progress-bar dosáhne 100 %, zobraz okno a přehraj zvuk (jednou)
        if (percentage >= 100 && !congratsModal.classList.contains("active")) {
            congratsModal.classList.add("active");
            congratsSound.currentTime = 0;
            congratsSound.play();
        }
    
        closeModalButton.addEventListener("click", () => {
            congratsModal.classList.remove("active");
        });
    }
    
    
    taskList.addEventListener("change", updateProgress);

})
