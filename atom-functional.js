const eletrons = 3;
const element = 'Li';

const eletronsWidth = '15px';

const layers = {
    k: {
        eletrons: 2,
        width: '200px'
    },
    l: {
        eletrons: 8,
        width: '300px'
    },
    m: {
        eletrons: 18,
        width: '400px'
    },
    n: {
        eletrons: 32,
        width: '500px'
    },
    o: {
        eletrons: 32,
        width: '600px'
    },
    p: {
        eletrons: 18,
        width: '700px'
    },
    q: {
        eletrons: 2,
        width: '800px'
    }
}

function layerSelector(configuration, layer, eletrons) {
    if (eletrons > layers[layer].eletrons) 
        configuration[layer].eletrons = layers[layer].eletrons;
    else
        configuration[layer].eletrons = eletrons;    
}

function atomConfigure(eletrons) {
    const configuration = { k: {}, l: {}, m: {}, n: {}, o: {}, p: {}, q: {} };

    for (key in configuration) {
        layerSelector(configuration, key, eletrons);
        eletrons -= layers[key].eletrons;

        if (eletrons <= 0 ) break;
    }
}

function eletronPosition(radius, eletrons) {
    return (2*Math.PI*radius)/eletrons;
}

function arcAngle(radius, eletronPosition) {
    return (eletronPosition*180)/(Math.PI*radius);
}

function calcLeft(radius, arcAngle) {
    const leftLine = Math.sin(arcAngle)*radius;
    return radius + leftLine;
}

function minorTriangleAngle(arcAngle) {
    return 90 - arcAngle;
}

function calcTop(minorTriangleAngle, left, eletronRadius) {
    return Math.tan(minorTriangleAngle)*left - eletronRadius;
}