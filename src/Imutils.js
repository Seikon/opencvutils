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

        //Force sin and cosin to be possitive no matter the direction of alpha, 
        //only the magnitude
        nW = nW < 0 ? -nW : nW;
        nH = nH < 0 ? -nH : nH;

        //Adjust the new rotation parameters of the rotation matrix M
        M.set(0,2, M.at(0,2) + (nW / 2) - cX)
        M.set(1,2, M.at(1,2) + (nH / 2) - cY)

        return image.warpAffine(M, new cv.Size(nW, nH));
    }

    static resize(image, width=null, height=null, inter=cv.INTER_AREA)
    {
        let dim = null;

        const w = image.cols;
        const h = image.rows;

        //Return the same image when no width and height are provided
        if(width == null && height == null)
        {
            return image;
        }

        if(width == null)
        {
            //Ratio based on height
            const r = height / parseFloat(h);

            dim = new cv.Size(parseInt(w * r), height);
        }
        else
        {
            //Ratio based on width
            const r = width / parseFloat(w);

            dim = new cv.Size(width, parseInt(h * r));
        }

        const resized = image.resize(dim,inter);

        return resized;
    }

    static resizeNoRatio(image, width, height, inter=cv.INTER_AREA)
    {
        return image.resize(new cv.Size(width,height), inter);
    }

    static skeletonize(image, size, structuring=cv.MORPH_RECT)
    {

        image = image.bgrToGray();

        const w = image.cols;
        const h = image.rows;

        const area = w * h;
        // creates a matrix filled with 0
        let skeleton = new cv.Mat(h, w, cv.CV_8U, 0);

        const elem = cv.getStructuringElement(cv.MORPH_RECT, size);
        
        do
        {
            const eroded = image.erode(elem);

            let temp = eroded.dilate(elem);
            
            temp = image.sub(temp);
            
            skeleton = skeleton.bitwiseOr(temp);
            
            image = eroded.copy();

        }while(image.countNonZero() != area);

        return skeleton;
    }

    // Return order is [topLeft, topRight, bottomRight, bottomLeft]
    static orderPoints(pts)
    {
        let rect = [0,0,0,0];
        let minX = Number.MAX_VALUE, minY = Number.MAX_VALUE;
        let maxX = Number.MIN_VALUE, maxY = Number.MIN_VALUE;
        console.log(pts);
        for(let pt of pts)
        {
            if(pt.x > maxX)
                maxX = pt.x;

            else if(pt.x < minX)
                minX = pt.x;

            if(pt.y > maxY)
                maxY = pt.y

            else if(pt.y < minY)
                minY = pt.y;
            
        }

        for(let pt of pts)
        {
            // Left
            if(pt.x == minX)
            {
                // Top
                if(pt.y == minY)
                {
                    // Top Left
                    rect[0] = pt;
                }
                // Bottom
                else
                {
                    // Bottom Left
                    rect[3] = pt;
                }
            }
            // Right
            else
            {
                // Top
                if(pt.y == minY)
                {
                    // Top Right
                    rect[1] = pt;
                }
                // Bottom
                else
                {
                    // Bottom Right
                    rect[2] = pt;
                }
            }
        }

        return rect;
    }


}

module.exports = Imutils;