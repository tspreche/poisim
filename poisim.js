var PoiSim = PoiSim || {

        stopdraw: false,

        configInit: function () {
            this.config = {
                width: 600,
                height: 600,
                cordLength: $('#cordLength').val(),
                armLength: $('#armLength').val(),
                continousPaint: $('#continousPaint').prop('checked'),
                firstactive: $('#firstactive').prop('checked'),
                secondactive: $('#secondactive').prop('checked'),
                drawReset: $('#drawReset').prop('checked'),
                preset: $('#preset').val()
            };
            this.patternlist = {
                '6PetalAntispin': {
                    r: {
                        isolation: 0,
                        speedHand: 6,
                        speedPoi: -36
                    },
                    l: {
                        isolation: 0,
                        speedHand: -6,
                        speedPoi: -36
                    }
                },
                '6PetalFlower': {
                    r: {
                        isolation: 0,
                        speedHand: 6,
                        speedPoi: 36
                    },
                    l: {
                        isolation: 0,
                        speedHand: -6,
                        speedPoi: 36
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
                this.drawPoi("r");
            }


            if (this.config.secondactive) {
                this.drawPoi("l");
            }

            c.restore();

            if (!this.stopdraw) {
                this.doDraw();
            }

        },

        //id is r = right, l = left, aka poi number
        drawPoi: function (id) {
            var c = this.c;
            //green hand or first ring if isolation
            c.fillStyle = 'rgba(0,255,0,1)';
            c.beginPath();

            //circle at center
            c.arc(0, 0, 5, 0, Math.PI * 2, false);
            c.fill();
            c.save();


            var rotateval = this.rotateInTime * this.config[id].speedHand;


            c.rotate(rotateval);
            //c.translate(0, rotateval * 50);

            c.beginPath();
            //gravitiy center
            c.fillRect((this.config.armLength) - 1, -1, 2, 2);
            c.fill();

            c.save();
            c.translate(this.config.armLength, 0);

            var rotateval2 = this.rotateInTime * this.config[id].speedPoi;
            c.rotate(rotateval2);


            c.rotate(Math.PI);

            //orange hand
            c.fillStyle = 'rgba(255,125,0,1)';
            c.beginPath();
//            c.arc(this.config[id].isolation, 0, 8, 0, Math.PI * 2, false);
            c.fillRect(this.config[id].isolation - 5, -5, 10, 10);
            c.fill();


            c.save();
            c.translate(this.config[id].isolation, 0);

            c.rotate(Math.PI);

            //red poiball
            c.fillStyle = 'rgba(255,0,0,1)';
            c.beginPath();
            c.arc(this.config.cordLength, 0, 8, 0, Math.PI * 2, false);
            c.fill();

//            if (Math.floor(rotateval2 * 20 * Math.PI) % 2 === 0) {
            c.save();
            c.beginPath();
            c.moveTo(0, 0);
            c.lineTo(this.config.cordLength, 0);
            c.stroke();

            c.restore();
            c.restore();
            c.restore();
            c.restore();
        }

    };


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



