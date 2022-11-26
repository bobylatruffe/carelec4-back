function setSession(itemName, data) {
    sessionStorage.setItem(itemName, JSON.stringify(data));
}

function getSession(itemName) {
    const data = JSON.parse(sessionStorage.getItem(itemName));
    
    return data;
}

function removeSession(itemName) {
    sessionStorage.removeItem(itemName);
}

module.exports = {
    setSession,
    getSession,
    removeSession,
}