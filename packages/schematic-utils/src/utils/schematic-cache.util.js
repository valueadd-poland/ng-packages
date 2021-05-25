// @dynamic
export class SchematicCache {
    constructor() {
        this.cacheOfCaches = {};
    }
    static getInstance() {
        if (!SchematicCache.instance) {
            SchematicCache.instance = new SchematicCache();
        }
        return SchematicCache.instance;
    }
    clear(cacheName) {
        this.cacheOfCaches[cacheName] = undefined;
    }
    clearAll() {
        this.cacheOfCaches = {};
    }
    read(cacheName) {
        return this.cacheOfCaches[cacheName];
    }
    save(cacheName, value) {
        this.cacheOfCaches[cacheName] = value;
    }
}
//# sourceMappingURL=schematic-cache.util.js.map