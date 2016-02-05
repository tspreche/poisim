"use strict";
var PoiSim = PoiSim || {


        stopdraw: false,

        configInit: function () {
            this.config = {
                width: 600,
                height: 600,
                colorPoi: {
                    r: 'rgba(255,0,0,1)',
                    l: 'rgba(0,0,255,1)'
                },
                colorHand: {
                    r: 'rgba(255,125,0,1)',
                    l: 'rgba(0,125,255,1)'
                },
                colorCenter: {
                    r: 'rgba(0,125,0,1)',
                    l: 'rgba(0,255,0,1)'
                },
                cordLength: $('#cordLength').val(),
                armLength: $('#armLength').val(),
                continousPaint: $('#continousPaint').prop('checked'),
                firstactive: $('#firstactive').prop('checked'),
                secondactive: $('#secondactive').prop('checked'),
                drawReset: $('#drawReset').prop('checked'),
                preset: $('#preset').val()

            };
            this.patternlist = {
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

            if (this.config.preset !== "" && this.patternlist[this.config.preset] !== undefined) {
                this.config[r] = {
                    speedHand: this.patternlist[this.config.preset][r].speedHand,
                    speedPoi: this.patternlist[this.config.preset][r].speedPoi,
                    isolation: this.patternlist[this.config.preset][r].isolation
                };
                this.config[l] = {
                    speedHand: this.patternlist[this.config.preset][l].speedHand,
                    speedPoi: this.patternlist[this.config.preset][l].speedPoi,
                    isolation: this.patternlist[this.config.preset][l].isolation
                };
            } else {
                this.config[r] = {
                    speedHand: $('#speedHand').val(),
                    speedPoi: $('#speedPoi').val(),
                    isolation: $('#isolation').val()
                };
                this.config[l] = {
                    speedHand: $('#speedHand2').val(),
                    speedPoi: $('#speedPoi2').val(),
                    isolation: $('#isolation2').val()
                };
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

            c.save();

            //trail
            c.fillStyle = 'rgba(102, 102, 102, 0.01)';
            c.fillRect(0, 0, this.config.width, this.config.height);

            //go to center
            c.translate(300, 300);

            if (this.config.firstactive) {
                this.drawHand("r");
            }


            c.translate(20, 0);


            if (this.config.secondactive) {
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


            var rotateval = this.rotateInTime * this.config[id].speedHand;
            //c.rotate(rotateval);
            var rotatevaldegree = rotateval * 180 / Math.PI;
            rotatevaldegree = Math.floor(rotatevaldegree);


            c.translate(this.config.armLength / 2, -this.config.armLength / 2);

            //c.rotate(Math.PI + Math.PI/2); //135degree


            //c.beginPath();
            //c.moveTo(0, 0);
            //c.lineTo(this.config.cordLength, 0);
            //c.stroke();


            var split = 4;
            //var totalarround = 1000;
            var totalarround = 2 * Math.PI * this.config[id].speedHand;

            var partwidth = totalarround / split;
            var angel = 2 * Math.PI / split;


            for (var i = 1; i < split; i++) {

                if (rotateval > i * partwidth) {
                    c.translate(0, partwidth * 20);
                    console.log(rotateval);
                    console.log(i);
                    c.rotate(angel);
                }

            }

            var rotatevalrest = rotateval % partwidth;

            c.translate(0, rotatevalrest * 20);



            //c.beginPath();
            //c.moveTo(0, 0);
            //c.lineTo(this.config.cordLength, 0);
            //c.stroke();


            c.beginPath();
            //gravitiy center
            c.fillRect(-1, -1, 2, 2);
            c.fill();

            c.save();

            //c.translate(this.config.armLength, 0);


            for (var i = 1; i < split; i++) {

                if (rotateval > i * partwidth) {
                    console.log(i);
                    c.rotate(-angel);
                }

            }






            //
            var rotateval2 = this.rotateInTime * this.config[id].speedPoi;
            c.rotate(rotateval2);


            //go to hand from poi
            c.rotate(Math.PI);

            //orange hand
            c.fillStyle = this.config.colorHand[id];
            c.beginPath();
//            c.arc(this.config[id].isolation, 0, 8, 0, Math.PI * 2, false);
            c.fillRect(this.config[id].isolation - 5, -5, 10, 10);
            c.fill();


            c.save();
            c.translate(this.config[id].isolation, 0);

            //go back to poi
            c.rotate(Math.PI);

            //red poiball
            c.fillStyle = this.config.colorPoi[id];
            c.beginPath();
            c.arc(this.config.cordLength, 0, 8, 0, Math.PI * 2, false);
            c.fill();

//            if (Math.floor(rotateval2 * 20 * Math.PI) % 2 === 0) {
            c.save();

            //if config show cord
            //c.beginPath();
            //c.moveTo(0, 0);
            //c.lineTo(this.config.cordLength, 0);
            //c.stroke();

            c.restore();
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
 fade effect
 show poi line schnur on request
 isolations
 cateye
 trasitions
 preset of patterns
 sequence of patterns, editor and save, load
 fade effect

 */



