window.onload = () => {
    let imagesLocations = [
        "url(./assets/images/SampleItem-d.png)",
        "url(./assets/images/SampleItem-c.png)",
        "url(./assets/images/SampleItem-b.png)",
        "url(./assets/images/SampleItem.png)",
    ];

    if (localStorage.getItem("ratings") === null) {
        let freshRatings = [];
        for (let i = 0; i < imagesLocations.length; i++) {
            freshRatings.push(0);
        }
        localStorage.setItem("ratings", JSON.stringify(freshRatings));
    }
    let ratings = JSON.parse(localStorage.getItem("ratings"));

    if (localStorage.getItem("cardIndex") === null) {
        localStorage.setItem("cardIndex", JSON.stringify(1));
    }
    let cardIndex = JSON.parse(localStorage.getItem("cardIndex"));

    let container = document.getElementById("carousel-container");
    let carousel = document.getElementById("carousel");
    let emoticon = document.getElementById("emoticon");
    emoticon.className = "";

    let isPointerDown = false;
    let startX;
    let carouselStartX;

    let cards = [];
    let sparksPerRow = 4;

    for (let i = 0; i < imagesLocations.length; i++) {
        createCard(imagesLocations[i], i);
    }
    averageRating(ratings, true);
    positionCards();

    function createCard(imageURL, currentId) {
        let itemCard = document.createElement("div");
        itemCard.className = "item-card";
        document.getElementById("carousel").appendChild(itemCard);

        let itemImage = document.createElement("div");
        itemImage.className = "item-image";
        itemImage.style.backgroundImage = imageURL;
        itemCard.appendChild(itemImage);

        let itemSparkRow = document.createElement("div");
        itemSparkRow.className = "item-spark-row";
        itemCard.appendChild(itemSparkRow);
        itemSparkRow.currentId = currentId;

        let sparks = [];
        for (let i = 0; i < sparksPerRow; i++) {
            let spark = document.createElement("div");
            if (ratings[currentId] - 1 >= i) {
                spark.className = "spark on";
            } else {
                spark.className = "spark off";
            }

            itemSparkRow.appendChild(spark);

            let sparkIndex = i;
            let enabled = "spark on";
            let disabled = "spark off";

            function enableSparks(sparkIndex) {
                for (let i = 0; i < sparkIndex + 1; i++) {
                    let spark = sparks[i];
                    spark.className = enabled;
                }
                ratings[itemSparkRow.currentId] = sparkIndex + 1;
                console.log(" ");
                console.log(
                    `Upvoted card ${itemSparkRow.currentId + 1} with ${ratings[itemSparkRow.currentId]
                    } sparks!`
                );
                console.log("The updated ratings are:", ratings);
                averageRating(ratings, false);
            }

            function disableSparks(sparkIndex) {
                for (let i = sparks.length - 1; i >= sparkIndex; i--) {
                    let spark = sparks[i];
                    spark.className = disabled;
                }
                ratings[itemSparkRow.currentId] = sparkIndex;
                console.log(" ");
                console.log(
                    `Downvoted rating of card ${itemSparkRow.currentId + 1} to ${ratings[itemSparkRow.currentId]
                    } sparks ${ratings[itemSparkRow.currentId] === 0 ? "and unselected it" : ""
                    }!`
                );
                console.log("The updated ratings are:", ratings);
                averageRating(ratings, false);
            }

            spark.addEventListener("mousedown", () => {
                if (spark.className === disabled) {
                    enableSparks(sparkIndex);
                } else {
                    disableSparks(sparkIndex);
                }
            });

            sparks.push(spark);
        }

        let itemButtons = document.createElement("div");
        itemButtons.className = "item-buttons";
        itemCard.appendChild(itemButtons);

        let leftButton = document.createElement("div");
        leftButton.className = "left-button";
        itemButtons.appendChild(leftButton);

        let leftButtonText = document.createElement("div");
        leftButtonText.className = "left-button-text";
        leftButtonText.textContent = "Keep";
        leftButton.appendChild(leftButtonText);

        let leftButtonShadow = document.createElement("div");
        leftButtonShadow.className = "left-button-shadow";
        leftButton.appendChild(leftButtonShadow);

        let rightButton = document.createElement("div");
        rightButton.className = "right-button";
        itemButtons.appendChild(rightButton);

        let rightButtonText = document.createElement("div");
        rightButtonText.className = "right-button-text";
        rightButtonText.textContent = "Discard";
        rightButton.appendChild(rightButtonText);

        let rightButtonShadow = document.createElement("div");
        rightButtonShadow.className = "right-button-shadow";
        rightButton.appendChild(rightButtonShadow);

        cards.push(itemCard);
    }

    function averageRating(ratings, firstRun) {
        localStorage.setItem("ratings", JSON.stringify(ratings));

        let ratingAverage = document.getElementById("rating-average-text");
        let ratingSum = 0;
        let countRatings = 0;
        let average = 0;
        let percentage = 0;
        for (let i = 0; i < ratings.length; i++) {
            if (ratings[i] > 0) {
                ratingSum += ratings[i];
                countRatings += 1;
            }
        }

        if (countRatings > 0) {
            average = Math.floor((ratingSum / countRatings) * 100) / 100;
            ratingAverage.textContent = `${countRatings} card(s) rated.\nAverage sparks:    ${average}!`;
            percentage = Math.floor((average / sparksPerRow) * 100);
            emoticon.style.left = `${percentage - 50}%`;
            if (firstRun === true) {
                emoticon.className = "";
            } else {
                emoticon.className = "move";
            }
        }

        if (countRatings === 0) {
            ratingAverage.textContent = "No card rated.\nPlease rate a card.";
            percentage = 0;
            emoticon.style.left = `${percentage - 50}%`;
            emoticon.className = "move";
        }
    }

    function positionCards() {
        setCardsClass();
        carousel.className = "";
        let cardWidth = parseFloat(window.getComputedStyle(cards[0]).width);
        let cardMargin = parseFloat(window.getComputedStyle(cards[0]).marginLeft);
        let cardTotalWidth = cardWidth + 2 * cardMargin;
        carousel.style.left = `${-cardIndex * cardTotalWidth}px`;
    }

    function setCardsClass() {
        for (let i = 0; i < cards.length; i++) {
            let itemButtons = Array.from(
                cards[i].getElementsByClassName("item-buttons")
            )[0];
            if (i === cardIndex) {
                cards[i].className = "item-card";
                itemButtons.className = "item-buttons opacity-on";
            } else {
                cards[i].className = "item-card small";
                itemButtons.className = "item-buttons opacity-off";
            }
        }
    }

    function computeSwipe() {
        let carouselCurrentX = parseFloat(window.getComputedStyle(carousel).left);
        let swipeDistance = carouselCurrentX - carouselStartX;
        if (swipeDistance === 0) {
            return;
        }
        let cardWidth = parseFloat(window.getComputedStyle(cards[0]).width);
        let cardMargin = parseFloat(window.getComputedStyle(cards[0]).marginLeft);
        let cardTotalWidth = cardWidth + 2 * cardMargin;

        console.log(" ");
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

        localStorage.setItem("cardIndex", JSON.stringify(cardIndex));

        cards[cardIndex].className = "item-card move";
        let itemButtons = Array.from(
            cards[cardIndex].getElementsByClassName("item-buttons")
        )[0];
        itemButtons.className = "item-buttons opacity-on move";

        if (cards[cardIndex - 1] !== undefined) {
            cards[cardIndex - 1].className = "item-card small move";

            let itemButtonsPrevious = Array.from(
                cards[cardIndex - 1].getElementsByClassName("item-buttons")
            )[0];
            itemButtonsPrevious.className = "item-buttons opacity-off move";
        }
        if (cards[cardIndex + 1] !== undefined) {
            cards[cardIndex + 1].className = "item-card small move";

            let itemButtonsNext = Array.from(
                cards[cardIndex + 1].getElementsByClassName("item-buttons")
            )[0];
            itemButtonsNext.className = "item-buttons opacity-off move";
        }
    }

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

    container.addEventListener("transitionend", (e) => {
        positionCards();
    });

    emoticon.addEventListener("transitionend", (e) => {
        emoticon.className = "";
    });

    window.addEventListener("resize", (e) => {
        positionCards();
    });
};
