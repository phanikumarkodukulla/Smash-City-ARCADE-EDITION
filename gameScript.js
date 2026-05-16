const TOTAL_SEGMENTS = 10;
function buildSegments() {
    const track = $("#fuelTrack");
    track.empty();
    for (let i = 0; i < TOTAL_SEGMENTS; i++) {
        track.append('<div class="fuel-segment" id="seg' + i + '"></div>');
    }
}
function updateFuelBar(hitCount) {
    const pct = Math.max(0, 100 - hitCount);
    const activeSegs = Math.ceil((pct / 100) * TOTAL_SEGMENTS);
    $("#fuelPct").text(pct + "%");
    let dots = "";
    for (let i = 0; i < TOTAL_SEGMENTS; i++) {
        dots += i < activeSegs ? "▰" : "▱";
    }
    $("#fuelPercentText").text(dots);
    for (let i = 0; i < TOTAL_SEGMENTS; i++) {
        const seg = $("#seg" + i);
        seg.removeClass("dead warn danger");
        if (i >= activeSegs) {
            seg.addClass("dead");
        } else if (pct <= 30) {
            seg.addClass("danger");
        } else if (pct <= 60) {
            seg.addClass("warn");
        }
    }
    if (pct > 60) {
        $("#fuelGlow").css("box-shadow", "inset 0 0 8px rgba(0,255,136,0.25)");
    } else if (pct > 30) {
        $("#fuelGlow").css("box-shadow", "inset 0 0 8px rgba(255,136,0,0.25)");
    } else {
        $("#fuelGlow").css("box-shadow", "inset 0 0 10px rgba(255,34,34,0.35)");
    }
}
function refillFuelBar() {
    for (let i = 0; i < TOTAL_SEGMENTS; i++) {
        $("#seg" + i).removeClass("dead warn danger");
    }
    $("#fuelPct").text("100%");
    $("#fuelPercentText").text("▰▰▰▰▰▰▰▰▰▰");
    $("#fuelGlow").css("box-shadow", "inset 0 0 12px rgba(0,255,136,0.5)");
}
function isMobile() {
    return (
        /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
        window.innerWidth < 768
    );
}
function adjustHudLayout() {
    if (!isMobile()) {
        $("#hud").css({
            flexDirection: "row",
            alignItems: "center",
            background: "",
        });
    }
}
$(document).ready(function () {
    buildSegments();
    updateFuelBar(0);
    $(".title").hide();
    if (isMobile()) {
        $(".popup-hint").text("TAP ← → BUTTONS TO MOVE");
    }
    if (!isMobile()) {
        const $row1 = $(".hud-row1");
        const $title = $(".title");
        const $dist = $("#distanceCounter");
        const $fuel = $("#fuelContainer");
        $row1.before($title).before($dist);
        $row1.remove();
        $("#hud").append($fuel);
        $("#hud").css({
            flexDirection: "row",
            alignItems: "center",
            gap: "12px",
            padding: "14px 18px",
            background: "",
        });
    }
    let jet = $("#jet");
    function startGame() {
        let left = 50;
        let hitCount = 0;
        let distance = 0;
        let pressingLeft = false;
        let pressingRight = false;
        $(document).on("keydown", function (e) {
            if (e.key === "ArrowLeft" && left > 0) left -= 2;
            if (e.key === "ArrowRight" && left < 100) left += 2;
            jet.css("left", left + "%");
        });
        $("#btnLeft").on("touchstart mousedown", function (e) {
            e.preventDefault();
            pressingLeft = true;
        });
        $("#btnLeft").on("touchend mouseup mouseleave", function () {
            pressingLeft = false;
        });
        $("#btnRight").on("touchstart mousedown", function (e) {
            e.preventDefault();
            pressingRight = true;
        });
        $("#btnRight").on("touchend mouseup mouseleave", function () {
            pressingRight = false;
        });
        setInterval(function () {
            if (hitCount >= 100) return;
            if (pressingLeft && left > 0) left -= 1.5;
            if (pressingRight && left < 100) left += 1.5;
            if (pressingLeft || pressingRight) jet.css("left", left + "%");
        }, 16);
        const spawnInterval = isMobile() ? 750 : 300;
        setInterval(function () {
            if (hitCount >= 100) return;
            let isSuper = Math.random() < 0.02;
            let dot;
            if (isSuper) {
                $("#superAlert").fadeIn(200);
                setTimeout(() => $("#superAlert").fadeOut(400), 1500);
                dot = $(`<div class="dot superStar" style="position:absolute;top:-100px;font-size:60px;font-weight:900;line-height:1;pointer-events:none;background:linear-gradient(45deg,#4285F4,#9B72FF,#D96570,#F2A60C);-webkit-background-clip:text;-webkit-text-fill-color:transparent;filter:drop-shadow(0 0 14px rgba(255,255,255,.7));animation:spin 1s linear infinite;">✦</div>`);
                $("head").append("<style>@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}</style>");
            } else {
                dot = $(`<div class="dot" style="position:absolute;top:-100px;font-size:40px;color:#fff;font-weight:900;line-height:1;pointer-events:none;">✦</div>`);
            }
            let randomLeft = Math.random() * (window.innerWidth - 50);
            dot.css({ left: randomLeft + "px" });
            $(".game").append(dot);
            let collision = setInterval(function () {
                if (!dot.length) return;
                let dotOffset = dot.offset();
                let jetOffset = jet.offset();
                let dotWidth = dot.width();
                let dotHeight = dot.height();
                let jetWidth = jet.width();
                let jetHeight = jet.height();
                if (
                    dotOffset.left < jetOffset.left + jetWidth &&
                    dotOffset.left + dotWidth > jetOffset.left &&
                    dotOffset.top < jetOffset.top + jetHeight &&
                    dotOffset.top + dotHeight > jetOffset.top
                ) {
                    if (dot.hasClass("superStar")) {
                        hitCount = 0;
                        refillFuelBar();
                        $("body").css("background", "#003322");
                        setTimeout(function () {
                            $("body").css("background", "#000");
                        }, 300);
                    } else {
                        $("body").css("background", "red");
                        hitCount += 10;
                        updateFuelBar(hitCount);
                        setTimeout(function () {
                            $("body").css("background", "#000");
                        }, 150);
                    }
                    if (hitCount >= 100) {
                        $("#goScore").text(distance);
                        $("#goDist").text("D: " + distance + "m");
                        $("#gameOver").css("display", "flex");
                        $("#mobileControls").removeClass("show");
                        $(".dot").stop();
                        $(document).off("keydown");
                    }
                    dot.remove();
                    clearInterval(collision);
                }
                if (dotOffset && dotOffset.top > window.innerHeight) {
                    dot.remove();
                    clearInterval(collision);
                }
            }, 10);
            dot.animate({ top: "120vh" }, 3000, "linear", function () {
                $(this).remove();
                clearInterval(collision);
            });
        }, spawnInterval);
        setInterval(function () {
            if (hitCount >= 100) return;
            distance += 1;
            $("#distanceCounter").text("D: " + distance + "m");
        }, 100);
    }
    $("#startBtn").click(function () {
        if (isMobile() && document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(() => { });
        }
        $(".entry-popup").fadeOut(500, function () {
            $(this).remove();
            $(".title").fadeIn(500);
            if (isMobile()) {
                $("#mobileControls").addClass("show");
            }
            startGame();
        });
    });
    $("#saveCardBtn").click(function () {
        const btn = $(this);
        btn.text("SAVING...");
        html2canvas(document.getElementById("goCard"), {
            backgroundColor: "#0a0a0a",
            scale: 2,
        })
            .then(function (canvas) {
                const link = document.createElement("a");
                link.download = "smash-city-score.png";
                link.href = canvas.toDataURL("image/png");
                link.click();
                btn.text("SAVED ✓");
                setTimeout(() => btn.text("SAVE CARD"), 2000);
            })
            .catch(function () {
                btn.text("SAVE CARD");
            });
    });
});