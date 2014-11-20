/*
Alternative camera parameter
({r:[-0.98270474575889388, 0.10046337812322131, 0.15555864591535323, -0.038018933647139819, -0.93160560344706023, 0.36147691532153625, 0.18123449822614335, 0.34931090633146478, 0.91931275818983871], t:[83.296853042942487, 256.72519276755503, 348.946591146267], k1:-1.1738872833, k2:6.16117008947, k3:-8.27427609968, p1:-0.0321941000394, p2:-0.0739802556975, fx:1730.10332072, fy:1623.70067172, cx:247.896386316, cy:457.490496922})
*/
// Utility function, return an image configuration used by slides
function Pic(url, x, y, scale, leap) {
    scale = typeof scale !== 'undefined' ? scale : 0.2;
    leap = typeof leap !== 'undefined' ? leap : true;
    return {
        url: url,
        opt: {
            position: {
                x: x,
                y: y
            },
            scale: {
                magnitude: scale,
                reference: gapi.hangout.av.effects.ScaleReference.HEIGHT
            }
        },
        leap: leap
    };
}
var slideData = [];

// Project point3d:p to screen using camera data:c 
function project(p, c) {
        var c = cameraData;
        if (c == null) return null;
        var z = c.r[6] * p[0] + c.r[7] * p[1] + c.r[8] * p[2] + c.t[2];
        if (z < 10) {
            return null;
        }
        var x = c.r[0] * p[0] + c.r[1] * p[1] + c.r[2] * p[2] + c.t[0];
        var y = c.r[3] * p[0] + c.r[4] * p[1] + c.r[5] * p[2] + c.t[1];
        var x1 = x / z,
            y1 = y / z;
        var x1_2 = x1 * x1,
            y1_2 = y1 * y1;
        var r2 = x1_2 + y1_2;
        var r = 1 + (c.k1 + (c.k2 + c.k3 * r2) * r2) * r2
        var xy = 2 * x1 * y1;
        var x2 = x1 * r + c.p1 * xy + c.p2 * (3 * x1_2 + y1_2);
        var y2 = y1 * r + c.p2 * xy + c.p1 * (x1_2 + 3 * y1_2);
        var u = (c.fx * x2 + c.cx);
        var v = (c.fy * y2 + c.cy);
        return [u, v];

    }
    // The following two varaiables are setInterval handler
scaleUpdater = null;
slideTransition = null;


