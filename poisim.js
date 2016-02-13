"use strict";
var PoiSim = PoiSim || {

        count: 0,
        stopdraw: false,

        doInit: function () {
            this.c = document.getElementById('canvas').getContext('2d');
            this.stopdraw = false;
            this.configInit();
            this.c.fillStyle = 'rgba(0, 0, 0, 1)';
            this.c.clearRect(0, 0, this.config.width, this.config.height); // clear canvas
            this.initTime = new Date();
        },

        configInit: function () {
            this.config = {
                width: 600,
                height: 600,
                colorPoi: {
                    r: 'rgba([[R]],[[G]],[[B]],1)',
                    l: 'rgba([[R]],[[G]],[[B]],1)'
                },
                colorHand: {
                    r: 'rgba(255,125,0,1)',
                    l: 'rgba(0,125,255,1)'
                },
                colorCenter: {
                    r: 'rgba(0,125,0,1)',
                    l: 'rgba(0,255,0,1)'
                },
                trail: $('#trail').val(),
                speed: $('#speed').val(),
                cordLength: $('#cordLength').val(),
                armLength: $('#armLength').val(),
                drawReset: $('#drawReset').prop('checked'),
                distance: $('#distance').val(),
                globalStartPosition: $('#globalStartPosition').val() * Math.PI / 180,
                preset: $('#preset').val()

            };

            this.config.colorPoi.r = this.config.colorPoi.r.replace("[[R]]", $('#colorPoiR').val());
            this.config.colorPoi.r = this.config.colorPoi.r.replace("[[G]]", $('#colorPoiG').val());
            this.config.colorPoi.r = this.config.colorPoi.r.replace("[[B]]", $('#colorPoiB').val());
            this.config.colorPoi.l = this.config.colorPoi.l.replace("[[R]]", $('#colorPoiR2').val());
            this.config.colorPoi.l = this.config.colorPoi.l.replace("[[G]]", $('#colorPoiG2').val());
            this.config.colorPoi.l = this.config.colorPoi.l.replace("[[B]]", $('#colorPoiB2').val());

            if (this.config.trail === "fire") {
                this.config.colorPoi = {
                    r: 'rgba(255,255,255,1)',
                    l: 'rgba(255,255,255,1)'
                };
                this.config.colorHand = {
                    r: 'rgba(30,0,0,1)',
                    l: 'rgba(30,0,0,1)'
                };
                this.config.colorCenter = {
                    r: 'rgba(30,0,0,1)',
                    l: 'rgba(30,0,0,1)'
                };
            }
            this.patternlist = {
                'Mercedes': {
                    r: {
                        isolation: 0,
                        speedHand: -1,
                        speedPoi: -3,
                        startPosition: 0
                    },
                    l: {
                        isolation: 0,
                        speedHand: 1,
                        speedPoi: 0,
                        startPosition: 0
                    }
                },
                '6PetalAntispin': {
                    r: {
                        isolation: 6,
                        speedHand: 1,
                        speedPoi: 6

                    },
                    l: {
                        isolation: 6,
                        speedHand: -1,
                        speedPoi: -6
                    }
                },
                '6PetalFlower': {
                    r: {
                        isolation: 6,
                        speedHand: -1,
                        speedPoi: 6
                    },
                    l: {
                        isolation: 6,
                        speedHand: 1,
                        speedPoi: -6
                    }
                }
            };

            var r = "r", l = "l";

            this.config[r] = {
                speedHand: $('#speedHand').val(),
                speedPoi: $('#speedPoi').val(),
                isolation: $('#isolation').val(),
                split: $('#split').val(),
                startPosition: $('#startPosition').val() * Math.PI / 180,
                activeHand: $('#activeHand').prop('checked'),
                showHand: $('#showHand').prop('checked'),
                activePoi: $('#activePoi').prop('checked'),
                showArm: $('#showArm').prop('checked'),
                showG: $('#showG').prop('checked'),
                showCord: $('#showCord').prop('checked'),
                showCenter: $('#showCenter').prop('checked')
            };
            this.config[l] = {
                speedHand: $('#speedHand2').val(),
                speedPoi: $('#speedPoi2').val(),
                isolation: $('#isolation2').val(),
                split: $('#split2').val(),
                startPosition: $('#startPosition2').val() * Math.PI / 180,
                activeHand: $('#activeHand2').prop('checked'),
                showHand: $('#showHand2').prop('checked'),
                activePoi: $('#activePoi2').prop('checked'),
                showArm: $('#showArm2').prop('checked'),
                showG: $('#showG2').prop('checked'),
                showCord: $('#showCord2').prop('checked'),
                showCenter: $('#showCenter2').prop('checked')
            };

            if (this.config.preset !== "" && this.patternlist[this.config.preset] !== undefined) {
                var pl = this.patternlist,
                    ps = this.config.preset;

                this.config[r].speedHand = pl[ps][r].speedHand;
                this.config[r].speedPoi = pl[ps][r].speedPoi;
                this.config[r].isolation = pl[ps][r].isolation;
                this.config[r].startPosition = pl[ps][r].startPosition;

                this.config[l].speedHand = pl[ps][l].speedHand;
                this.config[l].speedPoi = pl[ps][l].speedPoi;
                this.config[l].isolation = pl[ps][l].isolation;
                this.config[l].startPosition = pl[ps][l].startPosition;

            }

        },

        doDraw: function () {
            window.requestAnimationFrame($.proxy(this.draw, this));
        },

        draw: function () {
            var c = this.c;
            var time = new Date();
            this.count++;


            var diffTime = new Date(time - this.initTime);
            this.rotateInTime = ((2 * Math.PI) / 60) * diffTime.getSeconds() + ((2 * Math.PI) / 60000) * diffTime.getMilliseconds();

            this.rotateInTime = this.rotateInTime * this.config.speed % (2 * Math.PI);

            c.save();

            //trail fadetogrey
            if (this.config.trail == "fadetogrey") {
                c.fillStyle = 'rgba(102, 102, 102, 0.02)';
                c.fillRect(0, 0, this.config.width, this.config.height);
            }

            //trail notrail
            if (this.config.trail == "notrail") {
                c.clearRect(0, 0, 600, 600);
                //c.fillStyle = 'rgba(102, 102, 102, 0.02)';
                //c.fillRect(0, 0, this.config.width, this.config.height);
            }

            //doublepaint
            if (this.config.trail == "doublepaint") {

                //if(this.count % 10 === 0){

                var imgDataTemp = c.getImageData(0, 0, 600, 600);
                c.clearRect(0, 0, 600, 600);
                if (this.imgData) {
                    c.putImageData(this.imgData, 0, 0);
                }
                ;
                this.imgData = imgDataTemp;

                //}
            }


            //trail short trail
            if (this.config.trail == "shorttrail") {
                c.fillStyle = 'rgba(102, 102, 102, 0.1)';
                c.fillRect(0, 0, this.config.width, this.config.height);
            }

            //trail fire
            if (this.config.trail == "fire") {
                var redFade = 4;
                var greenFade = 9;
                var blueFade = 32;
                var lastImage = c.getImageData(0, 0, 600, 600);
                var pixelData = lastImage.data;
                var len = pixelData.length;

                for (var i = 0; i < len; i += 4) {
                    var r = pixelData[i];
                    if (r != 0) {

                        r -= redFade;
                        var g = pixelData[i + 1] - greenFade;
                        var b = pixelData[i + 2] - blueFade;
                        pixelData[i] = (r < 0) ? 0 : r;
                        pixelData[i + 1] = (g < 0) ? 0 : g;
                        pixelData[i + 2] = (b < 0) ? 0 : b;

                    }
                }
                c.putImageData(lastImage, 0, 0);
            }

            //trail to black
            if (this.config.trail == "trailtoblack") {
                var redFade = 4;
                var greenFade = 4;
                var blueFade = 4;
                var lastImage = c.getImageData(0, 0, 600, 600);
                var pixelData = lastImage.data;
                var len = pixelData.length;

                for (var i = 0; i < len; i += 4) {
                    var r = pixelData[i];
                    //if (r != 0) {

                    r -= redFade;
                    var g = pixelData[i + 1] - greenFade;
                    var b = pixelData[i + 2] - blueFade;
                    pixelData[i] = (r < 0) ? 0 : r;
                    pixelData[i + 1] = (g < 0) ? 0 : g;
                    pixelData[i + 2] = (b < 0) ? 0 : b;

                    //}
                }
                c.putImageData(lastImage, 0, 0);
            }





            //go to center
            c.translate(300, 300);


            //start position, inital rotation
            c.rotate(this.config.globalStartPosition);

            if (this.config["r"].activeHand) {
                this.drawHand("r");
            }
            c.rotate(-this.config.globalStartPosition);

            c.translate(this.config.distance, 0);

            c.rotate(this.config.globalStartPosition);
            if (this.config["l"].activeHand) {
                this.drawHand("l");
            }

            c.restore();

            var endtime = new Date();
            window.console.log(new Date(endtime - time).getMilliseconds());


            if (!this.stopdraw) {
                this.doDraw();
            }

        },

        //id is r = right, l = left, aka poi number
        drawHand: function (id) {
            var c = this.c;

            c.fillStyle = this.config.colorCenter[id];
            c.beginPath();
            //circle at center
            if (this.config[id].showCenter) {
                c.arc(0, 0, 5, 0, Math.PI * 2, false);
                c.fill();
            }
            c.save();


            var rotateval = (this.rotateInTime * this.config[id].speedHand) % (2 * Math.PI);

            c.rotate(this.config[id].startPosition);

            //normal circle rotate
            c.rotate(rotateval);
            c.translate(this.config.armLength, 0);


            if (this.config[id].showG) {
                //gravitiy center
                c.beginPath();
                c.fillRect(-1, -1, 2, 2);
                c.fill();
            }

            c.save();

            //c.translate(this.config.armLength, 0);

            //
            var rotateval2 = this.rotateInTime * this.config[id].speedPoi * Math.abs(this.config[id].speedHand);
            c.rotate(rotateval2);


            //go to hand from poi for isolation
            c.rotate(Math.PI);


            c.save();
            //c.translate(this.config[id].isolation * Math.cos(rotateval2), 0);
            c.translate(this.config[id].isolation, 0);


            if (this.config[id].showHand) {

                //orange hand
                c.fillStyle = this.config.colorHand[id];
                c.beginPath();
                c.fillRect(-3, -3, 6, 6);
                c.fill();

            }


            if (this.config[id].showArm) {

                c.save();

                var arm = this.config.armLength;
                var iso = this.config[id].isolation;

                var x = Math.sqrt(Math.pow(arm, 2) + Math.pow(iso, 2) - 2 * arm * iso * Math.cos(rotateval2));

                var ro4 = Math.asin(Math.sin(rotateval2) * iso / x);

                var ro3 = Math.PI - rotateval2 - ro4;

                c.rotate(ro3 + Math.PI);
                c.beginPath();
                c.moveTo(0, 0);
                c.lineTo(x, 0);
                c.stroke();
                c.restore();

            }


            //go back to poi
            c.rotate(Math.PI);

            if (this.config[id].activePoi) {
                //red poiball
                c.fillStyle = this.config.colorPoi[id];
                c.beginPath();
                c.arc(this.config.cordLength, 0, 8, 0, Math.PI * 2, false);
                c.fill();

                //            if (Math.floor(rotateval2 * 20 * Math.PI) % 2 === 0) {
                c.save();

                //if config show cord

                if (this.config[id].showCord) {
                    c.beginPath();
                    c.moveTo(0, 0);
                    c.lineTo(this.config.cordLength, 0);
                    c.stroke();
                }

                c.restore();
            }

            c.restore();
            c.restore();
            c.restore();
        }

    };

function valBetween(v, min, max) {
    return (v > min) ? ((v < max) ? v : max) : min;
}

//document.ready
$(function () {

    var ps = PoiSim;
    ps.doInit();
    ps.doDraw();


    $('#start').on("click", function () {
        ps.doInit();
        ps.doDraw();
    });
    $('#stop').on("click", function () {
        ps.stopdraw = true;
    });
    $('#continue').on("click", function () {
        ps.stopdraw = false;
        ps.doDraw();
    });
    $('#reset').on("click", function () {
        ps.doInit();
    });
    $('.doDrawReset').on("change", function () {
        if (ps.config.drawReset) {
            ps.doInit();
        }
        else {
            ps.configInit();
        }
    });

});


/*
 wishlist:
 done, fade effect
 done show poi line cord on request
 done isolations
 cateye
 transitions
 started, preset of patterns
 sequence of patterns, editor and save, load -> Meteor
 done firepoi effect
 share it
 mobile tauglich
 zurbfoundation
 metoer mobile app



 */



