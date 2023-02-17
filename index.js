
function decoder_into_utf8(str) {
    return decodeURIComponent(escape(window.atob(str)));
}

function encode(str) {
    return window.btoa(unescape(encodeURIComponent(str)));
}

function proxy_type_checker(uri) {
    var no = uri.match("vmess|vless|trojan");
    if (no !== null) {
        return no[0];
    }
    return null;
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
    j.path = `/${j.host}${j.path}`;
    j.add = address;
    j.sni = host_and_SNI;
    j.host = host_and_SNI;
    return j;
}


function doFunction() {
    var textarea = document.getElementById("conf").value
    var ar = textarea.split("\n")
    document.getElementById("execconf").value = ""
    const wa = document.getElementById("workerarea").value
    const cl = document.getElementById("cloadflarearea").value
    console.log(wa, cl)
    for (const element of ar) {
        var sp = seprator(element)
        if (sp == null) { continue; }
        if (sp[0] === "vmess") {
            if (conf_validator(decoder_into_utf8(sp[1])) === null) { continue; }
            var final = conf_ch(decoder_into_utf8(sp[1]), cl, wa)
            document.getElementById("execconf").value += `vmess://${encode(JSON.stringify(final))}\n`
        }
    }

}