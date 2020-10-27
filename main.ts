
namespace imagesettings {

    //% blockNamespace=Images
    //% block="set setting $key to image $toSave"
    //% toSave.defl=screen_image_picker
    export function writeImage(key: string, toSave: Image) {
        const w = toSave.width;
        const h = toSave.height;
        const imgBuf = pins.createBuffer(h * w);
        const rowBuf = pins.createBuffer(h);
        for (let i = 0; i < h; ++i) {
            // load one image at a time...
            toSave.getRows(i, rowBuf);
            // and save to the buffer we're going to store, offset from the start.
            imgBuf.write(i * w, rowBuf);
        }

        const namespacedSetting = settingKey(key);

        settings.writeBuffer(namespacedSetting, imgBuf);
        settings.writeNumber(`${namespacedSetting}--w`, w);
        settings.writeNumber(`${namespacedSetting}--h`, h);
    }

    function settingKey(key: string) {
        return `--writeImage${key}`;
    }
    
    //% blockNamespace=Images
    //% block="read setting $key as image"
    export function readImage(key: string): Image {
        const namespacedSetting = settingKey(key);
        const loadedImg = settings.readBuffer(namespacedSetting);
        if (!loadedImg)
            return undefined;
        const w = settings.readNumber(`${namespacedSetting}--w`);
        const h = settings.readNumber(`${namespacedSetting}--h`);

        const outputImg = image.create(w, h); 
        for (let i = 0; i < h; ++i) {
            const row = loadedImg.slice(i * w, w);
            outputImg.setRows(i, row);
        }

        return outputImg;
    }
}