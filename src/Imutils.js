const cv = require('opencv4nodejs');

class Imutils
{
    static translate(image, xPixels, yPixels)
    {
        // Create the translation matrix
        const M = new cv.Mat([[1,0,xPixels],
                              [0,1,yPixels]],
                              cv.CV_32F);

        // Displace the image x and y pixels to the desired postion
        const translated = image.warpAffine(M, new cv.Size(image.cols, image.rows));

        return translated;

    }

    static rotate(image, alpha, center=null, scale=1.0)
    {
        //Dimensions of image
        const w = image.cols;
        const h = image.rows;

        //When center null, center will be the center of the image
        center = center === null ? new cv.Point(w / 2, h / 2) : center;

        //Genrate rotation matrix
        const M = cv.getRotationMatrix2D(center, alpha, scale);

        const rotated = image.warpAffine(M, new cv.Size(w, h));

        return rotated;
    }

    static rotateBound(image, alpha)
    {
        //Center
        const w = image.cols;
        const h = image.rows;

        const cX = w / 2;
        const cY = h / 2;

        //Genrate rotation matrix
        const M = cv.getRotationMatrix2D(new cv.Point(cX, cY), -alpha, 1.0);
        //Extract the sin and cosin from the rotation matrix 
        const cos = M.at(0,0);
        const sin = M.at(0,1);

        let nW = parseInt((h * sin) + (w * cos))
        let nH = parseInt((w * sin) + (h * cos))

        nW = nW < 0 ? -nW : nW;
        nH = nH < 0 ? -nH : nH;

        //Adjust the new rotation parameters of the rotation matrix M
        M.set(0,2, M.at(0,2) + (nW / 2) - cX)
        M.set(1,2, M.at(1,2) + (nH / 2) - cY)

        return image.warpAffine(M, new cv.Size(nW, nH));
    }
}

module.exports = Imutils;