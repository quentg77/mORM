export default class Entity {
    constructor(dbInstance) {
        this.dbInstance = dbInstance;
        this.tableName = undefined;
    }

    async count() {
        return this.dbInstance.count(this.tableName);
    }

    async save(data) {
        return this.dbInstance.save(this.tableName, data);
    }

    async findByPK(id, { attributes } = {}) {
        return this.dbInstance.findByPK(this.tableName, id, { attributes });
    }

    async findAll({ attributes } = {}) {
        return this.dbInstance.findAll(this.tableName, { attributes });
    }

    async update(data) {
        return this.dbInstance.update(this.tableName, data);
    }
}