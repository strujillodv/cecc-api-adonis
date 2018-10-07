'use strict'

export function  slugConverter(str) {

    str = str.replace(/^\s+|\s+$/g, ""); // trim
    str = str.toLowerCase();

    // eliminna accentos, comvierte ñ a n, entre otros
    var from = "åàáãäâèéëêìíïîòóöôùúüûñç·/_,:;";
    var to = "aaaaaaeeeeiiiioooouuuunc------";

    for (var i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
    }

    str = str
      .replace(/[^a-z0-9 -]/g, "") // eliminina los caracteres invalidos
      .replace(/\s+/g, "-") // colapsa los espacios y los remplaza por -
      .replace(/-+/g, "-") // colapsa los - diplicados
      .replace(/^-+/, "") // asegura que los guiones no aparecen al comienzo de la cadena
      .replace(/-+$/, ""); //// asegura que los guiones no aparecen al final de la cadena

    return str; // retorna la cadena limpia
}

