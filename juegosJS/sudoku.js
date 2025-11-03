const tableroSudoku = document.querySelector ('.tableroSudoku');

tableroSudoku.style.display = 'grid';
tableroSudoku.style.gridTemplateColumns = 'repeat(9, 40px)';
tableroSudoku.style.width = '360px';
tableroSudoku.style.height = '360px';
tableroSudoku.style.gap = '1px';
tableroSudoku.style.backgroundColor = 'black';

function aplicarDificultad(tableroCompleto, nivel) {
    const tablero = JSON.parse(JSON.stringify(tableroCompleto));
    let pistas;

    if (nivel === 'easy') pistas = 40;
    else if (nivel === 'medium') pistas = 30;
    else pistas = 20;

    const posiciones = [];
    for (let fila = 0; fila < 9; fila++) {
        for (let col = 0; col < 9; col++) {
            posiciones.push([fila, col]);
        }
    }

    posiciones.sort(() => Math.random() - 0.5);

    for (let fila = 0; fila < 9; fila++) {
        for (let col = 0; col < 9; col++) {
            tablero[fila][col] = 0;
        }
    }

    for (let i = 0; i < pistas; i++) {
        const [fila, col] = posiciones[i];
        tablero[fila][col] = tableroCompleto[fila][col];
    }

    return tablero;
}

function comprobarVictoria() {
    let victoria = true;

    for (let fila = 0; fila < 9; fila++) {
        for (let col = 0; col < 9; col++) {
            const index = fila * 9 + col;
            const input = tableroSudoku.children[index];
            const valor = input.value;

            if (!/^[1-9]$/.test(valor)) {
                victoria = false;
                break;
            }

            for (let i = 0; i < 9; i++) {
                if (i !== col) {
                    const otro = tableroSudoku.children[fila * 9 + i];
                    if (otro.value === valor) {
                        victoria = false;
                        break;
                    }
                }
                if (i !== fila) {
                    const otro = tableroSudoku.children[i * 9 + col];
                    if (otro.value === valor) {
                        victoria = false;
                        break;
                    }
                }
            }

            const bloqueFila = Math.floor(fila / 3) * 3;
            const bloqueCol = Math.floor(col / 3) * 3;
        
            for (let f = bloqueFila; f < bloqueFila + 3; f++) {
                for (let c = bloqueCol; c < bloqueCol + 3; c++) {
                    const idx = f * 9 + c;
                    if ((f !== fila || c !== col) && tableroSudoku.children[idx].value === valor) {
                        victoria = false;
                        break;
                    }
                }
            }

            if (!victoria) break;
        }
        if (!victoria) break;
    }

    if (victoria) {
        tableroSudoku.style.backgroundColor = 'green';
        alert('🎉 ¡HAS GANADO!');
        
    }
}

document.querySelector('.buttonStart').addEventListener('click', () => {
    const nivel = document.querySelector('#dificultad').value;
})

const filaBase = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const tableroCompleto = [];

document.querySelector('.buttonStart').addEventListener('click', () => {
    const nivel = document.querySelector('#dificultad').value;

    const filaBase = [1,2,3,4,5,6,7,8,9];
    const tableroCompleto = [];

    for (let i = 0; i < 9; i++) {
        const desplazamiento = (i * 3 + Math.floor(i / 3)) % 9;
        const fila = filaBase.slice(desplazamiento).concat(filaBase.slice(0, desplazamiento));
        tableroCompleto.push(fila);
    }

    const tableroVisible = aplicarDificultad(tableroCompleto, nivel);

    tableroSudoku.innerHTML = '';

    for (let i = 0; i < 81; i++) {
        const nuevoInput = document.createElement('input');
        nuevoInput.type = 'text';
        nuevoInput.min = '1';
        nuevoInput.max = '9';
        nuevoInput.classList.add('inputSudoku');

        nuevoInput.style.width = '40px';
        nuevoInput.style.height = '40px';
        nuevoInput.style.fontSize = '25px';
        nuevoInput.style.textAlign = 'center';
        nuevoInput.style.boxSizing = 'border-box';
        nuevoInput.style.border = '1px solid #ccc';
        nuevoInput.style.backgroundColor = 'white';

        nuevoInput.addEventListener('input', () => {
            const valor = nuevoInput.value;
            if (!/^[1-9]?$/.test(valor)) {
                nuevoInput.value = '';
                comprobarVictoria();
            }
        });

        const fila = Math.floor(i / 9);
        const columna = i % 9;
        const valor = tableroVisible[fila][columna];

        if (valor !== 0) {
            nuevoInput.value = valor;
            nuevoInput.disabled = true;
            nuevoInput.style.backgroundColor = '#aef0f5ff';
        }

        nuevoInput.addEventListener('keydown', (e) => {
            const teclasPermitidas = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
            const esNumeroValido = /^[1-9]$/.test(e.key);

            if (!esNumeroValido && !teclasPermitidas.includes(e.key)) {
                e.preventDefault();
            }
        });

        nuevoInput.addEventListener('keydown', (e) => {
            const teclasPermitidas = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
            const esNumeroValido = /^[1-9]$/.test(e.key);
            if (!esNumeroValido && !teclasPermitidas.includes(e.key)) {
                e.preventDefault();
            }
        });

        nuevoInput.addEventListener('input', () => {
            const valorIngresado = nuevoInput.value;

            if (!/^[1-9]?$/.test(valorIngresado)) {
                nuevoInput.value = '';
                nuevoInput.style.backgroundColor = 'white';
                return;
            }

            let conflicto = false;

            for (let c = 0; c < 9; c++) {
                const index = fila * 9 + c;
                const inputComparar = tableroSudoku.children[index];
                if (c !== columna && inputComparar.value === valorIngresado) {
                    conflicto = true;
                    break;
                }
            }

            if (!conflicto) {
                for (let f = 0; f < 9; f++) {
                    const index = f * 9 + columna;
                    const inputComparar = tableroSudoku.children[index];
                    if (f !== fila && inputComparar.value === valorIngresado) {
                        conflicto = true;
                        break;
                    }
                }
            }

            if (!conflicto) {
                const bloqueFila = Math.floor(fila / 3) * 3;
                const bloqueCol = Math.floor(columna / 3) * 3;
                for (let f = bloqueFila; f < bloqueFila + 3; f++) {
                    for (let c = bloqueCol; c < bloqueCol + 3; c++) {
                        const index = f * 9 + c;
                        if ((f !== fila || c !== columna) && tableroSudoku.children[index].value === valorIngresado) {
                            conflicto = true;
                            break;
                        }
                    }
                    if (conflicto) break;
                }
            }

            nuevoInput.style.backgroundColor = conflicto ? '#f51818ff' : 'white';

            comprobarVictoria();
        });

        if (fila % 3 === 0) {
            nuevoInput.style.borderTop = '2px solid black';
        }
        if (fila === 8) {
            nuevoInput.style.borderBottom = '2px solid black';
        }
        if (columna % 3 === 0) {
            nuevoInput.style.borderLeft = '2px solid black';
        }
        if (columna === 8) {
            nuevoInput.style.borderRight = '2px solid black';
        }

        tableroSudoku.appendChild(nuevoInput);
    }
});
