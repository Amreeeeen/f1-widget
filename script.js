document.addEventListener("DOMContentLoaded", () => {
    const countdownElem = document.getElementById("countdown");
    const raceTitle = document.getElementById("race-title");
    const raceLocation = document.getElementById("race-location");
    const raceDate = document.getElementById("race-date");
    const raceTime = document.getElementById("race-time");
    const circuitImage = document.getElementById("circuit-image");
    const themeToggle = document.getElementById("theme-toggle");
    const installButton = document.getElementById("install-button");
  
    // Theme toggle
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("light-mode");
    });
  
    // Load race data
    fetch("yes/circuits.json")
      .then(res => res.json())
      .then(data => {
        const now = new Date();
        const upcoming = data.find(race => new Date(race.date + "T" + race.time) > now);
  
        if (upcoming) {
          raceTitle.innerText = upcoming.name;
          raceLocation.innerText = upcoming.location;
          raceDate.innerText = "Date: " + upcoming.date;
          raceTime.innerText = "Time: " + new Date(upcoming.date + "T" + upcoming.time).toLocaleString();
          circuitImage.src = "yes/" + upcoming.image;
          circuitImage.alt = upcoming.name + " Circuit";
          startCountdown(upcoming.date + "T" + upcoming.time);
        } else {
          raceTitle.innerText = "No upcoming races.";
          countdownElem.innerText = "";
        }
      })
      .catch(err => {
        raceTitle.innerText = "Error loading race data.";
        console.error(err);
      });
  
    function startCountdown(targetTime) {
      function updateCountdown() {
        const now = new Date().getTime();
        const target = new Date(targetTime).getTime();
        const diff = target - now;
  
        if (diff <= 0) {
          countdownElem.innerText = "Race is live!";
          return;
        }
  
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
  
        countdownElem.innerText = `${days}d ${hours}h ${minutes}m ${seconds}s`;
      }
  
      setInterval(updateCountdown, 1000);
      updateCountdown();
    }
  
    // Install button logic
    let deferredPrompt;
  
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      deferredPrompt = e;
      const installButton = document.getElementById('install-button');
      installButton.style.display = 'inline-block';  
      installButton.addEventListener("click", () => {
        installButton.style.display = "none";
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(choice => {
          if (choice.outcome === "accepted") {
            console.log("User accepted the install prompt");
          }else {
            console.log('User dismissed the install prompt');
          }
        });
      });
    });
  
    // Register service worker (remember the file is sw.js)
    if ('serviceWorker' in navigator) {setTimeout(() => {
        document.getElementById("a2hs-tip").style.display = "block";
      }, 5000);
      
      navigator.serviceWorker.register('sw.js')
        .then(() => console.log("Service Worker registered"))
        .catch(err => console.error("Service Worker error", err));
    }
  });
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
      .then(() => console.log('Service Worker Registered'));
  }
  
function requestNotificationPermission() {
    if ('Notification' in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          console.log('Notification permission granted.');
        }
      });
    }
  }
  function sendRaceNotification(raceName, time) {
  if (Notification.permission === 'granted') {
    new Notification("Upcoming F1 Race 🏁", {
      body: `${raceName} is starting at ${time}!`,
      icon: 'yes/f1-icon-192.png'
    });
  }
}
let deferredPrompt;

const installButton = document.getElementById('install-button');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installButton.style.display = 'inline-block';
});

installButton.addEventListener('click', () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(choice => {
      if (choice.outcome === 'accepted') {
        console.log('App installed');
      }
      deferredPrompt = null;
    });
  }
});
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
    .then(() => console.log('Service Worker Registered'));
}
