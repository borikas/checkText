function checkText() {
    var res = '';
    var textframe = $("#text").contents().find('.frameBody').text();
    var lang = $("#language").val();
    var text = removeTag(textframe);
    var alphabet_kr = ' А а Б б В в Г г Д д Е е Ж ж И и Й й К к Л л М м Н н О о П п Р р С с Т т У у Ф ф Х х Ц ц Ч ч Ш ш Щ щ Ь ь Ю ю Я я';
    var alphabet_ru = ' Ё ё Ъ ъ Ы ы Э э';
    var alphabet_ua = ' Є є	Ґ ґ Ї ї і І';
    var alphabet_as = ' A a B b C c D d E e F f G g H h I i J j K k L l M m N n O o P p Q q R r S s T t U u V v W w X x Y y Z z';

    if(text == 0) {
        return false;
    }

    for (var i = 0; i < text.length; i++) {
        var code = text[i].charCodeAt(0);
        if (lang == 0) { //English
            var alphabet = alphabet_ru + alphabet_ua + alphabet_kr;
            if (((code >= 1040) && (code <= 1105)) || (code == 1025) || (code == 1105) || (code == 1066) || (code == 1098) || (code == 1067) || (code == 1099) || (code == 1069) || (code == 1101) || (code == 1028) || (code == 1108) || (code == 1168) || (code == 1169) || (code == 1031) || (code == 1111) || (code == 1110) || (code == 1030)) {
                if(alphabet.search(text[i]) != -1) {
                    res = res + '<b>'+text[i]+'</b>';
                }
                else {
                    res = res + text[i];
                }
            }
            else {
                res = res + text[i];
            }
        } else if (lang == 1) { //Українська
            var alphabet = alphabet_as + alphabet_ru;
            if (((code >= 65) && (code <= 90)) || ((code >= 97) && (code <= 122)) || (code == 1025) || (code == 1105) || (code == 1066) || (code == 1098) || (code == 1067) || (code == 1099) || (code == 1069) || (code == 1101)) {
                if(alphabet.search(text[i]) != -1) {
                    res = res + '<b>'+text[i]+'</b>';
                }
                else {
                    res = res + text[i];
                }
            }
            else {
                res = res + text[i];
            }
        }
        else if (lang == 2) { //Русский
            var alphabet = alphabet_as + alphabet_ua;
            if (((code >= 65) && (code <= 90)) || ((code >= 97) && (code <= 122)) || (code == 1028) || (code == 1108) || (code == 1168) || (code == 1169) || (code == 1031) || (code == 1111) || (code == 1110) || (code == 1030)) {
                if(alphabet.search(text[i]) != -1) {
                    res = res + '<b>'+text[i]+'</b>';
                }
                else {
                    res = res + text[i];
                }
            }
            else {
                res = res + text[i];
            }
        }
    }

    showError(res);
}

function removeTag(str){
    return str.replace(/<\/?[^>]+(>|$)/g, "");
}

function showError(str) {
    $("#text").contents().find('.frameBody').html(str);
    return false;
}

