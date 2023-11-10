// https://mariokart.fandom.com/wiki/Weight

Array.from($0.children[1].children).slice(1).map(tr => {
    return {
        driver: tr.children[0].innerText,
        class: tr.children[8].innerText
    }
}).reduce((obj, item) => {
    obj[item.driver] = item.class;
    return obj;
}, {})