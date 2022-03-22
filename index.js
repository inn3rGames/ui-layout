window.onload = () => {
    let sparks = Array.from(document.getElementsByClassName("spark"));
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
};
