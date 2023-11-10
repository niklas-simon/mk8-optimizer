// https://www.mariowiki.com/Standard_bike_(vehicle_class)
// https://www.mariowiki.com/Sport_bike_(vehicle_class)
// https://www.mariowiki.com/All-Terrain_Vehicle

Array.from($0.children).map(li => {
    return li.children[0].children[1].children[0].children[0].innerText;
})