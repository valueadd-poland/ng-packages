import { of } from 'rxjs';
export class LocalStorageCrud {
    create(collection, entity) {
        if (!entity.id) {
            throw new Error(`Entity must have 'id' property.`);
        }
        const entities = this.getCollection(collection);
        this.setCollection(collection, entities.concat(entity));
        return of(entity);
    }
    get(collection, id) {
        const entities = this.getCollection(collection);
        const found = entities.find(entity => entity.id === id);
        if (!found) {
            throw new Error(`Entity with id '${id}' not found in collection '${collection}.'`);
        }
        return of(found);
    }
    getAll(collection) {
        return of(this.getCollection(collection));
    }
    remove(collection, id) {
        const entities = this.getCollection(collection);
        this.setCollection(collection, entities.filter(entity => entity.id !== id));
        return of();
    }
    update(collection, entity) {
        if (!entity.id) {
            throw new Error(`Entity must have 'id' property.`);
        }
        const entities = this.getCollection(collection);
        const index = entities.findIndex(e => e.id === entity.id);
        if (index === -1) {
            throw new Error(`Entity with id '${entity.id} does not exist in '${collection}' collection.`);
        }
        entities[index] = Object.assign(Object.assign({}, entities[index]), entity);
        this.setCollection(collection, entities);
        return of(entities[index]);
    }
    getCollection(collection) {
        return JSON.parse(localStorage.getItem(collection) || '[]');
    }
    setCollection(collection, value) {
        localStorage.setItem(collection, JSON.stringify(value));
    }
}
//# sourceMappingURL=local-storage-crud.js.map