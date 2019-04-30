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
}

module.exports = ImAdvanced;