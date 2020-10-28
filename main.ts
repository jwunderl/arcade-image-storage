
namespace imagesettings {

    //% blockNamespace=images
    //% block="set setting $key to image $toSave"
    //% toSave.shadow=screen_image_picker
    //% group="settings"
    export function writeImage(key: string, toSave: Image) {
        const w = toSave.width;
        const h = toSave.height;
        const imgBuf = pins.createBuffer(2 + h * w);
        const rowBuf = pins.createBuffer(h);
        imgBuf.setUint8(0, w);
        imgBuf.setUint8(1, h);
        for (let i = 0; i < h; ++i) {
            // load one image at a time...
            toSave.getRows(i, rowBuf);
            // and save to the buffer we're going to store, offset from the start.
            imgBuf.write(2 + i * w, rowBuf);
        }

        const namespacedSetting = settingKey(key);

        settings.writeBuffer(namespacedSetting, imgBuf);
    }

    function settingKey(key: string) {
        return `--writeImage${key}`;
    }
    
    //% blockNamespace=images
    //% block="read setting $key as image"
    //% group="settings"
    export function readImage(key: string): Image {
        const namespacedSetting = settingKey(key);
        const loadedImg = settings.readBuffer(namespacedSetting);
        if (!loadedImg)
            return undefined;
        const w = loadedImg.getUint8(0);
        const h = loadedImg.getUint8(1);

        const outputImg = image.create(w, h); 
        for (let i = 0; i < h; ++i) {
            const row = loadedImg.slice(2 + i * w, w);
            outputImg.setRows(i, row);
        }

        return outputImg;
    }
}