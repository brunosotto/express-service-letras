var animabanners = (function ($) {
    "use strict";

    function show(data) {
        data.text = data.text.replace(/(?:\r\n|\r|\n)/g, '<br>');
        $("#message").html(data.text);

        // tamanho do texto
        if (data.size) {
            $("#message").css("font-size", data.size + "em");
        }

        // pad
        if (data.pad) {
            $("#message").css("padding", data.pad + "em 0");
        }

        // topo ou base
        if (data.top) {
            $("body").removeClass("end");
        } else {
            $("body").addClass("end");
        }
    }

    function _ready() {
        // setInterval(() => {
        //     $.get("../api/text", show);
        // }, 300);

        var socket = io(window.location.origin);
        socket.on('connect', function(){ console.log('connect'); });
        socket.on('data-show', show);
        socket.on('disconnect', function(){ console.log('disconnect'); });
    }

    $(function () {
        _ready();
    });

})(jQuery);
