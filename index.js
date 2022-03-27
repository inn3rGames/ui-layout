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

    let isPointerDown = false;
    let startX;
    let carouselStartX;
    let cardIndex = 0;

    function down(currentPointerX) {
        isPointerDown = true;
        startX = currentPointerX;
        carouselStartX = parseFloat(window.getComputedStyle(carousel).left);
        container.style.cursor = "grabbing";
    }

    function leave() {
        isPointerDown = false;
        container.style.cursor = "grab";
    }

    function computeSwipe() {
        let carouselCurrentX = parseFloat(window.getComputedStyle(carousel).left);
        let swipeDistance = carouselCurrentX - carouselStartX;
        let cardWidth = parseFloat(window.getComputedStyle(cards[0]).width);
        let cardMargin = parseFloat(window.getComputedStyle(cards[0]).marginLeft);
        let cardTotalWidth = cardWidth + 2 * cardMargin;

        console.log(`Moved ${swipeDistance}px`);
        carousel.className = "move";

        if (Math.abs(swipeDistance) >= cardWidth / 2) {
            if (swipeDistance > 0) {
                if (cardIndex > 0) {
                    console.log("Swiped right!");
                    carousel.style.left = `${carouselStartX + cardTotalWidth}px`;
                    cardIndex = cardIndex - 1;
                } else {
                    console.log("Right limit reached!");
                    carousel.style.left = `${carouselStartX}px`;
                    cardIndex = 0;
                }
            } else {
                if (cardIndex < cards.length - 1) {
                    console.log("Swiped left!");
                    carousel.style.left = `${carouselStartX - cardTotalWidth}px`;
                    cardIndex = cardIndex + 1;
                } else {
                    console.log("Left limit reached!");
                    carousel.style.left = `${carouselStartX}px`;
                    cardIndex = cards.length - 1;
                }
            }
        } else {
            console.log("Did not swipe!");
            carousel.style.left = `${carouselStartX}px`;
        }

        cards[cardIndex].className = "item-card move";
       

        if (cards[cardIndex - 1] !== undefined) {
             cards[cardIndex - 1].className = "item-card item-card-small move";
        }

        if (cards[cardIndex + 1] !== undefined) {
          cards[cardIndex + 1].className = "item-card item-card-small move";
        }

        //console.log(cardIndex);
        //console.log(cards[cardIndex]);
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

    function end() {
        carousel.className = "";
        let cardWidth = parseFloat(window.getComputedStyle(cards[0]).width);
        let cardMargin = parseFloat(window.getComputedStyle(cards[0]).marginLeft);
        let cardTotalWidth = cardWidth + 2 * cardMargin;
        carousel.style.left = `${-cardIndex * cardTotalWidth}px`;
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

    container.addEventListener("transitionend", (e) => {
        end();
    });

    window.addEventListener("resize", (e) => {
        end();
    });
};
