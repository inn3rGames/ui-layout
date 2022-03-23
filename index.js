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

    function down(currentPointerX) {
        isPointerDown = true;
        startX = currentPointerX;
        carouselStartX = carousel.offsetLeft;
        container.style.cursor = "grabbing";
    }

    function leave() {
        isPointerDown = false;
        container.style.cursor = "grab";
    }

    function up() {
        isPointerDown = false;
        container.style.cursor = "grab";
        console.log(`Moved ${carousel.offsetLeft - carouselStartX}px`);
    }

    function move(currentPointerX) {
        if (isPointerDown === true) {
            let distance = startX - currentPointerX;
            carousel.style.left = `${carouselStartX - distance}px`;
        } else {
            return;
        }
    }

    container.addEventListener("mousedown", (e) => {
        down(e.clientX);
    });
    container.addEventListener("mouseleave", (e) => {
        leave();
    });
    container.addEventListener("mouseup", (e) => {
        up();
    });
    container.addEventListener("mousemove", (e) => {
        e.preventDefault();
        move(e.clientX);
    });

    container.addEventListener("touchstart", (e) => {
        down(e.touches[0].clientX);
    });
    container.addEventListener("touchcancel", (e) => {
        leave();
    });
    container.addEventListener("touchend", (e) => {
        up();
    });
    container.addEventListener("touchmove", (e) => {
        e.preventDefault();
        move(e.touches[0].clientX);
    });

    container.addEventListener("contextmenu", (e) => {
        e.preventDefault();
    });
};
