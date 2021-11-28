
let tabTime;

function registreerTabTime() {
  if (location.search && location.search.split('=')[0].includes('tabtime')) {
    tabTime = location.search.split('=')[1];

    let tabtimeMem = localStorage.getItem('tabtimes') || '';
    tabtimeMem = `${tabTime}%${tabtimeMem}`;
    localStorage.setItem('tabtimes', tabtimeMem)
  }
}

function tabTimeToSeconds(tijd) {
  const s = tijd.split(':');
  return s[0] * 60 * 60 + s[1] * 60 + s[2]
}

function intervalCheckOfTabDichtMoet() {
  if (location.search && location.search.split('=')[0].includes('tabtime')) {
    const p = setInterval(() => {
      let tabtimeMem = (localStorage.getItem('tabtimes') || '').split('%');

      const tabTimes = tabtimeMem.map(tabTimeToSeconds)
        .filter(getal => typeof getal === 'string')
        .map(getal => Number(getal))
        .sort();

      const hoogsteTijd = Math.max(...tabTimes);
      const eigenTabTime = Number(tabTimeToSeconds(tabTime));
      if (eigenTabTime < hoogsteTijd) {

        window.close();
      } else {
        console.log(eigenTabTime, hoogsteTijd)
      }
    }, 5000);

  }
}

registreerTabTime();
intervalCheckOfTabDichtMoet();