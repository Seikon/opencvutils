// -- Author: Seikon 
// --  Original Repo (https://github.com/Seikon/opencvutils)

// ---- Special thanks ---- :

// -- Adrian Rosebrock (https://www.pyimagesearch.com)
// -- Dr. Tomasz Malisiewicz (http://people.csail.mit.edu/tomasz/)
// -- Vicent Müller https://medium.com/@muehler.v

const cv = require('opencv4nodejs');
const fs = require('fs');
const Imutils = require('./Imutils');
const nj = require("numjs");

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

    /*static nonMaximaSupresion(boxes = [], overlapThresh)
    {
        if(boxes.length == 0)
            return [];

        // Array of picked indexes
        const pick = []

        //Get the coordinates of each bounding box
        const x1 = boxes.map(box => box.x);
        const y1 = boxes.map(box => box.y);
        const x2 = boxes.map(box => box.x + box.width);
        const y2 = boxes.map(box => ReadableStreamBYOBReader.y + box.height);

        //Compute the area of the bounding boxes and sort the bounding
        //boxes by the bottom-right y-coordinate of the bounding box
        const area = boxes.map(box, i => x2[i] - x1[i] + 1) * (y2 - y1 + 1);
        const idxs = y2.sort();

        while(idxs.length > 0)
        {
            // Grab the last index
            const last = idxs.length - 1
            const id = idxs[last];

            pick.push(id);

            //find the largest (x, y) coordinates for the start of
            //the bounding box and the smallest (x, y) coordinates
            //for the end of the bounding box
            const xx1 = Math.max(x1[id], x1[idxs[]]);
        }
        
    }*/

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

        }
    }

    static trainSVM(svm, hog, trainingDataPath, testDataPath, imageSize=new cv.Size(50,50))
    {
        const classes = fs.readdirSync(trainingDataPath);
        let samples = [], labels = [];
        
        // For each class, look into directory for collect the training and test data
        for(let indClass = 0; indClass < classes.length; indClass++)
        {
            const traingFiles = fs.readdirSync(trainingDataPath + "/" + classes[indClass]);

            //For each file,
            for(let imageFile of traingFiles)
            {
                //Load the image in memory,
                let image = cv.imread(trainingDataPath + "/" + classes[indClass] + "/" + imageFile);
                //Resize if it doesn't match with the Image Size for training
                if(image.cols != imageSize.width || image.rows != imageSize.height)
                {
                    image = Imutils.resizeNoRatio(image,imageSize.width, imageSize.height);
                }
                // Transform to grayscale,
                const grayImage = image.bgrToGray(); 
                // Compute the HOG descriptor
                const descriptor = hog.compute(grayImage);
                
                samples.push(descriptor);
                labels.push(indClass);
            }

        }

        const samplesMat = new cv.Mat(samples, cv.CV_32F);
        const labelsMat = new cv.Mat([labels], cv.CV_32S);

        const trainData = new cv.TrainData(samplesMat,cv.ml.ROW_SAMPLE, labelsMat);

        svm.train(trainData);

        return {svm: svm, classes:classes};
    }

    static fourPointsPerspective(image, pts)
    {
        const pointShorted = Imutils.orderPoints(pts);

        const tl = pointShorted[0];
        const tr = pointShorted[1];
        const br = pointShorted[2];
        const bl = pointShorted[3];

        //compute the width of the new image, which will be the
        //maximum distance between bottom-right and bottom-left
        //x-coordiates or the top-right and top-left x-coordinates
        const widthA = Math.sqrt(Math.pow(br.x  - bl.x, 2) + Math.pow(br.y  - bl.y, 2)); 
        const widthB = Math.sqrt(Math.pow(tr.x  - tl.x, 2) + Math.pow(tr.y  - tl.y, 2));
        
        const maxWidth = Math.max(widthA, widthB);

        // compute the height of the new image, which will be the
        // maximum distance between the top-right and bottom-right
        // y-coordinates or the top-left and bottom-left y-coordinates
        const heightA = Math.sqrt(Math.pow(tr.x  - br.x, 2) + Math.pow(tr.y  - br.y, 2)); 
        const heightB = Math.sqrt(Math.pow(tl.x  - bl.x, 2) + Math.pow(tl.y  - bl.y, 2));
        
        const maxHeight = Math.max(heightA, heightB);
        //c ompute the perspective transform matrix and then apply it
        const dst = [
                    new cv.Point2(0,0),
                     new cv.Point2(maxWidth - 1, 0),
                     new cv.Point2(maxWidth - 1, maxHeight - 1),
                     new cv.Point2(0, maxHeight - 1)
        ];

        const M = cv.getPerspectiveTransform(pointShorted, dst);
        const warped = image.warpPerspective(M, new cv.Size(maxWidth, maxHeight));

        return warped;

    }
}

module.exports = ImAdvanced;