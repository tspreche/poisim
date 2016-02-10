"use strict";
var PoiSim = PoiSim || {


        stopdraw: false,

        configInit: function () {
            this.config = {
                width: 600,
                height: 600,
                colorPoi: {
                    //r: 'rgba(255,0,0,1)',
                    r: 'rgba(255,255,255,1)',
                    //l: 'rgba(0,0,255,1)'
                    l: 'rgba(255,255,255,1)'
                },
                colorHand: {
                    r: 'rgba(255,125,0,1)',
                    l: 'rgba(0,125,255,1)'
                },
                colorCenter: {
                    r: 'rgba(0,125,0,1)',
                    l: 'rgba(0,255,0,1)'
                },
                speed: $('#speed').val(),
                cordLength: $('#cordLength').val(),
                armLength: $('#armLength').val(),
                continousPaint: $('#continousPaint').prop('checked'),
                drawReset: $('#drawReset').prop('checked'),
                distance: $('#distance').val(),
                globalStartPosition: $('#globalStartPosition').val() * Math.PI / 180,
                preset: $('#preset').val()

            };
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
                '6PetalFlower': {
                    r: {
                        isolation: 0,
                        speedHand: 6,
                        speedPoi: 36,
                        split: 3,
                        splitstart: 0.5

                    },
                    l: {
                        isolation: 0,
                        speedHand: -6,
                        speedPoi: -36,
                        split: 3,
                        splitstart: 0.5
                    }
                },
                '6PetalAntispin': {
                    r: {
                        isolation: 0,
                        speedHand: 6,
                        speedPoi: -36,
                        split: 6
                    },
                    l: {
                        isolation: 0,
                        speedHand: -6,
                        speedPoi: 36,
                        split: 6
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
                showCord: $('#showCord').prop('checked')
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
                showCord: $('#showCord2').prop('checked')
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

        doInit: function () {
            this.c = document.getElementById('canvas').getContext('2d');
            this.stopdraw = false;
            this.configInit();
            this.c.fillStyle = 'rgba(0, 0, 0, 1)';
            this.c.clearRect(0, 0, this.config.width, this.config.height); // clear canvas
            this.initTime = new Date();
        },

        doDraw: function () {
            window.requestAnimationFrame($.proxy(this.draw, this));
        },

        draw: function () {
            var c = this.c;
            var time = new Date();
            var diffTime = new Date(time - this.initTime);
            this.rotateInTime = ((2 * Math.PI) / 60) * diffTime.getSeconds() + ((2 * Math.PI) / 60000) * diffTime.getMilliseconds();

            this.rotateInTime = this.rotateInTime * this.config.speed % (2 * Math.PI);

            c.save();

            //trail v1
            //c.fillStyle = 'rgba(102, 102, 102, 0.02)';
            //c.fillRect(0, 0, this.config.width, this.config.height);

            //trail v2

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

            if (!this.stopdraw) {
                this.doDraw();
            }

        },

        //id is r = right, l = left, aka poi number
        drawHand: function (id) {
            var c = this.c;
            //green hand or first ring if isolation
            c.fillStyle = this.config.colorCenter[id];
            c.beginPath();

            //circle at center
            c.arc(0, 0, 5, 0, Math.PI * 2, false);
            c.fill();
            c.save();


            var rotateval = (this.rotateInTime * this.config[id].speedHand) % (2 * Math.PI);


            c.rotate(this.config[id].startPosition);

            //hand pattern. normal circle or vieleck/ploygon pattern
            if (this.config[id].split && this.config[id].split != 0) {
                //draw rechteck pfad


                c.translate(this.config.armLength / 1.44, -this.config.armLength / 1.44);

                var split = this.config[id].split;
                var totalarround = 2 * Math.PI;

                var partwidth = totalarround / split;
                var angel = 2 * Math.PI / split;


                for (var i = 1; i < split; i++) {

                    if (rotateval > i * partwidth) {
                        c.translate(0, partwidth * this.config.armLength);
                        //console.log(rotateval);
                        //console.log(i);
                        c.rotate(angel);
                    }

                }

                var rotatevalrest = rotateval % partwidth;

                c.translate(0, rotatevalrest * this.config.armLength);

            }
            else {
                //normal circle rotate
                c.rotate(rotateval);
                c.translate(this.config.armLength, 0);
            }


            if (this.config[id].showG) {
                //gravitiy center
                c.beginPath();
                c.fillRect(-1, -1, 2, 2);
                c.fill();
            }

            c.save();

            //c.translate(this.config.armLength, 0);


            if (this.config[id].split && this.config[id].split != 0) {

                //rotate back poi the same as hand was rotated forwared, for not jumping poi when hand changes direction
                for (var j = 1; j < split; j++) {

                    if (rotateval > j * partwidth) {
                        //console.log(j);
                        c.rotate(-angel);
                    }

                }

            }


            //
            var rotateval2 = this.rotateInTime * this.config[id].speedPoi * Math.abs(this.config[id].speedHand);
            c.rotate(rotateval2);


            //go to hand from poi for isolation
            c.rotate(Math.PI);


            c.save();
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
 done show poi line schnur on request
 done isolations
 cateye
 transitions
 started, preset of patterns
 sequence of patterns, editor and save, load -> Meteor
 firepoi effect

 */



