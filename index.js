
function decoder_into_utf8(str) {
    return decodeURIComponent(escape(window.atob(str)));
}

function encode(str) {
    return window.btoa(unescape(encodeURIComponent(str)));
}


function seprator(uri) {
    var no = uri.split("://");
    if (no.length > 1) {
        return no;
    }
    return null;
}

function conf_validator(conf) {
    var j = JSON.parse(conf);
    if (j.port != 443) {
        return null;
    }
    if (j.tls !== "tls") {
        return null;
    }
    if (j.net !== "ws") {
        return null;
    }
    if (j.path === "") {
        return null;
    }
    return j;
}

function conf_ch(conf, address, host_and_SNI) {
    var j = JSON.parse(conf);

    if (j.host === "") {
        j.path = `/${j.add}${j.path}`;
    } else {
        j.path = `/${j.host}${j.path}`;
    }
    j.add = address;
    j.sni = host_and_SNI;
    j.host = host_and_SNI;
    return j;
}

function regex_convertor(string, add, worker) {
    string = string.replaceAll("%2F", "/");
    string = string.replaceAll("\n", "");

    const protocol = string.match(/(.*?):\/\//);
    const host = string.match(/host=(.*?)[&#]/);
    const path = string.match(/path=(.*?)[&#]/);
    if (path === null) { return "" }
    const uuid = string.match(/:\/\/(.*?)@/);
    const port = string.match(/:(\d*?)\?/);
    if (port[1] != 443) { return "" }
    const security = string.match(/security=(.*?)[&#]/);
    const type = string.match(/type=(.*?)[&#]/);
    const name = string.match(/#(.*?)$/);
    // const sni = string.match(/sni=(.*?)[&#]/);
    return `${protocol[1]}://${uuid[1]}@${add}:${port[1]}?sni=${worker}&allowInsecure=1&security=${security[1]}&type=${type[1]}&path=/${host[1]}${path[1]}&host=${worker}#${name[1]}`



}

function doFunction() {
    var textarea = document.getElementById("conf").value
    var ar = textarea.split("\n")
    document.getElementById("execconf").value = ""
    const wa = document.getElementById("workerarea").value
    const cl = document.getElementById("cloadflarearea").value
    for (const element of ar) {
        var sp = seprator(element)
        if (sp == null) { continue; }
        if (sp[0] === "vmess") {
            if (conf_validator(decoder_into_utf8(sp[1])) === null) { continue; }
            var final = conf_ch(decoder_into_utf8(sp[1]), cl, wa)
            document.getElementById("execconf").value += `vmess://${encode(JSON.stringify(final))}\n`
        } else if (sp[0] === "vless") {
            document.getElementById("execconf").value += `${regex_convertor(element, cl, wa)}\n`

        } else if (sp[0] === "trojan") {
            document.getElementById("execconf").value += `${regex_convertor(element, cl, wa)}\n`

        }
    }

}