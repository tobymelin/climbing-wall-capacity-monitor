const Storage = {
    get: function (key) {
        return JSON.parse(localStorage.getItem(key));
    },
    set: function (key, value) {
        return localStorage.setItem(key, JSON.stringify(value));
    }
}

export default Storage;
