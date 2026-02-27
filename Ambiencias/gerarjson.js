var fso = new ActiveXObject("Scripting.FileSystemObject");
var pasta = fso.GetFolder(".");
var arquivos = new Enumerator(pasta.Files);

function trim(str) {
    str = String(str);
    return str.replace(/^\s+|\s+$/g, "");
}

var resultado = [];

for (; !arquivos.atEnd(); arquivos.moveNext()) {
    var arquivo = arquivos.item();

    if (arquivo.Name.slice(-3) !== ".md") continue;

    var file = fso.OpenTextFile(arquivo.Path, 1);
    var conteudo = file.ReadAll();
    file.Close();

    var match = conteudo.match(/---([\s\S]*?)---/);
    if (!match) continue;

    var yaml = String(match[1]).split("\n");

    var objeto = {};
    objeto.nome = String(arquivo.Name).replace(".md", "");

    var currentKey = null;

    for (var i = 0; i < yaml.length; i++) {
        var linha = trim(yaml[i]);

        if (linha.indexOf("- ") === 0) {
            if (!objeto[currentKey]) objeto[currentKey] = [];
            objeto[currentKey].push(trim(linha.replace("- ", "")));
        } else {
            var partes = linha.split(":");
            currentKey = trim(partes[0]);
            var valor = trim(partes.slice(1).join(":"));

            if (valor !== "") {
                objeto[currentKey] = valor;
            } else {
                objeto[currentKey] = [];
            }
        }
    }

    resultado.push(objeto);
}

function toJSON(obj, indent) {
    indent = indent || 0;
    var space = "";
    for (var i = 0; i < indent; i++) space += "  ";

    if (obj instanceof Array) {
        if (obj.length === 0) return "[]";

        var arr = [];
        for (var i = 0; i < obj.length; i++) {
            arr.push(space + "  " + toJSON(obj[i], indent + 1));
        }

        return "[\n" + arr.join(",\n") + "\n" + space + "]";
    } 
    else if (typeof obj === "object") {
        var props = [];
        for (var key in obj) {
            props.push(
                space + "  " + '"' + key + '": ' + toJSON(obj[key], indent + 1)
            );
        }

        return "{\n" + props.join(",\n") + "\n" + space + "}";
    } 
    else {
        return '"' + String(obj).replace(/"/g, '\\"') + '"';
    }
}

var json = toJSON(resultado, 0);

var json = toJSON(resultado);

var output = fso.CreateTextFile("ambientes.json", true);
output.Write(json);
output.Close();

WScript.Echo("JSON gerado com sucesso!");