function ghSlides() {
    var images = [];
    var overlays = [];
    var baseUrl = "";
    var bannerImage;
    var slideX = 0,
        slideY = [];
    var x = 0,
        y = 0,
        r = 0;
    var leapResizeLock = false;
    var scale = 1.0,
        targetScale = 1.0;

    function clearIntervals() {
        if (scaleUpdater) {
            clearInterval(scaleUpdater);
            scaleUpdater = null;
        }
        if (slideTransition) {
            clearInterval(slideTransition);
            slideTransition = null;
        }
    }
    var showSlides = function(direction) {
        document.getElementById("keyControlDiv").innerHTML = "KeyContolArea: showSlide  " + slideX + "   " + slideY[slideX] + " start";
        direction = typeof direction !== 'undefined' ? direction : 4;
        if (direction < 0 || direction > 3) direction = 4;
        var div = document.getElementById('info');
        clearIntervals();
        scale = targetScale;
        var oldimages = images;
        var oldoverlays = overlays;
        var transitionY = [0, 1.0, 0, -1.0, 0][direction],
            transitionX = [1.0, 0, -1.0, 0, 0][direction];
        var incY = -0.2 * transitionY,
            incX = -0.2 * transitionX;
        images = []
        overlays = []
        var slideList = slideData[slideX][slideY[slideX]]
        for (var i in slideList) {
            var url, leap = true;
            var opt = {
                position: {
                    x: 0,
                    y: 0
                },
                scale: {
                    magnitude: scale,
                    reference: gapi.hangout.av.effects.ScaleReference.HEIGHT
                }
            }
            var data = slideList[i];
            if (typeof data == 'string') {
                url = baseUrl + data;
            } else {
                url = baseUrl + data.url;
                if ("opt" in data) opt = data.opt;
                if ("leap" in data) leap = data.leap;
            }
            var img = gapi.hangout.av.effects.createImageResource(url);
            var ov = img.showOverlay(opt);
            var targetPosition = ov.getPosition();
            ov.leap = leap;
            ov.setPosition(targetPosition.x + transitionX, targetPosition.y + transitionY);
            ov.setVisible(true);
            images.push(img);
            overlays.push(ov);
        }
        if (images.length > 0) {
            div.innerHTML = images[0].getUrl();
        }

        var moveSlides = function() {
            if (images.length > 0 && !images[0].isLoaded()) {
                return;
            }
            transitionY += incY;
            transitionX += incX;
            var mv = function(ov, i, array) {
               if( ov.isDisposed()) return;
                var pos = ov.getPosition();
                ov.setPosition(pos.x + incX, pos.y + incY);
            };
            oldoverlays.forEach(mv);
            overlays.forEach(mv);
            if (transitionY <= 0.1 && transitionY >= -0.1 && transitionX <= 0.1 && transitionX >= -0.1) {
                clearIntervals();
                document.getElementById("keyControlDiv").innerHTML = "KeyContolArea: showSlide  " + slideX + "   " + slideY[slideX] + " done";
                for (var i in oldimages)
                    oldimages[i].dispose();
            }
        }
        slideTransition = setInterval(moveSlides, 100);
    }

    var loadSlides = function() {
        document.getElementById("keyControlDiv").focus()
        clearIntervals();
        scale = targetScale;
        baseUrl = document.getElementById('baseUrl').value + "/";
        if (bannerImage) bannerImage.dispose();
        var bannerUrl = baseUrl + document.getElementById('banner');
        bannerImage = gapi.hangout.av.effects.createImageResource(baseUrl + "PyConChina2014-slide-barnner.png");
        bannerImage.showOverlay({
            position: {
                x: 0,
                y: 0.44
            },
            scale: {
                magnitude: 0.1,
                reference: gapi.hangout.av.effects.ScaleReference.HEIGHT
            }
        });
        for (var i in images)
                    images[i].dispose();
        slideData = eval(document.getElementById('slideData').value);
        slideX = 0;
        slideY = [];
        for (var i = 0; i < slideData.length; i++)
            slideY.push(0);
       showSlides();
    }
    var updateScale = function() {
        if (scale <= targetScale + 0.02 && scale >= targetScale - 0.02) {
            scale = targetScale;
            clearInterval(scaleUpdater);
            scaleUpdater = null;
        } else {
            if (scale < targetScale) scale += 0.02;
            if (scale > targetScale) scale -= 0.02;
        }
        if (overlays.length > 0)
            overlays[0].setScale(scale, gapi.hangout.av.effects.ScaleReference.HEIGHT);
    }

    var keyControl = function(evt) {
        evt.preventDefault();
        console.log("keyControl", evt.keyIdentifier, slideTransition);
        if (slideTransition) {
            return;
        }
        if (evt.keyIdentifier == "Up") {
            if (slideY[slideX] > 0) {
                slideY[slideX] --;
                showSlides(3);
            }
        }
        if (evt.keyIdentifier == "Down") {
            if (slideY[slideX] < slideData[slideX].length - 1) {
                slideY[slideX] ++;
                showSlides(1);
            }
        }
        if (evt.keyIdentifier == "Left") {
            if (slideX > 0) {
                slideX--;
                showSlides(2);
            }
        }
        console.log(evt.keyIdentifier == "Right");
        if (evt.keyIdentifier == "Right") {
            console.log("abcdefg", slideX);
            if (slideX < slideData.length - 1) {
                slideX++;
                showSlides(0);
            }
        }
        if (evt.keyIdentifier == "U+0020") {
            showSlides(4);
        }
        /*    //  Special ending for PyCon2014CN
                if (evt.keyIdentifier == "U+0046") {           
                    var data = Pic("sThe2.png", 0, -0.2, 1, false);
                    var url = "https://raw.githubusercontent.com/tjwei/gh_show/master/demo_imgs" + data.url;
                    if ("opt" in data) opt = data.opt;
                    if ("leap" in data) leap = data.leap;
                    var img = gapi.hangout.av.effects.createImageResource(url);
                    img.showOverlay(opt);
                }
        */
        if (evt.keyIdentifier == "U+005B" || evt.keyIdentifier == "U+00DB") {
            if (targetScale > 0.5) {
                targetScale -= 0.2;
                if (!scaleUpdater) scaleUpdater = setInterval(updateScale, 70);

            }

        }
        if (evt.keyIdentifier == "U+005D" || evt.keyIdentifier == "U+00DD") {
            {
                targetScale += 0.2;
                if (!scaleUpdater) scaleUpdater = setInterval(updateScale, 70);
            }
        }
    }

    function showPointer() {
        if (redCircle) {
            redCircle.setVisible(!redCircle.isVisible());
            document.getElementById('showPointer').value = "red=" + redCircle.isVisible();
        }
        document.getElementById("keyControlDiv").focus()
    }

    function setResize() {
        leapResizeLock = !leapResizeLock;
        document.getElementById('lockSize').value = "lock=" + leapResizeLock;
        document.getElementById("keyControlDiv").focus()
    }
    var leapOutput = document.getElementById('var');
    var skip = 0;
    var redCircleImage = gapi.hangout.av.effects.createImageResource('https://raw.githubusercontent.com/tjwei/gh_show/master/demo_imgs/red_circle.png');
    var redCircle;
    cameraData = null;
    document.getElementById('cameraButton').onclick = function() {
        cameraData = eval(document.getElementById('cameraParameter').value);
        console.log(cameraData);

    };
    redCircleImage.onLoad.add(function(result) {
        if (!result) {
            console.log("can not load the image of red circle");
            return;
        }
        redCircle = redCircleImage.showOverlay({
            scale: {
                magnitude: 0.05,
                reference: gapi.hangout.av.effects.ScaleReference.HEIGHT
            }
        });
        var pinchData = null;
        Leap.loop(function(frame) {
            // modify the following code to skip some frames        
            if (skip < 0) {
                skip += 1;
                return;
            }
            skip = 0;
            leapOutput.value = ""
                //for(var hi in frame.hands){
            if (frame.hands.length >= 1) {
                var hand = frame.hands[0];
                for (var fi in hand.fingers) {
                    if (hand.fingers[fi].type == 1) {
                        var position = hand.fingers[fi].tipPosition;
                        var x, y;
                        if (cameraData == null) {
                            x = (-position[0]) / 1280;
                            y = (200 - position[1]) / 720;
                            redCircle.setPosition(x, y);
                        } else {
                            var s = project(position, cameraData);
                            if (s != null) {
                                leapOutput.value += position[0].toFixed(1) + " " + position[1].toFixed(1) + " " + position[2].toFixed(1);
                                leapOutput.value += " " + s[0].toFixed(1) + " " + s[0].toFixed(1);
                                x = s[0] / 1280 - 0.5;
                                y = s[1] / 720 - 0.5;
                                redCircle.setPosition(x, y);
                                if (hand.pinchStrength > 0.9) {
                                    if (x > -0.55 && x < 0.55 && y > -0.55 && y < 0.55) {
                                        if (pinchData == null) {
                                            var bestOverlay = null;
                                            var bestDist = -1;
                                            var bestI;
                                            for (var i in overlays) {
                                                var ov = overlays[i];
                                                if (ov.leap) {
                                                    var pos = ov.getPosition();
                                                    var dist = (pos.x - x) * (pos.x - x) + (pos.y - y) * (pos.y - y);
                                                    if (bestDist == -1 || dist < bestDist) {
                                                        bestOverlay = ov;
                                                        bestDist = dist;
                                                        bestI = i;
                                                    }
                                                }

                                            }
                                            if (bestOverlay != null) {
                                                document.getElementById("info").innerHTML = "pinch " + bestI;
                                                pinchData = {
                                                    overlay: bestOverlay,
                                                    p: position,
                                                    x: x,
                                                    y: y,
                                                    opos: bestOverlay.getPosition(),
                                                    oscale: bestOverlay.getScale()
                                                }
                                            }
                                        } else {
                                            var overlay = pinchData.overlay;
                                            overlay.setPosition(pinchData.opos.x + x - pinchData.x,
                                                pinchData.opos.y + y - pinchData.y);
                                            if (!leapResizeLock) {
                                                var cz = position[2];
                                                var newScale = pinchData.oscale.magnitude;
                                                if (cz > pinchData.p[2] + 15)
                                                    newScale = pinchData.oscale.magnitude - (cz - pinchData.p[2] - 15) / 100;
                                                if (cz < pinchData.p[2] - 15)
                                                    newScale = pinchData.oscale.magnitude - (cz - pinchData.p[2] + 15) / 100; {
                                                    if (newScale < 0.02) newScale = 0.05;
                                                    if (newScale > 2.2) newScale = 2.0;
                                                    overlay.setScale(newScale, pinchData.oscale.reference);
                                                }
                                            }

                                        }

                                    }
                                } else {
                                    pinchData = null;
                                    document.getElementById("info").innerHTML = "";
                                }
                            }
                        }


                    }
                }
            }


        });
    });
    loadSlides();    
    document.getElementById('loadSlides').onclick = loadSlides;
    document.getElementById('keyControlDiv').onkeydown = keyControl;
    document.getElementById('showPointer').onclick = showPointer;
    document.getElementById('lockSize').onclick = setResize;
    document.getElementById("keyControlDiv").focus()

}

function init() {
    // When API is ready...                                                         
    gapi.hangout.onApiReady.add(
        function(eventObj) {
            if (eventObj.isApiReady) {
                ghSlides();
            }

        });
}
