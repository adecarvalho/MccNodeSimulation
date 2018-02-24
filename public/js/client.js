//****************************
$(document).ready(function() {

    var gaugeTensionUa = undefined;
    var gaugeCourantIe = undefined;
    var gaugeCoupleCharge=undefined;

    var gaugeCourantIa = $('#gauge_courant_ia');
    var gaugeVitesse = $('#gauge_vitesse');

    var gaugePuissanceAbsorbee = $('#gauge_puissance_absorbee');
    var gaugePuissanceUtile = $('#gauge_puissance_utile');

    var socket=undefined;

    //
    var reglages={
        ua:0,
        ie:200,
        cr:0,
    };

    //sockets
    socket=io.connect();

    //*************************************
    // gauge tension primaire
    //**************************************
    gaugeTensionUa = $('#gauge_tension_ua').SonicGauge({
        label: 'Ua[V]',
        start: {
            angle: -225,
            num: 0
        },
        end: {
            angle: 45,
            num: 220
        },
        style: {
            "needle": {
                "fill": "#fff",
                "height": 2,
            },
        },
        markers: [{
            gap: 20,
            line: {
                "width": 20,
                "stroke": "none",
                "fill": "#eeeeee"
            },
            text: {
                "space": 22,
                "text-anchor": "middle",
                "fill": "#000",
                "font-size": 18
            }
        }, {
            gap: 20,
            line: {
                "width": 12,
                "stroke": "none",
                "fill": "#aaaaaa"
            },
            text: {
                "space": 18,
                "text-anchor": "middle",
                "fill": "#000",
                "font-size": 12
            }
        }, {
            gap: 10,
            line: {
                "width": 8,
                "stroke": "none",
                "fill": "#999999"
            }
        }],
        animation_speed: 500
    });
    //*************************************
    // gauge courant Ie
    //**************************************
    gaugeCourantIe = $('#gauge_courant_ie').SonicGauge({
        label: 'Ie[mA]',
        start: {
            angle: -225,
            num: 0
        },
        end: {
            angle: 45,
            num: 240
        },
        style: {
            "needle": {
                "fill": "#fff",
                "height": 2,
            },
        },
        markers: [{
            gap: 20,
            line: {
                "width": 20,
                "stroke": "none",
                "fill": "#eeeeee"
            },
            text: {
                "space": 22,
                "text-anchor": "middle",
                "fill": "#000",
                "font-size": 18
            }
        }, {
            gap: 20,
            line: {
                "width": 12,
                "stroke": "none",
                "fill": "#aaaaaa"
            },
            text: {
                "space": 18,
                "text-anchor": "middle",
                "fill": "#000",
                "font-size": 12
            }
        }, {
            gap: 10,
            line: {
                "width": 8,
                "stroke": "none",
                "fill": "#999999"
            }
        }],
        animation_speed: 500
    });
    //********************************
    //gauge couple charge
    //********************************
    gaugeCoupleCharge = $('#gauge_couple_charge').SonicGauge({
        label: 'Couple[Nm]',
        start: {
            angle: -225,
            num: 0
        },
        end: {
            angle: 45,
            num: 15
        },
        style: {
            "needle": {
                "fill": "#fff",
                "height": 2,
            },
        },
        markers: [{
            gap: 5,
            line: {
                "width": 20,
                "stroke": "none",
                "fill": "#eeeeee"
            },
            text: {
                "space": 22,
                "text-anchor": "middle",
                "fill": "#000",
                "font-size": 18
            }
        }, {
            gap: 1,
            line: {
                "width": 12,
                "stroke": "none",
                "fill": "#aaaaaa"
            },
            text: {
                "space": 18,
                "text-anchor": "middle",
                "fill": "#000",
                "font-size": 12
            }
        }, {
            gap: 2,
            line: {
                "width": 8,
                "stroke": "none",
                "fill": "#999999"
            }
        }],
        animation_speed: 500
    });
    //********************************
    //******* slider ua *************
    //*******************************
    $("#range_ua").ionRangeSlider({
        type:'single',
        hide_min_max:true,
        hide_from_to:true,
        keyboard:true,
        min:0,
        max:220,
        from:0,
        step:1,
        grid:true,
        onFinish:function(data){
            reglages.ua=data.from
            gaugeTensionUa.SonicGauge('val',reglages.ua);
            socket.emit('reglages',reglages)
        },
    });
    //*******************************
    //******* slider Ie *************
    //*******************************
    $("#range_ie").ionRangeSlider({
        type:'single',
        hide_min_max:true,
        hide_from_to:true,
        keyboard:true,
        min:0,
        max:240,
        from:0,
        step:1,
        grid:true,
        onFinish:function(data){
            reglages.ie=data.from;
            gaugeCourantIe.SonicGauge('val',reglages.ie);
            socket.emit('reglages',reglages)
        },
    });
    //*******************************
    //******* slider cr *************
    //*******************************
    $("#range_cr").ionRangeSlider({
        type:'single',
        hide_min_max:true,
        hide_from_to:true,
        keyboard:true,
        min:0,
        max:10,
        from:0,
        step:0.1,
        grid:true,
        onFinish:function(data){
            reglages.cr=data.from;
            gaugeCoupleCharge.SonicGauge('val',reglages.cr);
            socket.emit('reglages',reglages)
        },
    });
    //*******************************
    function setMesures(ia,vit,pabs,put){

        gaugeCourantIa.text(ia);

        gaugeVitesse.text(vit);

        gaugePuissanceAbsorbee.text(pabs);

        gaugePuissanceUtile.text(put);
    }
    //*********************************
    setMesures(0,0,0,0);
    //
    //***********************************
    socket.on("mesures",function(datas){
        //console.log(datas);
        gaugeCourantIa.text(datas.ia.toFixed(2));
        //
        gaugeVitesse.text(datas.vit.toFixed(0));
        //
        gaugePuissanceAbsorbee.text(datas.pabs.toFixed(0));
        //
        gaugePuissanceUtile.text(datas.put.toFixed(0));
    });
});
//fin
