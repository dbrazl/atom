class Atom {
    constructor({ eletrons, element, eletronsWidth }) {
        this.eletrons = eletrons;
        this.element = element;
        this.eletronsWidth = eletronsWidth;
        this.configuration = {};

        this.layers = {
            k: {
                eletrons: 2,
                diameter: '200px'
            },
            l: {
                eletrons: 8,
                diameter: '300px'
            },
            m: {
                eletrons: 18,
                diameter: '400px'
            },
            n: {
                eletrons: 32,
                diameter: '500px'
            },
            o: {
                eletrons: 32,
                diameter: '600px'
            },
            p: {
                eletrons: 18,
                diameter: '700px'
            },
            q: {
                eletrons: 2,
                diameter: '800px'
            }
        }

        this.linusPauling = {
            k: {
                s: 2
            },
            l: {
                s: 2,
                p: 6
            },
            m: {
                s: 2,
                p: 6,
                d: 10
            },
            n: {
                s: 2,
                p: 6,
                d: 10,
                f: 14
            },
            o: {
                s: 2,
                p: 6,
                d: 10,
                f: 14
            },
            p: {
                s: 2,
                p: 6,
                d: 10,
            },
            q: {
                s: 2,
                p: 6,
            }
        }

        this.linusPaulingDitributed = {
            k1: { s: 2 },
            l1: { s: 2, p: 6 },
            m1: { s: 2, p: 6 },
            n1: { s: 2 },
            m2: { d: 10 },
            n2: { p: 6 },
            o1: { s: 2 },
            n3: { d: 10 },
            o2: { p: 6 },
            p1: { s: 2 },
            n4: { f: 14 },
            o3: { d: 10 },
            p2: { p: 6 },
            q1: { s: 2 },
            o4: { f: 14 },
            p3: { d: 10 },
            q2: { p: 6 }
        }   
    }

    #eletronsDistribution = (configuration, layer, eletrons) => { 
    
        const levels = Object.entries(this.linusPaulingDitributed)

        for (const [level, subLevels] of levels) {

            const subs = Object.entries(subLevels);

            for (const [actual, nEletrons] of subs) {
                if (eletrons > nEletrons) {
                    configuration[level[0]].eletrons += nEletrons;
                    eletrons -= nEletrons;
                } else {
                    configuration[level[0]].eletrons += eletrons;
                    eletrons -= eletrons
                }

            }
        }

        return eletrons;
    }

    atomConfigure() {
        let eletrons = this.eletrons;
        const configuration = { 
            k: { eletrons: 0 }, 
            l: { eletrons: 0 }, 
            m: { eletrons: 0 }, 
            n: { eletrons: 0 }, 
            o: { eletrons: 0 }, 
            p: { eletrons: 0 }, 
            q: { eletrons: 0 } 
        };

        const keys = Object.keys(configuration);
        for (const key of keys) {
            eletrons = this.#eletronsDistribution(configuration, key, eletrons);

            if (eletrons <= 0 ) break;
        }

        this.configuration = configuration;
    }

    #eletronPosition = (radius, eletrons, numberOfEletrons) => {
        return (2*Math.PI*radius)/numberOfEletrons * eletrons;
    }
    
    #arcAngle = (radius, eletronPosition) => {
        return (eletronPosition*180)/(Math.PI*radius);
    }

    #toRad = degrees => {
        return degrees * Math.PI / 180;
    }
    
    #calcLeft = (radius, arcAngle) => {
        const radians = this.#toRad(arcAngle)
        const leftLine = Math.sin(radians)*radius;
        return radius + leftLine - this.eletronsWidth.split('px')[0]/2;
    }
    
    #calcTop = (radius, arcAngle) => {
        const radians = this.#toRad(arcAngle);
        const topLine = Math.cos(radians)*radius;
        
        if (arcAngle > 90 || arcAngle < 270)
            return radius + topLine - this.eletronsWidth.split('px')[0]/2;
        
        return radius - topLine - this.eletronsWidth.split('px')[0]/2;
    }

    #addEletrons = () => {
        const configuration = Object.entries(this.configuration);

        
        for (const [level, data] of configuration) {
            if (data.eletrons <= 0) break;
            
            let html = '';
            for (let index = 1; index < data.eletrons + 1; index++) {
                html = html.concat(`
                    <div class="eletron${level.toUpperCase()}${index}"></div>
                `)
            }

            const layer = document.querySelector(`.${level}`);
            layer.insertAdjacentHTML('beforeend' ,html);

        }

    }

    #addCssToEletrons = () => {
        const configuration = Object.entries(this.configuration);

        for(const [level, data] of configuration) {
            if (data.eletrons <= 0) break;

            const eletronsOfLayer = this.configuration[level].eletrons;
            const eletronsOnLayer = data.eletrons;
            const diameter = parseInt(this.layers[level].diameter.split('px')[0])
            const radius = diameter/2;

            
            let css = '';
            for(let eletron = 1; eletron <= eletronsOnLayer; eletron++) {
                const positionOnArc = this.#eletronPosition(radius, eletron, eletronsOfLayer);
                const angle = this.#arcAngle(radius, positionOnArc);
                const left = this.#calcLeft(radius, angle);
                const top = this.#calcTop(radius, angle);

                css = css.concat(`
                    .eletron${level.toUpperCase()}${eletron} {
                        width: ${this.eletronsWidth};
                        height: ${this.eletronsWidth};
                        border-radius: 50%;
                        position: absolute;
                        background-color: #373567ff;
                        top: ${top}px;
                        left: ${left}px;
                    }
                `)
    
            }

            const sheet = document.createElement('style');
            sheet.type = 'text/css';
            sheet.setAttribute('name', `eletron ${level}`);

            sheet.innerText = css;

            document.head.appendChild(sheet);
        }
    }

    #addCssToLayers = () => {
        const configuration = Object.entries(this.configuration);

        //TODO - improve to file. Remove from HTML
        const sheet = document.createElement('style');
        sheet.type = 'text/css';
        sheet.setAttribute('name', `levels`)

        let time = 5, css = '';
        for(const [level, data] of configuration) {
            if (data.eletrons <= 0) break;

            css = css.concat(`
                .${level} {
                    width: ${this.layers[level].diameter};
                    height: ${this.layers[level].diameter};
                    animation: rotate ${time}s linear infinite;
                }
            `);

            time += 2;
        }

        sheet.innerText = css;

        document.head.appendChild(sheet);
    }

    #addLayers = () => {
        const configuration = Object.entries(this.configuration);

        let layers = [];
        for(const [level, data] of configuration) {
            if (data.eletrons <= 0) break;

            layers.push(`
                <div class="level ${level}"></div>
            `)
        }

        const body = document.querySelector('body');
        for(const index in layers) 
            body.insertAdjacentHTML('beforeend', layers[index]);
    }

    #addCore = () => {
        const core = `
            <div class="core centralize">
                <p class="element">${this.element}</p>
            </div>
        `;

        const body = document.querySelector('body');
        body.insertAdjacentHTML('beforeend', core);
    }

    createAtom() {

        this.#addCore();
        this.#addLayers();
        this.#addCssToLayers();
        this.#addEletrons();
        this.#addCssToEletrons();


    }
}