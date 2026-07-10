import fs from 'fs';
import path from 'path';

function generate() {
    console.log('--- GENERATING STATIC FILE LIST ---');
    const publicDir = path.join(process.cwd(), 'public');
    const outputDir = path.join(process.cwd(), 'data');
    
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const getFiles = (dir) => {
        const targetDir = path.join(publicDir, dir);
        if (!fs.existsSync(targetDir)) return [];
        return fs.readdirSync(targetDir).filter(file => !fs.lstatSync(path.join(targetDir, file)).isDirectory());
    };

    const fileData = {
        sound: getFiles('sound'),
        img: getFiles('img'),
        generatedAt: new Date().toISOString()
    };

    fs.writeFileSync(
        path.join(outputDir, 'file-list.json'),
        JSON.stringify(fileData, null, 2)
    );

    console.log(`Generated file-list.json with ${fileData.sound.length} sounds and ${fileData.img.length} images.`);
}

generate();
