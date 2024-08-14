const fs = require('fs');
const path = require('path');

// Helper function to delete images from the server
const deleteImages = (images) => {
    images.forEach(imagePath => {
        const absolutePath = path.join(__dirname, '..', imagePath);
        fs.unlink(absolutePath, (err) => {
            if (err) {
                console.error(`Failed to delete image: ${imagePath}`, err);
            } else {
                console.log(`Deleted image: ${imagePath}`);
            }
        });
    });
};

module.exports = deleteImages;