jQuery.fn.rte = function(css_url, media_url) {

    if(document.designMode || document.contentEditable)
    {
        $(this).each( function(){
            var textarea = $(this);
            enableDesignMode(textarea);
        });
    }

    function formatText(iframe, command, option) {
        iframe.contentWindow.focus();
        try{
            iframe.contentWindow.document.execCommand(command, false, option);
        }catch(e){console.log(e)}
        iframe.contentWindow.focus();
    }

    function tryEnableDesignMode(iframe, doc, callback) {
        try {
            iframe.contentWindow.document.open();
            iframe.contentWindow.document.write(doc);
            iframe.contentWindow.document.close();
        } catch(error) {
            console.log(error)
        }
        if (document.contentEditable) {
            iframe.contentWindow.document.designMode = "On";
            callback();
            return true;
        }
        else if (document.designMode != null) {
            try {
                iframe.contentWindow.document.designMode = "on";
                callback();
                return true;
            } catch (error) {
                console.log(error)
            }
        }
        setTimeout(function(){tryEnableDesignMode(iframe, doc, callback)}, 250);
        return false;
    }

    function enableDesignMode(textarea) {
        // need to be created this way
        var iframe = document.createElement("iframe");
        iframe.frameBorder=0;
        iframe.frameMargin=0;
        iframe.framePadding=0;
        iframe.height=200;
        if(textarea.attr('class'))
            iframe.className = textarea.attr('class');
        if(textarea.attr('id'))
            iframe.id = textarea.attr('id');
        if(textarea.attr('name'))
            iframe.title = textarea.attr('name');
        textarea.after(iframe);
        var css = "";
        if(css_url)
            var css = "<link type='text/css' rel='stylesheet' href='"+css_url+"' />"
        var content = textarea.val();
        // Mozilla need this to display caret
        if($.trim(content)=='')
            content = '<br>';
        var doc = "<html><head>"+css+"</head><body class='frameBody'>"+content+"</body></html>";
        tryEnableDesignMode(iframe, doc, function() {
            $("#toolbar-"+iframe.title).remove();
            $(iframe).before(toolbar(iframe));
            textarea.remove();
        });
    }

    function disableDesignMode(iframe, submit) {
        var content = iframe.contentWindow.document.getElementsByTagName("body")[0].innerHTML;
        if(submit==true)
            var textarea = $('<input type="hidden" />');
        else
            var textarea = $('<textarea cols="40" rows="10"></textarea>');
        textarea.val(content);
        t = textarea.get(0);
        if(iframe.className)
            t.className = iframe.className;
        if(iframe.id)
            t.id = iframe.id;
        if(iframe.title)
            t.name = iframe.title;
        $(iframe).before(textarea);
        if(submit!=true)
            $(iframe).remove();
        return textarea;
    }

    function toolbar(iframe) { return false;

        var tb = $("<div class='rte-toolbar' id='toolbar-"+iframe.title+"'><div>\
            <p>\
                <select>\
                    <option value=''>Bloc style</option>\
                    <option value='p'>Paragraph</option>\
                    <option value='h3'>Title</option>\
                </select>\
            </p>\
            <p>\
                <a href='#' class='bold'><img src='"+media_url+"bold.gif' alt='bold' /></a>\
                <a href='#' class='italic'><img src='"+media_url+"italic.gif' alt='italic' /></a>\
            </p>\
            <p>\
                <a href='#' class='unorderedlist'><img src='"+media_url+"unordered.gif' alt='unordered list' /></a>\
                <a href='#' class='link'><img src='"+media_url+"link.png' alt='link' /></a>\
                <a href='#' class='image'><img src='"+media_url+"image.png' alt='image' /></a>\
                <a href='#' class='disable'><img src='"+media_url+"close.gif' alt='close rte' /></a>\
            </p></div></div>");
        $('select', tb).change(function(){
            var index = this.selectedIndex;
            if( index!=0 ) {
                var selected = this.options[index].value;
                formatText(iframe, "formatblock", '<'+selected+'>');
            }
        });
        $('.bold', tb).click(function(){ formatText(iframe, 'bold');return false; });
        $('.italic', tb).click(function(){ formatText(iframe, 'italic');return false; });
        $('.unorderedlist', tb).click(function(){ formatText(iframe, 'insertunorderedlist');return false; });
        $('.link', tb).click(function(){
            var p=prompt("URL:");
            if(p)
                formatText(iframe, 'CreateLink', p);
            return false; });
        $('.image', tb).click(function(){
            var p=prompt("image URL:");
            if(p)
                formatText(iframe, 'InsertImage', p);
            return false; });
        $('.disable', tb).click(function() {
            var txt = disableDesignMode(iframe);
            var edm = $('<a href="#">Enable design mode</a>');
            tb.empty().append(edm);
            edm.click(function(){
                enableDesignMode(txt);
                return false;
            });
            return false;
        });
        $(iframe).parents('form').submit(function(){
            disableDesignMode(iframe, true); });
        var iframeDoc = $(iframe.contentWindow.document);

        var select = $('select', tb)[0];
        iframeDoc.mouseup(function(){
            setSelectedType(getSelectionElement(iframe), select);
            return true;
        });
        iframeDoc.keyup(function(){
            setSelectedType(getSelectionElement(iframe), select);
            var body = $('body', iframeDoc);
            if(body.scrollTop()>0)
                iframe.height = Math.min(350, parseInt(iframe.height)+body.scrollTop());
            return true;
        });

        return tb;
    }

    function setSelectedType(node, select) {
        while(node.parentNode) {
            var nName = node.nodeName.toLowerCase();
            for(var i=0;i<select.options.length;i++) {
                if(nName==select.options[i].value){
                    select.selectedIndex=i;
                    return true;
                }
            }
            node = node.parentNode;
        }
        select.selectedIndex=0;
        return true;
    }

    function getSelectionElement(iframe) {
        if (iframe.contentWindow.document.selection) {
            // IE selections
            selection = iframe.contentWindow.document.selection;
            range = selection.createRange();
            try {
                node = range.parentElement();
            }
            catch (e) {
                return false;
            }
        } else {
            // Mozilla selections
            try {
                selection = iframe.contentWindow.getSelection();
                range = selection.getRangeAt(0);
            }
            catch(e){
                return false;
            }
            node = range.commonAncestorContainer;
        }
        return node;
    }
}
