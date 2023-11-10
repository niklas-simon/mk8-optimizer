// https://www.mariowiki.com/Mario_Kart_8_Deluxe_in-game_statistics

Array.from($0.children[1].children).map(tr => {
    return {
        names: [tr.children[0].children[2].innerText],
        images: [tr.children[0].children[0].children[0].src],
        wg: Number(tr.children[1].innerText),
        ac: Number(tr.children[2].innerText),
        on: Number(tr.children[3].innerText),
        of: Number(tr.children[4].innerText),
        mt: Number(tr.children[5].innerText),
        sl: Number(tr.children[6].innerText),
        sw: Number(tr.children[7].innerText),
        sa: Number(tr.children[8].innerText),
        sg: Number(tr.children[9].innerText),
        tl: Number(tr.children[10].innerText),
        tw: Number(tr.children[11].innerText),
        ta: Number(tr.children[12].innerText),
        tg: Number(tr.children[13].innerText),
        iv: Number(tr.children[14].innerText)
    }
}).reduce((array, stat) => {
    const existing = array.find(exis => !Object.keys(exis).filter(key => key.length === 2).find(key => exis[key] !== stat[key]));
    if (existing) {
        existing.names.push(stat.names[0]);
        existing.images.push(stat.images[0]);
    } else array.push(stat);
    return array;
}, [])
