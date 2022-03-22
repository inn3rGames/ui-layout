window.onload = () => {
    let cards = Array.from(document.getElementsByClassName("item-card"));

    for (let i = 0; i < cards.length; i++) {
        let sparks = Array.from(cards[i].getElementsByClassName("spark"));
        let enabled = "spark on";
        let disabled = "spark off";

        function enableSparks(sparkIndex) {
            for (let i = 0; i < sparkIndex + 1; i++) {
                let spark = sparks[i];
                spark.className = enabled;
            }
        }

        function disableSparks(sparkIndex) {
            for (let i = sparks.length - 1; i >= sparkIndex; i--) {
                let spark = sparks[i];
                spark.className = disabled;
            }
        }

        for (let i = 0; i < sparks.length; i++) {
            let spark = sparks[i];
            let sparkIndex = sparks.indexOf(spark);
            spark.addEventListener("pointerdown", () => {
                if (spark.className === disabled) {
                    enableSparks(sparkIndex);
                } else {
                    disableSparks(sparkIndex);
                }
            });
        }
    }

    let middle = document.getElementById("middle");
    let carousel = document.getElementById("carousel");
    let isPointerDown = false;
    let pointerX;

    middle.addEventListener("pointerdown", (e) => {
        isPointerDown = true;
        pointerX = e.offsetX - carousel.offsetLeft;
        middle.style.cursor = "grabbing";
    });

    middle.addEventListener("pointerup", (e) => {
        middle.style.cursor = "grab";
    });

    middle.addEventListener("pointermove", (e) => {
        if (!isPointerDown === true) {
            return;
        }
        e.preventDefault();
        carousel.style.left = `${e.offsetX - pointerX}px`;
    });

    window.addEventListener("pointerup", () => {
        isPointerDown = false;
    });

    middle.addEventListener("contextmenu", (e) => {
        e.preventDefault();
    });
};
