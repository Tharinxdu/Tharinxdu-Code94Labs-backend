const fs = require('fs');

// Helper function to delete images from the server
const deleteImages = (images) => {
    images.forEach(imagePath => {
        fs.unlink(imagePath, (err) => {
            if (err) {
                console.error(`Failed to delete image: ${imagePath}`, err);
            } else {
                console.log(`Deleted image: ${imagePath}`);
            }
        });
    });
};

module.exports = deleteImages;
