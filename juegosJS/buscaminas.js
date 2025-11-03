function table(filas,columnas) {
    const tablero = [];
    for (let i = 0; i < filas; i++) {
        const fila = [];
        for (let j = 0; j < columnas; j++) {
            fila.push(null);
        }
        tablero.push(fila);
    }
    return tablero;
}

const botonComenzar = document.querySelector('.buttonStart');
const tableroJuego = document.querySelector('.tablero');


botonComenzar.addEventListener('click', () => {
    function comprobarVictoria(tablero, filasU, columnasU) {
        let reveladas = 0;
        let totalCeldas = filasU * columnasU;

        const todasCeldas = document.querySelectorAll('.cell');
        todasCeldas.forEach(celda => {
            if (celda.classList.contains('revelada')) reveladas++;
        });

        const minas = tablero.flat().filter(c => c === 'mina').length;
        const necesarias = totalCeldas - minas;

        if (reveladas === necesarias) {
            setTimeout(() => alert('¡Has ganado! 🎉'), 100);
        }
    }

    let filasU = parseInt(prompt('Indica el número de filas para tu tablero'));
    let columnasU = parseInt(prompt('Indica el número de columnas para tu tablero'));


    const tablero = table(filasU, columnasU);


    const totalMinas = Math.floor((filasU * columnasU) * 0.15);


    let minasColocadas = 0;
        while (minasColocadas < totalMinas) {
            const filaAleatoria = Math.floor(Math.random() * filasU);
            const columnaAleatoria = Math.floor(Math.random() * columnasU);
            
            if (tablero[filaAleatoria][columnaAleatoria] !== 'mina') {
                tablero[filaAleatoria][columnaAleatoria] = 'mina';
                minasColocadas++;
            }
        }


    for (let i = 0; i < filasU; i++) {
        for (let j = 0; j < columnasU; j++) {
            if (tablero[i][j] === 'mina') continue;

            let minasCerca = 0;
            const vecinos = [
                [-1, -1], [-1, 0], [-1, 1],
                [0, -1],          [0, 1],
                [1, -1], [1, 0], [1, 1]
            ];

            for (const [dx, dy] of vecinos) {
                const ni = i + dx;
                const nj = j + dy;

                if (
                    ni >= 0 && ni < filasU &&
                    nj >= 0 && nj < columnasU &&
                    tablero[ni][nj] === 'mina'
                ) {
                    minasCerca++;
                }
            }

            tablero[i][j] = minasCerca;
        }
    }

    function revelarZonaVacia(fila, columna, tablero, filasU, columnasU, tableroJuego) {
        const vecinos = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],          [0, 1],
            [1, -1], [1, 0], [1, 1]
        ];

    const celdaActual = document.querySelector(`.cell[data-row="${fila}"][data-col="${columna}"]`);
    if (!celdaActual || celdaActual.classList.contains('revelada')) return;

    celdaActual.classList.add('revelada');
    const valor = tablero[fila][columna];
    celdaActual.textContent = valor > 0 ? valor : '';
        if (valor > 0) {
            celdaActual.textContent = valor;
            return;
        }

        for (const [dx, dy] of vecinos) {
            const ni = fila + dx;
            const nj = columna + dy;
            if (ni >= 0 && ni < filasU && nj >= 0 && nj < columnasU) {
                revelarZonaVacia(ni, nj, tablero, filasU, columnasU, tableroJuego);
            }
        }
    }

    tableroJuego.innerHTML = '';
    tableroJuego.style.display = 'grid';
    tableroJuego.style.gridTemplateColumns = `repeat(${columnasU}, 30px)`;

    for (let i = 0; i < filasU; i++) {
        for (let j = 0; j < columnasU; j++) {
            const celda = document.createElement('div');
            celda.classList.add('cell');
            celda.dataset.row = i;
            celda.dataset.col = j;


            celda.addEventListener('click', () => {
            const fila = parseInt(celda.dataset.row);
            const columna = parseInt(celda.dataset.col);
            const valor = tablero[fila][columna];

            if (valor === 'mina') {
                celda.textContent = '';
                const img = document.createElement('img');
                img.src = '../src/img/mina.png';
                img.alt = 'mina';
                img.style.width = '100%';
                img.style.height = '100%';
                celda.appendChild(img);
                celda.classList.add('explosion');
                alert('¡Boom! Has perdido.');
            } else {
                revelarZonaVacia(fila, columna, tablero, filasU, columnasU, tableroJuego);
                comprobarVictoria(tablero, filasU, columnasU);
            }
        });

        celda.addEventListener('contextmenu', (e) => {
            e.preventDefault();

            if (!celda.classList.contains('revelada')) {
                const minaFijaExistente = celda.querySelector('img.minaFija');

                if (minaFijaExistente) {
                    celda.removeChild(banderaExistente);
                } else {
                    const img = document.createElement('img');
                    img.src = '../src/img/mina_res.png';
                    img.alt = 'minaFija';
                    img.classList.add('minaFija');
                    img.style.width = '100%';
                    img.style.height = '100%';
                    celda.appendChild(img);
                }
            }
        });

        tableroJuego.appendChild(celda);
        }
    }
    console.table(tablero);
});

