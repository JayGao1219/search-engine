
    function ready() {
                result = $('.list');
                reslut = "";
                key = "";
                reger1 = new RegExp(key, "gm");
                var aaa = $('.hhh');
                for (let i = 0; i < aaa.length; ++i) {
                    a = $(aaa[i]).html();
                    toRed(a, 'whole');
                }

                function toRed(content, id) {
                    var bodyHtml = $("#" + id).html();
                    reger = new RegExp("(>|^)([^<]*)(" + content + ")([^>]*<)", "gm");
                    reslut = bodyHtml.replace(reger, "$1$2<font color='red'>$3</font>$4");
                    $("#" + id).html(reslut);
                }
                $('#toHide').hide();
                changeTo(0);
                var buttons = $('#buttons');
                for (let i = 0; i < result.length / 10; ++i) {
                    let b = document.createElement('button');
                    let bb = $(b);
                    bb.text(i + 1);
                    buttons.append(b);

                    (function() {
                        var index = i;
                        $(bb).click(function() {
                            changeTo(i);
                        });

                    })();
                    bb.css('float', 'left');
                    bb.css('backgroundColor', 'white');
                    bb.css('font-weight', 'bold');
                    bb.css('color', '#4a4a4a');

                }
            }

            function changeTo(index) {
                result = $('.list');
                if (result.length < index * 10)
                    return;
                for (let i = 0; i < result.length; ++i) {
                    let a = $(result[i]);
                    a.hide();
                }
                for (let i = index * 10; i < (index + 1) * 10 && i < result.length; ++i) {
                    let a = $(result[i]);
                    a.show();
                }

            }
$(function() {
    ready();
});