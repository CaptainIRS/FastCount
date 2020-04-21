let timer, best;

document.addEventListener("DOMContentLoaded", function () {
  init();
});

let seconds = 0;

function init() {
  clearInterval(timer);
  document.getElementById('game_area').setAttribute('style', 'border:none;');
}

let current, tiles;

function reset(mode) {
  seconds = 0;
  clearInterval(timer);
  current = 1;

  if (localStorage.getItem('scores') == null) {
    best = [0, 0, 0, 0, 0];
    localStorage.setItem('scores', JSON.stringify(best));
  } else {
    best = JSON.parse(localStorage.getItem('scores'));
    document.getElementById('best_time').innerHTML = '<b>' + Math.trunc(best[0] / 100) + ':' + best[0] % 100 + '</b>';
  }

  document.getElementById('hacker_plus_container').innerHTML = '';
  document.getElementById('game_board').innerHTML = '';

  document.getElementById('game_area').setAttribute('style', 'border:none;');

  if (mode === null) {
    mode = select.selectedIndex;
  }
  if (mode === 0) {
    mode_dialog.open();
    return;
  }

  timer = setInterval(increment, 10);

  if (mode === 1) {
    normalMode();
  } else if (mode === 2) {
    hackerMode();
  } else if (mode === 3) {
    hackerPlusMode();
  } else if (mode === 4) {
    hackerPlusPlusMode();
  } else if (mode === 5) {
    hackerPlusPlusPlusMode();
  }

  if (mode > 2) {
    document.getElementById('game_area').setAttribute('style', 'border:none;');
  } else {
    document.getElementById('game_area').setAttribute('style', 'border:2px solid black');
  }

  current = 1;
  tiles = document.getElementsByClassName('tile');
  Array.from(tiles).forEach((e) => e.addEventListener('click', tileClickListener));

  Array.from(tiles).forEach(e => {
    let i = parseInt(e.innerText);
    e.setAttribute('style', 'background-color:hsla(0, 0%, ' + 65 * (1 - i / 40) + '%, 1) !important;');
    mdc.ripple.MDCRipple.attachTo(e);
  });
}

function tileClickListener() {
  console.log(this.innerText);
  if (current.toString() === this.innerText) {
    let winDialogMessage = 'You won!';
    if (this.innerText === '40' || this.innerText === '240') {
      clearInterval(timer);
      let time = seconds;
      if (time < best[4] || best[4] === 0) {
        winDialogMessage += '\nNew high score!';
      }
      let newHS = [];
      for (let i = 0, j = 0; i < 5; i++) {
        if ((i === 0 && best[0] === 0) || (time < best[i] && best[i] !== 0)) newHS.push(time);
        else newHS.push(best[j++]);
      }
      localStorage.setItem("scores", JSON.stringify(newHS));
      document.getElementById('win-dialog-message').innerText = winDialogMessage;
      document.getElementById('win-dialog-play-button').addEventListener('click', () => {
        reset(null);
      });
      document.getElementById('win-dialog-close-button').addEventListener('click', () => {
        select.selectedIndex = 0;
        reset(null);
      });
      win_dialog.open();
      return;
    }
    let max = (select.selectedIndex === 5) ? 120 : 20;
    if (max + current <= 2 * max) {
      Array.from(tiles).forEach((e1) => {
        if (e1.innerText === current.toString()) {
          e1.innerText = max + current;
          if (current <= max * 2)
            e1.setAttribute('style',
              'background-color:hsla(0, 0%, ' + 65 * (1 - (max + current) / (max * 2)) + '%, 1) !important');
        }
      });
      current++;
    } else {
      Array.from(tiles).forEach((e1) => {
        if (e1.innerText === current.toString()) {
          e1.innerText = '';
        }
      });
      current++;
    }
  } else {
    clearInterval(timer);
    Array.from(tiles).forEach((el) => {
      el.removeEventListener('click', tileClickListener);
    });
    document.getElementById('game-over-dialog-title').innerText = '';
    document.getElementById('game-over-dialog-message').innerText = 'Game Over!';
    document.getElementById('game-over-retry-dialog-button').addEventListener('click',
      () => reset(null)
    );
    document.getElementById('game-over-close-dialog-button').addEventListener('click',
      () => {
        select.selectedIndex = 0;
        reset(null);
      }
    );
    game_over_dialog.open();
  }
}

function normalMode() {
  document.getElementsByClassName('game_board')[0]
    .setAttribute('style', 'grid-template-columns: repeat(5, 100px)');
  let tileContainer = document.getElementById('game_board');
  tileContainer.innerHTML = '';
  let numbers = Array.from(new Array(20), (x, i) => i + 1);
  shuffle(numbers);
  let currentNumber = 0, str = '';
  for (; currentNumber < 20; currentNumber++) {
    str += '<div class="tile mdc-button mdc-button--raised mdc-ripple-surface">' + numbers[currentNumber] + '</div>';
  }
  console.log(str);
  tileContainer.innerHTML = str;
}

