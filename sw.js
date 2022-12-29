const staticCacheName = 'site-static-v2';
const dynamicCache = 'site-dynamic-v1';
const assets =[
    '/',
    '/index.html',
    '/js/script.js',
    '/css/style.css',
    '/images/0.png',
    '/images/1.png',
    '/images/2.png',
    '/images/3.png',
    '/images/4.png',
    '/images/5.png',
    '/images/6.png',
    '/images/7.png',
    '/images/8.png',
    '/images/9.png',
    '/images/10.png',
    '/fallback.html'
] ;


//cache size limit
const limitCacheSize = (name, size) => {
    caches.open(name).then(cache => {
        cache.keys().then(keys => {
            if(keys.length > size){
                cache.delete(keys[0]).then(limitCacheSize(name, size))
            }
        })
    })
}

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
    //console.log('activated');
    evt.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(keys
                .filter(key => key !== staticCacheName && key !== dynamicCache)
                .map(key => caches.delete(key))
            )
        })
    )
});


self.addEventListener('fetch', (evt) =>{
    //console.log('fetched',evt);
    evt.respondWith(
        caches.match(evt.request).then(cacheRes => {
            return cacheRes || fetch(evt.request).then(fetchRes => {
                return caches.open(dynamicCache).then(cache => {
                    cache.put(evt.request.url, fetchRes.clone())
                    limitCacheSize(dynamicCache, 15);
                    return fetchRes;
                })
            });
        }).catch(() => {
            if (evt.request.url.indexOf('.html') > -1) {
                caches.match('/fallback.html');
            }
        })
    );
});