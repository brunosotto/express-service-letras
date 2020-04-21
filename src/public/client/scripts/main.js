var animabanners = (function ($) {
    "use strict";

    function show(data) {
        data.text = data.text.replace(/(?:\r\n|\r|\n)/g, '<br>');
        $("#message").html(data.text);

        // tamanho do texto
        if (data.size) {
            $("#message").css("font-size", data.size + "rem");
        }

        // pad
        if (data.pad) {
            $("#message").css("padding", data.pad + "rem 0");
        }

        // topo ou base
        if (data.top) {
            $("body").removeClass("end");
        } else {
            $("body").addClass("end");
        }
    }

    function _ready() {
        setInterval(() => {
            $.get("../api/text", show);
        }, 300);
    }

    $(function () {
        _ready();
    });

})(jQuery);
