self.addEventListener("install", event => {
    console.log("[Service Worker] Installed");
    event.waitUntil(
        caches.open("static-v1").then(cache => {
            return cache.addAll([
                "/offline.html",
                "/styles.css",
                "/images/workouts/barbell_rows.png",
                "/images/workouts/bench_press.png",
                "/images/workouts/bicep_curl.png",
                "/images/workouts/bulgarian_splits.png",
                "/images/workouts/calf_raises.png",
                "/images/workouts/deadlift.png",
                "/images/workouts/hamstring_curls.png",
                "https://cdn.dribbble.com/userupload/23086661/file/original-7d31c0a1b32433621add356660058ead.gif",
            ]);
        })
    );
});

self.addEventListener("activate", event => {
    console.log("[Service Worker] Activated");
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== "static-v1") {
                        console.log("[Service Worker] Removing old cache", cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener("fetch", event => {
    console.log("[Service Worker] Fetching", event.request.url);

    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) {
                event.waitUntil(
                    fetch(event.request).then(networkResponse => {
                        if (networkResponse && networkResponse.ok) {
                            caches.open("static-v1").then(cache => {
                                cache.put(event.request, networkResponse.clone());
                            });
                        }
                    }).catch(() => {
                        console.log("[Service Worker] Network revalidation failed.");
                    })
                );
                return cachedResponse; 
            }

            return fetch(event.request).then(networkResponse => {
                return caches.open("static-v1").then(cache => {
                    if (event.request.url.includes("/images/")) {
                        cache.put(event.request, networkResponse.clone());
                    }
                    return networkResponse;
                });
            }).catch(() => {
                return caches.match("/offline.html");
            });
        })
    );
});