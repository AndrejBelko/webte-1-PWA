const staticCacheName = 'site-static';
const assets =[
    './',
    './index.html',
    './js/script.js',
    './css/style.css',
    './images/0.png',
    './images/1.png',
    './images/2.png',
    './images/3.png',
    './images/4.png',
    './images/5.png',
    './images/6.png',
    './images/7.png',
    './images/8.png',
    './images/9.png',
    './images/10.png',
    './fallback.html',
    './levels.json',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js'
] ;

self.addEventListener('install', (evt) =>{
    console.log('installed');
    evt.waitUntil(
        caches.open(staticCacheName).then(cache => {
            console.log('caching assets');
            cache.addAll(assets);
        })
    );

});


self.addEventListener('activate', (evt) =>{
    console.log('activated',evt);
});
//


self.addEventListener('fetch', (evt) =>{
    evt.respondWith(
        caches.match(evt.request)
            .then(function(response){
                if(response){
                    return response;
                }
            })
    )
});

