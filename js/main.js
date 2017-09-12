$(function() {
    $("#JPtimeFrom").datepicker();
    $("#FBtimeFrom").datepicker();
    $("#JPtimeTo").datepicker();
    $("#FBtimeTo").datepicker();
});
var advancedClick = 0;
$(function() {
    $("#show").on('click', function() {
        ++advancedClick;
        if (advancedClick % 2) {
            $('#better').show();
        } else {
            $('#better').hide();
        }
    })
});
var Url = "http://bc2.citr.me:8000/search?type_of_model=0&index=law&doc_type=big_data&search_content=";
var getJSON = [];
var getIt = false;
var Url1 = "http://bc2.citr.me:8000/doc?index=law&doc_type=big_data&id=";

function createCORSRequest(method, url) {
    console.info("test");
    console.info(url);
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
        // XHR for Chrome/Firefox/Opera/Safari.
        xhr.open(method, url, true);
    } else if (typeof XDomainRequest != "undefined") {
        // XDomainRequest for IE.
        xhr = new XDomainRequest();
        xhr.open(method, url);
    } else {
        // CORS not supported.
        xhr = null;
    }
    return xhr;
}

$(function() {
    $('#doSearch').on('click', function() {
        var xml;
        getIt = false;
        if ($('#write').val() === "")
            return;
        var current = $('#write').val();
        xml = createCORSRequest('GET', Url + escape(current));
        xml.onload = function() {
            console.info("success");
            getJSON = JSON.parse(xml.responseText);
            test();
        }
        xml.onerror = function() {
            alert('Woops, there was an error making the request.');
        };
        xml.send();
    })
});
var div;
var a;
var p;

function test() {
    let l = getJSON.length;
    if (l % 10)
        l = l / 10 + 1;
    else
        l = l / 10;
    $('#logo').hide();
    div = $('#resultList');
    div.show();
    changeTo(1);
    var buttons = $('#buttons');
    for (let i = 0; i < l - 1; ++i) {
        let b = document.createElement('button');
        b.id = "button" + i;
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
    if (arguments.length === 0)
        return;
    del();
    for (let i = (index - 1) * 10; i < index * 10; ++i) {
        a = document.createElement('a');
        p = document.createElement('p');
        a.id = "" + i + "";
        p.id = "p" + i + "";
        div.append('<br/>')
        div.append(a);
        div.append('<br/>');
        div.append(p);
        div.append('<br/>');
        let cur = $(a);
        cur.attr('href', Url1 + getJSON[i].id);
        cur.css('float', 'left');
        cur.text(getJSON[i].title);
        cur.attr('display', 'block');
        let curr = $(p);
        curr.text(getJSON[i].shortcut);
    }
}

function del() {
    var li = $('#resultList>p');
    li.remove();
    li = $('#resultList>a');
    li.remove();
    li = $('#resultList>br');
    li.remove();
}
