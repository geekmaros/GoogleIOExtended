const CACHE_NAME = 'weather-v1'
const urlsToCache = ['index.html', 'app.js', 'offline.html']

const self = this;

// Install our Servicer Worker
self.addEventListener('install', (event) => {
    console.log("Starting Installation...")
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then((cache) => {
            console.log('Successfully Caached Files') 
            // this should run once which is after it has cached the files
            // and also present in the Cache Storage

            return cache.addAll(urlsToCache)
        })
    )
})



// Activate our service worker
self.addEventListener('activate', (event) => {
    const cacheWhitelist = []
    cacheWhitelist.push(CACHE_NAME)
    console.log("Starting Activation...")
    event.waitUntil(
        caches.keys().then((cacheName) => Promise.all(
            cacheName.map((cacheName) => {
                if(!cacheWhitelist.includes(cacheName)){
                    return caches.delete(cacheName)
                }
            })
        ))
    )
})


// Listen for Request 
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
        .then(() => {
            console.log(event.request)
            return fetch(event.request)
            .catch(() => caches.match('offline.html'))
        })
    )

})


