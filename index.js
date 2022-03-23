window.onload = () => {
    let cards = Array.from(document.getElementsByClassName("item-card"));
    let images = Array.from(document.getElementsByClassName("item-image"));

    let imagesLocations = [
        "url(./assets/images/SampleItem-b.png)",
        "url(./assets/images/SampleItem-c.png)",
        "url(./assets/images/SampleItem-d.png)",
        "url(./assets/images/SampleItem.png)",
    ];

    for (let i = 0; i < cards.length; i++) {
        images[i].style.backgroundImage = imagesLocations[i];

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
            spark.addEventListener("mousedown", () => {
                if (spark.className === disabled) {
                    enableSparks(sparkIndex);
                } else {
                    disableSparks(sparkIndex);
                }
            });
        }
    }

    let container = document.getElementById("carousel-container");
    let carousel = document.getElementById("carousel");

    let isPointerDown = false;
    let startX;
    let carouselStartX;

    container.addEventListener("mousedown", (e) => {
        isPointerDown = true;
        startX = e.clientX;
        carouselStartX = carousel.offsetLeft;
        container.style.cursor = "grabbing";
    });

    container.addEventListener("mouseleave", (e) => {
        isPointerDown = false;
        container.style.cursor = "grab";
    });

    container.addEventListener("mouseup", (e) => {
        isPointerDown = false;
        container.style.cursor = "grab";
        console.log(`Moved ${carousel.offsetLeft - carouselStartX}px`);
    });

    container.addEventListener("mousemove", (e) => {
        e.preventDefault();

        if (isPointerDown === true) {
            let distance = startX - e.clientX;
            carousel.style.left = `${carouselStartX - distance}px`;
        } else {
            return;
        }
    });

    container.addEventListener("touchstart", (e) => {
        isPointerDown = true;
        startX = e.touches[0].clientX;
        carouselStartX = carousel.offsetLeft;
        container.style.cursor = "grabbing";
    });

    container.addEventListener("touchcancel", (e) => {
        isPointerDown = false;
        container.style.cursor = "grab";
    });

    container.addEventListener("touchend", (e) => {
        isPointerDown = false;
        container.style.cursor = "grab";
        console.log(`Moved ${carousel.offsetLeft - carouselStartX}px`);
    });

    container.addEventListener("touchmove", (e) => {
        e.preventDefault();

        if (isPointerDown === true) {
            let distance = startX - e.touches[0].clientX;
            carousel.style.left = `${carouselStartX - distance}px`;
        } else {
            return;
        }
    });

    container.addEventListener("contextmenu", (e) => {
        e.preventDefault();
    });
};
