const time = document.querySelector('.current-time');
const dayName = document.getElementById('current-day');
const month = document.getElementById('current-month');
const date = document.getElementById('current-number-of-day');
const today = document.getElementById('current-temp');


const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

let nextPrayer = "";
let highlight = true;


setInterval(() => {
  const Thetime = new Date();
  const Themonth = Thetime.getMonth();
  const Thedate = Thetime.getDate();
  const Theday = Thetime.getDay();
  const minutes = Thetime.getMinutes();
  const hour = Thetime.getHours();

  time.innerHTML = hour + ':' + (minutes < 10? '0'+minutes: minutes);
  dayName.innerHTML = days[Theday];
  month.innerHTML = months[Themonth];
  date.innerHTML = Thedate;

}, 1000)

const findLocation = () => {

  const country = document.querySelector('.country');
  const city = document.querySelector('.city');

  const success = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    const geoApiUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;

    fetch(geoApiUrl)
    .then(res => res.json())
    .then(data => {
      country.textContent = data.countryName;
      city.textContent = data.principalSubdivision;

    });


    const time = new Date();
    const year = time.getFullYear();
    const month = time.getMonth();
    const day = time.getDate();

    const prayerTimeApi = `https://api.aladhan.com/v1/calendar?latitude=${latitude}&longitude=${longitude}&method=2&month=${month}&year=${year}`;

    fetch(prayerTimeApi)
    .then(res => res.json())
    .then(data => {
      countDown(data.data[day-1].timings, day, month, year);
      
      for (let i = 0; i < 8; i++)
      {
        showPrayerTime(data.data[day - 1 + i], i);
      }
      selectedPrayer(nextPrayer);
    });
  }

  const error = () => {
    country.textContent = 'Unabel to retrieve your loaction';
  }
  navigator.geolocation.getCurrentPosition(success, error);
}

window.addEventListener('load', findLocation);

let otherDay = document.getElementById('other-days');

function showPrayerTime(prayerTime, day) {
  if (day == 0) {
    today.innerHTML = `
      <div class="day">${prayerTime.date.gregorian.weekday.en}</div>
      <div class="fajr" id="Fajr">Fajr :<span class="fajr-time">${prayerTime.timings['Fajr'].slice(0, 5)}</span></div>
      <div class="sunrise">Sunrise :<span class="sunrise-time">${prayerTime.timings['Sunrise'].slice(0, 5)}</span></div>
      <div class="dhuhr" id="Dhuhr">Dhuhr :<span class="dhuhr-time">${prayerTime.timings['Dhuhr'].slice(0, 5)}</span></div>
      <div class="asr" id="Asr">Asr :<span class="asr-time">${prayerTime.timings['Asr'].slice(0, 5)}</span></div>
      <div class="maghrib" id="Maghrib">Maghrib :<span class="maghrib-time">${prayerTime.timings['Maghrib'].slice(0, 5)}</span></div>
      <div class="isha" id="Isha">Isha :<span class="isha-time">${prayerTime.timings['Isha'].slice(0, 5)}</span></div>
    `
  } else {
    otherDay.innerHTML += `
      <div class="future-prayer-item">  
        <div class="day">${prayerTime.date.gregorian.weekday.en}</div>
        <div class="fajr">Fajr :<span class="fajr-time">${prayerTime.timings['Fajr'].slice(0, 5)}</span></div>
        <div class="sunrise">Sunrise :<span class="sunrise-time">${prayerTime.timings['Sunrise'].slice(0, 5)}</span></div>
        <div class="dhuhr">Dhuhr :<span class="dhuhr-time">${prayerTime.timings['Dhuhr'].slice(0, 5)}</span></div>
        <div class="asr">Asr :<span class="asr-time">${prayerTime.timings['Asr'].slice(0, 5)}</span></div>
        <div class="maghrib">Maghrib :<span class="maghrib-time">${prayerTime.timings['Maghrib'].slice(0, 5)}</span></div>
        <div class="isha">Isha :<span class="isha-time">${prayerTime.timings['Isha'].slice(0, 5)}</span></div>
      </div>
    `
  }
  // Appling CSS to highlight the next prayer in the bottom section
  selectedPrayer(nextPrayer);
}

