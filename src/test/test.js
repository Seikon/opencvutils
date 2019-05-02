const Imutils = require("../Imutils");
const ImAdvanced = require("../core");
const cv = require("opencv4nodejs");

const image = cv.imread("tortilla.jpg");
// ----- Translation ----
/*
const imgDisplaced = Imutils.translate(image,
                                       // X = width / 2 
                                       image.cols / 2,
                                       // Y = height / 2
                                       image.rows / 2);

/*cv.imshow("real", image);
// Result: -> The left upper corner of image should start in the center of the window
cv.imshow("Displaced", imgDisplaced);
console.log("Translation performed, Check the results...!")
cv.waitKey();
cv.destroyAllWindows();

// ----- Rotation ----
const imgRotated = Imutils.rotate(image, 180);

cv.imshow("real", image);
// Result: -> The Image should be horizontally inverted displayed 
cv.imshow("rotated", imgRotated);
console.log("Rotation performed, Check the results...!")
cv.waitKey();
cv.destroyAllWindows();

// ----- Rotation bound ----
const imgRotationBound = Imutils.rotateBound(image, 90);

cv.imshow("real", image);
// Result: -> The Image should be cropped or amplied when the image is rotated
// for 90° width and height switch each other
cv.imshow("rotated bound", imgRotationBound);
console.log("Rotation bound performed, Check the results...!")
cv.waitKey();
cv.destroyAllWindows();


// ----- Resize ----
const imgResizeWidth = Imutils.resize(image, 542);
const imgResizeHeight = Imutils.resize(image, null, 372);
cv.imshow("real", image);
// Result: -> The Image should be 2 times bigger in width
cv.imshow("Resized width", imgResizeWidth);
// Result: -> The Image should be 2 times bigger in height
cv.imshow("Resized height", imgResizeHeight);
console.log("Resizing performed , Check the results...!")
cv.waitKey();
cv.destroyAllWindows();


const image2 = cv.imread("opencv.png");
// ----- Skeletonize ----
const imageSkeletonized = Imutils.skeletonize(image2, new cv.Size(2,2));
cv.imshow("real", image2);
// Result: -> The Image should be 2 times bigger in width
cv.imshow("Skeletonized", imageSkeletonized);
console.log("Resizing performed , Check the results...!")
cv.waitKey();
cv.destroyAllWindows();
*/

// ----- Image pyramid ----
/*let ind = 0;

for(let imgPyramid of ImAdvanced.pyramid(image, 1.5))
{
    cv.imshow("pyramid" + ind, imgPyramid);
    ind ++;
}
// Result: -> A list of images appear, each one smaller than the previous one until the min size expecified
console.log("Pyramid performed, Check the results...!")
cv.waitKey();
cv.destroyAllWindows();
*/
// ----- Image pyramid + sliding windows algorithym ----
let winH = 100;
let winW = 100;

for(let imgPyramid of ImAdvanced.pyramid(image, 1.5))
{
    for(let windowResult of ImAdvanced.slidingWindow(imgPyramid, 32, new cv.Size(winW, winH)))
    {
        if(windowResult.window.cols != winW || windowResult.window.rows != winH)
            continue;

        const clone = imgPyramid.copy();

        clone.drawRectangle(
        new cv.Point(windowResult.x, windowResult.y), 
        new cv.Point(windowResult.x + winW, windowResult.y + winH),
        new cv.Vec(0,255,0),
        2,
        cv.LINE_8);

        cv.imshow("Window", clone);
        // This adjust the time beetwen images, doesn't not affect the perfom of the algorithim.
        // Only for test porpouses and learn porpouses
        cv.waitKey(50);
    }
}
// Result: -> A green bound box move across the all the image pyramid 


