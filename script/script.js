function wait(seconds) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(1);
        }, seconds * 1000);
    });
}


function getImageBase64FromInput(file) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = function (e) {
            resolve(e.target.result);
        }
        reader.readAsDataURL(file);
    });
}

