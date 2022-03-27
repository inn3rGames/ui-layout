window.onload = () => {
    let cards = Array.from(document.getElementsByClassName("item-card"));
    let images = Array.from(document.getElementsByClassName("item-image"));

    let imagesLocations = [
        "url(./assets/images/SampleItem-d.png)",
        "url(./assets/images/SampleItem-c.png)",
        "url(./assets/images/SampleItem-b.png)",
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

    /* let globalOffset = cards[0].offsetWidth * (cards.length - 4);
        carousel.style.left = `${
           - parseInt(window.getComputedStyle(cards[0]).marginLeft)/2
        }px`;
        console.log(cards[0].offsetWidth + " px", parseInt(window.getComputedStyle(cards[0]).marginLeft));
        console.log(globalOffset); */

    let isPointerDown = false;
    let startX;
    let carouselStartX;

    function down(currentPointerX) {
        isPointerDown = true;
        startX = currentPointerX;
        carouselStartX = carousel.offsetLeft;
        container.style.cursor = "grabbing";
        carousel.className = "";
    }

    function leave() {
        isPointerDown = false;
        container.style.cursor = "grab";
        computeSwipe();
    }

    function computeSwipe() {
        let swipeDistance = carousel.offsetLeft - carouselStartX;
        let cardWidth = parseInt(window.getComputedStyle(cards[0]).width);
        let cardMargin = parseInt(window.getComputedStyle(cards[0]).marginLeft);
        console.log(`Moved ${swipeDistance}px`);

        if (Math.abs(swipeDistance) >= cardWidth / 2) {
            console.log("Swiped !");
            if (swipeDistance > 0) {
                carousel.style.left = `${carouselStartX + (cardWidth + 2 * cardMargin)}px`;
                carousel.className = "move";
                console.log("Right");
            } else {
                carousel.style.left = `${carouselStartX - (cardWidth + 2 * cardMargin)}px`;
                carousel.className = "move";
                console.log("Left");
            }
        } else {
            console.log("Did not swipe!");
            carousel.style.left = `${carouselStartX}px`;
            carousel.className = "move";
        }
    }

    function up() {
        isPointerDown = false;
        container.style.cursor = "grab";
        computeSwipe();
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
