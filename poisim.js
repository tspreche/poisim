
var PoiSim = PoiSim || {

        stopdraw : false,

        doInit : function () {
            this.c = document.getElementById('canvas').getContext('2d');
            this.stopdraw = false;
            this.configInit();
            this.c.clearRect(0, 0, this.config.width, this.config.height); // clear canvas
            this.initTime = new Date();
        },

        configInit : function () {
            this.config = {
                width: 600,
                height: 600,
                cordLength: $('#cordLength').val(),
                armLength: $('#armLength').val(),
                continousPaint: $('#continousPaint').prop('checked'),
                firstactive: $('#firstactive').prop('checked'),
                drawReset: $('#drawReset').prop('checked'),
                preset : $('#preset').val(),
            };
            this.patternlist = {
                '6PetalAntispin': {
                    //direction
                    //hand path, example: 3star. quadrat, hexagon
                    isolation: 20,
                    speedHand: 6,
                    speedPoi: -3
                },
                '6PetalFlower': {
                    //direction
                    //hand path, example: 3star. quadrat, hexagon
                    isolation: 20,
                    speedHand: 6,
                    speedPoi: -3
                }
            };

            if (preset !== "" && this.patternlist[preset] != undefined)
            {
                this.config.speedHand = this.patternlist[preset].speedHand;
                this.config.speedPoi = this.patternlist[preset].speedHand;
                this.config.isolation = this.patternlist[preset].isolation;
            } else {
                this.config.speedHand = $('#speedHand').val();
                this.config.speedPoi = $('#speedPoi').val();
                this.config.isolation = $('#isolation').val();
            }



        },

        doDraw : function () {
            window.requestAnimationFrame($.proxy(this.draw, this));
        },

        draw : function () {
            var time = new Date();
            var diffTime = new Date(time - this.initTime);
            var rotateInTime = ((2 * Math.PI) / 60) * diffTime.getSeconds() + ((2 * Math.PI) / 60000) * diffTime.getMilliseconds();



            var c = this.c;




            c.save();


            c.fillStyle = 'rgba(51, 51, 51, .02)';
            c.fillRect(0, 0, this.config.width, this.config.height);

            //go to center
            c.translate(300, 300);

            if (this.config.firstactive) {


                //green hand or first ring if isolation
                c.fillStyle = 'rgba(0,255,0,1)';
                c.beginPath();

                //circle at center
                c.arc(0, 0, 5, 0, Math.PI * 2, false);
                c.fill();
                c.save();


                var rotateval = rotateInTime * this.config.speedHand;


                //c.rotate(rotateval);
                c.translate(0,rotateval*50);

                c.beginPath();
                //gravitiy center
                c.fillRect((this.config.armLength) - 1, -1, 2, 2);
                c.fill();

                c.save();
                c.translate(this.config.armLength, 0);

                //rotateval2 = rotateval * $('#speed2').val();
                var rotateval2 = rotateInTime * this.config.speedPoi;
                c.rotate(rotateval2);



                c.rotate(Math.PI);

                //orange hand
                c.fillStyle = 'rgba(255,125,0,1)';
                c.beginPath();
//            c.arc(this.config.isolation, 0, 8, 0, Math.PI * 2, false);
                c.fillRect(this.config.isolation - 5, -5, 10, 10);
                c.fill();


                c.save();
                c.translate(this.config.isolation, 0);

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
//            }

                //c.restore();




                c.restore();

                c.restore();

            }

            c.restore();




            //refactor second
            if ($('#secondactive').prop('checked')) {

                c.save();

                c.translate(250 + parseInt($('#distance').val()), 250);

                //mangenta hand
                c.fillStyle = 'rgba(0,255,255,1)';
                c.beginPath();
                c.arc(0, 0, 5, 0, Math.PI * 2, false);
                c.fill();
                c.save();


                rotateval = rotateInTime * $('#speed3').val();

                c.rotate(rotateval);


                c.beginPath();
                c.fillRect(this.config.cordLength - 5, -5, 10, 10);
                c.fill();

                c.save();
                c.translate(this.config.cordLength, 0);

                rotateval2 = rotateval * $('#speed4').val();
                c.rotate(rotateval2);


                //yellow poiball
                c.fillStyle = 'rgba(255,255,0,1)';
                c.beginPath();
                c.arc(config.cordLength, 0, 10, 0, Math.PI * 2, false);
                c.fill();
                //c.restore();


                c.restore();
                c.restore();
            }

            c.restore();
            c.restore();


            if (!this.stopdraw) {
                this.doDraw();
            }

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
        if(ps.config.drawReset) {
            ps.doInit();
        }
        else{
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