function countDown(prayerTimes, day, month, year) {
  let fajr = new Date(`${months[month]} ${day}, ${year} ${prayerTimes['Fajr'].slice(0, 5)}`).getTime();
  let dhuhr = new Date(`${months[month]} ${day}, ${year} ${prayerTimes['Dhuhr'].slice(0, 5)}`).getTime();
  let asr = new Date(`${months[month]} ${day}, ${year} ${prayerTimes['Asr'].slice(0, 5)}`).getTime();
  let maghrib = new Date(`${months[month]} ${day}, ${year} ${prayerTimes['Maghrib'].slice(0, 5)}`).getTime();
  let isha = new Date(`${months[month]} ${day}, ${year} ${prayerTimes['Isha'].slice(0, 5)}`).getTime();

  let prayerNames = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

  let now = new Date().getTime();

  nextPrayer = "";
  let timeRemaining = 0;
  let difference = 0;
  if (now < fajr) {
    nextPrayer = prayerNames[0];
    timeRemaining = fajr - now;
    difference = fajr - isha + 86400000;
  } else if (now < dhuhr) {
    nextPrayer = prayerNames[1];
    timeRemaining = dhuhr - now;
    difference = dhuhr - fajr;
  } else if (now < asr) {
    nextPrayer = prayerNames[2];
    timeRemaining = asr - now;
    difference = asr - dhuhr;
  } else if (now < maghrib) {
    nextPrayer = prayerNames[3];
    timeRemaining = maghrib - now;
    difference = maghrib - asr;
  } else if (now < isha) {
    nextPrayer = prayerNames[4];
    timeRemaining = isha - now;
    difference = isha - maghrib;
  } else {
    nextPrayer = prayerNames[0];
    timeRemaining = fajr - now + 86400000;
    difference = fajr - isha  + 86400000;
    // This make the Fajr doesn't hightlight after Isha
    highlight = false; 
  }


   
  
  let x = setInterval(function() {
    timeRemaining -= 1000;
    let hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    // Output the result 
    if (hours != 0) {
      document.getElementById("cout-down").innerHTML = "-" + hours + "h " + minutes + "m " + seconds + "s ";
    } else if (minutes != 0) {
      document.getElementById("cout-down").innerHTML = "-"+ minutes + "m " + seconds + "s ";
    } else {
      document.getElementById("cout-down").innerHTML = "-" + seconds + "s ";
    }
    
    // Rendring the percentage of the circular progress bar
    const percentage = 100 - (timeRemaining / difference * 100);
    document.documentElement.style.setProperty('--num', percentage);

    document.querySelector('.prayer-name').innerHTML = nextPrayer;

    document.querySelector('.prayer-time').innerHTML = `${prayerTimes[nextPrayer].slice(0, 5)}`;
    
    if (timeRemaining <= 0) {
      playAdhan();
      clearInterval(x)
    }  
  }, 1000)
}

function playAdhan() {
  const adhan = document.getElementById('adhan');
  adhan.load();
  adhan.play();
  adhan.addEventListener('ended', function(){
    location.reload();
  });
}

function muteAdhan() {

  const adhan = document.getElementById('adhan');
  const img = document.getElementById('sound-icon');
  if (adhan.muted) {    
    adhan.muted = false;
    img.src = 'images/active-sound-icon.png';
      
  } else {
    adhan.muted = true;
    img.src = 'images/muted-sound.png';
      
  }
}

function selectedPrayer(nextPrayer) {
  if (highlight == true ) {
    let selected = document.getElementById(`${nextPrayer}`);
    selected.style.backgroundColor = 'white';
    selected.style.color = 'black';
    selected.style.fontWeight = 700;
    selected.style.padding = '5px';
    selected.style.borderRadius = '4px';
    selected.style.setProperty("box-shadow", "0 0 5px rgba(255, 255, 255, 0.7), 0 0 10px white");
  }
}