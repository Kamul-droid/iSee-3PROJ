export default function extendLocalStorage() {
    Storage.prototype.setObject = function(key : string, value : Record<string, any>) {
        this.setItem(key, JSON.stringify(value));
    }
    
    Storage.prototype.getObject = function(key: string) {
        const value = this.getItem(key);
        return value && JSON.parse(value);
    }
    
}