const cv = require('opencv4nodejs');
const Imutils = require('./Imutils');

class ImAdvanced
{
    static *pyramid(image, scale=1.5, minSize=new cv.Size(30,30))
    {
        yield image;

        do 
        {
            // Get the new width applying the scale reductor factor
            const w = parseInt(image.cols / scale);
            
            //Reduce the size of the image until its dimensions is less than minimun
            yield image = Imutils.resize(image, w);
        }
        while(image.cols > minSize.width || image.rows > minSize.height)


        yield image;
    }

    static nonMaximaSupresion(boxes, overlapThresh)
    {
        if(boxes.length == 0)
            return [];

        
    }

    static *slidingWindow(image, stepSize, windowSize= new cv.Size(4,8))
    {
        // Slide a window across the height of the image
        for(let y = 0; y < image.rows; y+= stepSize)
        {
            // Slide a window across the width of the image
            for(let x = 0; x < image.cols; x+= stepSize)
            {
                //Continue when the region of the windows is bigger than the total amount of rows or colums 
                if(x + windowSize.width > image.cols || y + windowSize.height > image.rows)
                    continue;
                
                yield {x: x, y: y, window: image.getRegion(new cv.Rect(x, y, windowSize.width, windowSize.height))};
            }

            console.log("y: ", y);
        }
    }
}

module.exports = ImAdvanced;