function hackerMode() {
  document.getElementsByClassName('game_board')[0]
    .setAttribute('style', 'grid-template-columns: repeat(1, 500px)');
  let tileContainer = document.getElementById('game_board');
  tileContainer.innerHTML = '';
  let numbers = Array.from(new Array(20), (x, i) => i + 1);
  shuffle(numbers);
  let currentNumber = 0, rowNo = 0, str = '', tmp = '';
  for (; currentNumber < 20; currentNumber++) {
    if ((currentNumber) % 5 === 0) {
      tmp += '<div class="marquee1">';
    }
    tmp += '<div class="tile mdc-button mdc-button--raised mdc-ripple-surface">' + numbers[currentNumber] + '</div>';
    if ((currentNumber + 1) % 5 === 0) {
      tmp += '</div>';
      if (rowNo % 2 !== 0) {
        tmp = tmp.replace('marquee1', 'marquee1" style="animation-direction:reverse');
      }
      tmp += tmp.replace('marquee1', 'marquee2');
      str += '<div class="marquee">' + tmp + '</div>';
      tmp = '';
      rowNo++;
    }
  }
  console.log(str);
  tileContainer.innerHTML = str;
}

function hackerPlusMode() {
  document.getElementsByClassName('game_board')[0]
    .setAttribute('style', 'grid-template-columns: repeat(5, 100px)');
  let cubeContainer = document.getElementById('hacker_plus_container');
  cubeContainer.innerHTML = '';
  let numbers = Array.from(new Array(20), (x, i) => i + 1);
  shuffle(numbers);
  let currentNumber = 0, str = '';
  for (; currentNumber < 20; currentNumber++) {
    str += '<div class="tile mdc-button mdc-button--raised mdc-ripple-surface">' + numbers[currentNumber] + '</div>';
  }
  str = '<div class="cube-face cube-front">' + str + '</div>'
    + '<div class="cube-face cube-back">' + str + '</div>'
    + '<div class="cube-face cube-left">' + str + '</div>'
    + '<div class="cube-face cube-right">' + str + '</div>'
    + '<div class="cube-face cube-top">' + str + '</div>'
    + '<div class="cube-face cube-bottom">' + str + '</div>';
  str = '<div class="cube">' + str + '</div>';
  console.log(str);
  cubeContainer.innerHTML = str;
}

function hackerPlusPlusMode() {
  document.getElementsByClassName('game_board')[0]
    .setAttribute('style', 'grid-template-columns: repeat(1, 500px)');
  let cubeContainer = document.getElementById('hacker_plus_container');
  cubeContainer.innerHTML = '';
  let numbers = Array.from(new Array(20), (x, i) => i + 1);
  shuffle(numbers);
  let currentNumber = 0, rowNo = 0, str = '', tmp = '';
  for (; currentNumber < 20; currentNumber++) {
    if ((currentNumber) % 5 === 0) {
      tmp += '<div class="marquee1">';
    }
    tmp += '<div class="tile mdc-button mdc-button--raised mdc-ripple-surface">' + numbers[currentNumber] + '</div>';
    if ((currentNumber + 1) % 5 === 0) {
      tmp += '</div>';
      if (rowNo % 2 !== 0) {
        tmp = tmp.replace('marquee1', 'marquee1" style="animation-direction:reverse');
      }
      tmp += tmp.replace('marquee1', 'marquee2');
      str += '<div class="marquee">' + tmp + '</div>';
      tmp = '';
      rowNo++;
    }
  }
  str = '<div class="cube-face cube-front">' + str + '</div>'
    + '<div class="cube-face cube-back">' + str + '</div>'
    + '<div class="cube-face cube-left">' + str + '</div>'
    + '<div class="cube-face cube-right">' + str + '</div>'
    + '<div class="cube-face cube-top">' + str + '</div>'
    + '<div class="cube-face cube-bottom">' + str + '</div>';
  str = '<div class="cube">' + str + '</div>';
  console.log(str);
  cubeContainer.innerHTML = str;
}

function hackerPlusPlusPlusMode() {
  document.getElementsByClassName('game_board')[0]
    .setAttribute('style', 'grid-template-columns: repeat(1, 500px)');
  let cubeContainer = document.getElementById('hacker_plus_container');
  cubeContainer.innerHTML = '';
  let numbers = Array.from(new Array(120), (x, i) => i + 1);
  shuffle(numbers);
  let str = '', tmp = '', tmp1 = '', count = 0;
  for (let i = 0; i < 6; i++) {
    let currentNumber = 0, rowNo = 0;
    for (; currentNumber < 20; currentNumber++) {
      if ((currentNumber) % 5 === 0) {
        tmp += '<div class="marquee1">';
      }
      tmp += '<div class="tile mdc-button mdc-button--raised mdc-ripple-surface">' + numbers[count] + '</div>';
      if ((currentNumber + 1) % 5 === 0) {
        tmp += '</div>';
        if (rowNo % 2 !== 0) {
          tmp = tmp.replace('marquee1', 'marquee1" style="animation-direction:reverse');
        }
        tmp += tmp.replace('marquee1', 'marquee2');
        tmp1 += '<div class="marquee">' + tmp + '</div>';
        tmp = '';
        rowNo++;
      }
      count++;
    }
    let side = (i === 0) ? 'front'
      : (i === 1) ? 'back'
        : (i === 2) ? 'left'
          : (i === 3) ? 'right'
            : (i === 4) ? 'top'
              : 'bottom';
    str += '<div class="cube-face cube-' + side + '">' + tmp1 + '</div>';
    tmp1 = '';
  }
  str = '<div class="cube">' + str + '</div>';
  console.log(str);
  cubeContainer.innerHTML = str;
}

function increment() {
  seconds += 1;
  document.getElementById('time').innerHTML = '<b>' + Math.trunc(seconds / 100) + ':' + seconds % 100 + '</b>';
}

function shuffle(array) {
  let currentIndex = array.length, temporaryValue, randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
